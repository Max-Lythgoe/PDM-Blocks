<?php

/**
 * Breakpoints Field Template
 *
 * @package PdmAccelerate
 */
defined('ABSPATH') || exit;
?>
<div>
	<p class="description" style="margin-bottom: 12px;">
		<?php esc_html_e('Each breakpoint becomes available as a target in the block editor\'s Responsive Controls panel. The "Mobile" and "Tablet" breakpoints cannot be removed, only renamed or adjusted.', 'pdm-accelerate'); ?>
	</p>

	<table class="widefat fixed" style="max-width: 600px; margin-bottom: 12px;">
		<thead>
			<tr>
				<th style="width: 35%;"><?php esc_html_e('Name', 'pdm-accelerate'); ?></th>
				<th style="width: 30%;"><?php esc_html_e('Max Width', 'pdm-accelerate'); ?></th>
				<th style="width: 20%;"><?php esc_html_e('Unit', 'pdm-accelerate'); ?></th>
				<th style="width: 15%;"></th>
			</tr>
		</thead>
		<tbody id="prc-breakpoint-list">
			<!-- rows are injected by breakpoints.js -->
		</tbody>
	</table>

	<button
		type="button"
		class="button button-secondary"
		onclick="prcSettingsAddBreakpoint(event)">
		<span
			class="dashicons dashicons-plus"
			style="width: auto; height: auto; font-size: 1.2em; vertical-align: middle;"
			title="<?php echo esc_attr__('Add breakpoint', 'pdm-accelerate'); ?>"></span>
		<?php esc_html_e('Add Breakpoint', 'pdm-accelerate'); ?>
	</button>
</div>