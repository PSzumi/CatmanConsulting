import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { siteConfig, contactContent } from "@/lib/constants";

// Path labels for display
const pathLabels: Record<string, string> = {
  diagnoza: "Diagnoza sytuacji",
  rozwoj: "Rozwój liderów",
  wdrozenie: "Wsparcie we wdrożeniu",
  rozmowa: "Chce porozmawiać",
};

// Contact method labels
const methodLabels: Record<string, string> = {
  call: "Rozmowa wideo",
  email: "Email",
  calendar: "Calendly",
};

// Grade config for email styling
const gradeConfig: Record<string, { emoji: string; label: string; color: string }> = {
  hot: { emoji: "🔥", label: "GORĄCY LEAD", color: "#ef4444" },
  warm: { emoji: "🌡️", label: "CIEPŁY", color: "#f59e0b" },
  cold: { emoji: "❄️", label: "ZIMNY", color: "#3b82f6" },
  new: { emoji: "🆕", label: "NOWY", color: "#6b7280" },
};

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

    const { name, email, phone, company, role, message, website, path, contactMethod, hasVideo, leadScore } = result.data;

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.length > 0) {
      // Silently accept to not give feedback to bots
      console.log("Honeypot triggered - likely bot submission");
      return NextResponse.json({ success: true });
    }

    // Get lead score info
    const grade = leadScore?.grade ? gradeConfig[leadScore.grade] : gradeConfig.new;
    const score = leadScore?.score ?? 0;
    const isHotLead = leadScore?.grade === "hot";

    // Format time on site
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${String(secs).padStart(2, "0")}`;
    };

    // Build engagement signals list
    const signals: string[] = [];
    if (leadScore?.quizCompleted) signals.push(`✅ Ukończył quiz diagnostyczny${leadScore.quizScore ? ` (wynik: ${leadScore.quizScore})` : ""}`);
    if (leadScore?.calculatorUsed) signals.push(`✅ Użył kalkulatora ROI${leadScore.calculatorSavings ? ` (potencjał: ${leadScore.calculatorSavings.toLocaleString("pl-PL")} PLN)` : ""}`);
    if (leadScore?.calendlyClicked) signals.push("✅ Kliknął Calendly");
    if (leadScore?.videoRecorded || hasVideo) signals.push("✅ Nagrał wideo");
    if (leadScore?.returnVisit) signals.push(`✅ Powracający użytkownik (${leadScore.visitCount || 1} wizyty)`);
    if (leadScore?.easterEggFound) signals.push("✅ Znalazł Easter Egg (ciekawski!)");

    // Prepare email content
    const emailSubject = isHotLead
      ? `🔥 GORĄCY LEAD: ${name} - ${siteConfig.name}`
      : `Nowe zapytanie od ${name} - ${siteConfig.name}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${emailSubject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f3f4f6;">

          ${isHotLead ? `
          <!-- Hot Lead Banner -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 15px 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <span style="font-size: 24px;">🔥</span>
            <span style="font-size: 18px; font-weight: bold; margin-left: 10px;">GORĄCY LEAD - PRIORYTET!</span>
          </div>
          ` : ""}

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 25px; ${isHotLead ? "" : "border-radius: 10px 10px 0 0;"}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h1 style="margin: 0; font-size: 22px; color: #b8860b;">${siteConfig.name}</h1>
                <p style="margin: 8px 0 0; opacity: 0.7; font-size: 14px;">Nowe zapytanie ze strony</p>
              </div>
              <div style="text-align: right;">
                <div style="background: ${grade.color}20; color: ${grade.color}; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px;">
                  ${grade.emoji} Score: ${score}/100
                </div>
              </div>
            </div>
          </div>

          <!-- Lead Score Section -->
          ${leadScore ? `
          <div style="background: #1f2937; padding: 20px; border-left: 4px solid ${grade.color};">
            <h3 style="margin: 0 0 15px; color: white; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              📊 Lead Analytics
            </h3>
            <table style="width: 100%; color: #9ca3af; font-size: 13px;">
              <tr>
                <td style="padding: 5px 0;">Czas na stronie:</td>
                <td style="padding: 5px 0; text-align: right; color: white; font-weight: 500;">${formatTime(leadScore.totalTimeOnSite || 0)}</td>
                <td style="padding: 5px 0; padding-left: 20px;">Odsłony:</td>
                <td style="padding: 5px 0; text-align: right; color: white; font-weight: 500;">${leadScore.pageViews || 1}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Scroll:</td>
                <td style="padding: 5px 0; text-align: right; color: white; font-weight: 500;">${leadScore.scrollDepth || 0}%</td>
                <td style="padding: 5px 0; padding-left: 20px;">Wizyty:</td>
                <td style="padding: 5px 0; text-align: right; color: white; font-weight: 500;">${leadScore.visitCount || 1}</td>
              </tr>
            </table>
            ${signals.length > 0 ? `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #374151;">
              <p style="margin: 0 0 10px; color: #b8860b; font-size: 12px; font-weight: bold;">SYGNAŁY ZAANGAŻOWANIA:</p>
              ${signals.map(s => `<p style="margin: 5px 0; color: #d1d5db; font-size: 13px;">${s}</p>`).join("")}
            </div>
            ` : ""}
          </div>
          ` : ""}

          <!-- Contact Details -->
          <div style="background: white; padding: 25px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #b8860b; margin: 0 0 20px; font-size: 16px;">👤 Dane kontaktowe</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; width: 120px; font-size: 14px;">Imię:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Email:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px;">
                  <a href="mailto:${email}" style="color: #b8860b; text-decoration: none; font-weight: 500;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Telefon:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px;">
                  <a href="tel:${phone}" style="color: #b8860b; text-decoration: none; font-weight: 500;">${phone}</a>
                </td>
              </tr>
              ` : ""}
              ${company ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Firma:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; font-weight: 500;">${company}</td>
              </tr>
              ` : ""}
              ${role ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Stanowisko:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px;">${role}</td>
              </tr>
              ` : ""}
              ${path ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Temat:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px;">
                  <span style="background: #b8860b20; color: #b8860b; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                    ${pathLabels[path] || path}
                  </span>
                </td>
              </tr>
              ` : ""}
              ${contactMethod ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Kontakt:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px;">${methodLabels[contactMethod] || contactMethod}</td>
              </tr>
              ` : ""}
            </table>

            ${message ? `
            <h2 style="color: #b8860b; margin: 25px 0 15px; font-size: 16px;">💬 Wiadomość</h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</div>
            ` : ""}

            ${hasVideo ? `
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border: 1px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                🎥 <strong>Ta osoba nagrała wiadomość wideo</strong> - sprawdź załączniki lub skontaktuj się, aby otrzymać nagranie.
              </p>
            </div>
            ` : ""}

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
              <p style="margin: 5px 0;">Wysłano: ${new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}</p>
              <p style="margin: 5px 0;">IP: ${ip}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1a1a1a; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px;">
            <p style="margin: 0; opacity: 0.7;">© ${new Date().getFullYear()} ${siteConfig.name}. Lead scoring powered by Catman Analytics.</p>
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
      console.log("\n========================================");
      console.log("📧 CONTACT FORM SUBMISSION");
      console.log("========================================");
      if (isHotLead) {
        console.log("🔥🔥🔥 HOT LEAD - PRIORYTET! 🔥🔥🔥");
      }
      console.log(`📊 Lead Score: ${score}/100 (${grade.label})`);
      console.log("----------------------------------------");
      console.log("👤 Dane kontaktowe:");
      console.log(`   Imię: ${name}`);
      console.log(`   Email: ${email}`);
      console.log(`   Telefon: ${phone || "N/A"}`);
      console.log(`   Firma: ${company || "N/A"}`);
      console.log(`   Rola: ${role || "N/A"}`);
      console.log(`   Temat: ${path ? pathLabels[path] || path : "N/A"}`);
      console.log(`   Kontakt: ${contactMethod ? methodLabels[contactMethod] || contactMethod : "N/A"}`);
      if (message) {
        console.log("----------------------------------------");
        console.log("💬 Wiadomość:", message);
      }
      if (signals.length > 0) {
        console.log("----------------------------------------");
        console.log("📈 Sygnały zaangażowania:");
        signals.forEach(s => console.log(`   ${s}`));
      }
      console.log("========================================\n");
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
