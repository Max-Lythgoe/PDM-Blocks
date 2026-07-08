import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const deprecated = [
	{
		// Version 3: Card link was an empty overlay <a> inside the <div> wrapper (relied on CSS positioning).
		// Replaced by v4 where <a> properly wraps the content.
		attributes: {
			url: {
				type: 'string',
				source: 'attribute',
				selector: 'a.pdm-card-link',
				attribute: 'href'
			},
			linkTarget: {
				type: 'string',
				source: 'attribute',
				selector: 'a.pdm-card-link',
				attribute: 'target'
			},
			rel: {
				type: 'string',
				source: 'attribute',
				selector: 'a.pdm-card-link',
				attribute: 'rel'
			},
			verticalAlignment: {
				type: 'string',
				default: 'top'
			}
		},
		save: ({ attributes }) => {
			const { url, linkTarget, rel, verticalAlignment } = attributes;
			const blockProps = useBlockProps.save({
				className: `is-vertically-aligned-${verticalAlignment || 'top'}`
			});
			return (
				<div { ...blockProps }>
					{url && (
						<a
							className="pdm-card-link"
							href={url}
							{...(linkTarget && { target: linkTarget })}
							{...(rel && { rel: rel })}
							aria-hidden="true"
							tabIndex="-1"
						/>
					)}
					<InnerBlocks.Content />
				</div>
			);
		}
	},
	{
		// Version 2: Card link was an <a> wrapper (invalid HTML when card contains buttons/divs)
		attributes: {
			url: {
				type: 'string',
				source: 'attribute',
				selector: 'a',
				attribute: 'href'
			},
			linkTarget: {
				type: 'string',
				source: 'attribute',
				selector: 'a',
				attribute: 'target'
			},
			rel: {
				type: 'string',
				source: 'attribute',
				selector: 'a',
				attribute: 'rel'
			},
			verticalAlignment: {
				type: 'string',
				default: 'top'
			}
		},
		save: ({ attributes }) => {
			const { url, linkTarget, rel, verticalAlignment } = attributes;
			const blockProps = useBlockProps.save({
				className: `is-vertically-aligned-${verticalAlignment || 'top'}`
			});
			const content = <InnerBlocks.Content />;
			if (url) {
				return (
					<a { ...blockProps } href={url} {...(linkTarget && { target: linkTarget })} {...(rel && { rel: rel })}>
						{content}
					</a>
				);
			}
			return <div { ...blockProps }>{content}</div>;
		}
	},
	{
		// Version 1: Before link and alignment attributes were added
		attributes: {},
		save: () => {
			const blockProps = useBlockProps.save();
			return (
				<div { ...blockProps }>
					<InnerBlocks.Content />
				</div>
			);
		}
	}
];

export default deprecated;
