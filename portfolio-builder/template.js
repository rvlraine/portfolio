// Portfolio Template System - HTML Generator
// Generates a complete single-file portfolio from config + theme

function generateHTML(config, theme) {
  const title = config.name || 'Portfolio';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)} | Portfolio</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --primary: ${theme.primary};
      --accent: ${theme.accent};
      --accent-light: ${theme.accentLight};
      --bg: ${theme.bg};
      --card-bg: ${theme.cardBg};
      --text: ${theme.text};
      --text-light: ${theme.textLight};
      --border: ${theme.border};
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }

    /* Hero */
    .hero {
      background: var(--primary);
      color: #fff;
      padding: 80px 24px 60px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0;
    }

    @keyframes kenBurnsIn {
      0% { transform: scale(1.0); }
      100% { transform: scale(1.15); }
    }
    @keyframes kenBurnsOut {
      0% { transform: scale(1.15); }
      100% { transform: scale(1.0); }
    }

    .hero-bg img {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 2s ease-in-out;
      transform: scale(1);
      will-change: transform, opacity;
    }

    .hero-bg img.active { opacity: 1; }
    .hero-bg img.zoom-in { animation: kenBurnsIn 5s ease-out forwards; }
    .hero-bg img.zoom-out { animation: kenBurnsOut 5s ease-out forwards; }

    .hero::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: ${theme.heroOverlay};
      z-index: 1;
    }

    .hero-content { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; }

    .profile-photo {
      width: 130px; height: 130px;
      border-radius: 50%;
      border: 4px solid rgba(255,255,255,0.3);
      object-fit: cover;
      margin: 0 auto 20px;
      display: block;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .hero h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .hero .tagline {
      font-size: clamp(0.85rem, 2vw, 1.1rem);
      color: rgba(255,255,255,0.85);
      margin-bottom: 24px;
      font-weight: 300;
      white-space: nowrap;
    }

    .hero .stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
      margin-top: 32px;
    }

    .hero .stat { text-align: center; }
    .hero .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--accent-light); }
    .hero .stat-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; color: #b0b8c8; }

    .contact-bar {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 28px;
    }

    .contact-bar a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 24px;
      border-radius: 50px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { background: var(--accent-light); transform: translateY(-2px); }
    .btn-outline { border: 1.5px solid rgba(255,255,255,0.4); color: #fff; }
    .btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

    /* Section */
    .section { max-width: 1100px; margin: 0 auto; padding: 60px 24px; }
    .section-title { font-size: 1.75rem; font-weight: 700; text-align: center; margin-bottom: 12px; color: var(--primary); }
    .section-subtitle { text-align: center; color: var(--text-light); margin-bottom: 48px; font-size: 1rem; }

    /* Project Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 28px;
    }

    .project-card {
      background: var(--card-bg);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
    }

    /* Image Gallery */
    .card-gallery {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      background: #f0f0f0;
    }

    .card-gallery img {
      width: 100%; height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0; left: 0;
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .card-gallery img.active { opacity: 1; }

    .gallery-dots {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 2;
    }

    .gallery-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      cursor: pointer;
      border: none;
      padding: 0;
      transition: background 0.3s;
    }

    .gallery-dot.active { background: #fff; }

    .gallery-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.35);
      color: #fff;
      border: none;
      width: 32px; height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .card-gallery:hover .gallery-nav { opacity: 1; }

    @media (max-width: 768px) {
      .gallery-nav { opacity: 0.7 !important; width: 28px; height: 28px; font-size: 0.9rem; }
      .lightbox-nav { opacity: 0.8 !important; }
    }

    .gallery-prev { left: 8px; }
    .gallery-next { right: 8px; }

    .card-header { padding: 20px 28px 0; }
    .card-header h3 { font-size: 1.15rem; font-weight: 600; margin-bottom: 6px; color: var(--primary); }
    .card-role { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent); font-weight: 600; margin-bottom: 10px; }
    .card-body { padding: 0 28px 16px; flex: 1; }
    .card-body p { font-size: 0.9rem; color: var(--text-light); line-height: 1.6; }
    .card-footer { padding: 14px 28px; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag { font-size: 0.72rem; padding: 3px 10px; border-radius: 50px; background: ${theme.skillTagBg}; color: ${theme.skillTagColor}; font-weight: 500; }
    .card-date { padding: 0 28px 14px; font-size: 0.76rem; color: var(--text-light); }

    /* Featured card */
    .project-card.featured { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; }
    .project-card.featured .featured-left { display: flex; flex-direction: column; }
    .project-card.featured .card-header { padding: 28px 32px 0; }
    .project-card.featured .card-body { padding: 0 32px 16px; }
    .project-card.featured .card-footer { padding: 14px 32px; }
    .project-card.featured .card-date { padding: 0 32px 16px; }

    .featured-gallery { position: relative; overflow: hidden; min-height: 320px; }
    .featured-gallery img { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; opacity: 0; transition: opacity 0.5s ease; }
    .featured-gallery img.active { opacity: 1; }

    /* Skills */
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
    .skill-category { background: var(--card-bg); border-radius: 12px; padding: 24px; border: 1px solid var(--border); }
    .skill-category h4 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); margin-bottom: 12px; }
    .skill-category ul { list-style: none; }
    .skill-category li { padding: 4px 0; font-size: 0.9rem; color: var(--text-light); }
    .skill-category li::before { content: '\\2022'; color: var(--accent); font-weight: bold; display: inline-block; width: 1em; }

    /* CTA */
    .cta { background: ${theme.ctaGradient}; color: #fff; text-align: center; padding: 60px 24px; }
    .cta h2 { font-size: 1.75rem; margin-bottom: 12px; }
    .cta p { opacity: 0.8; margin-bottom: 28px; max-width: 500px; margin-left: auto; margin-right: auto; }

    .footer { text-align: center; padding: 24px; font-size: 0.8rem; color: var(--text-light); }

    /* Lightbox */
    .lightbox { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.92); z-index: 1000; overflow: auto; -webkit-overflow-scrolling: touch; cursor: zoom-out; }
    .lightbox.open { display: flex; align-items: flex-start; justify-content: center; }
    .lightbox img { max-width: 95%; width: auto; height: auto; margin: 40px auto; display: block; border-radius: 8px; cursor: default; }
    .lightbox-close { position: fixed; top: 20px; right: 24px; background: rgba(0,0,0,0.6); border: none; color: #fff; font-size: 2rem; cursor: pointer; z-index: 1002; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
    .lightbox-nav { position: fixed; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: #fff; font-size: 2.5rem; cursor: pointer; z-index: 1002; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.3s; }
    .lightbox-nav:hover { background: rgba(255,255,255,0.3); }
    .lightbox-prev { left: 16px; }
    .lightbox-next { right: 16px; }
    .lightbox-counter { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.7); font-size: 0.85rem; z-index: 1002; }

    /* Responsive */
    @media (max-width: 768px) {
      .project-card.featured { grid-template-columns: 1fr; }
      .featured-gallery { min-height: 220px; }
      .projects-grid { grid-template-columns: 1fr; }
      .hero .stats { gap: 24px; }
    }
  </style>
</head>
<body>

  <!-- Hero -->
  <header class="hero">
${buildHeroBackgrounds(config.heroBackgrounds)}
    <div class="hero-content">
${config.profilePhoto ? `      <img src="${escHtml(config.profilePhoto)}" alt="${escHtml(config.name)}" class="profile-photo">` : ''}
      <h1>${escHtml(config.name)}</h1>
${config.tagline ? `      <p class="tagline">${escHtml(config.tagline)}</p>` : ''}
${buildStats(config.stats)}
${buildContactBar(config.buttons)}
    </div>
  </header>

${buildPortfolioSection(config)}
${buildSkillsSection(config.skills)}
${buildCTA(config.cta)}

  <footer class="footer">
    &copy; ${new Date().getFullYear()} ${escHtml(config.footer || config.name)} &mdash; All Rights Reserved
  </footer>

  <!-- Lightbox -->
  <div class="lightbox" id="lightbox" onclick="if(event.target===this)closeLightbox()">
    <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
    <button class="lightbox-nav lightbox-prev" onclick="event.stopPropagation();navLightbox(-1)">&#8249;</button>
    <img id="lightbox-img" src="" alt="Full size preview" onclick="event.stopPropagation()">
    <button class="lightbox-nav lightbox-next" onclick="event.stopPropagation();navLightbox(1)">&#8250;</button>
    <div class="lightbox-counter" id="lightbox-counter"></div>
  </div>

  <script>
    // Initialize galleries
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
      const imgs = gallery.querySelectorAll('img');
      const dotsContainer = gallery.querySelector('.gallery-dots');
      if (!dotsContainer || imgs.length <= 1) return;
      imgs.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.onclick = (e) => { e.stopPropagation(); goToSlide(gallery, i); };
        dotsContainer.appendChild(dot);
      });
    });

    function goToSlide(gallery, index) {
      const imgs = gallery.querySelectorAll('img');
      const dots = gallery.querySelectorAll('.gallery-dot');
      imgs.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      imgs[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    }

    function navGallery(btn, dir) {
      event.stopPropagation();
      const gallery = btn.closest('[data-gallery]');
      const imgs = gallery.querySelectorAll('img');
      const current = Array.from(imgs).findIndex(img => img.classList.contains('active'));
      let next = current + dir;
      if (next < 0) next = imgs.length - 1;
      if (next >= imgs.length) next = 0;
      goToSlide(gallery, next);
    }

    // Lightbox
    let lbImages = [];
    let lbIndex = 0;

    function openLightbox(src) {
      event.stopPropagation();
      const clickedImg = event.target;
      const gallery = clickedImg.closest('[data-gallery]');
      if (gallery) {
        lbImages = Array.from(gallery.querySelectorAll('img')).map(img => img.src);
        lbIndex = lbImages.indexOf(src);
        if (lbIndex === -1) lbIndex = 0;
      } else {
        lbImages = [src];
        lbIndex = 0;
      }
      showLightboxImage();
      document.getElementById('lightbox').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function showLightboxImage() {
      document.getElementById('lightbox-img').src = lbImages[lbIndex];
      document.getElementById('lightbox-counter').textContent = (lbIndex + 1) + ' / ' + lbImages.length;
      document.getElementById('lightbox').scrollTop = 0;
    }

    function navLightbox(dir) {
      lbIndex += dir;
      if (lbIndex < 0) lbIndex = lbImages.length - 1;
      if (lbIndex >= lbImages.length) lbIndex = 0;
      showLightboxImage();
    }

    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('open');
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', e => {
      const lb = document.getElementById('lightbox');
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); navLightbox(1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); navLightbox(-1); }
    });

    // Touch swipe for card galleries
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
      let startX = 0, startY = 0;
      gallery.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
      gallery.addEventListener('touchend', e => {
        const distX = e.changedTouches[0].clientX - startX;
        const distY = e.changedTouches[0].clientY - startY;
        if (Math.abs(distX) > 40 && Math.abs(distX) > Math.abs(distY)) {
          const imgs = gallery.querySelectorAll('img');
          const current = Array.from(imgs).findIndex(img => img.classList.contains('active'));
          let next = distX < 0 ? current + 1 : current - 1;
          if (next < 0) next = imgs.length - 1;
          if (next >= imgs.length) next = 0;
          goToSlide(gallery, next);
        }
      }, { passive: true });
    });

    // Touch swipe for lightbox
    (function() {
      const lb = document.getElementById('lightbox');
      let startX = 0;
      lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', e => {
        const distX = e.changedTouches[0].clientX - startX;
        if (Math.abs(distX) > 50) navLightbox(distX < 0 ? 1 : -1);
      }, { passive: true });
    })();

    // Hero background slideshow with Ken Burns
    (function() {
      const bgImgs = document.querySelectorAll('.hero-bg img');
      if (bgImgs.length <= 1) return;
      let current = 0;
      let zoomIn = true;
      bgImgs[0].classList.add('zoom-in');
      setInterval(() => {
        const prev = current;
        current = (current + 1) % bgImgs.length;
        zoomIn = !zoomIn;
        bgImgs[current].classList.add(zoomIn ? 'zoom-in' : 'zoom-out');
        bgImgs[current].classList.add('active');
        bgImgs[prev].classList.remove('active');
        setTimeout(() => { bgImgs[prev].classList.remove('zoom-in', 'zoom-out'); }, 2000);
      }, 5000);
    })();
  </script>

