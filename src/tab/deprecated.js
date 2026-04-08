import { InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {},
	save() {
		return <InnerBlocks.Content />;
	},
};

export default [ v1 ];
