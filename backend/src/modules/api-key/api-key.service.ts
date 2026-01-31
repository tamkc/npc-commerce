import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import type { ApiKey } from '../../../generated/prisma/index.js';
import { CreateApiKeyDto } from './dto/create-api-key.dto.js';
import { generateApiKey, hashApiKey } from '../../common/utils/hash.util.js';

/** Shape returned when a new key is generated (raw key shown once). */
export interface GeneratedApiKey {
  id: string;
  name: string;
  type: string;
  keyPrefix: string;
  rawKey: string;
  createdAt: Date;
  expiresAt: Date | null;
}

/** Shape returned when listing keys (raw key is never exposed). */
export interface ApiKeySummary {
  id: string;
  name: string;
  type: string;
  keyPrefix: string;
  userId: string;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
}

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a new API key.
   * The raw key is returned **once** in the response; only its hash is stored.
   */
  async generate(
    userId: string,
    dto: CreateApiKeyDto,
  ): Promise<GeneratedApiKey> {
    const rawKey = generateApiKey();
    const keyHash = hashApiKey(rawKey);
    const keyPrefix = rawKey.substring(0, 8);

    const apiKey = await this.prisma.client.apiKey.create({
      data: {
        name: dto.name,
        type: dto.type,
        keyHash,
        keyPrefix,
        userId,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      type: apiKey.type,
      keyPrefix: apiKey.keyPrefix,
      rawKey,
      createdAt: apiKey.createdAt,
      expiresAt: apiKey.expiresAt,
    };
  }

  /**
   * List API keys, optionally filtered by user.
   * Never exposes the raw key or hash.
   */
  async findAll(userId?: string): Promise<ApiKeySummary[]> {
    const where = userId ? { userId } : {};

    const keys = await this.prisma.client.apiKey.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        keyPrefix: true,
        userId: true,
        lastUsedAt: true,
        expiresAt: true,
        revokedAt: true,
        createdAt: true,
      },
    });

    return keys;
  }

  /**
   * Revoke an API key by setting `revokedAt`.
   */
  async revoke(id: string): Promise<ApiKey> {
    const apiKey = await this.prisma.client.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key with ID "${id}" not found`);
    }

    return this.prisma.client.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Validate a raw API key:
   *  1. Hash the raw key
   *  2. Look up by hash
   *  3. Ensure it is not revoked or expired
   * Returns the ApiKey record if valid, null otherwise.
   */
  async validateKey(rawKey: string): Promise<ApiKey | null> {
    const keyHash = hashApiKey(rawKey);

    const apiKey = await this.prisma.client.apiKey.findUnique({
      where: { keyHash },
    });

    if (!apiKey) {
      return null;
    }

    // Check revocation
    if (apiKey.revokedAt) {
      return null;
    }

    // Check expiration
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Update lastUsedAt (fire-and-forget)
    this.prisma.client.apiKey
      .update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {
        // Swallow errors from the non-critical timestamp update
      });

    return apiKey;
  }
}
