import { sendResultsEmail } from "@/utils/emailService";

export default async function handler(req, res) {
  const email = process.env.EMAIL_RECEIVER;

  console.log("email", email);
  console.log("req", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { results, testDuration } = req.body;

    if (!results || !testDuration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await sendResultsEmail(email, results, testDuration);

    if (result.success) {
      return res.status(200).json({ message: "Email sent successfully" });
    } else {
      return res.status(500).json({ message: "Failed to send email", error: result.error });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
