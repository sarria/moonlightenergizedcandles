<?php
/**
 * Moonlight Energized Candles
 *
 */

add_action('init', 'init_fns');

function init_fns() {
    register_post_type('products', array(
        'labels' => array(
            'name' => 'Products',
            'singular_name' => 'Products',
            'add_new_item' => 'Add a New Product',
            'edit_item' => 'Edit a Product',
        ),
        'public' => true,
        'has_archive' => true,
        'menu_position' => 40,
        'supports' => array('title', 'page-attributes'),
        'hierarchical' => true, // Allows ordering

        // Enable GraphQL support
        'show_in_graphql' => true,
        'graphql_single_name' => 'Product',
        'graphql_plural_name' => 'Products',
    ));
}
add_action('init', 'init_fns');

if( function_exists('acf_add_options_page') ) {
	acf_add_options_page(array(
		'page_title' => __('Global Options'),
		'menu_title' => __('Global Options'),
		'autoload' => true,
		'show_in_graphql' => true
	));
}

// Add custom columns to the Products admin list
function moonlight_products_custom_columns($columns) {
    $new_columns = [];

    // Keep the checkbox and title at the beginning
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = $columns['title'];

    // Add Type and Price before Date
    $new_columns['type'] = __('Type');
    $new_columns['price'] = __('Price');
    $new_columns['headline'] = __('headline');
    $new_columns['size'] = __('size');
    $new_columns['weight'] = __('weight');

    // Add the rest of the default columns
    $new_columns['date'] = $columns['date'];

    return $new_columns;
}
add_filter('manage_edit-products_columns', 'moonlight_products_custom_columns');

// Populate the custom fields in the admin list
function moonlight_products_custom_column_content($column, $post_id) {
    switch ($column) {
        case 'type':
            $types = get_field('type', $post_id); // Get ACF field (array)
            if (is_array($types)) {
                echo esc_html(implode(', ', $types)); // Convert array to a comma-separated string
            } else {
                echo esc_html($types ? $types : '—');
            }
            break;
        case 'price':
            $price = get_field('price', $post_id); // Get ACF field
            echo $price ? esc_html('$' . number_format($price, 2)) : '—'; // Display formatted price
            break;
        case 'headline':
            $headline = get_field('headline', $post_id); // Get ACF field
            echo $headline; // Display headline
            break;
        case 'size':
            $size = get_field('size', $post_id); // Get ACF field
            echo $size; // Display size
            break;
        case 'weight':
            $weight = get_field('weight', $post_id); // Get ACF field
            echo $weight; // Display weight
            break;
    }
}
add_action('manage_products_posts_custom_column', 'moonlight_products_custom_column_content', 10, 2);


function moonlight_products_sortable_columns($columns) {
    $columns['type'] = 'type';
    $columns['price'] = 'price';
    $columns['headline'] = 'headline';
    return $columns;
}
add_filter('manage_edit-products_sortable_columns', 'moonlight_products_sortable_columns');

function register_acf_graphql_fields() {
    if (function_exists('register_graphql_field')) {

        register_graphql_field('Product', 'seo_title', [
            'type' => 'String',
            'description' => 'The SEO Title of the product',
            'resolve' => function($post) {
                return get_field('seo_title', $post->ID);
            }
        ]);

        register_graphql_field('Product', 'seo_description', [
            'type' => 'String',
            'description' => 'The SEO Description of the product',
            'resolve' => function($post) {
                return get_field('seo_description', $post->ID);
            }
        ]);        

        // Register Price
        register_graphql_field('Product', 'price', [
            'type' => 'String',
            'description' => 'The price of the product',
            'resolve' => function($post) {
                return get_field('price', $post->ID);
            }
        ]);

        // Register Image (Now includes alt text)
        register_graphql_field('Product', 'image', [
            'type' => 'String',
            'description' => 'Product image details',
            'resolve' => function($post) {
                $image = get_field('image', $post->ID);
                if ($image) {
                    return $image['url'];
                }
                return '';
            }
        ]);        

        // Register Type
        register_graphql_field('Product', 'type', [
            'type' => ['list_of' => 'String'], // Define it as a list (array)
            'description' => 'Product types',
            'resolve' => function($post) {
                $types = get_field('type', $post->ID); // Get multi-select values
                return is_array($types) ? $types : []; // Ensure it's an array
            }
        ]);

        // Register size
        register_graphql_field('Product', 'size', [
            'type' => 'String',
            'description' => 'The size of the product',
            'resolve' => function($post) {
                return get_field('size', $post->ID);
            }
        ]);

        // Register Weight
        register_graphql_field('Product', 'weight', [
            'type' => 'String',
            'description' => 'The weight of the product',
            'resolve' => function($post) {
                return get_field('weight', $post->ID);
            }
        ]);        

        // Register Headline
        register_graphql_field('Product', 'headline', [
            'type' => 'String',
            'description' => 'Product headline',
            'resolve' => function($post) {
                return get_field('headline', $post->ID);
            }
        ]);

        // Register Description (WYSIWYG)
        register_graphql_field('Product', 'description', [
            'type' => 'String',
            'description' => 'Product description',
            'resolve' => function($post) {
                return get_field('description', $post->ID);
            }
        ]);

        // Register Button Link (Page Link) - Returns Only the Last Part of the Path
        register_graphql_field('Product', 'button_link', [
            'type' => 'String',
            'description' => 'Button link to a specific page (only the last part of the path)',
            'resolve' => function($post) {
                $link = get_field('button_link', $post->ID); // Get ACF Page Link field
                if ($link) {
                    $path = wp_parse_url($link, PHP_URL_PATH); // Extracts only the path
                    $pathParts = explode('/', trim($path, '/')); // Split by "/" and remove empty parts
                    return end($pathParts); // Get the last part of the path
                }
                return '';
            }
        ]);

   
    }
}
add_action('graphql_register_types', 'register_acf_graphql_fields');

