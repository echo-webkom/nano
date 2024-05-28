const RESEND_API_URL = "https://api.resend.com/emails";

/**
 * Email class for sending emails.
 *
 * If no api key is provided, the email will be logged to the console instead.
 *
 * @param apiKey - API key for the email service
 *
 * @example
 * ```ts
 * const email = new Email("API_KEY");
 *
 * await email.send(["hello@echo.uib.no"], "Hello", "Hello, world!");
 * ```
 */
export class Email {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(to: Array<string>, subject: string, body: string) {
    if (!this.apiKey) {
      console.error("No RESEND_API_KEY provided");

      console.log("TO: ", to);
      console.log("SUBJECT: ", subject);
      console.log("BODY: ", body);

      return;
    }

    await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from: "echo <ikkesvar@echo-webkom.no>",
        to,
        subject,
        html: body,
      }),
    });
  }
}
