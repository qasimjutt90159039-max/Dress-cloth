import { BUSINESS_INFO } from '../config/constants.js';

export const generateInvoiceHtml = (order) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${order.orderNumber} - ${BUSINESS_INFO.name}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      margin: 0;
      padding: 30px;
      background: #fff;
    }
    .invoice-container {
      max-width: 800px;
      margin: auto;
      border: 1px solid #ddd;
      padding: 35px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 3px solid #5C061D;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .store-title {
      color: #5C061D;
      font-size: 26px;
      font-weight: bold;
      margin: 0 0 5px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .store-sub {
      color: #C5A059;
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 10px 0;
    }
    .store-details {
      font-size: 12px;
      color: #555;
      line-height: 1.5;
      max-width: 340px;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta h2 {
      margin: 0 0 8px 0;
      color: #5C061D;
      font-size: 22px;
    }
    .meta-line {
      font-size: 13px;
      margin: 4px 0;
      color: #444;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      background: #fdfbf7;
      padding: 15px;
      border-radius: 4px;
      border: 1px solid #f0eae1;
    }
    .col {
      width: 48%;
      font-size: 13px;
      line-height: 1.5;
    }
    .col strong {
      display: block;
      color: #5C061D;
      margin-bottom: 5px;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    th {
      background: #5C061D;
      color: #fff;
      text-align: left;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 600;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      font-size: 13px;
    }
    .text-right {
      text-align: right;
    }
    .summary-table {
      width: 320px;
      margin-left: auto;
      border-collapse: collapse;
    }
    .summary-table td {
      padding: 6px 12px;
      border: none;
    }
    .grand-total {
      font-size: 16px;
      font-weight: bold;
      color: #5C061D;
      border-top: 2px solid #5C061D !important;
      background: #fdfbf7;
    }
    .footer-note {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #ccc;
      font-size: 12px;
      color: #777;
    }
    @media print {
      body { padding: 0; }
      .invoice-container { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right; max-width: 800px; margin: 0 auto 15px auto;">
    <button onclick="window.print()" style="background: #5C061D; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 4px; cursor: pointer;">
      🖨️ Print Packing Slip / Invoice
    </button>
  </div>

  <div class="invoice-container">
    <div class="header">
      <div>
        <div class="store-title">${BUSINESS_INFO.name}</div>
        <div class="store-sub">Authentic Multan Hand Embroidery</div>
        <div class="store-details">
          ${BUSINESS_INFO.address}<br>
          WhatsApp / Phone: ${BUSINESS_INFO.phone}<br>
          Email: ${BUSINESS_INFO.email}
        </div>
      </div>
      <div class="invoice-meta">
        <h2>INVOICE</h2>
        <div class="meta-line"><strong>Invoice #:</strong> ${order.orderNumber}</div>
        <div class="meta-line"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        <div class="meta-line"><strong>Status:</strong> ${order.orderStatus}</div>
        <div class="meta-line"><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</div>
      </div>
    </div>

    <div class="details-row">
      <div class="col">
        <strong>DELIVERY ADDRESS:</strong>
        ${order.customer.name}<br>
        ${order.customer.streetAddress}${order.customer.apartment ? ', ' + order.customer.apartment : ''}<br>
        ${order.customer.city}, ${order.customer.province} ${order.customer.postalCode || ''}<br>
        Phone: ${order.customer.phone}<br>
        Email: ${order.customer.email}
      </div>
      <div class="col">
        <strong>SHIPPING & COURIER:</strong>
        Courier: ${order.courierName || 'TCS Express'}<br>
        Tracking #: ${order.trackingNumber || 'Pending Dispatch'}<br>
        Order Notes: ${order.customerNotes || 'None'}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item Description</th>
          <th>Size / Color</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Total (PKR)</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td><strong>${item.title}</strong></td>
            <td>${item.size || 'Standard'} / ${item.color || 'Default'}</td>
            <td class="text-right">Rs. ${item.price.toLocaleString()}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">Rs. ${item.total.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <table class="summary-table">
      <tr>
        <td>Subtotal:</td>
        <td class="text-right">Rs. ${order.subtotal.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Delivery Fee:</td>
        <td class="text-right">${order.shippingFee === 0 ? 'FREE' : 'Rs. ' + order.shippingFee.toLocaleString()}</td>
      </tr>
      ${order.discount > 0 ? `
        <tr style="color: #0B4636;">
          <td>Discount (${order.couponApplied?.code || 'Coupon'}):</td>
          <td class="text-right">- Rs. ${order.discount.toLocaleString()}</td>
        </tr>
      ` : ''}
      <tr class="grand-total">
        <td><strong>Amount Due:</strong></td>
        <td class="text-right"><strong>Rs. ${order.totalAmount.toLocaleString()}</strong></td>
      </tr>
    </table>

    <div class="footer-note">
      <p>Thank you for shopping with <strong>${BUSINESS_INFO.name}</strong>!</p>
      <p>Every piece is handcrafted with love by Multani artisans. For customer support or bespoke tailoring inquiries, contact <strong>${BUSINESS_INFO.phone}</strong>.</p>
    </div>
  </div>
</body>
</html>
  `;
};
