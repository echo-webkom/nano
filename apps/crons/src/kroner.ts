interface Job<Bindings, Variables> {
  schedule: string;
  handler: (ctx: Context<Bindings, Variables>) => Promise<void>;
}

interface Bindings {
  [key: string]: unknown;
}

interface Variables {
  [key: string]: unknown;
}

interface Context<Bindings, Variables> {
  vars: Variables;
  controller: ScheduledController;
  env: Bindings;
  ctx?: ExecutionContext;
}

interface Env {
  Bindings?: Bindings;
  Variables?: Variables;
}

type SetupFunction<Bindings, Variables> = (
  ctx: Context<Bindings, Record<string, never>>
) => Variables;

export class Kroner<E extends Env = Env> {
  jobs: Array<Job<E["Bindings"], E["Variables"]>> = [];
  setupFunction?: SetupFunction<E["Bindings"], E["Variables"]>;

  at = (
    schedule: string,
    handler: (ctx: Context<E["Bindings"], E["Variables"]>) => Promise<void>
  ) => {
    this.jobs.push({
      schedule,
      handler,
    });

    return this;
  };

  setup = (
    setupFunction: SetupFunction<E["Bindings"], E["Variables"]>
  ): this => {
    this.setupFunction = setupFunction;
    return this;
  };

  scheduled = async (
    controller: ScheduledController,
    env?: E["Bindings"],
    ctx?: ExecutionContext
  ): Promise<void> => {
    if (!Array.isArray(this.jobs)) {
      throw new Error("Jobs array is not initialized!");
    }

    const jobsToRun = this.jobs.filter(
      (job) => job.schedule === controller.cron
    );

    console.log(`[Kroner] Running ${jobsToRun.length} jobs`);

    let vars: E["Variables"] = {};
    if (this.setupFunction) {
      vars = this.setupFunction({ env, controller, vars: {} });
    }

    for (const job of jobsToRun) {
      await job.handler({ env, controller, vars, ctx });
    }

    console.log("[Kroner] All jobs executed");
  };
}
