export function queryKeysFactory(scope: string) {
  return {
    all: [scope] as const,
    lists: () => [...queryKeysFactory(scope).all, "list"] as const,
    list: (query?: Record<string, string>) =>
      [...queryKeysFactory(scope).lists(), query] as const,
    details: () => [...queryKeysFactory(scope).all, "detail"] as const,
    detail: (id: string) => [...queryKeysFactory(scope).details(), id] as const,
  };
}

export const productKeys = queryKeysFactory("admin-products");
export const orderKeys = queryKeysFactory("admin-orders");
export const customerKeys = queryKeysFactory("admin-customers");
export const customerGroupKeys = queryKeysFactory("admin-customer-groups");
export const inventoryKeys = queryKeysFactory("admin-inventory");
export const lowStockKeys = queryKeysFactory("admin-low-stock");
export const promotionKeys = queryKeysFactory("admin-promotions");
export const priceListKeys = queryKeysFactory("admin-price-lists");
export const categoryKeys = queryKeysFactory("admin-categories");
export const regionKeys = queryKeysFactory("admin-regions");
export const fulfillmentKeys = queryKeysFactory("admin-fulfillments");
export const orderNoteKeys = queryKeysFactory("admin-order-notes");

// Settings domain keys
export const userKeys = queryKeysFactory("admin-users");
export const currencyKeys = queryKeysFactory("admin-currencies");
export const taxRateKeys = queryKeysFactory("admin-tax-rates");
export const salesChannelKeys = queryKeysFactory("admin-sales-channels");
export const stockLocationKeys = queryKeysFactory("admin-stock-locations");
export const shippingMethodKeys = queryKeysFactory("admin-shipping-methods");
export const apiKeyKeys = queryKeysFactory("admin-api-keys");
