import nodemailer from 'nodemailer';
import { traitMapping, traitDescriptions } from "@/constant/question";

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

// Helper function to get trait interpretation
const getInterpretation = (traitName, score) => {
  const { min, max } = traitMapping[traitName];
  const range = max - min;
  const lowThreshold = min + range / 3;
  const highThreshold = min + (2 * range) / 3;

  if (score < lowThreshold) return traitDescriptions[traitName].Low;
  if (score <= highThreshold) return traitDescriptions[traitName].Moderate;
  return traitDescriptions[traitName].High;
};

export const sendResultsEmail = async (to, results, testDuration, userEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Big Five Personality Test Results',
      html: `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h2 { color: #2d3748; font-size: 24px; text-align: center; margin-bottom: 20px; }
            .user-info { margin-bottom: 30px; background: #f7fafc; padding: 15px; border-radius: 5px; }
            .result-card { padding: 20px; margin-bottom: 15px; border-radius: 8px; background: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .trait-title { font-size: 18px; font-weight: 600; color: #4a5568; margin-bottom: 8px; }
            .trait-description { font-size: 14px; color: #718096; margin-bottom: 12px; font-style: italic; }
            .score { font-size: 16px; color: #2563eb; font-weight: 700; margin-bottom: 12px; }
            .progress-container { height: 12px; background-color: #e2e8f0; border-radius: 6px; margin-bottom: 12px; overflow: hidden; }
            .progress-bar { height: 100%; background-color: #3b82f6; }
            .interpretation { font-size: 14px; color: #718096; }
            .footer { margin-top: 30px; text-align: center; font-size: 14px; color: #a0aec0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Big Five Personality Test Results</h2>
            
            <div class="user-info">
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Test Duration:</strong> ${testDuration}</p>
            </div>
            
            ${Object.entries(results)
              .map(([trait, score]) => {
                const { max } = traitMapping[trait];
                const percentage = ((score - traitMapping[trait].min) / (max - traitMapping[trait].min)) * 100;
                return `
                  <div class="result-card">
                    <div class="trait-title">${trait}</div>
                    <div class="trait-description">${traitDescriptions[trait].Description}</div>
                    <div class="score">Score: ${score} / ${max}</div>
                    <div class="progress-container">
                      <div class="progress-bar" style="width: ${Math.max(0, Math.min(100, percentage))}%;"></div>
                    </div>
                    <div class="interpretation">${getInterpretation(trait, score)}</div>
                  </div>
                `;
              })
              .join('')}
              
            <div class="footer">
              <p>Thank you for taking the Big Five Personality Test!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};