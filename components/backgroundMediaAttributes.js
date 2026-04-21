// attributes for background image/video
export const backgroundMediaAttributes = {
	opacity: {
		type: "number",
		default: 50
	},
	mixBlendMode: {
		type: "string",
		default: "normal"
	},
	imageFit: {
		type: "string",
		default: "cover"
	},
	imageURL: {
		type: "string",
		default: ""
	},
	customAlt: {
		type: "string",
		default: ""
	},
	customTitle: {
		type: "string",
		default: ""
	},
	defaultAlt: {
		type: "string",
		default: ""
	},
	defaultTitle: {
		type: "string",
		default: ""
	},
	focalPoint: {
		type: "object",
		default: { x: 0.5, y: 0.5 }
	},
	imageID: {
		type: "number",
		default: null
	},
	useFeaturedImage: {
		type: "boolean",
		default: false
	},
	videoURL: {
		type: "string",
		default: ""
	}
};
