export const generateWhatsAppMessage = (vendor, items, total, authUser) => {
  const userName = authUser?.fullName || authUser?.username || "A Customer";
  const userPhone = authUser?.phoneNumber || "";
  const userLocation = authUser?.schoolName || "Not specified";
  const userSchool = authUser?.schoolName || "";

  let message = `*New Order from ${userName}*\n\n`;
  message += `I would like to purchase:\n\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.title}*\n`;
    message += `   Qty: ${item.quantity}\n`;
    message += `   Price: ₦${(
      item.price * item.quantity
    ).toLocaleString()}\n\n\n`;
  });

  message += `*Total Amount: ₦${total.toLocaleString()}*\n\n`;

  message += `*Delivery Details:*\n\n`;
  message += `Name: ${userName}\n\n`;
  message += `Location: ${userLocation}\n\n`;
  message += `School: ${userSchool}\n\n`;
  message += `Phone: ${userPhone}\n\n`;

  return message;
};

export const openWhatsApp = (vendor, items, total, authUser) => {
  if (!vendor?.whatsAppNumber) {
    alert("This vendor does not have a WhatsApp number connected.");
    return;
  }

  const message = generateWhatsAppMessage(vendor, items, total, authUser);

  // Basic phone number cleaning (remove spacing, ensure it works with wa.me)
  const cleanPhone = vendor.whatsAppNumber.replace(/[^\d+]/g, "");
  const encodedMessage = encodeURIComponent(message);

  window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
};
