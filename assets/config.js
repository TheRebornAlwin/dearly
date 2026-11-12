/* Dearly checkout settings. The only file you need to edit to turn checkout on.

   shopDomain: your Shopify store's .myshopify.com address (Settings, Domains in Shopify admin).
   variantId:  the variant ID in Shopify admin
               (add .json to the product URL, then variants, id).

   The Buy button sends the shopper straight to Shopify checkout with one necklace in the cart:
   https://<shopDomain>/cart/<variantId>:<quantity>
   While either value is empty, the button shows a short "checkout is being connected" note instead. */
window.DEARLY_CONFIG = {
  shopDomain: "tx0mjr-1r.myshopify.com",
  variantId: "63497440788561",
  currency: "USD",
  price: 49.99
};
