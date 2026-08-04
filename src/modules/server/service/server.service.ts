import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";

import { serverRepository } from "../repository/server.repository.js";
import type { CreateServerInput, UpdateServerInput } from "../schema/server.schema.js";

export class ServerService {
  async create(ownerId: string, data: CreateServerInput) {
    return serverRepository.create(ownerId, data);
  }

  async getAllByOwnerId(ownerId: string) {
    return serverRepository.findAllByOwnerId(ownerId);
  }

  async getById(serverId: string) {
    const server = await serverRepository.findById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    return server;
  }

  async update(serverId: string, userId: string, data: UpdateServerInput) {
    const server = await this.getById(serverId);

    if (server.ownerId !== userId) {
      throw new ForbiddenError("Hanya Owner yang dapat mengubah server");
    }

    return serverRepository.update(serverId, data);
  }

  async delete(serverId: string, userId: string) {
    const server = await this.getById(serverId);

    if (server.ownerId !== userId) {
      throw new ForbiddenError("Hanya Owner yang dapat menghapus server");
    }

    await serverRepository.delete(serverId);
  }
}

export const serverService = new ServerService();
