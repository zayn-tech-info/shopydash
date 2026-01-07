const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, code) => {
  try {
    const data = await resend.emails.send({
      from: "Shopydash <noreply@shopydash.com>",
      to: [email],
      subject: "Verify your email address",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; width: 100%; padding: 40px 0;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <div style="background-color: #F7561B; padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">ShopyDash</h1>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin-top: 0; margin-bottom: 20px; font-size: 22px; text-align: center;">Verify Your Email Address</h2>
              
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
                Thanks for joining ShopyDash! To complete your sign-up, please verify your email address using the code below.
              </p>
              
              <div style="margin: 0 auto; width: fit-content; text-align: center; background-color: #FFF0EB; padding: 15px 35px; border-radius: 8px; border: 1px dashed #F7561B;">
                <span style="font-size: 32px; font-weight: bold; color: #F7561B; letter-spacing: 6px; display: block;">${code}</span>
              </div>
              
              <p style="color: #666666; font-size: 14px; margin-top: 30px; text-align: center;">
                This code will expire in 10 minutes.
              </p>
              
              <p style="color: #888888; font-size: 13px; margin-top: 20px; text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px;">
                If you didn't create an account with ShopyDash, you can safely ignore this email.
              </p>
            </div>
            
            <div style="background-color: #f8f8f8; padding: 15px; text-align: center;">
              <p style="margin: 0; color: #999999; font-size: 12px;">&copy; ${new Date().getFullYear()} ShopyDash. All rights reserved.</p>
            </div>
          </div>
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
