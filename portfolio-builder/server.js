#!/usr/bin/env node
const express = require('express');
const multer = require('multer');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const themes = require('./themes');
const { generateHTML } = require('./template');

const app = express();
const PORT = 3000;

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads', Date.now().toString());
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// Serve admin page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Return available themes
app.get('/api/themes', (req, res) => {
  const themeList = Object.entries(themes).map(([key, val]) => ({
    id: key,
    name: val.name,
    primary: val.primary,
    accent: val.accent,
    accentLight: val.accentLight,
    bg: val.bg,
  }));
  res.json(themeList);
});

// Generate portfolio
app.post('/api/generate', upload.any(), (req, res) => {
  try {
    const config = JSON.parse(req.body.config);
    const themeName = config.theme || 'dark-professional';
    const theme = themes[themeName];

    if (!theme) {
      return res.status(400).json({ error: `Unknown theme: ${themeName}` });
    }

    // Map uploaded files to config paths
    const fileMap = {};
    if (req.files) {
      req.files.forEach(f => {
        fileMap[f.fieldname] = f;
      });
    }

    // Build image path mappings
    const imagePaths = {}; // configPath -> actual file path

    // Profile photo
    if (fileMap['profilePhoto']) {
      const f = fileMap['profilePhoto'];
      config.profilePhoto = 'images/profile' + path.extname(f.originalname);
      imagePaths[config.profilePhoto] = f.path;
    }

    // Hero backgrounds
    if (config.heroBackgrounds) {
      config.heroBackgrounds = config.heroBackgrounds.map((bg, i) => {
        const key = `heroBg_${i}`;
        if (fileMap[key]) {
          const f = fileMap[key];
          const p = `images/covers/cover-${i}${path.extname(f.originalname)}`;
          imagePaths[p] = f.path;
          return p;
        }
        return bg;
      }).filter(Boolean);
    }

    // Project images
    if (config.projects) {
      config.projects.forEach((proj, pi) => {
        if (proj.images) {
          proj.images = proj.images.map((img, ii) => {
            const key = `project_${pi}_img_${ii}`;
            if (fileMap[key]) {
              const f = fileMap[key];
              const p = `images/projects/p${pi}-${ii}${path.extname(f.originalname)}`;
              imagePaths[p] = f.path;
              return { src: p, alt: img.alt || '' };
            }
            return img;
          }).filter(img => img && img.src);
        }
      });
    }

    // Generate HTML
    const html = generateHTML(config, theme);

    // Create ZIP in memory
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${slugify(config.name)}-portfolio.zip"`);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.pipe(res);

    // Add index.html
    archive.append(html, { name: 'site/index.html' });

    // Add uploaded images
    Object.entries(imagePaths).forEach(([destPath, srcPath]) => {
      if (fs.existsSync(srcPath)) {
        archive.file(srcPath, { name: `site/${destPath}` });
      }
    });

    // Add resume/CV if uploaded
    if (fileMap['resume']) {
      const f = fileMap['resume'];
      const resumePath = `assets/resume${path.extname(f.originalname)}`;
      archive.file(f.path, { name: `site/${resumePath}` });
      // Update button URL in HTML if needed
    }

    archive.finalize();

    // Clean up uploads after a delay
    setTimeout(() => {
      if (req.files) {
        const dirs = new Set(req.files.map(f => path.dirname(f.path)));
        dirs.forEach(dir => {
          try { fs.rmSync(dir, { recursive: true }); } catch(e) {}
        });
      }
    }, 5000);

  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: err.message });
  }
});

function slugify(str) {
  return (str || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

app.listen(PORT, () => {
  console.log(`\n  🚀 Portfolio Builder is running!`);
  console.log(`  Open in browser: http://localhost:${PORT}\n`);
});
