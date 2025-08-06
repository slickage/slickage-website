import { NextResponse } from 'next/server';

const rateLimitMap = new Map();
const RATE_LIMIT = 5; // max submissions
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function getClientIp(req: Request) {
  const ip = req.headers.get('x-forwarded-for');
  if (ip && ip.split(',')[0]) {
    return ip.split(',')[0].trim();
  }
  return 'unknown';
}

function stripTags(input: string = '') {
  return input.replace(/<[^>]*>?/gm, '');
}

function escapeHtml(input: string = '') {
  return input.replace(
    /[&<>'"]/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[c] || c,
  );
}

async function sendContactEmail({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  // TODO: Integrate with email service
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('Stub email send:', { name, email, phone, subject, message });
}

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, phone, subject, message, website, elapsed } = data;

  if (website && website.trim() !== '') {
    return NextResponse.json({ error: 'Spam detected.' }, { status: 400 });
  }

  if (typeof elapsed !== 'number' || elapsed < 2000) {
    return NextResponse.json({ error: 'Form submitted too quickly.' }, { status: 400 });
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, first: now };
  if (now - entry.first > RATE_LIMIT_WINDOW) {
    entry.count = 0;
    entry.first = now;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  if (entry.count > RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 },
    );
  }

  const cleanName = stripTags(typeof name === 'string' ? name : '');
  const cleanEmail = stripTags(typeof email === 'string' ? email : '');
  const cleanPhone = stripTags(typeof phone === 'string' ? phone : '');
  const cleanSubject = stripTags(typeof subject === 'string' ? subject : '');
  const cleanMessage = stripTags(typeof message === 'string' ? message : '');

  const linkCount = (cleanMessage.match(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi) || [])
    .length;
  if (linkCount > 2) {
    return NextResponse.json({ error: 'Too many links in message.' }, { status: 400 });
  }

  const safeName = escapeHtml(cleanName);
  const safeEmail = escapeHtml(cleanEmail);
  const safePhone = escapeHtml(cleanPhone);
  const safeSubject = escapeHtml(cleanSubject);
  const safeMessage = escapeHtml(cleanMessage);

  await sendContactEmail({
    name: safeName,
    email: safeEmail,
    phone: safePhone,
    subject: safeSubject,
    message: safeMessage,
  });

  return NextResponse.json({ message: `Thank you, ${safeName}, for your message!` });
}
