import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use App Password from Google Account
  },
});

export const sendResultsEmail = async (to, results, testDuration) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your Big Five Personality Test Results',
      html: `
        <h2>Your Personality Test Results</h2>
        <p>Test Duration: ${testDuration}</p>
        <div>
          ${Object.entries(results)
            .map(
              ([trait, score]) => `
            <div style="margin-bottom: 15px;">
              <h3 style="color: #2563eb;">${trait}</h3>
              <p>Score: ${score}</p>
            </div>
          `
            )
            .join('')}
        </div>
        <p>Thank you for taking the Big Five Personality Test!</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}; 