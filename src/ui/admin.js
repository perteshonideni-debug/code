import { authService } from '../services/auth.js';
import { chapterFlows } from '../data/chapter-flows.js';
import { emailSimulator } from '../data/workshops/email-simulator.js';
import { curriculum } from '../data/curriculum.js';

const app = document.querySelector('#app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

function adminHeader(user) {
  return `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="#/">
          <span class="brand-mark">&lt;/&gt;</span>CodePath <span class="badge-admin-label">Admin Console</span>
        </a>
        <nav class="nav-links" aria-label="Primary">
          <a href="#/admin" class="active">Përmbajtja</a>
          <a href="#/dashboard">Paneli Nxënësit</a>
          <a href="#/courses">Kurset</a>
        </nav>
        <div class="nav-actions">
          <span class="badge-role">Admin: ${esc(user?.fullName || 'Admin')}</span>
          <button class="button button-quiet theme-toggle" type="button" data-theme-toggle>◐ Theme</button>
          <a href="#/dashboard" class="button button-secondary">Kthehu te Paneli</a>
        </div>
      </div>
    </header>
  `;
}

function adminFooter() {
  return `<footer class="footer"><div class="container footer-inner"><span>© 2026 CodePath Admin</span><span>Menaxhimi i Kurrikulës dhe Përmbajtjes Arsimore</span></div></footer>`;
}

export function renderAdmin() {
  const user = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();

  if (!isAdmin) {
    app.innerHTML = `
      <header class="site-header">
        <div class="container nav">
          <a class="brand" href="#/"><span class="brand-mark">&lt;/&gt;</span>CodePath</a>
          <div class="nav-actions"><a href="#/dashboard" class="button button-secondary">Paneli Im</a></div>
        </div>
      </header>
      <main class="section">
        <div class="container" style="max-width: 640px; text-align: center;">
          <p class="eyebrow">Akses i Kufizuar</p>
          <h1 class="editorial">Kërkohen të drejta Administratori</h1>
          <p class="hero-copy">Zona e administrimit është e rezervuar për instruktorët dhe stafin arsimor të CodePath.</p>
          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
            <button type="button" class="button button-primary" id="activate-admin-btn">
              ⚡ Aktivizo Rolin Admin për Testim
            </button>
            <a href="#/dashboard" class="button button-secondary">Kthehu te Paneli</a>
          </div>
        </div>
      </main>
      ${adminFooter()}
    `;

    document.querySelector('#activate-admin-btn')?.addEventListener('click', () => {
      authService.setDemoUser('admin');
      renderAdmin();
    });
    return;
  }

  const allLessons = chapterFlows.flatMap(c => c.lessons);
  const totalTasks = chapterFlows.reduce((acc, c) => acc + (c.tasks?.length || 0), 0);
  const totalWorkshopSteps = emailSimulator.steps.length;

  app.innerHTML = `
    ${adminHeader(user)}
    <main class="admin-shell">
      <div class="container">
        
        <div class="admin-title-row">
          <div>
            <p class="eyebrow">Paneli Qendror i Kurrikulës</p>
            <h1>Menaxhimi i Përmbajtjes</h1>
            <p class="admin-sub">Shiko, modifiko dhe publiko kapitujt, mësimet dhe hapat e workshop-it.</p>
          </div>
          <button class="button button-primary" id="btn-add-content">+ Shto Përmbajtje të Re</button>
        </div>

        <!-- Metric Cards -->
        <div class="admin-metrics-grid">
          <div class="admin-metric-card">
            <span>Kurse Aktive</span>
            <strong>1</strong>
            <small>Python Fundamentals</small>
          </div>
          <div class="admin-metric-card">
            <span>Kapituj të Strukturuar</span>
            <strong>${chapterFlows.length}</strong>
            <small>Versioni 2 (Shqip)</small>
          </div>
          <div class="admin-metric-card">
            <span>Mësime Interaktive</span>
            <strong>${allLessons.length}</strong>
            <small>Me shpjegime dhe kuize</small>
          </div>
          <div class="admin-metric-card">
            <span>Ushtrime me Teste</span>
            <strong>${totalTasks}</strong>
            <small>Vlerësim i menjëhershëm</small>
          </div>
          <div class="admin-metric-card">
            <span>Hapa të Workshop-it</span>
            <strong>${totalWorkshopSteps}</strong>
            <small>Email Simulator</small>
          </div>
        </div>

        <!-- Content Tables -->
        <section class="admin-section">
          <div class="section-head-row">
            <h2>Kapitujt e Kurrikulës</h2>
            <span class="badge-subtle">Statusi: Të gjithë të publikuar</span>
          </div>

          <div class="table-scroll">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nr.</th>
                  <th>Titulli i Kapitullit</th>
                  <th>Moduli</th>
                  <th>Mësime</th>
                  <th>Ushtrime</th>
                  <th>Statusi</th>
                  <th>Veprime</th>
                </tr>
              </thead>
              <tbody>
                ${chapterFlows.map((c, i) => `
                  <tr>
                    <td><b>${String(i + 1).padStart(2, '0')}</b></td>
                    <td><strong>${esc(c.title)}</strong></td>
                    <td>${esc(c.moduleTitle)}</td>
                    <td>${c.lessons.length} mësime</td>
                    <td>${c.tasks.length} ushtrime</td>
                    <td><span class="tag-published">● Publikuar</span></td>
                    <td>
                      <a href="#/chapter/${c.id}" class="button button-quiet button-small" target="_blank">Shiko →</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Workshop Steps Inspector -->
        <section class="admin-section">
          <div class="section-head-row">
            <h2>Hapat e Workshop-it: Email Simulator</h2>
            <span class="badge-subtle">${emailSimulator.steps.length} Hapa të Konfiguruar</span>
          </div>

          <div class="table-scroll">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Hapi</th>
                  <th>Titulli</th>
                  <th>Udhëzimi</th>
                  <th>Kushtet e Testimit</th>
                  <th>Veprime</th>
                </tr>
              </thead>
              <tbody>
                ${emailSimulator.steps.map((s, idx) => `
                  <tr>
                    <td><b>${idx + 1}</b></td>
                    <td><strong>${esc(s.title)}</strong></td>
                    <td class="table-copy-cell">${esc(s.instructions.slice(0, 80))}...</td>
                    <td>${s.checks?.length || 0} teste automatike</td>
                    <td>
                      <a href="#/workshop/email-simulator" class="button button-quiet button-small">Testo</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
    ${adminFooter()}
  `;

  document.querySelector('#btn-add-content')?.addEventListener('click', () => {
    alert('Funksioni i krijimit të mësimeve është gati për integrim me bazën e të dhënave Supabase.');
  });
}
