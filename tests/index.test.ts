import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

describe("kaffe as a service", () => {
  it("should return 0 strikes", async () => {
    const resp = await SELF.fetch("http://kaffe.no/");

    expect(resp.status).toBe(200);
    expect(await resp.text()).toBe("0");
  });

  it("should return 0 strike", async () => {
    const resp = await SELF.fetch("http://kaffe.no/strike", {
      method: "POST",
      headers: { Authorization: "Bearer foobar" },
      body: JSON.stringify({ reporter: "alice" }),
    });

    expect(resp.status).toBe(200);
    expect(await resp.text()).toBe("0");
  });

  it("should return 1 strike", async () => {
    const resp = await SELF.fetch("http://kaffe.no/strike", {
      method: "POST",
      headers: { Authorization: "Bearer foobar" },
      body: JSON.stringify({ reporter: "alice" }),
    });

    expect(resp.status).toBe(200);
    expect(await resp.text()).toBe("0");

    const resp2 = await SELF.fetch("http://kaffe.no/strike", {
      method: "POST",
      headers: { Authorization: "Bearer foobar" },
      body: JSON.stringify({ reporter: "bob" }),
    });

    expect(resp2.status).toBe(200);
    expect(await resp2.text()).toBe("1");
  });

  it("should not be able to strike", async () => {
    const resp = await SELF.fetch("http://kaffe.no/strike", {
      method: "POST",
      body: JSON.stringify({ reporter: "alice" }),
    });

    expect(resp.status).toBe(401);
  });
});
