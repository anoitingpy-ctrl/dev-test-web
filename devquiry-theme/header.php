<?php if (!defined('ABSPATH')) exit; ?><!doctype html>
<html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>><?php wp_body_open(); ?>
<header class="site-nav" id="site-nav"><div class="wrap nav-inner">
<a class="brand" href="<?php echo esc_url(home_url('/')); ?>">DEVQUIRY<span class="brand-dot">.</span></a>
<nav class="nav-menu" aria-label="Primary navigation"><?php if(has_nav_menu('primary')) wp_nav_menu(['theme_location'=>'primary','container'=>false,'items_wrap'=>'%3$s']); else devquiry_menu_fallback(); ?></nav>
<div class="nav-actions">
<?php if(function_exists('wc_get_page_permalink')): ?><a class="cart-link" href="<?php echo esc_url(wc_get_cart_url()); ?>">Cart <span class="cart-count"><?php echo esc_html(devquiry_cart_count()); ?></span></a><?php endif; ?>
<?php if(is_user_logged_in()): ?><a href="<?php echo esc_url(wc_get_account_endpoint_url('dashboard')); ?>">Account</a><?php else: ?><a href="<?php echo esc_url(wc_get_page_permalink('myaccount')); ?>">Login</a><?php endif; ?>
<?php if(function_exists('wc_get_page_permalink')): ?><a class="btn btn-dark" href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">Explore Software <span>→</span></a><?php endif; ?>
<button class="menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
</div></div></header>
<div class="mobile-menu" id="mobile-menu"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><a href="<?php echo esc_url(function_exists('wc_get_page_permalink')?wc_get_page_permalink('shop'):home_url('/products/')); ?>">Products</a><a href="<?php echo esc_url(home_url('/about/')); ?>">About</a><a href="<?php echo esc_url(home_url('/contact/')); ?>">Support</a><?php if(function_exists('wc_get_page_permalink')):?><a href="<?php echo esc_url(wc_get_page_permalink('myaccount')); ?>">Account</a><?php endif; ?></div>
<main id="main-content">
