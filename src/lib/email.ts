import { Resend } from "resend";

let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log("[Contact form — dev mode, no RESEND_API_KEY]", data);
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "sohelashik594@gmail.com",
      replyTo: data.email,
      subject: `[Portfolio] ${data.subject || "New message"} from ${data.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a78bfa;">New message from your portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 100px;">Name</td>
              <td style="padding: 8px;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Email</td>
              <td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Subject</td>
              <td style="padding: 8px;">${data.subject || "—"}</td>
            </tr>
          </table>
          <hr style="margin: 16px 0; border-color: #e5e7eb;" />
          <h3>Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Resend error:", err);
    return { success: false, error: "Failed to send email. Please try again." };
  }
}
