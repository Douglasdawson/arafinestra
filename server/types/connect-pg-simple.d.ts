// connect-pg-simple v10 ships no type declarations; minimal ambient module.
declare module "connect-pg-simple" {
  import type { Store } from "express-session";
  import type session from "express-session";
  interface PgStoreOptions {
    pool?: unknown;
    conString?: string;
    conObject?: unknown;
    schemaName?: string;
    tableName?: string;
    createTableIfMissing?: boolean;
    pruneSessionInterval?: number | false;
    ttl?: number;
    errorLog?: (...args: unknown[]) => void;
  }
  interface PgStoreClass {
    new (options?: PgStoreOptions): Store;
  }
  function connectPgSimple(s: typeof session): PgStoreClass;
  export = connectPgSimple;
}
