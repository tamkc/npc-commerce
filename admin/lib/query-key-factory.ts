export function queryKeysFactory(scope: string) {
  return {
    all: [scope] as const,
    lists: () => [...queryKeysFactory(scope).all, "list"] as const,
    list: (query?: Record<string, string>) =>
      [...queryKeysFactory(scope).lists(), query] as const,
    details: () => [...queryKeysFactory(scope).all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeysFactory(scope).details(), id] as const,
  };
}

export const productKeys = queryKeysFactory("products");
export const orderKeys = queryKeysFactory("orders");
export const customerKeys = queryKeysFactory("customers");
export const customerGroupKeys = queryKeysFactory("customer-groups");
export const inventoryKeys = queryKeysFactory("inventory");
export const categoryKeys = queryKeysFactory("categories");
export const promotionKeys = queryKeysFactory("promotions");
export const pricingKeys = queryKeysFactory("pricing");
export const regionKeys = queryKeysFactory("regions");
export const currencyKeys = queryKeysFactory("currencies");
export const taxRateKeys = queryKeysFactory("tax-rates");
export const salesChannelKeys = queryKeysFactory("sales-channels");
export const shippingKeys = queryKeysFactory("shipping");
export const stockLocationKeys = queryKeysFactory("stock-locations");
export const fulfillmentKeys = queryKeysFactory("fulfillments");
export const userKeys = queryKeysFactory("users");
export const apiKeyKeys = queryKeysFactory("api-keys");
export const settingsKeys = queryKeysFactory("settings");
