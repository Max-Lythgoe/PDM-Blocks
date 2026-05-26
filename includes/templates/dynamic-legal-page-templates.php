<?php

if (! defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/privacy-policy.php';
require_once __DIR__ . '/terms.php';
require_once __DIR__ . '/accessibility-statement.php';
require_once __DIR__ . '/anti-discrimination-disclaimer.php';
require_once __DIR__ . '/healthcare-disclaimer.php';
require_once __DIR__ . '/hipaa.php';

function pdm_blocks_get_dynamic_legal_page_definitions()
{
    return array(
        'privacy_policy' => array(
            'title'   => 'Privacy Policy',
            'slug'    => 'privacy-policy',
            'content' => pdm_blocks_get_dynamic_privacy_policy_template(),
        ),
        'terms_page' => array(
            'title'   => 'Terms',
            'slug'    => 'terms',
            'content' => pdm_blocks_get_dynamic_terms_template(),
        ),
        'accessibility_page' => array(
            'title'   => 'Accessibility Statement',
            'slug'    => 'accessibility-statement',
            'content' => pdm_blocks_get_dynamic_accessibility_statement_template(),
        ),
        'anti_discrimination_page' => array(
            'title'   => 'Anti-Discrimination Disclaimer',
            'slug'    => 'anti-discrimination-disclaimer',
            'content' => pdm_blocks_get_dynamic_anti_discrimination_disclaimer_template(),
        ),
        'healthcare_disclaimer_page' => array(
            'title'   => 'Healthcare Disclaimer',
            'slug'    => 'healthcare-disclaimer',
            'content' => pdm_blocks_get_dynamic_healthcare_disclaimer_template(),
        ),
        'hipaa_page' => array(
            'title'   => 'HIPAA Privacy Policy',
            'slug'    => 'hipaa',
            'content' => pdm_blocks_get_dynamic_hipaa_template(),
        ),
    );
}
