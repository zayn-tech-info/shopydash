const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : {
      emails: {
        send: async () => {
          console.warn("RESEND_API_KEY is missing. Email not sent.");
          return { error: { message: "RESEND_API_KEY is missing" } };
        },
      },
    };

const generateEmailLayout = (title, content) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; width: 100%; padding: 40px 0;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      
      <div style="background-color: #F7561B; padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">ShopyDash</h1>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #1a1a1a; margin-top: 0; margin-bottom: 20px; font-size: 22px; text-align: center;">${title}</h2>
        
        ${content}
      </div>
      
      <div style="background-color: #f8f8f8; padding: 15px; text-align: center;">
        <p style="margin: 0; color: #999999; font-size: 12px;">&copy; ${new Date().getFullYear()} ShopyDash. All rights reserved.</p>
      </div>
    </div>
  </div>
`;

const sendVerificationEmail = async (email, code) => {
  try {
    const content = `
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
    `;

    const data = await resend.emails.send({
      from: "Shopydash <noreply@shopydash.com>",
      to: [email],
      subject: "Verify your email address",
      html: generateEmailLayout("Verify Your Email Address", content),
    });

    if (data.error) throw new Error(data.error.message);
    return data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

const sendOrderNotificationEmail = async (email, vendorName, orderDetails) => {
  try {
    const { buyerName, items, orderId, totalAmount } = orderDetails;
    const itemsHtml = items
      .map(
        (item) => `
      <li style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <strong>${item.title}</strong> x${item.quantity}<br/>
        <span style="color: #666;">₦${item.price.toLocaleString()} each</span>
      </li>
    `
      )
      .join("");

    const dashboardLink = `https:

    const content = `
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Hello ${vendorName},
      </p>
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        You have received a new order from <strong>${buyerName}</strong>!
      </p>
      
      <div style="background-color: #fafafa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #333; font-size: 18px; border-bottom: 2px solid #F7561B; padding-bottom: 10px; display: inline-block;">Order Summary</h3>
        <ul style="list-style: none; padding: 0; margin: 15px 0 0 0; color: #444;">
          ${itemsHtml}
        </ul>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-weight: bold; font-size: 18px; color: #333;">
          Total Earnings: <span style="color: #F7561B;">₦${totalAmount.toLocaleString()}</span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${dashboardLink}" style="background-color: #F7561B; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(247, 86, 27, 0.2);">Go to Vendor Dashboard</a>
      </div>
    `;

    const data = await resend.emails.send({
      from: "Shopydash <noreply@shopydash.com>",
      to: [email],
      subject: "New Order Received on Shopydash",
      html: generateEmailLayout("New Order Received! 🚀", content),
    });

    if (data.error) throw new Error(data.error.message);
    return data;
  } catch (error) {
    console.error("Error sending order notification email:", error);
    
  }
};

module.exports = { sendVerificationEmail, sendOrderNotificationEmail };
