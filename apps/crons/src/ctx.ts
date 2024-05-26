import type { Env } from ".";
import { createDatabase } from "@echo-webkom/nano-db";

export type AppContext = {
  env: Env;
  db: ReturnType<typeof createDatabase>;
};

export const createContext = (env: Env): AppContext => {
  const db = createDatabase(env.HYPERDRIVE);
  const ctx = {
    env: {
      ...env,
    },
    db,
  };

  return ctx;
};