</body>
</html>`;
}

// --- Helper functions ---

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildHeroBackgrounds(backgrounds) {
  if (!backgrounds || backgrounds.length === 0) return '';
  const imgs = backgrounds.map((src, i) =>
    `      <img src="${escHtml(src)}" alt=""${i === 0 ? ' class="active"' : ''}>`
  ).join('\n');
  return `    <div class="hero-bg">\n${imgs}\n    </div>`;
}

function buildStats(stats) {
  if (!stats || stats.length === 0) return '';
  const items = stats.map(s =>
    `        <div class="stat">
          <div class="stat-value">${escHtml(s.value)}</div>
          <div class="stat-label">${escHtml(s.label)}</div>
        </div>`
  ).join('\n');
  return `      <div class="stats">\n${items}\n      </div>`;
}

function buildContactBar(buttons) {
  if (!buttons || buttons.length === 0) return '';
  const items = buttons.map(b => {
    const cls = b.style === 'primary' ? 'btn-primary' : 'btn-outline';
    const dl = b.download ? ' download' : '';
    const target = b.target ? ` target="${escHtml(b.target)}"` : '';
    const emoji = b.emoji ? `${b.emoji} ` : '';
    return `        <a href="${escHtml(b.url)}" class="${cls}"${target}${dl}>${emoji}${escHtml(b.label)}</a>`;
  }).join('\n');
  return `      <div class="contact-bar">\n${items}\n      </div>`;
}

function buildPortfolioSection(config) {
  const projects = config.projects;
  if (!projects || projects.length === 0) return '';

  const sectionTitle = config.portfolioTitle || 'Portfolio';
  const sectionSub = config.portfolioSubtitle || 'A selection of my best work';

  const cards = projects.map(p => p.featured ? buildFeaturedCard(p) : buildRegularCard(p)).join('\n\n');

  return `
  <!-- Portfolio -->
  <section class="section">
    <h2 class="section-title">${escHtml(sectionTitle)}</h2>
    <p class="section-subtitle">${escHtml(sectionSub)}</p>
    <div class="projects-grid">
