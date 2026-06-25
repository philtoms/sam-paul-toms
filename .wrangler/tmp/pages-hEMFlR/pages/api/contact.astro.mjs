globalThis.process ??= {}; globalThis.process.env ??= {};
import { Resend } from 'resend';
import { aj as objectType, az as stringType } from '../../chunks/astro/server_k4Nw9Nby.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BVV-WUqq.mjs';

const contactSchema = objectType({
  name: stringType().min(1, "Name is required.").max(200, "Name must be 200 characters or fewer."),
  email: stringType().min(1, "Email is required.").email("Please enter a valid email address.").max(200, "Email must be 200 characters or fewer."),
  message: stringType().min(1, "Message is required.").max(5e3, "Message must be 5,000 characters or fewer."),
  fax: stringType().optional(),
  turnstileToken: stringType().optional()
});
const POST = async ({
  request
}) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({
      ok: false,
      error: "Invalid request body."
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  if (typeof body === "object" && body !== null && "fax" in body && typeof body.fax === "string" && body.fax.trim() !== "") {
    return new Response(JSON.stringify({
      ok: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Validation failed.";
    return new Response(JSON.stringify({
      ok: false,
      error: firstError
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const {
    name,
    email,
    message
  } = result.data;
  const resend = new Resend("re_R5qcgnHJ_E6SZVcSpVqyFT8tLL8FKSdQw");
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "sampaultomsmusic@gmail.com",
      subject: `Contact form: ${name}`,
      text: `Name: ${name}
Email: ${email}

Message:
${message}`,
      replyTo: email
    });
  } catch {
    return new Response(JSON.stringify({
      ok: false,
      error: "Failed to send message. Please try again later."
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const artistName = undefined                                   || "Sam";
    let siteHost = "sampaultoms.com";
    try {
      siteHost = new URL("https://sampaultoms.com").hostname;
    } catch {
    }
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Thank you for your message",
      text: `Hi ${name},

Thank you for getting in touch via the contact form on ${siteHost}. I've received your message and will get back to you as soon as possible.

Best,
${artistName}`,
      replyTo: "sampaultomsmusic@gmail.com"
    });
  } catch {
    console.error("Failed to send auto-reply email:", {
      name,
      email
    });
  }
  return new Response(JSON.stringify({
    ok: true
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
