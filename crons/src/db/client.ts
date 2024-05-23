import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "./types";

export const createDatabase = (databaseUrl: string) => {
  const dialect = new PostgresJSDialect({
    postgres: postgres(databaseUrl),
  });

  return new Kysely<DB>({
    dialect,
  });
};
