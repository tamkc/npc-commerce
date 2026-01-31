import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Models that have a `deletedAt` field and support soft-delete.
 */
const SOFT_DELETE_MODELS = new Set([
  'User',
  'Customer',
  'CustomerGroup',
  'Product',
  'ProductVariant',
  'Category',
  'PriceList',
  'Promotion',
  'Region',
  'SalesChannel',
  'StockLocation',
]);

function createSoftDeleteClient(baseClient: PrismaClient) {
  return baseClient.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) {
            args.where = { ...args.where, deletedAt: null };
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) {
            args.where = { ...args.where, deletedAt: null };
          }
          return query(args);
        },
        async findUnique({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) {
            args.where = {
              ...args.where,
              deletedAt: null,
            } as typeof args.where;
          }
          return query(args);
        },
        async delete({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) {
            return (
              query as unknown as (
                a: Record<string, unknown>,
              ) => Promise<unknown>
            )({
              where: args.where,
              data: { deletedAt: new Date() },
            } as unknown as typeof args);
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if (SOFT_DELETE_MODELS.has(model)) {
            return (
              query as unknown as (
                a: Record<string, unknown>,
              ) => Promise<unknown>
            )({
              where: args.where,
              data: { deletedAt: new Date() },
            } as unknown as typeof args);
          }
          return query(args);
        },
      },
    },
  });
}

type ExtendedPrismaClient = ReturnType<typeof createSoftDeleteClient>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly baseClient: PrismaClient;
  private readonly _client: ExtendedPrismaClient;

  constructor() {
    const adapter = new PrismaPg(process.env['DATABASE_URL']!);
    this.baseClient = new PrismaClient({ adapter });
    this._client = createSoftDeleteClient(this.baseClient);
  }

  /**
   * Returns the extended Prisma Client with soft-delete middleware.
   * Use this in services: `this.prisma.client.user.findMany()`
   */
  get client(): ExtendedPrismaClient {
    return this._client;
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to database...');
    await this.baseClient.$connect();
    this.logger.log('Database connection established.');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from database...');
    await this.baseClient.$disconnect();
    this.logger.log('Database connection closed.');
  }
}
