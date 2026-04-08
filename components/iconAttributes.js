// Shared attributes for icon functionality
// Import and spread these in your block.json attributes

export const iconAttributes = {
	selectedIcon: {
		type: "string",
		default: "check"
	},
	customIconUrl: {
		type: "string"
	},
	customIconSvg: {
		type: "string"
	},
	iconSize: {
		type: "number",
		default: 30
	},
	iconColor: {
		type: "string",
		default: "currentColor"
	}
};

// For blocks that need multiple icons (like accordions with open/close)
export const dualIconAttributes = {
	iconOpen: {
		type: "string",
		default: "plus"
	},
	customIconUrlOpen: {
		type: "string"
	},
	customIconSvgOpen: {
		type: "string"
	},
	iconClose: {
		type: "string",
		default: "minus"
	},
	customIconUrlClose: {
		type: "string"
	},
	customIconSvgClose: {
		type: "string"
	},
	iconSize: {
		type: "number",
		default: 25
	},
	iconColor: {
		type: "string",
		default: "currentColor"
	}
};
