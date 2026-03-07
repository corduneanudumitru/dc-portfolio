import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * POST handler for contact form submissions
 *
 * For now, this logs the message and returns success.
 * In production, you would integrate with email services like:
 * - Resend (resend.com) - recommended for Next.js
 * - SendGrid
 * - AWS SES
 * - Mailgun
 *
 * Example with Resend:
 * ```
 * import { Resend } from 'resend';
 * const resend = new Resend(process.env.RESEND_API_KEY);
 *
 * await resend.emails.send({
 *   from: 'contact@dcphotography.com',
 *   to: process.env.CONTACT_EMAIL,
 *   subject: `New contact from ${name}`,
 *   html: `<p>From: ${email}</p><p>${message}</p>`
 * });
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (data.message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Log the message (placeholder for email integration)
    console.log('New contact form submission:', {
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    /**
     * TODO: Integrate with email service
     *
     * Example with Resend:
     * const response = await resend.emails.send({
     *   from: 'noreply@dcphotography.com',
     *   to: process.env.CONTACT_EMAIL || 'hello@dcphotography.com',
     *   replyTo: data.email,
     *   subject: `New Contact: ${data.name}`,
     *   html: `
     *     <h2>New Contact Form Submission</h2>
     *     <p><strong>From:</strong> ${data.name} (${data.email})</p>
     *     <p><strong>Message:</strong></p>
     *     <p>${data.message.replace(/\n/g, '<br>')}</p>
     *   `
     * });
     *
     * if (!response.ok) {
     *   throw new Error('Failed to send email');
     * }
     */

    // Return success response
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

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
