import { ForbiddenError, NotFoundError } from "#shared/errors/app-error.js";

import { channelRepository } from "../repository/channel.repository.js";
import type { CreateChannelInput, UpdateChannelInput } from "../schema/channel.schema.js";

export class ChannelService {
  private async ensureServerAccess(serverId: string, userId: string) {
    const server = await channelRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId === userId) {
      return server;
    }

    const member = await channelRepository.findMember(serverId, userId);

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    return server;
  }

  private async ensureOwner(serverId: string, userId: string) {
    const server = await channelRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId !== userId) {
      throw new ForbiddenError("Hanya Owner yang dapat mengelola channel");
    }

    return server;
  }

  private async ensureChannelBelongsToServer(serverId: string, channelId: string) {
    const channel = await channelRepository.findById(channelId);

    if (!channel || channel.serverId !== serverId) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    return channel;
  }

  private async ensureCategoryBelongsToServer(serverId: string, categoryId: string) {
    const category = await channelRepository.findCategoryById(categoryId);

    if (!category || category.serverId !== serverId) {
      throw new NotFoundError("Category tidak ditemukan di server ini");
    }

    return category;
  }

  async create(serverId: string, userId: string, data: CreateChannelInput) {
    await this.ensureOwner(serverId, userId);

    if (data.categoryId) {
      await this.ensureCategoryBelongsToServer(serverId, data.categoryId);
    }

    const position = await channelRepository.getNextPosition(serverId, data.categoryId);

    return channelRepository.create(serverId, data, position);
  }

  async getAll(serverId: string, userId: string) {
    await this.ensureServerAccess(serverId, userId);

    return channelRepository.findAllByServerId(serverId);
  }

  async getById(serverId: string, channelId: string, userId: string) {
    await this.ensureServerAccess(serverId, userId);

    return this.ensureChannelBelongsToServer(serverId, channelId);
  }

  async update(serverId: string, channelId: string, userId: string, data: UpdateChannelInput) {
    await this.ensureOwner(serverId, userId);

    await this.ensureChannelBelongsToServer(serverId, channelId);

    if (data.categoryId) {
      await this.ensureCategoryBelongsToServer(serverId, data.categoryId);
    }

    return channelRepository.update(channelId, data);
  }

  async delete(serverId: string, channelId: string, userId: string) {
    await this.ensureOwner(serverId, userId);

    await this.ensureChannelBelongsToServer(serverId, channelId);

    await channelRepository.delete(channelId);
  }
}

export const channelService = new ChannelService();
