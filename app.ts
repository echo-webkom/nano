import { Hono } from "https://deno.land/x/hono@v3.9.2/mod.ts";
import { logger } from "https://deno.land/x/hono@v3.10.1/middleware.ts";
import { addStrike, getAmountOfStrikes } from "./strikes.ts";
import { auth } from "./middleware.ts";

export const app = new Hono();

app.use("*", logger());
app.use("/strike", auth());

app.get("/", async (c) => {
  const strikes = await getAmountOfStrikes();
  return c.text(`Strikes issued: ${strikes}`);
});

app.post("/strike", async (c) => {
  const body = await c.req.json<{ userId: string }>();
  const res = await addStrike(body.userId);
  return c.text(`${res}`);
});
