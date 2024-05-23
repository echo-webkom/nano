import type { AppContext } from ".";

export class Cron {
  ctx: AppContext;
  controller: ScheduledController;

  constructor(ctx: AppContext, controller: ScheduledController) {
    this.ctx = ctx;
    this.controller = controller;
  }

  at(time: string, handler: (ctx: AppContext) => Promise<void>) {
    if (this.controller.cron === time) {
      handler(this.ctx);
    }
  }
}
