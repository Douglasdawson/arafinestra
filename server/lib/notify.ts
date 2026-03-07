// Email notification for new leads
// Uses environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL

export async function notifyNewLead(lead: {
  nombre?: string | null;
  email?: string | null;
  telefono?: string | null;
  localidad?: string | null;
  origen?: string | null;
}) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;

  // Skip if SMTP not configured
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) {
    console.log("[notify] SMTP not configured, skipping email notification");
    return;
  }

  try {
    // Dynamic import to avoid requiring nodemailer if not installed
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"ARA FINESTRA Web" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `Nou lead: ${lead.nombre || "Sense nom"} — ${lead.origen || "web"}`,
      html: `
        <h2>Nou lead des de la web</h2>
        <p><strong>Nom:</strong> ${lead.nombre || "-"}</p>
        <p><strong>Email:</strong> ${lead.email || "-"}</p>
        <p><strong>Telefon:</strong> ${lead.telefono || "-"}</p>
        <p><strong>Localitat:</strong> ${lead.localidad || "-"}</p>
        <p><strong>Origen:</strong> ${lead.origen || "-"}</p>
        <p style="color: #666; font-size: 12px;">Enviament automatic des de arafinestra.com</p>
      `,
    });
    console.log("[notify] Lead notification email sent");
  } catch (err) {
    console.error("[notify] Failed to send email:", err);
    // Don't throw — email failure shouldn't block lead creation
  }
}
