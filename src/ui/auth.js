import { authService } from '../services/auth.js';
import { isSupabaseConfigured } from '../services/supabase.js';

const app = document.querySelector('#app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

function authHeader() {
  return `<header class="site-header"><div class="container nav"><a class="brand" href="#/"><span class="brand-mark">&lt;/&gt;</span>CodePath</a><nav class="nav-links" aria-label="Primary"><a href="#/courses">Kurset</a><a href="#/learn/python-fundamentals">Mësimet</a><a href="#/workshop/email-simulator">Email Simulator</a></nav><div class="nav-actions"><button class="button button-quiet theme-toggle" type="button" data-theme-toggle>◐ Theme</button><a class="button button-secondary" href="#/">Kthehu</a></div></div></header>`;
}

function authFooter() {
  return `<footer class="footer"><div class="container footer-inner"><span>© 2026 CodePath</span><span>Mëso me qëllim · E ndërtuar për progres real</span></div></footer>`;
}

export function renderLogin() {
  const isConfigured = isSupabaseConfigured();
  app.innerHTML = `
    ${authHeader()}
    <main class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <p class="eyebrow">Hyrja në CodePath</p>
          <h1>Mirësevini përsëri</h1>
          <p class="auth-sub">Vazhdo rrugëtimin tënd drejt përvetësimit të Python-it.</p>
        </div>

        ${!isConfigured ? `
          <div class="auth-notice">
            <span class="notice-icon">ℹ️</span>
            <div>
              <strong>Modaliteti Lokal Aktiv</strong>
              <p>Mund të hysh me çdo email ose të përdorësh butonin Demo më poshtë. Progresi ruhet në shfletues.</p>
            </div>
          </div>
        ` : ''}

        <div id="auth-alert" class="auth-alert sr-only" role="alert"></div>

        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label for="login-email">Email adresa</label>
            <input id="login-email" type="email" required autocomplete="email" placeholder="studenti@shembull.com" />
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="login-password">Fjalëkalimi</label>
              <a href="#/reset-password" class="auth-link-subtle">Keni harruar fjalëkalimin?</a>
            </div>
            <input id="login-password" type="password" required autocomplete="current-password" placeholder="••••••••" />
          </div>

          <button type="submit" class="button button-primary button-block">Hyr në llogari</button>
        </form>

        <div class="auth-divider"><span>ose përdor llogari testimi</span></div>

        <div class="demo-actions">
          <button type="button" class="button button-secondary button-block" id="demo-student-btn">
            🎓 Hyr si Nxënës Demo
          </button>
          <button type="button" class="button button-quiet button-block" id="demo-admin-btn">
            ⚙️ Hyr si Administrator
          </button>
        </div>

        <div class="auth-footer-links">
          <span>Nuk keni llogari ende?</span>
          <a href="#/signup" class="auth-link-bold">Regjistrohu këtu</a>
        </div>
      </div>
    </main>
    ${authFooter()}
  `;

  const form = document.querySelector('#login-form');
  const alertEl = document.querySelector('#auth-alert');

  function showAlert(message, isError = true) {
    alertEl.className = isError ? 'auth-alert is-error' : 'auth-alert is-success';
    alertEl.textContent = message;
    alertEl.classList.remove('sr-only');
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const email = document.querySelector('#login-email').value.trim();
    const password = document.querySelector('#login-password').value;
    try {
      await authService.login(email, password);
      location.hash = '#/dashboard';
    } catch (err) {
      showAlert(err.message || 'Ndodhi një gabim gjatë hyrjes.');
    }
  });

  document.querySelector('#demo-student-btn')?.addEventListener('click', () => {
    authService.setDemoUser('student');
    location.hash = '#/dashboard';
  });

  document.querySelector('#demo-admin-btn')?.addEventListener('click', () => {
    authService.setDemoUser('admin');
    location.hash = '#/dashboard';
  });
}

