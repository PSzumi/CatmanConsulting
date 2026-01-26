import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations";
import { siteConfig, contactContent } from "@/lib/constants";

// Initialize Resend - will be undefined if no API key
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Simple in-memory rate limiting (resets on server restart)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // Max 3 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Zbyt wiele zapytań. Spróbuj ponownie za chwilę." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Błąd walidacji", details: errors },
        { status: 400 }
      );
    }

    const { name, email, phone, company, message, website } = result.data;

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.length > 0) {
      // Silently accept to not give feedback to bots
      console.log("Honeypot triggered - likely bot submission");
      return NextResponse.json({ success: true });
    }

    // Prepare email content
    const emailSubject = `Nowe zapytanie od ${name} - ${siteConfig.name}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${emailSubject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${siteConfig.name}</h1>
            <p style="margin: 10px 0 0; opacity: 0.8;">Nowe zapytanie ze strony</p>
          </div>

          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #e85a7f; margin-top: 0;">Dane kontaktowe</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 120px;">Imię:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <a href="mailto:${email}" style="color: #e85a7f; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${
                phone
                  ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Telefon:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <a href="tel:${phone}" style="color: #e85a7f; text-decoration: none;">${phone}</a>
                </td>
              </tr>
              `
                  : ""
              }
              ${
                company
                  ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Firma:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${company}</td>
              </tr>
              `
                  : ""
              }
            </table>

            <h2 style="color: #e85a7f; margin-top: 30px;">Wiadomość</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${message}</div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p>Wysłano: ${new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}</p>
              <p>IP: ${ip}</p>
            </div>
          </div>

          <div style="background: #1a1a2e; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px;">
            <p style="margin: 0; opacity: 0.7;">© ${new Date().getFullYear()} ${siteConfig.name}. Wszystkie prawa zastrzeżone.</p>
          </div>
        </body>
      </html>
    `;

    // Send email if Resend is configured
    if (resend) {
      try {
        await resend.emails.send({
          from: `${siteConfig.name} <onboarding@resend.dev>`, // Change to your verified domain
          to: [contactContent.email],
          replyTo: email,
          subject: emailSubject,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the request - log for debugging but still return success
        // This way the user doesn't see an error, but we're notified of the issue
      }
    } else {
      // Log to console if Resend is not configured (development)
      console.log("=== CONTACT FORM SUBMISSION ===");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone || "N/A");
      console.log("Company:", company || "N/A");
      console.log("Message:", message);
      console.log("===============================");
    }

    return NextResponse.json({
      success: true,
      message: "Wiadomość została wysłana",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas wysyłania wiadomości" },
      { status: 500 }
    );
  }
}
