// Social previews read the product-specific HTML. Shoppers use the shared storefront.
const destination = new URL(document.querySelector("main a").href);
const size = new URLSearchParams(location.search).get("size");
if (size === "50" || size === "30") destination.searchParams.set("size", size);
location.replace(destination);
