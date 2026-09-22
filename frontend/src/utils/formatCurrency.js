/**
 * Format numeric PKR amounts to Pakistani standard display
 * e.g., 25000 -> "Rs. 25,000"
 */
export const formatPKR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rs. 0';
  }
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};

export default formatPKR;