${cards}
    </div>
  </section>`;
}

function buildGalleryImages(images) {
  if (!images || images.length === 0) return '';
  return images.map((img, i) =>
    `          <img src="${escHtml(img.src)}" alt="${escHtml(img.alt || '')}"${i === 0 ? ' class="active"' : ''} onclick="openLightbox(this.src)">`
  ).join('\n');
}

function buildGalleryNav(images) {
  if (!images || images.length <= 1) return '';
  return `          <div class="gallery-dots"></div>
          <button class="gallery-nav gallery-prev" onclick="navGallery(this,-1)">&#8249;</button>
          <button class="gallery-nav gallery-next" onclick="navGallery(this,1)">&#8250;</button>`;
}

function buildSkillTags(skills) {
  if (!skills || skills.length === 0) return '';
  return skills.map(s => `          <span class="skill-tag">${escHtml(s)}</span>`).join('\n');
}

function buildFeaturedCard(p) {
  return `      <article class="project-card featured">
        <div class="featured-left">
          <div class="card-header">
            <div class="card-role">${escHtml(p.role || '')}</div>
            <h3>${escHtml(p.title)}</h3>
          </div>
          <div class="card-body">
            <p>${escHtml(p.description || '')}</p>
          </div>
          <div class="card-footer">
${buildSkillTags(p.skills)}
          </div>
${p.date ? `          <div class="card-date">${escHtml(p.date)}</div>` : ''}
        </div>
        <div class="featured-gallery" data-gallery>
${buildGalleryImages(p.images)}
${buildGalleryNav(p.images)}
        </div>
      </article>`;
}

