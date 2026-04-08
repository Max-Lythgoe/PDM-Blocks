<?php

/**
 * PDM Company Info — WordPress Abilities API integration.
 *
 * Registers two abilities so AI assistants (e.g. PDM Supercharge chatbot) can
 * read and update company info directly without requiring the user to navigate
 * to the Company Info admin page.
 *
 * @package PDM_Blocks
 */

defined('ABSPATH') || exit;

add_action('init', 'pdm_blocks_register_company_info_abilities');

function pdm_blocks_register_company_info_abilities(): void
{
    if (! function_exists('wp_register_ability')) {
        return;
    }

    $edit_url = admin_url('admin.php?page=pdm-blocks-company-info');

    // ------------------------------------------------------------------
    // Ability 1: Get Company Info
    // ------------------------------------------------------------------
    wp_register_ability(
        'pdm/get-company-info',
        [
            'label'            => 'Get Company Info',
            'description'      => 'Returns all company locations (name, phone, email, address, business hours) stored in PDM settings, plus a link to the Company Info edit page.',
            'category'         => 'site',
            'input_schema'     => [
                'type'                 => 'object',
                'properties'           => [
                    'location' => [
                        'type'        => 'integer',
                        'description' => 'Optional zero-based index of a specific location to return. Omit to return all locations.',
                        'default'     => -1,
                    ],
                ],
                'additionalProperties' => false,
            ],
            'output_schema'    => [
                'type'       => 'object',
                'properties' => [
                    'locations' => [
                        'type'  => 'array',
                        'items' => [
                            'type'       => 'object',
                            'properties' => [
                                'index'   => ['type' => 'integer'],
                                'name'    => ['type' => 'string'],
                                'phone'   => ['type' => 'string'],
                                'email'   => ['type' => 'string'],
                                'address' => ['type' => 'string'],
                                'hours'   => ['type' => 'array'],
                            ],
                        ],
                    ],
                    'edit_url'  => ['type' => 'string'],
                ],
            ],
            'execute_callback' => static function ($input = []) use ($edit_url): array {
                $raw_locations = pdm_blocks_get_company_locations();
                $index         = isset($input['location']) ? (int) $input['location'] : -1;

                $locations = [];
                foreach ($raw_locations as $i => $loc) {
                    if ($index >= 0 && $i !== $index) {
                        continue;
                    }
                    $locations[] = [
                        'index'   => $i,
                        'name'    => $loc['name']    ?? '',
                        'phone'   => $loc['phone']   ?? '',
                        'email'   => $loc['email']   ?? '',
                        'address' => $loc['address'] ?? '',
                        'hours'   => $loc['hours']   ?? [],
                    ];
                }

                return [
                    'locations' => $locations,
                    'edit_url'  => $edit_url,
                ];
            },
            'permission_callback' => static function (): bool {
                return current_user_can('manage_options');
            },
            'meta' => [
                'annotations'  => [
                    'readonly'    => true,
                    'destructive' => false,
                    'idempotent'  => true,
                ],
                'show_in_rest' => true,
            ],
        ]
    );

    // ------------------------------------------------------------------
    // Ability 2: Update Company Info
    // ------------------------------------------------------------------
    wp_register_ability(
        'pdm/update-company-info',
        [
            'label'       => 'Update Company Info',
            'description' => 'Updates one or more fields (name, phone, email, address) for a specific company location in PDM settings. Provide only the fields you want to change.',
            'category'    => 'site',
            'input_schema' => [
                'type'                 => 'object',
                'required'             => [],
                'properties'           => [
                    'location' => [
                        'type'        => 'integer',
                        'description' => 'Zero-based index of the location to update. Defaults to 0 (primary location).',
                        'default'     => 0,
                    ],
                    'name'    => ['type' => 'string', 'description' => 'New location / business name.'],
                    'phone'   => ['type' => 'string', 'description' => 'New phone number.'],
                    'email'   => ['type' => 'string', 'description' => 'New email address.'],
                    'address' => ['type' => 'string', 'description' => 'New street address.'],
                ],
                'additionalProperties' => false,
            ],
            'output_schema' => [
                'type'       => 'object',
                'properties' => [
                    'success'  => ['type' => 'boolean'],
                    'updated'  => ['type' => 'object'],
                    'edit_url' => ['type' => 'string'],
                ],
            ],
            'execute_callback' => static function ($input = []) use ($edit_url) {
                if (! current_user_can('manage_options')) {
                    return new WP_Error('forbidden', 'You do not have permission to update company info.');
                }

                $input    = is_array($input) ? $input : [];
                $index    = isset($input['location']) ? (int) $input['location'] : 0;
                $existing = get_option('pdm_blocks_company_info', []);
                $locs     = $existing['company_locations'] ?? [['name' => '', 'phone' => '', 'email' => '', 'address' => '', 'map' => '', 'hours' => []]];

                if (! isset($locs[$index])) {
                    return new WP_Error('invalid_location', "Location index {$index} does not exist.");
                }

                $changed = [];

                if (isset($input['name'])) {
                    $locs[$index]['name']  = sanitize_text_field($input['name']);
                    $changed['name']       = $locs[$index]['name'];
                }
                if (isset($input['phone'])) {
                    $locs[$index]['phone'] = sanitize_text_field($input['phone']);
                    $changed['phone']      = $locs[$index]['phone'];
                }
                if (isset($input['email'])) {
                    $locs[$index]['email'] = sanitize_email($input['email']);
                    $changed['email']      = $locs[$index]['email'];
                }
                if (isset($input['address'])) {
                    $locs[$index]['address'] = sanitize_textarea_field($input['address']);
                    $changed['address']      = $locs[$index]['address'];
                }

                if (empty($changed)) {
                    return new WP_Error('no_changes', 'No fields were provided to update. Please specify name, phone, email, or address.');
                }

                $existing['company_locations'] = $locs;
                $saved = update_option('pdm_blocks_company_info', $existing);

                // update_option returns false both on DB error and when the
                // serialised value hasn't changed (e.g. identical to current).
                // Re-read and compare to distinguish the two cases.
                if (! $saved) {
                    wp_cache_delete('pdm_blocks_company_info', 'options');
                    $verify  = get_option('pdm_blocks_company_info', []);
                    $ok      = true;
                    foreach ($changed as $field => $intended) {
                        if (($verify['company_locations'][$index][$field] ?? null) !== $intended) {
                            $ok = false;
                            break;
                        }
                    }
                    if (! $ok) {
                        return new WP_Error(
                            'save_failed',
                            'The company information could not be saved. Please update it manually in the admin panel.'
                        );
                    }
                }

                return [
                    'success'  => true,
                    'updated'  => $changed,
                    'edit_url' => $edit_url,
                ];
            },
            'permission_callback' => static function (): bool {
                return current_user_can('manage_options');
            },
            'meta' => [
                'annotations'  => [
                    'readonly'    => false,
                    'destructive' => false,
                    'idempotent'  => false,
                ],
                'show_in_rest' => true,
            ],
        ]
    );
}
