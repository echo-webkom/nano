import { Cron } from "./cron";
import { createContext } from "./ctx";
import {
  checkForNewFeedbacks,
  deleteOldStrikes,
  deleteSensitiveQuestions,
  resetYear,
  unbanUsers,
} from "./handlers";

export type Env = {
  RESEND_API_KEY: string;
  ADMIN_KEY: string;
  HYPERDRIVE: Hyperdrive;
};

export default {
  async scheduled(controller: ScheduledController, env: Env) {
    const ctx = createContext(env);

    const resp = new Cron(ctx, controller)
      .at("0 0 1 1,7 *", deleteSensitiveQuestions, {
        name: "delete-sensitive-questions",
      })
      .at("0 0 1 1,7 *", deleteOldStrikes, {
        name: "delete-old-strikes",
      })
      .at("0 0 1 7 *", resetYear, {
        name: "reset-year",
      })
      .at("0 2 * * *", unbanUsers, {
        name: "unban-users",
      })
      .at("0 16 * * *", checkForNewFeedbacks, {
        name: "check-for-new-feedbacks",
      });

    return resp;
  },
};
