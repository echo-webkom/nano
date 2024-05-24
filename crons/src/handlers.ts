import { sql } from "kysely";
import type { AppContext } from "./ctx";

export const deleteSensitiveQuestions = async (ctx: AppContext) => {
  const result = await ctx.db
    .deleteFrom("answer")
    .where(
      "question_id",
      "in",
      ctx.db
        .selectFrom("question")
        .leftJoin("happening", "happening_id", "id")
        .where("date", "<", sql<Date>`NOW() - INTERVAL '30 days'`)
        .where("is_sensitive", "=", true)
        .select("id"),
    )
    .execute();
  console.log(`Deleted ${result.length} sensitive questions`);
};

export const deleteOldStrikes = async (ctx: AppContext) => {
  const result = await ctx.db
    .deleteFrom("strike_info")
    .where("created_at", "<", sql<Date>`NOW() - INTERVAL '1 year'`)
    .execute();
  console.log(`Deleted ${result.length} old strikes`);
};

export const unbanUsers = async (ctx: AppContext) => {
  const response = await fetch("https://echo.uib.no/api/unban", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ctx.env.ADMIN_KEY}`,
    },
  });

  console.log("Ping to /api/unban:", response.status);
};

export const resetYear = async (ctx: AppContext) => {
  const result = await ctx.db
    .updateTable("user")
    .set("year", null)
    .returning("id")
    .execute();
  console.log(`Reset ${result.length} users' years`);
};

export const checkForNewFeedbacks = async (ctx: AppContext) => {
  const feedbacks = await ctx.db
    .selectFrom("site_feedback")
    .selectAll()
    .where("created_at", ">", sql<Date>`NOW() - INTERVAL '1 day'`)
    .where("is_read", "=", false)
    .execute();

  console.log(`Found ${feedbacks.length} new feedbacks`);

  if (feedbacks.length > 0) {
    const email = new EmailClient(ctx.env.RESEND_API_KEY);

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
      </li>`,
      ),
      "</ul>",
    ].join("");

    await email.sendEmail(to, subject, body);
  }
};
