import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, name, orderRef, amount, chaptersList } = await request.json();

    // Ensure environment variables exist
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.error("Missing SMTP credentials");
      return NextResponse.json({ error: 'SMTP config missing' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: host,
      port: 465, // usually 465 for secure, 587 for TLS
      secure: true,
      auth: {
        user: user,
        pass: pass,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #00377E; text-align: center;">Welcome to BMSCE IEEE!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your payment of <strong>₹${amount}</strong> (Order Ref: ${orderRef}) has been successfully verified.</p>
        <p>Your membership is now active. You have been enrolled in the base branch membership and the following chapters:</p>
        <ul style="background-color: #f9f9f9; padding: 15px 30px; border-radius: 5px;">
          ${chaptersList.length > 0 ? chaptersList.map((c: string) => `<li>${c}</li>`).join('') : '<li>No additional chapters</li>'}
        </ul>
        <p>We will share your official IEEE.org credentials separately once they are provisioned by the headquarters.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>BMSCE IEEE Student Branch</strong></p>
      </div>
    `;

    const mailOptions = {
      from: `"BMSCE IEEE" <${user}>`,
      to: email,
      subject: 'Membership Confirmed - BMSCE IEEE',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
