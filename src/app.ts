import { Hono, logger } from "../deps.ts";
import { addStrike, clearStrikes, getAmountOfStrikes } from "./strikes.ts";
import { auth } from "./middleware.ts";

const app = new Hono();

app.use("*", logger());

app.get("/", auth, async (c) => {
  const strikes = await getAmountOfStrikes();

  return c.text(`${strikes}`);
});

app.post("/strike", auth, async (c) => {
  const body = await c.req.json<{ userId: string }>();
  const res = await addStrike(body.userId);

  return c.text(`${res}`);
});

app.post("/reset", async (c) => {
  await clearStrikes();

  return c.text("OK");
});

export { app };
