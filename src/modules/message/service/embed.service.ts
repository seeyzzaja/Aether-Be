import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { BadRequestError } from "#shared/errors/app-error";

const MAX_RESPONSE_SIZE = 2 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 5000;

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);

  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const a = parts[0];
  const b = parts[1];

  if (a === undefined || b === undefined) {
    return false;
  }

  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 0
  );
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();

  return (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  );
}

async function ensureSafeUrl(rawUrl: string): Promise<URL> {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new BadRequestError("URL tidak valid");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new BadRequestError("URL hanya boleh menggunakan HTTP atau HTTPS");
  }

  if (url.username || url.password) {
    throw new BadRequestError("URL dengan username atau password tidak diizinkan");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();

  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new BadRequestError("URL menuju host lokal tidak diizinkan");
  }

  if (isIP(hostname)) {
    if (isPrivateIPv4(hostname) || isPrivateIPv6(hostname)) {
      throw new BadRequestError("URL menuju IP private tidak diizinkan");
    }

    return url;
  }

  const addresses = await lookup(hostname, {
    all: true,
    verbatim: true,
  });

  if (addresses.length === 0) {
    throw new BadRequestError("Host URL tidak dapat ditemukan");
  }

  for (const address of addresses) {
    if (
      (address.family === 4 && isPrivateIPv4(address.address)) ||
      (address.family === 6 && isPrivateIPv6(address.address))
    ) {
      throw new BadRequestError("URL menuju host private tidak diizinkan");
    }
  }

  return url;
}

function extractMeta(html: string, property: string): string | null {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${escaped}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeHtmlEntities(match[1].trim());
    }
  }

  return null;
}

function extractNameMeta(html: string, name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const patterns = [
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${escaped}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeHtmlEntities(match[1].trim());
    }
  }

  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  if (!match?.[1]) {
    return null;
  }

  return decodeHtmlEntities(match[1].trim());
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#47;/gi, "/");
}

function sanitizeText(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const withoutHtml = value.replace(/<[^>]*>/g, "");

  const withoutControlCharacters = Array.from(withoutHtml)
    .filter((character) => {
      const codePoint = character.codePointAt(0);

      return codePoint !== undefined && codePoint >= 0x20 && codePoint !== 0x7f;
    })
    .join("");

  return withoutControlCharacters.trim().slice(0, 1000) || null;
}

function sanitizeImageUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export class EmbedService {
  async fetchMetadata(rawUrl: string) {
    const url = await ensureSafeUrl(rawUrl);

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "AetherBot/1.0",
        },
      });

      if (!response.ok) {
        throw new BadRequestError("Gagal mengambil metadata dari URL");
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        throw new BadRequestError("URL bukan halaman HTML");
      }

      const contentLength = response.headers.get("content-length");

      if (contentLength && Number(contentLength) > MAX_RESPONSE_SIZE) {
        throw new BadRequestError("Ukuran halaman terlalu besar");
      }

      const html = await response.text();

      if (Buffer.byteLength(html, "utf8") > MAX_RESPONSE_SIZE) {
        throw new BadRequestError("Ukuran halaman terlalu besar");
      }

      const title =
        extractMeta(html, "og:title") ??
        extractNameMeta(html, "twitter:title") ??
        extractTitle(html);

      const description =
        extractMeta(html, "og:description") ??
        extractNameMeta(html, "description") ??
        extractNameMeta(html, "twitter:description");

      const image = extractMeta(html, "og:image") ?? extractNameMeta(html, "twitter:image");

      return {
        url: url.toString(),
        title: sanitizeText(title),
        description: sanitizeText(description),
        image: sanitizeImageUrl(image),
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }

      throw new BadRequestError("Gagal mengambil metadata dari URL");
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const embedService = new EmbedService();
