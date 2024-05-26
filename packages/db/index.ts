import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "./types";

export * from "kysely";

export const createDatabase = (hyperdrive: Hyperdrive) => {
  const dialect = new PostgresJSDialect({
    postgres: postgres(hyperdrive.connectionString),
  });

  return new Kysely<DB>({
    dialect,
  });
};
