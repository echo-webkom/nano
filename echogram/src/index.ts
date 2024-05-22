import { Hono } from "hono";
import { auth } from "./middleware";

export type Bindings = {
  SECRET: string;
  R2: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/healthcheck", async (c) => {
  return c.json({ status: "ok" });
});

export default app;
