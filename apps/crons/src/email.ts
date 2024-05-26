const RESEND_API_URL = "https://api.resend.com/emails";

class EmailClient {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(to: Array<string>, subject: string, body: string) {
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
