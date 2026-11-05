/* Dearly checkout settings. The only file you need to edit to turn checkout on.

   shopDomain: your Shopify store's .myshopify.com address (Settings, Domains in Shopify admin).
   variantId:  the number at the end of the product's variant URL in Shopify admin
               (Products, the necklace, then the variant; or add .json to the product URL).

   The Buy button sends the shopper straight to Shopify checkout with one necklace in the cart:
   https://<shopDomain>/cart/<variantId>:<quantity>
   While either value is empty, the button shows a short "checkout is being connected" note instead. */
window.DEARLY_CONFIG = {
  shopDomain: "",
  variantId: "",
  currency: "USD",
  price: 49.99
};
