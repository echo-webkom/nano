import { createDatabase, sql } from "@echo-webkom/nano-db";
import { Logger } from "@echo-webkom/logger";
import { Email } from "@echo-webkom/email";
import { Kroner } from "./kroner";

type Bindings = {
  RESEND_API_KEY: string;
  ADMIN_KEY: string;
  DATABASE_URL: string;
};

type Variables = {
  db: ReturnType<typeof createDatabase>;
  email: Email;
};

const kroner = new Kroner<{
  Bindings: Bindings;
  Variables: Variables;
}>();

kroner.setup((c) => {
  return {
    db: createDatabase(c.env.DATABASE_URL),
    email: new Email(c.env.RESEND_API_KEY),
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
        .select("id")
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
  const response = await fetch("https://echo.uib.no/api/unban", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.env.ADMIN_KEY}`,
    },
  });

  Logger.info(`Ping to /api/unban: ${response.status}`);
});

kroner.at("0 16 * * *", async (c) => {
  const feedbacks = await c.vars.db
    .selectFrom("site_feedback")
    .selectAll()
    .where("created_at", ">", sql<Date>`NOW() - INTERVAL '1 day'`)
    .where("is_read", "=", false)
    .execute();

  Logger.info(`Found ${feedbacks.length} new feedbacks`);

  // No new feedbacks
  if (!feedbacks.length) {
    return;
  }

  const to = [
    "me@omfj.no",
    "n.d.engh@gmail.com",
    "zenoelioleone@gmail.com",
    "webkom-styret@echo.uib.no",
  ];
  const subject = `${feedbacks.length} ny(e) tilbakemeldinger på echo.uib.no`;

  const body = [
    `<p>Det har kommet ${feedbacks.length} ny(e) tilbakemelding(er) på <a href="https://echo.uib.no">echo.uib.no</a>. Les de(n) <a href="https://echo.uib.no/admin/tilbakemeldinger">her</a>.</p>`,
    '<ul style="padding-top: 2rem;">',
    ...feedbacks.map(
      (feedback) => `<li>
    <div>
      <p><strong>${feedback.name ?? "Ukjent"}</strong> (${
        feedback.email ?? "Ingen e-post"
      })</p>
      <p>${feedback.message}</p>
    </div>
    </li>`
    ),
    "</ul>",
  ].join("");

  await c.vars.email.send(to, subject, body);
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
      keys.map((key) => key.key)
    )
    .execute();

  Logger.info(`Deleted ${keys.length} expired kv entries`);
});

kroner.at("0 2 * * *", async (c) => {
  await fetch("https://api.programmer.bar/", {
    method: "POST",
    body: JSON.stringify({ status: 0 }),
  });

  Logger.info("Closed bar");
});

export default kroner;