function buildRegularCard(p) {
  return `      <article class="project-card">
        <div class="card-gallery" data-gallery>
${buildGalleryImages(p.images)}
${buildGalleryNav(p.images)}
        </div>
        <div class="card-header">
          <div class="card-role">${escHtml(p.role || '')}</div>
          <h3>${escHtml(p.title)}</h3>
        </div>
        <div class="card-body">
          <p>${escHtml(p.description || '')}</p>
        </div>
        <div class="card-footer">
${buildSkillTags(p.skills)}
        </div>
${p.date ? `        <div class="card-date">${escHtml(p.date)}</div>` : ''}
      </article>`;
}

function buildSkillsSection(skills) {
  if (!skills || skills.length === 0) return '';

  const cats = skills.map(cat => {
    const items = cat.items.map(item => `            <li>${escHtml(item)}</li>`).join('\n');
    return `        <div class="skill-category">
          <h4>${escHtml(cat.name)}</h4>
          <ul>
${items}
          </ul>
        </div>`;
  }).join('\n');

  return `
  <!-- Skills -->
  <section class="section" style="background:#fff; padding-top:40px; padding-bottom:40px; max-width:100%;">
    <div style="max-width:1100px; margin:0 auto; padding:0 24px;">
      <h2 class="section-title">Skills & Tools</h2>
      <p class="section-subtitle">Technologies and expertise</p>
      <div class="skills-grid">
${cats}
      </div>
    </div>
  </section>`;
}

function buildCTA(cta) {
  if (!cta) return '';
  return `
  <!-- CTA -->
  <section class="cta">
    <h2>${escHtml(cta.heading || "Let's Work Together")}</h2>
    <p>${escHtml(cta.text || '')}</p>
    <a href="${escHtml(cta.buttonUrl || '#')}" class="btn-primary" target="_blank" style="display:inline-flex;">${escHtml(cta.buttonLabel || 'Get in Touch')}</a>
  </section>`;
}

module.exports = { generateHTML };
