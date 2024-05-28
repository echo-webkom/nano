import { Hono } from "hono";
import * as Striker from "./services/striker";
import * as Reporter from "./services/reporter";
import { auth } from "./middleware";

export type Bindings = {
  KV: KVNamespace;
  SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const strikes = await Striker.get(c.env.KV);
  return c.text(`${strikes}`);
});

app.post("/strike", auth, async (c) => {
  let reporter: string;
  try {
    reporter = await c.req
      .json<{ reporter: string }>()
      .then((json) => json.reporter);
  } catch {
    return c.text("Bad Request", { status: 400 });
  }

  const updated = await Reporter.add(c.env.KV, reporter);
  return c.text(`${updated}`);
});

app.get("/reset", auth, async (c) => {
  await Promise.all([Striker.reset(c.env.KV), Reporter.reset(c.env.KV)]);
  return c.text("0");
});

export default app;
