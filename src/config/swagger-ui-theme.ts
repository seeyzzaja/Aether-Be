const swaggerUiOptions = {
  explorer: true,
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
  ],
  customCss: `
    :root {
      --docs-bg: #f4f7fb;
      --docs-surface: #ffffff;
      --docs-surface-2: #eef4ff;
      --docs-border: #d7dfeb;
      --docs-text: #14213d;
      --docs-muted: #54657e;
      --docs-accent: #2c7be5;
      --docs-accent-strong: #1c5fd4;
      --docs-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
    }

    body[data-theme="dark"] {
      --docs-bg: #0b1020;
      --docs-surface: #111827;
      --docs-surface-2: #172033;
      --docs-border: #263043;
      --docs-text: #e5eefc;
      --docs-muted: #9eb0cc;
      --docs-accent: #66cfff;
      --docs-accent-strong: #2ea8ff;
      --docs-accent-soft: rgba(102, 207, 255, 0.14);
      --docs-shadow: 0 18px 50px rgba(0, 0, 0, 0.4);
    }

    html, body {
      background: var(--docs-bg) !important;
      color: var(--docs-text) !important;
      transition: background-color 180ms ease, color 180ms ease;
      color-scheme: light;
    }

    body[data-theme="dark"] {
      color-scheme: dark;
    }

    .swagger-ui {
      color: var(--docs-text);
    }

    .swagger-ui .topbar {
      display: none;
    }

    .swagger-ui .wrapper,
    .swagger-ui .scheme-container,
    .swagger-ui .opblock,
    .swagger-ui .opblock-summary,
    .swagger-ui .information-container,
    .swagger-ui .auth-wrapper,
    .swagger-ui .model-box,
    .swagger-ui .models,
    .swagger-ui .modal-ux,
    .swagger-ui .modal-ux-content,
    .swagger-ui .modal-ux-header {
      transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease;
    }

    .swagger-ui .information-container,
    .swagger-ui .scheme-container,
    .swagger-ui .opblock,
    .swagger-ui .model-box,
    .swagger-ui .models,
    .swagger-ui .opblock-summary,
    .swagger-ui .auth-wrapper {
      background: var(--docs-surface) !important;
      border-color: var(--docs-border) !important;
      box-shadow: var(--docs-shadow) !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock.opblock-get {
      border: 1px solid rgba(102, 207, 255, 0.28) !important;
      background: linear-gradient(180deg, rgba(10, 18, 36, 0.96), rgba(14, 24, 44, 0.98)) !important;
      box-shadow: 0 0 0 1px rgba(102, 207, 255, 0.08), 0 10px 28px rgba(0, 0, 0, 0.28) !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .opblock-summary {
      background: linear-gradient(90deg, rgba(102, 207, 255, 0.08), rgba(46, 168, 255, 0.03)) !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: linear-gradient(135deg, #66cfff, #2ea8ff) !important;
      color: #06111f !important;
      box-shadow: 0 0 0 1px rgba(102, 207, 255, 0.18), 0 0 18px rgba(102, 207, 255, 0.18) !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .parameters,
    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .responses-wrapper,
    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .responses-inner {
      background: linear-gradient(180deg, rgba(12, 20, 38, 0.98), rgba(9, 16, 30, 0.98)) !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .opblock-section-header,
    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .parameters-container,
    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .responses-inner {
      border-color: rgba(102, 207, 255, 0.12) !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .opblock-summary-path,
    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .opblock-summary-description {
      color: #d9f2ff !important;
    }

    .swagger-ui .wrapper {
      max-width: 1180px;
    }

    .swagger-ui .information-container {
      border-radius: 24px;
      margin-top: 24px;
      padding: 28px 28px 18px;
    }

    .swagger-ui .info .title,
    .swagger-ui .info .title small {
      color: var(--docs-text) !important;
    }

    .swagger-ui .info .description,
    .swagger-ui .opblock-description-wrapper p,
    .swagger-ui .opblock-summary-description,
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .parameter__in,
    .swagger-ui .response-col_description,
    .swagger-ui .response-col_status,
    .swagger-ui .model,
    .swagger-ui .prop-type,
    .swagger-ui .renderedMarkdown {
      color: var(--docs-muted) !important;
    }

    .swagger-ui .scheme-container {
      border-radius: 20px;
      margin: 20px 0;
      padding: 16px 20px;
    }

    .swagger-ui .scheme-container .schemes {
      background: transparent;
    }

    .swagger-ui .btn.authorize,
    .swagger-ui .btn.try-out__btn,
    .swagger-ui .btn.execute,
    .swagger-ui .btn.cancel {
      border-radius: 12px !important;
    }

    .swagger-ui .btn.authorize {
      background: linear-gradient(135deg, var(--docs-accent), var(--docs-accent-strong));
      color: #fff !important;
      border: none !important;
      box-shadow: 0 10px 24px rgba(44, 123, 229, 0.25);
    }

    body[data-theme="dark"] .swagger-ui .btn.authorize {
      box-shadow: 0 10px 24px rgba(56, 189, 248, 0.18);
    }

    .swagger-ui .opblock {
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 14px;
    }

    .swagger-ui .opblock-summary {
      padding: 10px 14px;
    }

    .swagger-ui .opblock-summary:hover {
      filter: brightness(1.01);
    }

    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 10px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #3b82f6 !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: linear-gradient(135deg, #66cfff, #2ea8ff) !important;
    }

    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #22c55e !important;
    }

    .swagger-ui .opblock.opblock-patch .opblock-summary-method {
      background: #14b8a6 !important;
    }

    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #ef4444 !important;
    }

    .swagger-ui .opblock-body,
    .swagger-ui .opblock-section,
    .swagger-ui .parameters,
    .swagger-ui .responses-wrapper,
    .swagger-ui .responses-inner,
    .swagger-ui .response-col_links,
    .swagger-ui .response-col_description,
    .swagger-ui .request-body-editor,
    .swagger-ui .body-param__example,
    .swagger-ui .highlight-code,
    .swagger-ui textarea,
    .swagger-ui input[type="text"],
    .swagger-ui input[type="password"],
    .swagger-ui select {
      background: var(--docs-surface) !important;
      color: var(--docs-text) !important;
      border-color: var(--docs-border) !important;
    }

    body[data-theme="dark"] .swagger-ui .parameters {
      background: linear-gradient(180deg, rgba(12, 20, 38, 0.98), rgba(9, 16, 30, 0.98)) !important;
    }

    body[data-theme="dark"] .swagger-ui .responses-wrapper,
    body[data-theme="dark"] .swagger-ui .responses-inner,
    body[data-theme="dark"] .swagger-ui .response {
      background: rgba(10, 18, 36, 0.98) !important;
      border-color: rgba(102, 207, 255, 0.12) !important;
    }

    body[data-theme="dark"] .swagger-ui .responses-wrapper .response {
      background: rgba(12, 22, 41, 0.98) !important;
      border-radius: 14px;
    }

    body[data-theme="dark"] .swagger-ui .response-col_description,
    body[data-theme="dark"] .swagger-ui .response-col_links,
    body[data-theme="dark"] .swagger-ui .response-col_status,
    body[data-theme="dark"] .swagger-ui .response-col_code {
      color: #d9f2ff !important;
    }

    body[data-theme="dark"] .swagger-ui .responses-table tbody tr {
      background: transparent !important;
    }

    body[data-theme="dark"] .swagger-ui .responses-table tbody tr:hover {
      background: rgba(102, 207, 255, 0.05) !important;
    }

    body[data-theme="dark"] .swagger-ui .response-col_description .response-headers,
    body[data-theme="dark"] .swagger-ui .response-col_description .markdown,
    body[data-theme="dark"] .swagger-ui .response-col_description .response-controls {
      background: transparent !important;
    }

    .swagger-ui .opblock-body,
    .swagger-ui .parameters-container,
    .swagger-ui .responses-inner {
      border-top: 1px solid var(--docs-border) !important;
    }

    .swagger-ui .highlight-code,
    .swagger-ui .microlight {
      border-radius: 14px;
      background: var(--docs-surface-2) !important;
    }

    body[data-theme="dark"] .swagger-ui .highlight-code,
    body[data-theme="dark"] .swagger-ui .microlight {
      background: rgba(102, 207, 255, 0.08) !important;
      border: 1px solid rgba(102, 207, 255, 0.14) !important;
    }

    body[data-theme="dark"] .swagger-ui .parameter__name,
    body[data-theme="dark"] .swagger-ui .parameter__type,
    body[data-theme="dark"] .swagger-ui .parameter__in {
      color: #cbeeff !important;
    }

    .swagger-ui .opblock-summary-path,
    .swagger-ui .opblock-summary-path__deprecated {
      color: var(--docs-text) !important;
    }

    .swagger-ui .opblock-control-arrow svg,
    .swagger-ui .expand-operation svg {
      fill: var(--docs-muted);
    }

    .swagger-ui .dialog-ux .modal-ux,
    .swagger-ui .modal-ux-content,
    .swagger-ui .modal-ux-header {
      background: var(--docs-surface) !important;
      color: var(--docs-text) !important;
    }

    .swagger-ui .modal-ux-header h3,
    .swagger-ui label,
    .swagger-ui .renderedMarkdown h1,
    .swagger-ui .renderedMarkdown h2,
    .swagger-ui .renderedMarkdown h3,
    .swagger-ui .renderedMarkdown h4,
    .swagger-ui .renderedMarkdown h5 {
      color: var(--docs-text) !important;
    }

    .swagger-ui .information-container::before {
      content: "coding_study";
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 999px;
      margin-bottom: 18px;
      background: var(--docs-surface-2);
      color: var(--docs-accent-strong);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    #theme-toggle {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      border: 1px solid var(--docs-border);
      background: var(--docs-surface);
      color: var(--docs-text);
      border-radius: 999px;
      padding: 10px 16px;
      font-weight: 700;
      box-shadow: var(--docs-shadow);
      cursor: pointer;
      backdrop-filter: blur(12px);
    }

    #theme-toggle:hover {
      border-color: var(--docs-accent);
      color: var(--docs-accent);
    }

    /* --- FIX: Menggelapkan background Parameters & Request Body --- */
    body[data-theme="dark"] .swagger-ui .opblock .opblock-section-header,
    body[data-theme="dark"] .swagger-ui .opblock-section {
      background: var(--docs-surface-2) !important;
      border-color: var(--docs-border) !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock-body,
    body[data-theme="dark"] .swagger-ui .parameters-container {
      background: transparent !important;
    }

    /* Memastikan teks header seperti "Parameters" tetap terlihat jelas */
    body[data-theme="dark"] .swagger-ui .opblock-section-header h4,
    body[data-theme="dark"] .swagger-ui .opblock-section-header label {
      color: var(--docs-text) !important;
    }

    body[data-theme="dark"] .swagger-ui .opblock-section-header,
    body[data-theme="dark"] .swagger-ui .responses-header,
    body[data-theme="dark"] .swagger-ui .parameters-container > .opblock-section-header {
      background: linear-gradient(90deg, rgba(102, 207, 255, 0.08), rgba(46, 168, 255, 0.02)) !important;
      border-bottom: 1px solid rgba(102, 207, 255, 0.12) !important;
    }
  `,
  customJsStr: `
    (function () {
      const themeKey = "swagger-ui-theme";

      function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem(themeKey, theme);
        const button = document.getElementById("theme-toggle");
        if (button) {
          button.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
        }
      }

      function initToggle() {
        if (document.getElementById("theme-toggle")) return;

        const button = document.createElement("button");
        button.id = "theme-toggle";
        button.type = "button";
        button.addEventListener("click", function () {
          const current = document.body.getAttribute("data-theme") || "light";
          applyTheme(current === "dark" ? "light" : "dark");
        });
        document.body.appendChild(button);

        const savedTheme = localStorage.getItem(themeKey);
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initToggle);
      } else {
        initToggle();
      }
    })();
  `,
};

export default swaggerUiOptions;
