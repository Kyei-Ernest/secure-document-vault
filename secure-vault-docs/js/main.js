/* ============================================
   SECURE VAULT DOCS - Main JavaScript
   ============================================ */

// ---- Theme Toggle ----
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
initTheme();

// ---- Search ----
const searchIndex = [
  { title: 'Executive Summary', section: 'Overview', url: 'pages/overview/executive-summary.html', desc: 'System overview, key capabilities, and value proposition' },
  { title: 'Key Features', section: 'Overview', url: 'pages/overview/key-features.html', desc: 'Military-grade encryption, RBAC, audit logs, and more' },
  { title: 'Compliance & Standards', section: 'Overview', url: 'pages/overview/compliance.html', desc: 'NIST, FIPS, SOC 2, ISO 27001 compliance overview' },
  { title: 'Use Cases', section: 'Overview', url: 'pages/overview/use-cases.html', desc: 'Intelligence agencies, defense contractors, government agencies' },
  { title: 'System Architecture Overview', section: 'Architecture', url: 'pages/architecture/overview.html', desc: 'High-level system architecture and design principles' },
  { title: 'C4 Context Diagram', section: 'Architecture', url: 'pages/architecture/c4-context.html', desc: 'System context showing external actors and boundaries' },
  { title: 'C4 Container Diagram', section: 'Architecture', url: 'pages/architecture/c4-container.html', desc: 'Container-level view of runtime services' },
  { title: 'C4 Component Diagram', section: 'Architecture', url: 'pages/architecture/c4-component.html', desc: 'Component-level detail of the Document Service' },
  { title: 'Context Level DFD (Level 0)', section: 'Architecture', url: 'pages/architecture/dfd-context.html', desc: 'Top-level data flow through the system' },
  { title: 'Level 1 DFD', section: 'Architecture', url: 'pages/architecture/dfd-level1.html', desc: 'Major process and data store interactions' },
  { title: 'Document Management DFD (Level 2)', section: 'Architecture', url: 'pages/architecture/dfd-document.html', desc: 'Detailed document management data flows' },
  { title: 'Encryption Service DFD (Level 2)', section: 'Architecture', url: 'pages/architecture/dfd-encryption.html', desc: 'Encryption/decryption service data flows' },
  { title: 'Audit Service DFD (Level 2)', section: 'Architecture', url: 'pages/architecture/dfd-audit.html', desc: 'Audit and logging service data flows' },
  { title: 'Authentication Service DFD (Level 2)', section: 'Architecture', url: 'pages/architecture/dfd-auth.html', desc: 'Authentication and authorization data flows' },
  { title: 'Deployment Architecture', section: 'Architecture', url: 'pages/architecture/deployment.html', desc: 'Production deployment with multi-AZ setup' },
  { title: 'Network Architecture', section: 'Architecture', url: 'pages/architecture/network.html', desc: 'Security zones, firewall rules, and network topology' },
  { title: 'Technology Stack', section: 'Architecture', url: 'pages/architecture/tech-stack.html', desc: 'Detailed technology choices and rationale' },
  { title: 'Security Overview', section: 'Security', url: 'pages/security/overview.html', desc: 'Security principles and defense-in-depth design' },
  { title: 'RBAC Hierarchy', section: 'Security', url: 'pages/security/rbac.html', desc: 'Role-based access control hierarchy and permissions' },
  { title: 'Permission Matrix', section: 'Security', url: 'pages/security/permissions.html', desc: 'Detailed permission matrix for all roles' },
  { title: 'ABAC Policies', section: 'Security', url: 'pages/security/abac.html', desc: 'Attribute-based access control policies' },
  { title: 'Document Classification', section: 'Security', url: 'pages/security/classification.html', desc: 'Document classification levels and clearance tiers' },
  { title: 'Sharing & Delegation', section: 'Security', url: 'pages/security/sharing.html', desc: 'Document sharing and delegation workflows' },
  { title: 'Authorization Flow', section: 'Security', url: 'pages/security/auth-flow.html', desc: 'Complete RBAC + ABAC authorization flow' },
  { title: 'Access Denied Scenario', section: 'Security', url: 'pages/security/access-denied.html', desc: 'Early RBAC rejection and insufficient role handling' },
  { title: 'Emergency Override', section: 'Security', url: 'pages/security/emergency-override.html', desc: 'Emergency access override procedures' },
  { title: 'Encryption & Cryptography', section: 'Security', url: 'pages/security/encryption.html', desc: 'AES-256-GCM encryption, TLS 1.3, and cryptographic standards' },
  { title: 'Key Management', section: 'Security', url: 'pages/security/key-management.html', desc: 'Key hierarchy, rotation, HSM integration' },
  { title: 'Compliance Checklist', section: 'Security', url: 'pages/security/compliance-checklist.html', desc: 'Interactive NIST SP 800-171 compliance checklist' },
  { title: 'NIST SP 800-53 Compliance', section: 'Research', url: 'pages/research/nist-800-53.html', desc: 'Security and privacy controls for federal systems' },
  { title: 'NIST SP 800-171/172', section: 'Research', url: 'pages/research/nist-800-171.html', desc: 'CUI protection requirements' },
  { title: 'FIPS 140-3 Cryptography', section: 'Research', url: 'pages/research/fips-140-3.html', desc: 'Cryptographic module validation standards' },
  { title: 'Zero Trust Architecture', section: 'Research', url: 'pages/research/zero-trust.html', desc: 'Zero trust principles and implementation' },
  { title: 'Development Roadmap', section: 'Implementation', url: 'pages/implementation/roadmap.html', desc: '24-week phased development plan' },
  { title: 'Technology Choices', section: 'Implementation', url: 'pages/implementation/tech-choices.html', desc: 'Technology selection rationale' },
  { title: 'API Documentation', section: 'Implementation', url: 'pages/implementation/api.html', desc: 'RESTful API reference and examples' },
  { title: 'Database Schema', section: 'Implementation', url: 'pages/implementation/database.html', desc: 'PostgreSQL schema with RLS and encryption' },
  { title: 'Deployment Guide', section: 'Implementation', url: 'pages/implementation/deployment-guide.html', desc: 'Step-by-step production deployment' },
  { title: 'Installation Guide', section: 'Operations', url: 'pages/operations/installation.html', desc: 'System prerequisites and installation steps' },
  { title: 'Configuration', section: 'Operations', url: 'pages/operations/configuration.html', desc: 'Configuration options and environment variables' },
  { title: 'Monitoring & Alerting', section: 'Operations', url: 'pages/operations/monitoring.html', desc: 'Prometheus, Grafana, and alerting setup' },
  { title: 'Backup & Recovery', section: 'Operations', url: 'pages/operations/backup.html', desc: 'Backup strategies and disaster recovery' },
  { title: 'Incident Response', section: 'Operations', url: 'pages/operations/incident-response.html', desc: 'Incident handling and response procedures' },
  { title: 'Glossary', section: 'Appendix', url: 'pages/appendix/glossary.html', desc: 'Security and technical terms glossary' },
  { title: 'FAQ', section: 'Appendix', url: 'pages/appendix/faq.html', desc: 'Frequently asked questions' },
  { title: 'References', section: 'Appendix', url: 'pages/appendix/references.html', desc: 'Standards, publications, and resources' },
];

