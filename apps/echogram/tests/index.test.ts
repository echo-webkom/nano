import "../src";
import {
  SELF,
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";

declare module "cloudflare:test" {
  interface ProvidedEnv {
    R2: KVNamespace;
  }
}

describe("echogram", () => {
  it("should not find image", async () => {
    const response = await SELF.fetch("http://example.com/some-id", {
      method: "GET",
    });

    expect(response.status).toBe(404);
  });

  it("should upload image", async () => {
    const ctx = createExecutionContext();

    const file = new File(["hello"], "hello.png", {
      type: "image/png",
    });

    const formData = new FormData();
    formData.append("file", file);

    const response = await SELF.fetch("http://example.com/some-id", {
      method: "POST",
      headers: {
        Authorization: "Bearer foobar",
      },
      body: formData,
    });

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
  });

  it("should delete image", async () => {
    const ctx = createExecutionContext();

    await env.R2.put("some-id", new ArrayBuffer(0));

    const response = await SELF.fetch("http://example.com/some-id", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer foobar",
      },
    });

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);

    const object = await env.R2.get("some-id");
    expect(object).toBeNull();
  });

  it("should not be able to upload image", async () => {
    const file = new File(["hello"], "hello.png", {
      type: "image/png",
    });

    const formData = new FormData();
    formData.append("file", file);

    const response = await SELF.fetch("http://example.com/some-id", {
      method: "POST",
      body: formData,
    });

    expect(response.status).toBe(401);
  });
});
