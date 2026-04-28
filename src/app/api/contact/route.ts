import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
}

const subjectLabels: Record<string, string> = {
  collaboration: 'Collaboration',
  'print-purchase': 'Print Purchase',
  commission: 'Commission',
  'press-media': 'Press / Media',
  other: 'Other',
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function validateContactForm(data: ContactFormData) {
  if (!data.name || !data.email || !data.subject || !data.message) {
    return { error: 'Missing required fields', status: 400 };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { error: 'Invalid email format', status: 400 };
  }

  if (data.message.trim().length < 10) {
    return { error: 'Message must be at least 10 characters', status: 400 };
  }

  if (!subjectLabels[data.subject]) {
    return { error: 'Invalid subject', status: 400 };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    if (data.company) {
      return NextResponse.json(
        { message: 'Message received successfully' },
        { status: 200 }
      );
    }

    const validationError = validateContactForm(data);
    if (validationError) {
      return NextResponse.json(
        { error: validationError.error },
        { status: validationError.status }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !toEmail || !fromEmail) {
      console.error('Contact form is missing Resend configuration');
      return NextResponse.json(
        { error: 'Contact form is not configured' },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const subjectLabel = subjectLabels[data.subject];
    const safeName = escapeHtml(data.name.trim());
    const safeEmail = escapeHtml(data.email.trim());
    const safeSubject = escapeHtml(subjectLabel);
    const safeMessage = escapeHtml(data.message.trim()).replace(/\n/g, '<br />');

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `Website contact: ${subjectLabel} - ${data.name}`,
      html: `
        <h2>New website contact</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
      text: [
        'New website contact',
        '',
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Subject: ${subjectLabel}`,
        '',
        data.message,
      ].join('\n'),
    });

    if (error) {
      console.error('Resend failed to send contact form email:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { message: 'Message received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