function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
  }
}
function closeSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('active');
}
function handleSearch(query) {
  const resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;
  if (!query.trim()) {
    resultsEl.innerHTML = '<div class="search-empty">Type to search documentation...</div>';
    return;
  }
  const q = query.toLowerCase();
  const results = searchIndex.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q) ||
    item.section.toLowerCase().includes(q)
  );
  if (!results.length) {
    resultsEl.innerHTML = '<div class="search-empty">No results found</div>';
    return;
  }
  // Resolve URLs relative to current page
  const basePath = getBasePath();
  resultsEl.innerHTML = results.slice(0, 10).map(r => `
    <a class="search-result-item" href="${basePath}${r.url}">
      <div class="result-title">${r.title}</div>
      <div class="result-section">${r.section}</div>
      <div class="result-desc">${r.desc}</div>
    </a>
  `).join('');
}

// Determine base path from current page location
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/pages/')) {
    // We're in a subpage — count depth
    const parts = path.split('/pages/')[1]?.split('/') || [];
    const depth = parts.length; // e.g. architecture/overview.html = 2
    return '../'.repeat(depth);
  }
  return '';
}

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape') closeSearch();
});

// ---- Diagram Viewer ----
function initDiagramViewers() {
  document.querySelectorAll('.diagram-container').forEach(container => {
    const viewport = container.querySelector('.diagram-viewport');
    const img = viewport?.querySelector('img');
    if (!img) return;
    let scale = 1;

    container.querySelector('.zoom-in')?.addEventListener('click', () => {
      scale = Math.min(scale + 0.25, 3);
      img.style.transform = `scale(${scale})`;
    });
    container.querySelector('.zoom-out')?.addEventListener('click', () => {
      scale = Math.max(scale - 0.25, 0.5);
      img.style.transform = `scale(${scale})`;
    });
    container.querySelector('.zoom-reset')?.addEventListener('click', () => {
      scale = 1;
      img.style.transform = 'scale(1)';
    });
    container.querySelector('.zoom-fullscreen')?.addEventListener('click', () => {
      openFullscreen(img.src, img.alt);
    });

    // Click image to fullscreen
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openFullscreen(img.src, img.alt));
  });
}

