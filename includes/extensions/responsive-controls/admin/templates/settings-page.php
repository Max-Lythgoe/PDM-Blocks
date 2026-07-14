<?php

/**
 * Responsive Controls Settings Page Template
 *
 * @package PdmAccelerate
 */
defined('ABSPATH') || exit;
?>
<div class="wrap">
	<h1><?php esc_html_e('Responsive Controls', 'pdm-accelerate'); ?></h1>

	<p><?php esc_html_e('Define the breakpoints available for responsive block controls in the editor. Both named breakpoints (Mobile, Tablet) and custom breakpoints are supported.', 'pdm-accelerate'); ?></p>

	<form action="options.php" method="post">
		<?php
		settings_fields(PRC_Settings::OPTION_PREFIX . '_settings');
		do_settings_sections(PRC_Settings::MENU_PAGE_SLUG);
		submit_button(esc_attr__('Save Breakpoints', 'pdm-accelerate'));
		?>
	</form>
</div>