add_action( 'graphql_register_types', function() {
    register_graphql_object_type( 'Coupon', [
        'description' => 'Represents a discount coupon',
        'fields' => [
            'code' => [
                'type' => 'String',
                'description' => 'Coupon Code',
            ],
            'quantity' => [
                'type' => 'Integer',
                'description' => 'Available quantity',
            ],
            'kind' => [
                'type' => 'String',
                'description' => 'Type of coupon',
            ],
            'message' => [
                'type' => 'String',
                'description' => 'Message of coupon',
            ],            
        ],
    ]);

    register_graphql_field( 'RootQuery', 'coupons', [
        'type' => ['list_of' => 'Coupon'],
        'description' => 'Retrieve coupons from custom table',
        'args' => [
            'code' => [
                'type' => 'String',
                'description' => 'Filter by coupon code'
            ]
        ],
        'resolve' => function($root, $args, $context, $info) {
            global $wpdb;

            // Secure query that ensures quantity > 0
            $sql = "SELECT code, quantity, kind, message FROM {$wpdb->prefix}coupons WHERE quantity > 0";

            if (!empty($args['code'])) {
                $sql .= $wpdb->prepare(" AND code = %s", $args['code']);
            }

            $results = $wpdb->get_results($sql, ARRAY_A);

            return $results ?: [];
        }
    ]);
});

add_action('graphql_register_types', function() {
    register_graphql_mutation('useCoupon', [
        'inputFields' => [
            'code' => [
                'type' => 'String',
                'description' => 'The coupon code to use'
            ]
        ],
        'outputFields' => [
            'success' => [
                'type' => 'Boolean',
                'description' => 'True if the coupon was successfully used'
            ],
            'message' => [
                'type' => 'String',
                'description' => 'Status message'
            ],
            'remainingQuantity' => [
                'type' => 'Integer',
                'description' => 'Remaining quantity of the coupon'
            ]
        ],
        'mutateAndGetPayload' => function($input, $context, $info) {
            global $wpdb;

            $code = $input['code'];

            // Fetch coupon data
            $coupon = $wpdb->get_row(
                $wpdb->prepare("SELECT quantity FROM {$wpdb->prefix}coupons WHERE code = %s", $code)
            );

            if (!$coupon) {
                return [
                    'success' => false,
                    'message' => 'Coupon not found',
                    'remainingQuantity' => null
                ];
            }

            if ($coupon->quantity <= 0) {
                return [
                    'success' => false,
                    'message' => 'Coupon is already used up',
                    'remainingQuantity' => 0
                ];
            }

            // Reduce coupon quantity by 1
            $updated = $wpdb->update(
                "{$wpdb->prefix}coupons",
                ['quantity' => max(0, $coupon->quantity - 1)], // Ensure it doesn't go below zero
                ['code' => $code]
            );

            if ($updated === false) {
                return [
                    'success' => false,
                    'message' => 'Failed to update coupon quantity',
                    'remainingQuantity' => $coupon->quantity
                ];
            }

            return [
                'success' => true,
                'message' => 'Coupon updated successfully',
                'remainingQuantity' => max(0, $coupon->quantity - 1)
            ];
        }
    ]);
});
