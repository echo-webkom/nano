import { Hono } from "hono";
import { createDatabase } from "@echo-webkom/nano-db";
import { RegistrationCounter } from "./registration-counter";
import { auth } from "./middleware";

type Bindings = {
  COUNTER: DurableObjectNamespace<RegistrationCounter>;
  DATABASE_URL: string;
  ADMIN_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/:id", auth, async (c) => {
  try {
    const { id } = c.req.param();
    const durableObjectId = c.env.COUNTER.idFromName(id);
    const stub = c.env.COUNTER.get(durableObjectId);

    const db = createDatabase(c.env.DATABASE_URL);

    const resp = await db
      .selectFrom("registration")
      .select(({ fn }) => [
        "registration.status",
        fn.count("registration.status").as("count"),
      ])
      .where("happening_id", "=", id)
      .groupBy("registration.status")
      .execute();

    const getCount = (status: "registered" | "waiting") => {
      return resp.find((row) => row.status === status)?.count ?? 0;
    };

    await stub.broadcast({
      registerCount: Number(getCount("registered")),
      waitlistCount: Number(getCount("waiting")),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log(error);

    return c.json({ success: false, error: "Unknown error" }, 400);
  }
});

app.get("/ws/:id", async (c) => {
  const { id } = c.req.param();
  const durableObjectId = c.env.COUNTER.idFromName(id);
  const stub = c.env.COUNTER.get(durableObjectId);

  return stub.fetch(c.req.raw);
});

export default app;
export { RegistrationCounter };
