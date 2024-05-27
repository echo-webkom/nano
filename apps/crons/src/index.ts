import { createDatabase, sql } from "@echo-webkom/nano-db";
import { Kroner } from "./kroner";
import { log } from "./logger";
import { EmailClient } from "./email";

type Bindings = {
  RESEND_API_KEY: string;
  ADMIN_KEY: string;
  HYPERDRIVE: Hyperdrive;
};

type Variables = {
  db: ReturnType<typeof createDatabase>;
  email: EmailClient;
};

const kroner = new Kroner<{
  Bindings: Bindings;
  Variables: Variables;
}>();

kroner.setup((c) => {
  return {
    db: createDatabase(c.env.HYPERDRIVE),
    email: new EmailClient(c.env.RESEND_API_KEY),
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

  log(`Deleted ${result.length} sensitive questions`);
});

kroner.at("0 0 1 1,7 *", async (c) => {
  const result = await c.vars.db
    .deleteFrom("strike_info")
    .where("created_at", "<", sql<Date>`NOW() - INTERVAL '1 year'`)
    .execute();

  log(`Deleted ${result.length} old strikes`);
});

kroner.at("0 0 1 7 *", async (c) => {
  const response = await fetch("https://echo.uib.no/api/unban", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.env.ADMIN_KEY}`,
    },
  });

  log(`Ping to /api/unban: ${response.status}`);
});

kroner.at("0 2 * * *", async (c) => {
  const result = await c.vars.db
    .updateTable("user")
    .set("year", null)
    .returning("id")
    .execute();

  log(`Reset ${result.length} users' years`);
});

kroner.at("0 16 * * *", async (c) => {
  const feedbacks = await c.vars.db
    .selectFrom("site_feedback")
    .selectAll()
    .where("created_at", ">", sql<Date>`NOW() - INTERVAL '1 day'`)
    .where("is_read", "=", false)
    .execute();

  log(`Found ${feedbacks.length} new feedbacks`);

  // No new feedbacks
  if (!feedbacks.length) {
    return;
  }

  const to = ["me@omfj.no", "n.d.engh@gmail.com", "KjetilAlvestad@gmail.com"];
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

export default kroner;
