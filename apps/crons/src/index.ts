import { createDatabase, sql } from "@echo-webkom/nano-db";
import { Logger } from "@echo-webkom/logger";
import { Kroner } from "./kroner";
import { createSanity } from "./sanity";

type Bindings = {
  ADMIN_KEY: string;
  DATABASE_URL: string;
  SANITY_PROJECT_ID: string;
  SANITY_TOKEN: string;
};

type Variables = {
  db: ReturnType<typeof createDatabase>;
  sanity: ReturnType<typeof createSanity>;
};

const kroner = new Kroner<{
  Bindings: Bindings;
  Variables: Variables;
}>();

kroner.setup((c) => {
  return {
    db: createDatabase(c.env.DATABASE_URL),
    sanity: createSanity({
      projectId: c.env.SANITY_PROJECT_ID,
      token: c.env.SANITY_TOKEN,
    }),
  };
});

kroner.at("0 0 1 1,7 *", async (c) => {
  const result = await c.vars.db
    .deleteFrom("answer")
    .where(
      "question_id",
      "in",
      c.vars.db
        .selectFrom("question")
        .leftJoin("happening", "happening_id", "id")
        .where("date", "<", sql<Date>`NOW() - INTERVAL '30 days'`)
        .where("is_sensitive", "=", true)
        .select("id"),
    )
    .execute();

  Logger.info(`Deleted ${result.length} sensitive questions`);
});

kroner.at("0 0 1 1,7 *", async (c) => {
  const result = await c.vars.db
    .deleteFrom("strike_info")
    .where("created_at", "<", sql<Date>`NOW() - INTERVAL '1 year'`)
    .execute();

  Logger.info(`Deleted ${result.length} old strikes`);
});

kroner.at("0 0 1 7 *", async (c) => {
  const result = await c.vars.db
    .updateTable("user")
    .set("year", null)
    .returning("id")
    .execute();

  Logger.info(`Reset ${result.length} users' years`);
});

kroner.at("0 2 * * *", async (c) => {
  const happenings = await c.vars.sanity.fetch<Array<{ id: string }>>(
    `*[_type == "happening" && isPinned == true && defined(registrationEnd) && dateTime(registrationEnd) < dateTime(now())] {
  "id": _id
}
`,
  );

  if (happenings.length > 0) {
    await c.vars.sanity
      .transaction(
        happenings.map((h) => ({
          patch: {
            id: h.id,
            set: {
              isPinned: false,
            },
          },
        })),
      )
      .commit();
  }

  Logger.info(`Updated ${happenings.length} pinned happenings`);
});

kroner.at("0 0 1 1 *", async (c) => {
  const keys = await c.vars.db
    .selectFrom("kv")
    .selectAll()
    .where("ttl", "<", sql<Date>`NOW()`)
    .execute();

  await c.vars.db
    .deleteFrom("kv")
    .where(
      "key",
      "in",
      keys.map((key) => key.key),
    )
    .execute();

  Logger.info(`Deleted ${keys.length} expired kv entries`);
});

kroner.at("0 2 * * *", async () => {
  const response = await fetch("https://programmer.bar/api/status", {
    method: "POST",
    body: JSON.stringify({ status: 0 }),
  });

  Logger.info(`Attempted to close bar. Got status, ${response.status}`);
});

kroner.at("0 2 * * *", async (c) => {
  const response = await fetch("https://api.echo-webkom.no/strikes/unban", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.env.ADMIN_KEY}`,
    },
  });

  Logger.info(`Attempted to unban users. Got status, ${response.status}`);
});

export default {
  fetch: () => {
    return new Response("OK", { status: 200 });
  },
  scheduled: kroner.scheduled,
} satisfies ExportedHandler<Bindings>;
