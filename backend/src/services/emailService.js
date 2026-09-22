import nodemailer from 'nodemailer';
import { BUSINESS_INFO } from '../config/constants.js';

let transporter;

// Create reusable transporter
try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  });
} catch (err) {
  console.warn('[EmailService] SMTP transporter not configured, email logs will be printed to console.');
}

/**
 * Send Order Confirmation Email
 */
export const sendOrderConfirmationEmail = async (order) => {
  const subject = `Order Confirmed: #${order.orderNumber} - ${BUSINESS_INFO.name}`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0dcd3; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <div style="background-color: #5C061D; color: #FDFBF7; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; letter-spacing: 1px; color: #D4AF37;">${BUSINESS_INFO.name}</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Multan Heritage Craftsmanship</p>
      </div>

      <div style="padding: 30px;">
        <h2 style="color: #5C061D; font-size: 20px; margin-top: 0;">Thank you for your order, ${order.customer.name}!</h2>
        <p style="color: #444; line-height: 1.6;">Your order has been received and our master artisans in Multan are preparing your handcrafted garments.</p>

        <div style="background-color: #F9F7F2; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <p style="margin: 0 0 6px 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p style="margin: 0 0 6px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p style="margin: 0 0 6px 0;"><strong>Delivery Address:</strong> ${order.customer.streetAddress}, ${order.customer.city}, ${order.customer.province}</p>
          <p style="margin: 0;"><strong>Contact Phone:</strong> ${order.customer.phone}</p>
        </div>

        <h3 style="color: #5C061D; font-size: 16px; border-bottom: 1px solid #e0dcd3; padding-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f4f0e6; text-align: left; font-size: 13px; color: #333;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px;">Size</th>
              <th style="padding: 10px;">Qty</th>
              <th style="padding: 10px; text-align: right;">Total (PKR)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid #eee; font-size: 14px;">
                <td style="padding: 10px;">${item.title}</td>
                <td style="padding: 10px;">${item.size}</td>
                <td style="padding: 10px;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right;">Rs. ${item.total.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">Rs. ${order.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 6px 10px; text-align: right;">Shipping:</td>
              <td style="padding: 6px 10px; text-align: right;">${order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}</td>
            </tr>
            ${order.discount > 0 ? `
              <tr>
                <td colspan="3" style="padding: 6px 10px; text-align: right; color: #0B4636;">Discount:</td>
                <td style="padding: 6px 10px; text-align: right; color: #0B4636;">- Rs. ${order.discount.toLocaleString()}</td>
              </tr>
            ` : ''}
            <tr style="font-size: 16px; font-weight: bold; background: #FAF7F0;">
              <td colspan="3" style="padding: 12px 10px; text-align: right; color: #5C061D;">Total:</td>
              <td style="padding: 12px 10px; text-align: right; color: #5C061D;">Rs. ${order.totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://wa.me/${BUSINESS_INFO.phone}?text=Hello%20Hand%20Embroidered%20Dresses%20team,%20I%20have%20an%20inquiry%20regarding%20my%20order%20${order.orderNumber}"
             style="background-color: #0B4636; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
             Chat on WhatsApp: ${BUSINESS_INFO.phone}
          </a>
        </div>
      </div>

      <div style="background-color: #F3EDE2; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0 0 5px 0;"><strong>${BUSINESS_INFO.name}</strong></p>
        <p style="margin: 0 0 5px 0;">${BUSINESS_INFO.address}</p>
        <p style="margin: 0;">Phone: ${BUSINESS_INFO.phone} | Email: ${BUSINESS_INFO.email}</p>
      </div>
    </div>
  `;

  if (!process.env.SMTP_USER) {
    console.log(`[Email Preview to ${order.customer.email}]:\nSubject: ${subject}\nOrder Total: Rs. ${order.totalAmount}`);
    return;
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM || `"${BUSINESS_INFO.name}" <${BUSINESS_INFO.email}>`,
    to: order.customer.email,
    subject,
    html
  });
};

/**
 * Send Status Update Notification
 */
export const sendOrderStatusEmail = async (order) => {
  const subject = `Order #${order.orderNumber} Status Update: ${order.orderStatus}`;
  const trackingMsg = order.trackingNumber ? `<p><strong>Courier:</strong> ${order.courierName}<br/><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : '';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 25px; border-radius: 8px;">
      <h2 style="color: #5C061D;">${BUSINESS_INFO.name}</h2>
      <p>Dear ${order.customer.name},</p>
      <p>The status of your order <strong>#${order.orderNumber}</strong> has been updated to: <span style="font-size: 16px; color: #0B4636; font-weight: bold;">${order.orderStatus}</span>.</p>
      ${trackingMsg}
      <p>If you have any questions or require modifications, please contact our Multan boutique team directly on WhatsApp at <strong>${BUSINESS_INFO.phone}</strong>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">${BUSINESS_INFO.address}</p>
    </div>
  `;

  if (!process.env.SMTP_USER) {
    console.log(`[Status Email Preview to ${order.customer.email}]: Order #${order.orderNumber} -> ${order.orderStatus}`);
    return;
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM || `"${BUSINESS_INFO.name}" <${BUSINESS_INFO.email}>`,
    to: order.customer.email,
    subject,
    html
  });
};
