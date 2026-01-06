const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, code) => {
  try {
    const data = await resend.emails.send({
      from: "Shopydash <noreply@shopydash.com>",
      to: [email],
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your email address</h2>
          <p>Thanks for signing up for ShopyDash! Please use the following code to verify your email address:</p>
          <h1 style="background-color: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't sign up for Shopydash, you can safely ignore this email.</p>
        </div>
      `,
    });
    if (data.error) {
      console.error("Resend API Error:", data.error);
      throw new Error(data.error.message || "Failed to send email via Resend");
    }
    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
