import { sendResultsEmail } from "@/utils/emailService";

export default async function handler(req, res) {
  const adminEmail = process.env.EMAIL_RECEIVER;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { results, testDuration, email } = req.body;

    if (!results || !testDuration || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Send to admin
    const adminResult = await sendResultsEmail(adminEmail, results, testDuration, email);
    
    // Also send to the user
    const userResult = await sendResultsEmail(email, results, testDuration, email);

    if (adminResult.success && userResult.success) {
      return res.status(200).json({ message: "Emails sent successfully" });
    } else {
      return res.status(500).json({ 
        message: "Failed to send one or more emails", 
        adminError: adminResult.error, 
        userError: userResult.error 
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
