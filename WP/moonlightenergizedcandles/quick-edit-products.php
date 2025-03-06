<?php
// ================================
// Quick Edit for Custom Field: Price
// ================================

// Add Price field to Quick Edit
function moonlight_add_quick_edit_fields($column_name, $post_type) {
    if ($post_type === 'products' && $column_name === 'price') { ?>
        <fieldset class="inline-edit-col-right">
            <div class="inline-edit-col">
                <label>
                    <span class="title"><?php esc_html_e('Price', 'text-domain'); ?></span>
                    <span class="input-text-wrap">
                        <input type="text" name="price" class="ptitle" value="">
                    </span>
                </label>
            </div>
        </fieldset>
    <?php }
}
add_action('quick_edit_custom_box', 'moonlight_add_quick_edit_fields', 10, 2);

// Save custom field when Quick Edit is updated
function moonlight_save_quick_edit_fields($post_id) {
    if (isset($_POST['price'])) {
        update_post_meta($post_id, 'price', sanitize_text_field($_POST['price']));
    }
}
add_action('save_post', 'moonlight_save_quick_edit_fields');

// Populate Quick Edit with existing price value
function moonlight_quick_edit_javascript() {
    global $post_type;
    if ($post_type !== 'products') {
        return;
    }
    ?>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            jQuery(document).on('click', '.editinline', function () {
                var post_id = jQuery(this).closest('tr').attr('id').replace('post-', '');
                var price = jQuery('#price-' + post_id).text().trim();
                jQuery('input[name="price"]').val(price);
            });
        });
    </script>
    <?php
}
add_action('admin_footer', 'moonlight_quick_edit_javascript');

// Add a hidden span to store the price in the admin list
function moonlight_custom_column_content($column_name, $post_id) {
    if ($column_name === 'price') {
        $price = get_post_meta($post_id, 'price', true);
        echo '<span id="price-' . $post_id . '">' . esc_html('$' . number_format($price, 2)) . '</span>';
    }
}
add_action('manage_products_posts_custom_column', 'moonlight_custom_column_content', 10, 2);
