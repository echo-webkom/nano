import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "./types";

export * from "kysely";

/**
 * Creates a new database connection to a hyperdrive
 * instance. Uses Kysely as the query builder to
 * add type safety to the queries.
 *
 * @param hyperdrive - Hyperdrive instance
 * @returns Kysely instance
 */
export const createDatabase = (hyperdrive: Hyperdrive) => {
  const dialect = new PostgresJSDialect({
    postgres: postgres(hyperdrive.connectionString),
  });

  return new Kysely<DB>({
    dialect,
  });
};