export function renderSignUp() {
  const isConfigured = isSupabaseConfigured();
  app.innerHTML = `
    ${authHeader()}
    <main class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <p class="eyebrow">Krijo llogari të re</p>
          <h1>Fillo rrugëtimin tënd</h1>
          <p class="auth-sub">Mëso të programosh duke shkruar kod real dhe duke zgjidhur sfida.</p>
        </div>

        ${!isConfigured ? `
          <div class="auth-notice">
            <span class="notice-icon">💡</span>
            <div>
              <strong>Regjistrim i Menjëhershëm</strong>
              <p>Llogaria jote krijohet menjëherë me ruajtje lokale dhe sinkronizim të plotë.</p>
            </div>
          </div>
        ` : ''}

        <div id="auth-alert" class="auth-alert sr-only" role="alert"></div>

        <form id="signup-form" class="auth-form">
          <div class="form-group">
            <label for="signup-name">Emri dhe Mbiemri</label>
            <input id="signup-name" type="text" required placeholder="Deni Zhvilluesi" />
          </div>

          <div class="form-group">
            <label for="signup-email">Email adresa</label>
            <input id="signup-email" type="email" required autocomplete="email" placeholder="studenti@shembull.com" />
          </div>

          <div class="form-group">
            <label for="signup-password">Fjalëkalimi (të paktën 6 karaktere)</label>
            <input id="signup-password" type="password" required minlength="6" autocomplete="new-password" placeholder="••••••••" />
          </div>

          <button type="submit" class="button button-primary button-block">Krijo llogarinë time</button>
        </form>

        <div class="auth-footer-links">
          <span>Keni llogari tashmë?</span>
          <a href="#/login" class="auth-link-bold">Hyr këtu</a>
        </div>
      </div>
    </main>
    ${authFooter()}
  `;

  const form = document.querySelector('#signup-form');
  const alertEl = document.querySelector('#auth-alert');

  function showAlert(message, isError = true) {
    alertEl.className = isError ? 'auth-alert is-error' : 'auth-alert is-success';
    alertEl.textContent = message;
    alertEl.classList.remove('sr-only');
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const fullName = document.querySelector('#signup-name').value.trim();
    const email = document.querySelector('#signup-email').value.trim();
    const password = document.querySelector('#signup-password').value;
    try {
      await authService.signUp(email, password, fullName);
      location.hash = '#/dashboard';
    } catch (err) {
      showAlert(err.message || 'Ndodhi një gabim gjatë regjistrimit.');
    }
  });
}

export function renderResetPassword() {
  app.innerHTML = `
    ${authHeader()}
    <main class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <p class="eyebrow">Siguria e llogarisë</p>
          <h1>Rivendosja e fjalëkalimit</h1>
          <p class="auth-sub">Shëno email-in tënd për të marrë udhëzimet e rivendosjes.</p>
        </div>

        <div id="auth-alert" class="auth-alert sr-only" role="alert"></div>

        <form id="reset-form" class="auth-form">
          <div class="form-group">
            <label for="reset-email">Email adresa e llogarisë</label>
            <input id="reset-email" type="email" required placeholder="studenti@shembull.com" />
          </div>

          <button type="submit" class="button button-primary button-block">Dërgo lidhjen</button>
        </form>

        <div class="auth-footer-links">
          <a href="#/login" class="auth-link-bold">← Kthehu te hyrja</a>
        </div>
      </div>
    </main>
    ${authFooter()}
  `;

  const form = document.querySelector('#reset-form');
  const alertEl = document.querySelector('#auth-alert');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const email = document.querySelector('#reset-email').value.trim();
    try {
      const res = await authService.resetPassword(email);
      alertEl.className = 'auth-alert is-success';
      alertEl.textContent = res.message;
      alertEl.classList.remove('sr-only');
    } catch (err) {
      alertEl.className = 'auth-alert is-error';
      alertEl.textContent = err.message || 'Ndodhi një gabim.';
      alertEl.classList.remove('sr-only');
    }
  });
}
