import { env } from "cloudflare:test";
import { describe, it, expect, vi, afterAll } from "vitest";
import worker from "../src";
import { noop } from "./utils";

declare module "cloudflare:test" {
  interface ProvidedEnv {
    DATABASE_URL: string;
    RESEND_API_KEY: string;
    ADMIN_KEY: string;
  }
}

describe("crons", () => {
  const consoleMock = vi
    .spyOn(console, "log")
    .mockImplementation(() => undefined);

  afterAll(() => {
    consoleMock.mockReset();
  });

  it("should run two jobs at: 0 0 1 1,7 *", async () => {
    await worker.scheduled(
      {
        cron: "0 0 1 1,7 *",
        scheduledTime: new Date().getTime(),
        noRetry: noop,
      },
      env
    );

    const expectedCrons = [
      "delete-sensitive-questions",
      "delete-old-strikes",
    ] as const;

    for (const cron of expectedCrons) {
      expect(consoleMock).toHaveBeenCalledWith(
        `Running ${cron} at 0 0 1 1,7 *`
      );
    }
  });

  it("should run one job at: 0 0 1 7 *", async () => {
    await worker.scheduled(
      {
        cron: "0 0 1 7 *",
        scheduledTime: new Date().getTime(),
        noRetry: noop,
      },
      env
    );

    expect(consoleMock).toHaveBeenCalledWith("Running reset-year at 0 0 1 7 *");
  });

  it("should run one job at: 0 2 * * *", async () => {
    await worker.scheduled(
      {
        cron: "0 2 * * *",
        scheduledTime: new Date().getTime(),
        noRetry: noop,
      },
      env
    );

    expect(consoleMock).toHaveBeenCalledWith(
      "Running unban-users at 0 2 * * *"
    );
  });

  it("should run one job at: 0 16 * * *", async () => {
    await worker.scheduled(
      {
        cron: "0 16 * * *",
        scheduledTime: new Date().getTime(),
        noRetry: noop,
      },
      env
    );

    expect(consoleMock).toHaveBeenCalledWith(
      "Running check-for-new-feedbacks at 0 16 * * *"
    );
  });
});
