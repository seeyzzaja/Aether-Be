import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Categories
 * const categories = await prisma.category.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Category
 *
 */
export type Category = Prisma.CategoryModel;
/**
 * Model Channel
 *
 */
export type Channel = Prisma.ChannelModel;
/**
 * Model Role
 *
 */
export type Role = Prisma.RoleModel;
/**
 * Model ServerMember
 *
 */
export type ServerMember = Prisma.ServerMemberModel;
/**
 * Model Server
 *
 */
export type Server = Prisma.ServerModel;
/**
 * Model Session
 *
 */
export type Session = Prisma.SessionModel;
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
//# sourceMappingURL=client.d.ts.map