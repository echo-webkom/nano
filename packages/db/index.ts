import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "./types";

export * from "kysely";

/**
 * Creates a new database connection.
 * Uses Kysely as the query builder to
 * add type safety to the queries.
 *
 * @param dbUrl - Connection string
 * @returns Kysely instance
 */
export const createDatabase = (dbUrl: string) => {
  const dialect = new PostgresJSDialect({
    postgres: postgres(dbUrl),
  });

  return new Kysely<DB>({
    dialect,
  });
};
