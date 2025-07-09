import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Stray2Stay</h1>
            <p style="margin: 5px 0 0 0;">Helping strays find homes</p>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              ${text.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="background-color: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Stray2Stay. Making communities safer, one rescue at a time.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};