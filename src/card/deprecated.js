import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import BackgroundMediaRender from '../../components/BackgroundMediaRender';
import { backgroundMediaAttributes } from '../../components/backgroundMediaAttributes';

const v4 = {
	// Version 4: Content wrapped in .content-wrapper; background media is now
	// decorative (aria-hidden). Reproduces the pre-aria-hidden markup so existing
	// cards migrate cleanly to the new format.
	attributes: {
		...backgroundMediaAttributes,
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
				<BackgroundMediaRender attributes={attributes} decorative={false} />
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
				<div className="content-wrapper">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	}
};

const deprecated = [
	v4,
	{
		// Version 3: Link overlay (a.pdm-card-link) with optional background media.
		// Content was rendered as direct children of the card (no .content-wrapper
		// wrapper yet), so this save reproduces that markup so older cards migrate cleanly.
		attributes: {
			...backgroundMediaAttributes,
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
					<BackgroundMediaRender attributes={attributes} decorative={false} />
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