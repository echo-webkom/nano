import { describe, it, expect } from "vitest";
import { Kroner } from "../src/kroner";

const noop = () => {};

describe("Kroner", () => {
  it("should add cron job to job queue", () => {
    const kroner = new Kroner();

    kroner.at("0 0 0 0 0", noop);

    expect(kroner.jobs.length).toBe(1);
  });

  it("should run cron job", async () => {
    const kroner = new Kroner();

    let ran = false;

    kroner.at("0 0 0 0 0", () => {
      ran = true;
    });

    await kroner.scheduled({
      cron: "0 0 0 0 0",
      noRetry: noop,
      scheduledTime: new Date().getTime(),
    });

    expect(ran).toBe(true);
  });

  it("should not run cron job if cron does not match", async () => {
    const kroner = new Kroner();

    let ran = false;

    kroner.at("0 0 0 0 0", () => {
      ran = true;
    });

    await kroner.scheduled({
      cron: "0 0 0 0 1",
      noRetry: noop,
      scheduledTime: new Date().getTime(),
    });

    expect(ran).toBe(false);
  });
});
