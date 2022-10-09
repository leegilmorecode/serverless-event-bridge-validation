// the order regexes can be used across our domain objects,
// events, api validation and more..
export const orderRegexes = {
  orderId: '^[A-Z]{3}-\\d{1,4}$',
  addressLine: '^[a-zA-Z0-9 _.-]*$',
  productId: '^[A-Z]{4}-\\d{1,4}$',
};
