import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

describe("echogram", () => {
  it("should respond with 200", async () => {
    const resp = await SELF.fetch("http://echogram.no/healthcheck");

    expect(resp.status).toBe(200);
  });
});
