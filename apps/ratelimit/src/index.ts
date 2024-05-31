import { Hono } from "hono";
import { auth } from "./middleware";
import { RateLimit } from "./ratelimit";

type Bindings = {
  ADMIN_KEY: string;
  KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(auth);

app.get("/", async (c) => {
  const ratelimit = new RateLimit(c.env.KV);
  const key = c.req.header("CF-Connecting-IP") || "127.0.0.1";
  const response = await ratelimit.check(key);
  return c.json(response);
});

export default app;