// ---- Image Viewer (Lightbox) ----
const ImageViewer = {
  active: false,
  currentIndex: 0,
  images: [], // Array of {src, alt, originalEl}

  init() {
    // Collect all zoomable images
    const contentImages = Array.from(document.querySelectorAll('.doc-content img:not(.no-zoom)'));

    // Also include diagram images if they aren't duplicates (diagram viewers might duplicate logic, 
    // but here we just want a master list for the gallery if desired. 
    // Actually, let's keep it simple: content images are part of the gallery.)
    this.images = contentImages.map(img => ({
      src: img.src,
      alt: img.alt,
      originalEl: img
    }));

    // Attach click listeners
    this.images.forEach((imgObj, index) => {
      imgObj.originalEl.addEventListener('click', (e) => {
        // If inside a diagram viewer, the "fullscreen" button might handle it, 
        // but the image itself also clicks. Let's handle it here.
        e.stopPropagation();
        this.open(index);
      });
    });

    // Create DOM elements if they don't exist
    if (!document.getElementById('imageViewer')) {
      const viewer = document.createElement('div');
      viewer.id = 'imageViewer';
      viewer.className = 'image-viewer';
      viewer.innerHTML = `
        <div class="image-viewer-close" onclick="ImageViewer.close()">✕</div>
        <div class="image-viewer-nav image-viewer-prev" onclick="ImageViewer.prev()">‹</div>
        <div class="image-viewer-nav image-viewer-next" onclick="ImageViewer.next()">›</div>
        <div class="image-viewer-content">
          <img class="image-viewer-img" src="" alt="">
          <div class="image-viewer-caption"></div>
        </div>
      `;
      viewer.addEventListener('click', (e) => {
        if (e.target === viewer || e.target.classList.contains('image-viewer-content')) {
          this.close();
        }
      });
      document.body.appendChild(viewer);

      // Keyboard support
      document.addEventListener('keydown', (e) => {
        if (!this.active) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }
  },

  open(index) {
    if (index < 0 || index >= this.images.length) return;
    this.currentIndex = index;
    this.active = true;

    const viewer = document.getElementById('imageViewer');
    const imgEl = viewer.querySelector('.image-viewer-img');
    const captionEl = viewer.querySelector('.image-viewer-caption');
    const data = this.images[index];

    imgEl.src = data.src;
    imgEl.alt = data.alt;
    captionEl.textContent = data.alt || '';

    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateNav();
  },

  close() {
    this.active = false;
    const viewer = document.getElementById('imageViewer');
    viewer.classList.remove('active');
    document.body.style.overflow = '';
  },

  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.open(this.currentIndex + 1);
    }
  },

  prev() {
    if (this.currentIndex > 0) {
      this.open(this.currentIndex - 1);
    }
  },

  updateNav() {
    const viewer = document.getElementById('imageViewer');
    const prevBtn = viewer.querySelector('.image-viewer-prev');
    const nextBtn = viewer.querySelector('.image-viewer-next');

    // Hide/show arrows based on index
    prevBtn.style.display = this.currentIndex > 0 ? 'flex' : 'none';
    nextBtn.style.display = this.currentIndex < this.images.length - 1 ? 'flex' : 'none';
  }
};

// Global function for the diagram toolbar "Fullscreen" button to use
function openFullscreen(src, alt) {
  // Find index of this image in the pool if possible
  const index = ImageViewer.images.findIndex(img => img.src === src);
  if (index !== -1) {
    ImageViewer.open(index);
  } else {
    // If not in the list (e.g. dynamically changed), just append and open? 
    // Or fallback to ad-hoc open. Let's fallback to ad-hoc opening using the same viewer.
    // We treat it as a standalone image (no gallery nav).
    ImageViewer.active = true;
    const viewer = document.getElementById('imageViewer');
    const imgEl = viewer.querySelector('.image-viewer-img');
    const captionEl = viewer.querySelector('.image-viewer-caption');

    imgEl.src = src;
    imgEl.alt = alt || '';
    captionEl.textContent = alt || '';

    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hide nav buttons
    viewer.querySelector('.image-viewer-prev').style.display = 'none';
    viewer.querySelector('.image-viewer-next').style.display = 'none';
  }
}

// ---- Scroll Spy (TOC) ----
function initScrollSpy() {
  const tocLinks = document.querySelectorAll('.toc-link');
  if (!tocLinks.length) return;
  const headings = [];
  tocLinks.forEach(link => {
    const id = link.getAttribute('href')?.split('#')[1];
    if (id) {
      const el = document.getElementById(id);
      if (el) headings.push({ el, link });
    }
  });
  if (!headings.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const active = headings.find(h => h.el === entry.target);
        if (active) active.link.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -70% 0px' });

  headings.forEach(({ el }) => observer.observe(el));
}

// ---- Copy Code Buttons ----
function initCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code')?.textContent || pre.textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      });
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

// ---- Mobile Navigation ----
function openMobileNav() {
  document.getElementById('mobileNavOverlay')?.classList.add('active');
  document.getElementById('mobileNavPanel')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  document.getElementById('mobileNavOverlay')?.classList.remove('active');
  document.getElementById('mobileNavPanel')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ---- Active Sidebar Link ----
function highlightActiveSidebar() {
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.endsWith(href.replace(/^\.\.\//, '').replace(/^\.\//, ''))) {
      link.classList.add('active');
    }
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initDiagramViewers();
  ImageViewer.init();
  initScrollSpy();
  initCopyButtons();
  highlightActiveSidebar();
});
