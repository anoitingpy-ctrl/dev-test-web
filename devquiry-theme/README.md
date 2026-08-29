# Devquiry WordPress Theme

This folder is the WordPress/WooCommerce integration layer for the Devquiry static prototype.

## What is dynamic
- WooCommerce products populate the product archive and homepage.
- Product pages, cart, checkout, orders and downloads use WooCommerce.
- My Account uses WooCommerce customer accounts and endpoints.
- A custom Licenses endpoint is included as a foundation.
- A license key is generated for each purchased line item after payment/completion.

## Install
1. Install and activate WooCommerce.
2. Zip the `devquiry-theme` folder and upload it from Appearance > Themes > Add New > Upload Theme.
3. Activate Devquiry.
4. In Settings > Permalinks, click Save Changes once to refresh rewrite rules.
5. In WooCommerce > Settings > Advanced, verify the Cart, Checkout and My Account pages.
6. Create products as Virtual + Downloadable products and attach the ZIP file under Product data > General / Downloadable files.
7. Set the store currency to USD in WooCommerce > Settings > General.
8. Set a static front page to the page that uses the homepage, or leave the theme front page active.
9. Add your Primary Menu under Appearance > Menus.

## Important
The license key system in this theme is an initial local WordPress/WooCommerce foundation. It does NOT yet perform remote verification from the customer's software. A separate secure license API should be implemented before shipping production software.

Do not put AWS, payment gateway, database, or license secrets in this theme or in Git.
