// Email notification for new leads
// Uses environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL

import { escapeHtml } from "./escape.js";

// Build a human-readable config summary from the calculator's presupuestoDatos jsonb.
function buildConfigResumen(datos: Record<string, unknown> | null | undefined): string | null {
  if (!datos || typeof datos !== "object") return null;
  const d = datos as Record<string, any>;
  const parts: string[] = [];
  if (d.tipo) parts.push(String(d.tipo));
  if (d.modelo) parts.push(String(d.modelo));
  if (d.ancho && d.alto) parts.push(`${d.ancho}x${d.alto}cm`);
  if (d.color) parts.push(String(d.color));
  if (d.vidrio) parts.push(String(d.vidrio));
  if (Array.isArray(d.extras) && d.extras.length) parts.push(`extras: ${d.extras.join(", ")}`);
  if (d.cantidad && Number(d.cantidad) > 1) parts.push(`x${d.cantidad}`);
  const precio = d.precioEstimado;
  if (precio && typeof precio === "object" && precio.low != null && precio.high != null) {
    parts.push(`${precio.low}€ - ${precio.high}€`);
  }
  return parts.length ? parts.join(" · ") : null;
}

export async function notifyNewLead(lead: {
  nombre?: string | null;
  email?: string | null;
  telefono?: string | null;
  localidad?: string | null;
  origen?: string | null;
  mensaje?: string | null;
  presupuestoDatos?: Record<string, unknown> | null;
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

    // Etiquetas de origen alineadas con los valores reales que envía el frontend
    const origenLabel: Record<string, string> = {
      presupuestador: "Calculadora de pressupost",
      formulario: "Formulari de contacte",
      popup: "Pop-up de sortida",
      blog_newsletter: "Newsletter del blog",
      calculator_save: "Desat de la calculadora",
      home_inline: "Formulari home",
      visita_gratuita: "Sol·licitud de visita gratuïta",
      admin: "Alta manual (admin)",
    };
    const src = origenLabel[lead.origen || ""] || lead.origen || "Web";
    const now = new Date().toLocaleString("ca-ES", { timeZone: "Europe/Madrid" });

    // Escaped values for safe interpolation into the email HTML
    const nombre = escapeHtml(lead.nombre) || "-";
    const email = escapeHtml(lead.email) || "-";
    const localidad = escapeHtml(lead.localidad) || "-";
    const mensaje = escapeHtml(lead.mensaje);
    const srcEsc = escapeHtml(src);
    // Phone: strip anything that isn't a valid dialable char before using in tel: href and text
    const telClean = (lead.telefono || "").replace(/[^\d+\s()-]/g, "");
    const telHref = encodeURIComponent(telClean);
    const telText = escapeHtml(telClean) || "-";
    const configResumen = escapeHtml(buildConfigResumen(lead.presupuestoDatos));

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
      <tr style="background:#f8f9fa"><td style="font-weight:bold;color:#0f2a4a;width:120px">Nom</td><td>${nombre}</td></tr>
      <tr><td style="font-weight:bold;color:#0f2a4a">Telefon</td><td><a href="tel:${telHref}" style="color:#e8612d;text-decoration:none">${telText}</a></td></tr>
      <tr style="background:#f8f9fa"><td style="font-weight:bold;color:#0f2a4a">Email</td><td><a href="mailto:${email}" style="color:#e8612d;text-decoration:none">${email}</a></td></tr>
      <tr><td style="font-weight:bold;color:#0f2a4a">Localitat</td><td>${localidad}</td></tr>
      <tr style="background:#f8f9fa"><td style="font-weight:bold;color:#0f2a4a">Origen</td><td>${srcEsc}</td></tr>
      ${mensaje ? `<tr><td style="font-weight:bold;color:#0f2a4a;vertical-align:top">Missatge</td><td>${mensaje}</td></tr>` : ""}
      ${configResumen ? `<tr style="background:#f8f9fa"><td style="font-weight:bold;color:#0f2a4a;vertical-align:top">Configuracio</td><td style="font-size:13px;color:#555">${configResumen}</td></tr>` : ""}
    </table>
    <div style="margin-top:24px;text-align:center">
      ${telClean ? `<a href="tel:${telHref}" style="display:inline-block;background:#25d366;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;margin-right:8px">Trucar ara</a>` : ""}
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
