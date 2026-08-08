type ResendMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string | null;
  tags?: Array<{ name: string; value: string }>;
};

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Lets Go Tour And Travels <onboarding@resend.dev>";

export async function sendResendEmail(message: ResendMessage) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
  const replyTo = message.replyTo ?? process.env.RESEND_REPLY_TO?.trim() || undefined;

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: replyTo,
      tags: message.tags,
    }),
  });

  if (!response.ok) {
    const detail = await safeReadResponse(response);
    throw new Error(detail || `Resend request failed with status ${response.status}`);
  }

  return response.json();
}

export async function trySendResendEmail(message: ResendMessage) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { skipped: true } as const;
  }

  return sendResendEmail(message);
}

export function getAppBaseUrl() {
  return process.env.APP_BASE_URL?.trim() || process.env.PUBLIC_APP_URL?.trim() || "";
}

async function safeReadResponse(response: Response) {
  try {
    const data = await response.json();
    if (typeof data?.message === "string") {
      return data.message;
    }

    return JSON.stringify(data);
  } catch {
    try {
      return await response.text();
    } catch {
      return null;
    }
  }
}
