<?php if (!defined('ABSPATH')) exit; ?>
</main>
<footer class="site-footer"><div class="wrap"><div class="footer-grid">
<div><div class="brand">DEVQUIRY<span class="brand-dot">.</span></div><p style="color:#aaa;max-width:30ch;margin-top:12px">Software built to work.</p></div>
<div><strong>Explore</strong><?php if(function_exists('wc_get_page_permalink')):?><a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">Products</a><?php endif; ?><a href="<?php echo esc_url(home_url('/about/')); ?>">About</a><a href="<?php echo esc_url(home_url('/contact/')); ?>">Support</a></div>
<div><strong>Account</strong><?php if(function_exists('wc_get_page_permalink')):?><a href="<?php echo esc_url(wc_get_page_permalink('myaccount')); ?>">My Account</a><a href="<?php echo esc_url(wc_get_cart_url()); ?>">Cart</a><a href="<?php echo esc_url(wc_get_checkout_url()); ?>">Checkout</a><?php endif; ?></div>
<div><strong>Legal</strong><a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>">Privacy</a><a href="<?php echo esc_url(home_url('/terms/')); ?>">Terms</a><a href="<?php echo esc_url(home_url('/refund-policy/')); ?>">Refunds</a></div>
</div><div style="border-top:1px solid rgba(255,255,255,.12);margin-top:55px;padding-top:20px;color:#777;font-size:.85rem">© <?php echo esc_html(date('Y')); ?> Devquiry. All rights reserved.</div></div></footer><?php wp_footer(); ?></body></html>
