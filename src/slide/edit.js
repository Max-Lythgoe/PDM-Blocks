import { useBlockProps } from '@wordpress/block-editor';
import ImageBlockControl from '../../components/ImageBlockControl';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    return (
        <div {...useBlockProps()}>
            <ImageBlockControl attributes={attributes} setAttributes={setAttributes} />
        </div>
    );
}