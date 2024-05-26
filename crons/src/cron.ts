import type { AppContext } from "./ctx";

type Metadata = {
  name?: string;
};

export class Cron {
  ctx: AppContext;
  controller: ScheduledController;

  constructor(ctx: AppContext, controller: ScheduledController) {
    this.ctx = ctx;
    this.controller = controller;
  }

  at(
    time: string,
    handler: (ctx: AppContext) => Promise<void>,
    metadata?: Metadata
  ) {
    if (this.controller.cron === time) {
      const name = metadata?.name || "cron job";
      console.log(`Running ${name} at ${time}`);

      handler(this.ctx);
    }

    return this;
  }
}
