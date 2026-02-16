/* ============================================
   Page Template Injection
   Injects shared navbar, sidebar, and footer
   ============================================ */

function getRelativeRoot() {
    // Count depth from pages/ directory
    const path = window.location.pathname;
    const match = path.match(/pages\//);
    if (!match) return '';
    const afterPages = path.split('pages/')[1] || '';
    const depth = afterPages.split('/').length;
    return '../'.repeat(depth);
}

function buildNavbar(root) {
    return `
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="container">
      <a class="navbar-brand" href="${root}index.html">
        <span class="shield-icon" aria-hidden="true">🛡</span>
        SecureVault Docs
      </a>
      <ul class="navbar-menu" role="menubar">
        <li><a href="${root}pages/overview/executive-summary.html">Overview</a></li>
        <li><a href="${root}pages/architecture/overview.html">Architecture</a></li>
        <li><a href="${root}pages/security/overview.html">Security</a></li>
        <li><a href="${root}pages/research/nist-800-53.html">Research</a></li>
        <li><a href="${root}pages/implementation/roadmap.html">Implementation</a></li>
        <li><a href="${root}pages/operations/installation.html">Operations</a></li>
      </ul>
      <div class="navbar-actions">
        <button class="btn-icon search-trigger" onclick="openSearch()" aria-label="Search">🔍 <span>Search</span> <kbd>⌘K</kbd></button>
        <button class="btn-icon" onclick="toggleTheme()" aria-label="Toggle dark mode">🌙</button>
        <button class="btn-icon mobile-menu-toggle" onclick="openMobileNav()" aria-label="Menu">☰</button>
      </div>
    </div>
  </nav>
  <!-- Search -->
  <div class="search-overlay" id="searchOverlay" onclick="if(event.target===this)closeSearch()">
    <div class="search-dialog" role="dialog" aria-label="Search">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" id="searchInput" placeholder="Search documentation..." oninput="handleSearch(this.value)" autocomplete="off">
      </div>
      <div class="search-results" id="searchResults"><div class="search-empty">Type to search documentation...</div></div>
      <div class="search-footer"><span>↵ to select</span><span>esc to close</span></div>
    </div>
  </div>`;
}

function buildSidebar(root, section) {
    const sections = {
        overview: `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Overview</div>
        <a class="sidebar-link" href="${root}pages/overview/executive-summary.html">Executive Summary</a>
        <a class="sidebar-link" href="${root}pages/overview/key-features.html">Key Features</a>
        <a class="sidebar-link" href="${root}pages/overview/compliance.html">Compliance & Standards</a>
        <a class="sidebar-link" href="${root}pages/overview/use-cases.html">Use Cases</a>
      </div>`,
        architecture: `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Architecture</div>
        <a class="sidebar-link" href="${root}pages/architecture/overview.html">System Overview</a>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">C4 Model</div>
        <a class="sidebar-link nested" href="${root}pages/architecture/c4-context.html">Context Diagram</a>
        <a class="sidebar-link nested" href="${root}pages/architecture/c4-container.html">Container Diagram</a>
        <a class="sidebar-link nested" href="${root}pages/architecture/c4-component.html">Component Diagram</a>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Data Flow Diagrams</div>
        <a class="sidebar-link nested" href="${root}pages/architecture/dfd-context.html">Context Level (L0)</a>
        <a class="sidebar-link nested" href="${root}pages/architecture/dfd-level1.html">Level 1 DFD</a>
        <a class="sidebar-link nested" href="${root}pages/architecture/dfd-document.html">Document Mgmt (L2)</a>
        <a class="sidebar-link nested" href="${root}pages/architecture/dfd-encryption.html">Encryption Svc (L2)</a>
        <a class="sidebar-link nested" href="${root}pages/architecture/dfd-audit.html">Audit Service (L2)</a>
        <a class="sidebar-link nested" href="${root}pages/architecture/dfd-auth.html">Auth Service (L2)</a>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Infrastructure</div>
        <a class="sidebar-link" href="${root}pages/architecture/deployment.html">Deployment Architecture</a>
        <a class="sidebar-link" href="${root}pages/architecture/network.html">Network Architecture</a>
        <a class="sidebar-link" href="${root}pages/architecture/tech-stack.html">Technology Stack</a>
      </div>`,
        security: `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Security</div>
        <a class="sidebar-link" href="${root}pages/security/overview.html">Security Overview</a>
        <a class="sidebar-link" href="${root}pages/security/encryption.html">Encryption & Cryptography</a>
        <a class="sidebar-link" href="${root}pages/security/key-management.html">Key Management</a>
        <a class="sidebar-link" href="${root}pages/security/compliance-checklist.html">Compliance Checklist</a>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Access Control</div>
        <a class="sidebar-link nested" href="${root}pages/security/rbac.html">RBAC Hierarchy</a>
        <a class="sidebar-link nested" href="${root}pages/security/permissions.html">Permission Matrix</a>
        <a class="sidebar-link nested" href="${root}pages/security/abac.html">ABAC Policies</a>
        <a class="sidebar-link nested" href="${root}pages/security/classification.html">Document Classification</a>
        <a class="sidebar-link nested" href="${root}pages/security/sharing.html">Sharing & Delegation</a>
        <a class="sidebar-link nested" href="${root}pages/security/auth-flow.html">Authorization Flow</a>
        <a class="sidebar-link nested" href="${root}pages/security/access-denied.html">Access Denied Scenario</a>
        <a class="sidebar-link nested" href="${root}pages/security/emergency-override.html">Emergency Override</a>
      </div>`,
        research: `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Research & Standards</div>
        <a class="sidebar-link" href="${root}pages/research/nist-800-53.html">NIST SP 800-53</a>
        <a class="sidebar-link" href="${root}pages/research/nist-800-171.html">NIST SP 800-171/172</a>
        <a class="sidebar-link" href="${root}pages/research/fips-140-3.html">FIPS 140-3</a>
        <a class="sidebar-link" href="${root}pages/research/zero-trust.html">Zero Trust Architecture</a>
      </div>`,
        implementation: `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Implementation</div>
        <a class="sidebar-link" href="${root}pages/implementation/roadmap.html">Development Roadmap</a>
        <a class="sidebar-link" href="${root}pages/implementation/tech-choices.html">Technology Choices</a>
        <a class="sidebar-link" href="${root}pages/implementation/api.html">API Documentation</a>
        <a class="sidebar-link" href="${root}pages/implementation/database.html">Database Schema</a>
        <a class="sidebar-link" href="${root}pages/implementation/deployment-guide.html">Deployment Guide</a>
      </div>`,
        operations: `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Operations</div>
        <a class="sidebar-link" href="${root}pages/operations/installation.html">Installation Guide</a>
        <a class="sidebar-link" href="${root}pages/operations/configuration.html">Configuration</a>
        <a class="sidebar-link" href="${root}pages/operations/monitoring.html">Monitoring & Alerting</a>
        <a class="sidebar-link" href="${root}pages/operations/backup.html">Backup & Recovery</a>
        <a class="sidebar-link" href="${root}pages/operations/incident-response.html">Incident Response</a>
      </div>`,
        appendix: `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Appendix</div>
        <a class="sidebar-link" href="${root}pages/appendix/glossary.html">Glossary</a>
        <a class="sidebar-link" href="${root}pages/appendix/faq.html">FAQ</a>
        <a class="sidebar-link" href="${root}pages/appendix/references.html">References</a>
      </div>`
    };
    return sections[section] || sections.overview;
}

function buildFooter(root) {
    return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h4>🛡 SecureVault Documentation</h4>
          <p>Comprehensive technical documentation for the Secure Intelligence Document Vault.</p>
        </div>
        <div class="footer-links">
          <h5>Documentation</h5>
          <ul>
            <li><a href="${root}pages/overview/executive-summary.html">Overview</a></li>
            <li><a href="${root}pages/architecture/overview.html">Architecture</a></li>
            <li><a href="${root}pages/security/overview.html">Security</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h5>Resources</h5>
          <ul>
            <li><a href="${root}pages/appendix/glossary.html">Glossary</a></li>
            <li><a href="${root}pages/appendix/faq.html">FAQ</a></li>
            <li><a href="${root}pages/appendix/references.html">References</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h5>Operations</h5>
          <ul>
            <li><a href="${root}pages/operations/installation.html">Installation</a></li>
            <li><a href="${root}pages/operations/monitoring.html">Monitoring</a></li>
            <li><a href="${root}pages/operations/backup.html">Backup</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Secure Intelligence Document Vault</span>
        <span>UNCLASSIFIED // FOUO</span>
      </div>
    </div>
  </footer>`;
}

// Auto-inject layout components
document.addEventListener('DOMContentLoaded', () => {
    const root = getRelativeRoot();
    const section = document.body.getAttribute('data-section') || 'overview';

    // Inject navbar at the top
    const navTarget = document.getElementById('navbar-placeholder');
    if (navTarget) navTarget.outerHTML = buildNavbar(root);

    // Inject sidebar
    const sidebarTarget = document.getElementById('sidebar-placeholder');
    if (sidebarTarget) sidebarTarget.innerHTML = buildSidebar(root, section);

    // Inject footer
    const footerTarget = document.getElementById('footer-placeholder');
    if (footerTarget) footerTarget.outerHTML = buildFooter(root);

    // Highlight active sidebar link
    const path = window.location.pathname;
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkFile = href.split('/').pop();
            const currentFile = path.split('/').pop();
            if (linkFile === currentFile) link.classList.add('active');
        }
    });
});
