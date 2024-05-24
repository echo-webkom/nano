import { Cron } from "./cron";
import { createDatabase } from "./db/client";
import { validateEnv } from "./env";
import {
  checkForNewFeedbacks,
  deleteOldStrikes,
  deleteSensitiveQuestions,
  resetYear,
  unbanUsers,
} from "./handlers";

export type Env = {
  DATABASE_URL: string;
  RESEND_API_KEY: string;
  ADMIN_KEY: string;
};

export type AppContext = {
  env: Env;
  db: ReturnType<typeof createDatabase>;
};

export default {
  async fetch() {
    return new Response("OK");
  },
  async scheduled(controller: ScheduledController, env: Env) {
    validateEnv(env);
    const db = createDatabase(env.DATABASE_URL);
    const ctx = {
      env: {
        ...env,
      },
      db,
    } satisfies AppContext;

    const cron = new Cron(ctx, controller);

    cron.at("0 0 1 1,7 *", deleteSensitiveQuestions);
    cron.at("0 0 1 1,7 *", deleteOldStrikes);
    cron.at("0 0 1 7 *", resetYear);
    cron.at("0 2 * * *", unbanUsers);
    cron.at("0 19 * * *", checkForNewFeedbacks);
  },
};
