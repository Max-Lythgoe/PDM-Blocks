#!/usr/bin/env node

/**
 * Icon Library Converter
 * Converts JavaScript ICON_LIBRARY (JSX format) to PHP format
 * 
 * Usage: node scripts/convert-icons.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const JS_ICON_FILE = path.join(__dirname, '../components/icon-library.js');
const PHP_ICON_FILE = path.join(__dirname, '../components/icon-library.php');

/**
 * Convert JSX element to string
 */
function jsxToString(jsxString) {
    // Remove JSX syntax and convert to HTML string
    return jsxString
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .trim();
}

/**
 * Parse JavaScript icon library file
 */
function parseJavaScriptIcons() {
    try {
        const content = fs.readFileSync(JS_ICON_FILE, 'utf8');
        
        // Extract the ICON_LIBRARY object using regex
        const iconLibraryMatch = content.match(/export const ICON_LIBRARY = \{([\s\S]*?)\};/);
        if (!iconLibraryMatch) {
            throw new Error('Could not find ICON_LIBRARY export in JavaScript file');
        }
        
        const iconObjectString = iconLibraryMatch[1];
        const icons = {};
        
        // Parse each icon entry
        const iconMatches = iconObjectString.matchAll(/'([^']+)':\s*(<svg[\s\S]*?<\/svg>),?/g);
        
        for (const match of iconMatches) {
            const iconName = match[1];
            const svgContent = jsxToString(match[2]);
            icons[iconName] = svgContent;
        }
        
        return icons;
    } catch (error) {
        console.error('Error parsing JavaScript icons:', error.message);
        process.exit(1);
    }
}

/**
 * Generate PHP icon library content
 */
function generatePHPContent(icons) {
    const iconEntries = Object.entries(icons)
        .map(([name, svg]) => `        '${name}' => '${svg}'`)
        .join(',\n');
    
    return `<?php

/**
 * PHP Icon Library
 * Maps to components/icon-library.js for consistent icon rendering
 * 
 * AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Run: node scripts/convert-icons.js to regenerate
 */

function pdm_get_icon_svg($icon_name = 'check')
{
    $icons = [
${iconEntries}
    ];

    return isset($icons[$icon_name]) ? $icons[$icon_name] : $icons['check'];
}
`;
}

/**
 * Main conversion function
 */
function convertIcons() {
    console.log('🔄 Converting JavaScript icons to PHP format...');
    
    // Parse JavaScript icons
    const icons = parseJavaScriptIcons();
    const iconCount = Object.keys(icons).length;
    
    console.log(`📊 Found ${iconCount} icons in JavaScript file`);
    
    // Generate PHP content
    const phpContent = generatePHPContent(icons);
    
    // Create backup of existing PHP file
    if (fs.existsSync(PHP_ICON_FILE)) {
        const backupFile = PHP_ICON_FILE + '.backup';
        fs.copyFileSync(PHP_ICON_FILE, backupFile);
        console.log(`💾 Backed up existing PHP file to ${path.basename(backupFile)}`);
    }
    
    // Write new PHP file
    fs.writeFileSync(PHP_ICON_FILE, phpContent, 'utf8');
    
    console.log('✅ Successfully converted icons to PHP format!');
    console.log(`📝 Updated: ${path.basename(PHP_ICON_FILE)}`);
    
    // List all converted icons
    console.log('\n📋 Converted icons:');
    Object.keys(icons).sort().forEach(name => {
        console.log(`   - ${name}`);
    });
}

// Run the conversion
if (require.main === module) {
    convertIcons();
}

module.exports = { convertIcons, parseJavaScriptIcons, generatePHPContent };