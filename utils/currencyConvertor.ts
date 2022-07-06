function currencyConvertor(value: any, name: any) {
  const rusToBel = 4.2626;
  if (name === "CustPrice") {
    const val = ((value / 100) * rusToBel * 1.5).toFixed(2);
    return isNaN(+val) ? 0 : val;
  }
  return value;
}
export  default currencyConvertor