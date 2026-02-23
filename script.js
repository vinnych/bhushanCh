// ── LANGUAGE COLORS ──
const langColors = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  HTML: '#e34c26',
  CSS: '#264de4',
  Rust: '#ce4a00',
  Go: '#00add8',
  default: '#8b5cf6'
};

// ── LANGUAGE EMOJIS ──
const langEmojis = {
  JavaScript: '⚡',
  TypeScript: '🔷',
  Python: '🐍',
  HTML: '🌐',
  CSS: '🎨',
  Rust: '⚙️',
  Go: '🐹',
  default: '💻'
};

// ── PROJECT DESCRIPTIONS (fallback enhancements) ──
const descFallback = {
  'Bhushan-Chilakapati.github.io': 'My personal GitHub Pages website — the online home for my work and profile.',
};

// ── FETCH GITHUB REPOS ──
async function loadProjects() {
  const grid = document.getElementById('projects-grid');

  try {
    const res = await fetch('https://api.github.com/users/vinnych/repos?sort=updated&per_page=10');
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();

    // Filter out forks, sort by update date, take top 6
    const filtered = repos
      .filter(r => !r.fork)
      .slice(0, 6);

    // Update stat
    const statEl = document.getElementById('stat-repos');
    if (statEl) statEl.textContent = filtered.length;

    grid.innerHTML = '';

    filtered.forEach((repo, i) => {
      const lang = repo.language || 'Code';
      const color = langColors[lang] || langColors.default;
      const emoji = langEmojis[lang] || langEmojis.default;
      const desc = repo.description || descFallback[repo.name] || 'A project by Bhushan Chilakapati.';

      const card = document.createElement('a');
      card.href = repo.html_url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'project-card fade-in';
      card.id = `project-card-${i}`;
      card.style.transitionDelay = `${i * 80}ms`;

      card.innerHTML = `
        <div class="project-top">
          <div class="project-icon">${emoji}</div>
          <div class="project-link-icon" title="View on GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
            </svg>
          </div>
        </div>
        <div class="project-name">${repo.name.replace(/-/g, ' ')}</div>
        <div class="project-desc">${desc}</div>
        <div class="project-meta">
          ${lang !== 'Code' ? `
          <div class="project-lang">
            <div class="lang-dot" style="background:${color}"></div>
            ${lang}
          </div>` : ''}
          ${repo.stargazers_count > 0 ? `
          <div class="project-lang">
            ⭐ ${repo.stargazers_count}
          </div>` : ''}
        </div>
      `;

      grid.appendChild(card);
    });

    // Trigger fade-in for project cards
    requestAnimationFrame(() => {
      document.querySelectorAll('.project-card.fade-in').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 50);
      });
    });

  } catch (err) {
    // Fallback: show static cards
    grid.innerHTML = `
      <a href="https://github.com/vinnych/Gemini-Mindmap-Generator" target="_blank" rel="noopener" class="project-card" id="project-fallback-1">
        <div class="project-top"><div class="project-icon">🤖</div></div>
        <div class="project-name">Gemini Mindmap Generator</div>
        <div class="project-desc">Using Gemini AI, developed a brainstormer which generates mind maps from any idea.</div>
        <div class="project-meta"><div class="project-lang"><div class="lang-dot" style="background:#3178c6"></div>TypeScript</div></div>
      </a>
      <a href="https://github.com/vinnych/RandomPasswordGenerator" target="_blank" rel="noopener" class="project-card" id="project-fallback-2">
        <div class="project-top"><div class="project-icon">🔐</div></div>
        <div class="project-name">Random Password Generator</div>
        <div class="project-desc">Generate strong, unique passwords with a single tap. Secure your digital life.</div>
        <div class="project-meta"><div class="project-lang"><div class="lang-dot" style="background:#f7df1e"></div>JavaScript</div></div>
      </a>
      <a href="https://github.com/vinnych/AI-interface" target="_blank" rel="noopener" class="project-card" id="project-fallback-3">
        <div class="project-top"><div class="project-icon">💡</div></div>
        <div class="project-name">AI Interface</div>
        <div class="project-desc">An AI interface designed to deploy and interact with custom APIs seamlessly.</div>
        <div class="project-meta"><div class="project-lang"><div class="lang-dot" style="background:#f7df1e"></div>JavaScript</div></div>
      </a>
    `;
    console.warn('GitHub API failed, showing static fallback:', err);
  }
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── INTERSECTION OBSERVER (fade-in) ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Add fade-in to sections
document.querySelectorAll('.about-card, .contact-card, .hero-stats, .section-label, .section-title, .about-text p, .about-text .skill-tags').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ── INIT ──
loadProjects();
