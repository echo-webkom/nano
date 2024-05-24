import type { Env } from ".";
import { createDatabase } from "./db/client";

export type AppContext = {
  env: Env;
  db: ReturnType<typeof createDatabase>;
};

export const createContext = (env: Env): AppContext => {
  const db = createDatabase(env.DATABASE_URL);
  const ctx = {
    env: {
      ...env,
    },
    db,
  };

  return ctx;
};
