import { config } from "#config/env";
import { uploadRepository } from "#modules/upload/repository/upload.repository";
import type {
  UploadConfirmInput,
  UploadSignatureInput,
} from "#modules/upload/schema/upload.schema";
import { cloudinary } from "#shared/cloudinary/cloudinary.client";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { Permission } from "#shared/permissions/permissions";
import { hasPermission } from "#utils/permission";

export class UploadService {
  private async getActorPermissions(
    serverId: string,
    userId: string,
    ownerId: string,
  ): Promise<bigint> {
    if (ownerId === userId) {
      return Permission.ADMINISTRATOR;
    }

    const member = await uploadRepository.findMemberPermissions(serverId, userId);

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    return member.roles.reduce(
      (total: bigint, memberRole: { role: { permissionsBitmask: bigint } }) =>
        total | memberRole.role.permissionsBitmask,
      0n,
    );
  }

  async createSignature(userId: string, channelId: string, input: UploadSignatureInput) {
    const channel = await uploadRepository.findChannelContext(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    const permissions = await this.getActorPermissions(
      channel.serverId,
      userId,
      channel.server.ownerId,
    );

    if (!hasPermission(permissions, Permission.ATTACH_FILES)) {
      throw new ForbiddenError("Kamu tidak memiliki permission untuk mengunggah file");
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const folder = `aether/${channel.serverId}/${channel.id}`;

    const signatureParams = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      signatureParams,
      config.CLOUDINARY_API_SECRET,
    );

    const cloudName = config.CLOUDINARY_CLOUD_NAME;
    const apiKey = config.CLOUDINARY_API_KEY;

    return {
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
      resourceType: "auto",
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      fileName: input.fileName,
      fileType: input.fileType,
      fileSize: input.fileSize,
    };
  }

  async confirmUpload(userId: string, input: UploadConfirmInput) {
    const channel = await uploadRepository.findChannelContext(input.channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    const permissions = await this.getActorPermissions(
      channel.serverId,
      userId,
      channel.server.ownerId,
    );

    if (!hasPermission(permissions, Permission.ATTACH_FILES)) {
      throw new ForbiddenError("Kamu tidak memiliki permission untuk mengunggah file");
    }

    const expectedFolder = `aether/${channel.serverId}/${channel.id}`;

    if (!input.publicId.startsWith(`${expectedFolder}/`)) {
      throw new ForbiddenError("File tidak berasal dari folder upload yang valid");
    }

    const resource = await cloudinary.api.resource(input.publicId, {
      resource_type: input.resourceType,
    });

    if (!resource) {
      throw new NotFoundError("File Cloudinary tidak ditemukan");
    }

    if (resource.public_id !== input.publicId) {
      throw new ForbiddenError("Public ID file tidak valid");
    }

    if (resource.bytes > 1024 * 1024 * 1024) {
      throw new ForbiddenError("Ukuran file melebihi batas 1GB");
    }

    if (resource.bytes !== input.fileSize) {
      throw new ForbiddenError("Ukuran file tidak sesuai dengan metadata upload");
    }

    return {
      channelId: input.channelId,
      fileUrl: resource.secure_url,
      thumbnailUrl: null,
      fileType: input.fileType,
      fileSize: resource.bytes,
      fileName: input.fileName,
      publicId: resource.public_id,
      resourceType: resource.resource_type,
      format: resource.format,
    };
  }
}

export const uploadService = new UploadService();
