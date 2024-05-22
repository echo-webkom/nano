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
  async scheduled(controller: ScheduledController, env: Env) {
    validateEnv(env);
    const db = createDatabase(env.DATABASE_URL);
    const ctx = {
      env: {
        ...env,
      },
      db,
    } satisfies AppContext;

    switch (controller.cron) {
      /**
       * Runs at 00:00 on the 1st of January and July
       *
       * Delete sensitive questions
       */
      case "0 0 1 1,7 *":
        await Promise.all([
          deleteSensitiveQuestions(ctx),
          deleteOldStrikes(ctx),
        ]);

        break;

      /**
       * Runs at 00:00 on the 1st of July
       */
      case "0 0 1 7 *":
        await resetYear(ctx);
        break;

      /**
       * Runs every day at 02:00
       */
      case "0 2 * * *":
        await unbanUsers(ctx);
        break;

      /**
       * Runs every day at 17:00
       */
      case "0 17 * * *":
        await checkForNewFeedbacks(ctx);
        break;
    }
  },
};
