<?php
/**
 * Devquiry theme functions.
 */
if (!defined('ABSPATH')) exit;

function devquiry_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('html5', ['search-form','comment-form','comment-list','gallery','caption','style','script']);
    register_nav_menus(['primary'=>'Primary Menu','footer'=>'Footer Menu']);
}
add_action('after_setup_theme','devquiry_setup');

function devquiry_assets() {
    wp_enqueue_style('devquiry-font','https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',[],null);
    wp_enqueue_style('devquiry-style',get_stylesheet_uri(),[], '1.0.0');
    wp_enqueue_script('devquiry-main',get_template_directory_uri().'/assets/js/main.js',[], '1.0.0', true);
    wp_localize_script('devquiry-main','devquiryData',['cartUrl'=>function_exists('wc_get_cart_url')?wc_get_cart_url():'#']);
}
add_action('wp_enqueue_scripts','devquiry_assets');

function devquiry_menu_fallback(){
    echo '<div class="nav-menu">';
    echo '<a href="'.esc_url(home_url('/')).'">Home</a>';
    echo '<a href="'.esc_url(function_exists('wc_get_page_permalink')?wc_get_page_permalink('shop'):home_url('/products/')).'">Products</a>';
    echo '<a href="'.esc_url(home_url('/about/')).'">About</a>';
    echo '<a href="'.esc_url(home_url('/contact/')).'">Support</a>';
    echo '</div>';
}

function devquiry_cart_count(){
    if (!function_exists('WC') || !WC()->cart) return 0;
    return WC()->cart->get_cart_contents_count();
}

/* Add a lightweight license key to each purchased product line. This is a foundation, not the final remote license server. */
function devquiry_generate_license_keys($order_id){
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    if (!$order) return;
    foreach ($order->get_items() as $item_id=>$item){
        if ($item->get_meta('_devquiry_license_key')) continue;
        $key = strtoupper('DVQ-'.wp_generate_password(4,false,false).'-'.wp_generate_password(4,false,false).'-'.wp_generate_password(4,false,false));
        $item->add_meta_data('_devquiry_license_key',$key,true);
        $item->add_meta_data('_devquiry_license_status','active',true);
        $item->save();
    }
}
add_action('woocommerce_payment_complete','devquiry_generate_license_keys');
add_action('woocommerce_order_status_completed','devquiry_generate_license_keys');

function devquiry_my_account_endpoint(){
    add_rewrite_endpoint('licenses',EP_ROOT|EP_PAGES);
}
add_action('init','devquiry_my_account_endpoint');

function devquiry_my_account_query_vars($vars){
    $vars[]='licenses';
    return $vars;
}
add_filter('query_vars','devquiry_my_account_query_vars');

function devquiry_account_menu_item($items){
    $logout = $items['customer-logout'] ?? null;
    unset($items['customer-logout']);
    $items['licenses']='Licenses';
    if ($logout) $items['customer-logout']=$logout;
    return $items;
}
add_filter('woocommerce_account_menu_items','devquiry_account_menu_item');

function devquiry_licenses_content(){
    $customer_id=get_current_user_id();
    if (!$customer_id){echo '<p>Please log in to view your licenses.</p>';return;}
    $orders=wc_get_orders(['customer_id'=>$customer_id,'limit'=>-1,'status'=>array_keys(wc_get_order_statuses())]);
    echo '<h2>My Licenses</h2><p class="lead">Your purchased software licenses.</p>';
    $found=false;
    foreach($orders as $order){
        foreach($order->get_items() as $item){
            $key=$item->get_meta('_devquiry_license_key');
            if(!$key) continue;
            $found=true;
            echo '<div style="border:1px solid var(--line);border-radius:16px;padding:20px;margin:16px 0;background:#fff">';
            echo '<strong>'.esc_html($item->get_name()).'</strong><br>';
            echo '<span style="color:#666">License: </span><code>'.esc_html($key).'</code><br>';
            echo '<span style="color:#666">Status: </span><strong style="text-transform:uppercase">'.esc_html($item->get_meta('_devquiry_license_status') ?: 'active').'</strong>';
            echo '</div>';
        }
    }
    if(!$found) echo '<p>No licenses have been issued yet.</p>';
}
add_action('woocommerce_account_licenses_endpoint','devquiry_licenses_content');

function devquiry_product_card(){
    global $product;
    if (!$product) return;
    $link=get_permalink($product->get_id());
    echo '<article class="product-card">';
    echo '<a class="product-image" href="'.esc_url($link).'">';
    if($product->get_image_id()) echo wp_get_attachment_image($product->get_image_id(),'large');
    else echo '<div style="width:100%;height:100%;display:grid;place-items:center;color:#666">DEVQUIRY</div>';
    echo '</a><div class="product-info">';
    echo '<div class="eyebrow">Software</div>';
    echo '<h2><a href="'.esc_url($link).'">'.esc_html($product->get_name()).'</a></h2>';
    echo '<p class="lead">'.esc_html(wp_trim_words($product->get_short_description() ?: $product->get_description(),18)).'</p>';
    echo '<div class="product-price">'.wp_kses_post($product->get_price_html()).'</div>';
    echo '<p style="margin-top:18px"><a class="btn btn-dark" href="'.esc_url($link).'">Explore Product <span>→</span></a></p>';
    echo '</div></article>';
}

function devquiry_flush_rewrites(){
    devquiry_my_account_endpoint();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__,'devquiry_flush_rewrites');
