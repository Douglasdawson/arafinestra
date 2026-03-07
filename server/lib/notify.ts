// Email notification for new leads
// Uses environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL

export async function notifyNewLead(lead: {
  nombre?: string | null;
  email?: string | null;
  telefono?: string | null;
  localidad?: string | null;
  origen?: string | null;
  mensaje?: string | null;
  configuracion?: string | null;
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

    const origenLabel: Record<string, string> = {
      calculadora: "Calculadora de pressupost",
      contacte: "Formulari de contacte",
      whatsapp: "WhatsApp",
      exit_popup: "Pop-up de sortida",
      newsletter: "Newsletter",
    };
    const src = origenLabel[lead.origen || ""] || lead.origen || "Web";
    const now = new Date().toLocaleString("ca-ES", { timeZone: "Europe/Madrid" });

    await transporter.sendMail({
      from: `"ARA FINESTRA Web" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `Nou lead: ${lead.nombre || "Sense nom"} — ${src}`,
      html: `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px 0">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
  <tr><td style="background:#0f2a4a;padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:22px">Nou lead des de la web</h1>
    <p style="color:#8ba4c0;margin:6px 0 0;font-size:14px">${now}</p>
  </td></tr>
  <tr><td style="padding:24px 32px">
    <table width="100%" cellpadding="8" cellspacing="0" style="font-size:15px">
      <tr style="background:#f8f9fa"><td style="font-weight:bold;color:#0f2a4a;width:120px">Nom</td><td>${lead.nombre || "-"}</td></tr>
      <tr><td style="font-weight:bold;color:#0f2a4a">Telefon</td><td><a href="tel:${lead.telefono || ""}" style="color:#e8612d;text-decoration:none">${lead.telefono || "-"}</a></td></tr>
      <tr style="background:#f8f9fa"><td style="font-weight:bold;color:#0f2a4a">Email</td><td><a href="mailto:${lead.email || ""}" style="color:#e8612d;text-decoration:none">${lead.email || "-"}</a></td></tr>
      <tr><td style="font-weight:bold;color:#0f2a4a">Localitat</td><td>${lead.localidad || "-"}</td></tr>
      <tr style="background:#f8f9fa"><td style="font-weight:bold;color:#0f2a4a">Origen</td><td>${src}</td></tr>
      ${lead.mensaje ? `<tr><td style="font-weight:bold;color:#0f2a4a;vertical-align:top">Missatge</td><td>${lead.mensaje}</td></tr>` : ""}
      ${lead.configuracion ? `<tr style="background:#f8f9fa"><td style="font-weight:bold;color:#0f2a4a;vertical-align:top">Configuracio</td><td style="font-size:13px;color:#555">${lead.configuracion}</td></tr>` : ""}
    </table>
    <div style="margin-top:24px;text-align:center">
      ${lead.telefono ? `<a href="tel:${lead.telefono}" style="display:inline-block;background:#25d366;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;margin-right:8px">Trucar ara</a>` : ""}
      <a href="https://arafinestra.com/admin" style="display:inline-block;background:#0f2a4a;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px">Veure al CRM</a>
    </div>
  </td></tr>
  <tr><td style="background:#f8f9fa;padding:16px 32px;text-align:center;font-size:12px;color:#999">
    Enviament automatic des de arafinestra.com
  </td></tr>
</table>
</td></tr></table>
</body></html>`,
    });
    console.log("[notify] Lead notification email sent");
  } catch (err) {
    console.error("[notify] Failed to send email:", err);
    // Don't throw — email failure shouldn't block lead creation
  }
}
