#!/usr/bin/env node
// Portfolio Builder - CLI Build Script
// Usage: node build.js path/to/config.json

const fs = require('fs');
const path = require('path');
const themes = require('./themes');
const { generateHTML } = require('./template');

// --- CLI ---
const configPath = process.argv[2];

if (!configPath) {
  console.log(`
  Portfolio Builder
  =================
  Usage: node build.js <config.json>

  Example: node build.js clients/jane-doe/config.json

  Available themes: ${Object.keys(themes).join(', ')}
  `);
  process.exit(0);
}

// --- Read config ---
const absConfigPath = path.resolve(configPath);
if (!fs.existsSync(absConfigPath)) {
  console.error(`Error: Config file not found: ${absConfigPath}`);
  process.exit(1);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(absConfigPath, 'utf8'));
} catch (e) {
  console.error(`Error: Invalid JSON in ${absConfigPath}\n${e.message}`);
  process.exit(1);
}

// --- Validate ---
if (!config.name) {
  console.error('Error: "name" is required in config');
  process.exit(1);
}

if (!config.projects || config.projects.length === 0) {
  console.warn('Warning: No projects defined. Portfolio section will be empty.');
}

// --- Theme ---
const themeName = config.theme || 'dark-professional';
const theme = themes[themeName];
if (!theme) {
  console.error(`Error: Unknown theme "${themeName}". Available: ${Object.keys(themes).join(', ')}`);
  process.exit(1);
}

console.log(`\n  Building portfolio for: ${config.name}`);
console.log(`  Theme: ${theme.name} (${themeName})`);

// --- Output directory ---
const configDir = path.dirname(absConfigPath);
const outputDir = path.join(configDir, 'site');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// --- Generate HTML ---
const html = generateHTML(config, theme);
const outputHtml = path.join(outputDir, 'index.html');
fs.writeFileSync(outputHtml, html, 'utf8');
console.log(`  Generated: ${outputHtml}`);

// --- Copy local images ---
function collectLocalPaths(config) {
  const paths = new Set();

  if (config.profilePhoto && !config.profilePhoto.startsWith('http')) {
    paths.add(config.profilePhoto);
  }

  if (config.heroBackgrounds) {
    config.heroBackgrounds.forEach(src => {
      if (!src.startsWith('http')) paths.add(src);
    });
  }

  if (config.projects) {
    config.projects.forEach(p => {
      if (p.images) {
        p.images.forEach(img => {
          if (!img.src.startsWith('http')) paths.add(img.src);
        });
      }
    });
  }

  // Check for downloadable assets (CV/resume)
  if (config.buttons) {
    config.buttons.forEach(b => {
      if (b.download && b.url && !b.url.startsWith('http')) {
        paths.add(b.url);
      }
    });
  }

  return paths;
}

const localPaths = collectLocalPaths(config);
let copied = 0;

localPaths.forEach(relPath => {
  const srcFile = path.join(configDir, relPath);
  const destFile = path.join(outputDir, relPath);

  if (!fs.existsSync(srcFile)) {
    console.warn(`  Warning: File not found: ${srcFile}`);
    return;
  }

  const destDir = path.dirname(destFile);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(srcFile, destFile);
  copied++;
});

console.log(`  Copied ${copied} local file(s)`);

// --- Done ---
console.log(`
  ✅ Portfolio built successfully!
  Output: ${outputDir}/

  Deploy options:
  1. Drag the "site" folder to https://app.netlify.com/drop
  2. Push to GitHub Pages
  3. Upload to any static hosting

`);
