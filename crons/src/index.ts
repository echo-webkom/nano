import { Cron } from "./cron";
import { createContext } from "./ctx";
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

export default {
  async fetch() {
    return new Response("OK");
  },
  async scheduled(controller: ScheduledController, env: Env) {
    validateEnv(env);
    const ctx = createContext(env);

    new Cron(ctx, controller)
      .at("0 0 1 1,7 *", deleteSensitiveQuestions)
      .at("0 0 1 1,7 *", deleteOldStrikes)
      .at("0 0 1 7 *", resetYear)
      .at("0 2 * * *", unbanUsers)
      .at("0 19 * * *", checkForNewFeedbacks);
  },
};
