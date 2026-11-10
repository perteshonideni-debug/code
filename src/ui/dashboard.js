import { authService } from '../services/auth.js';
import { evaluateAchievements } from '../services/achievements.js';
import { progressStore } from '../state/store.js';
import { curriculum } from '../data/curriculum.js';
import { chapterFlows } from '../data/chapter-flows.js';

const app = document.querySelector('#app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

function dashboardHeader(user, streak, xp) {
  return `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="#/">
          <span class="brand-mark">&lt;/&gt;</span>CodePath
        </a>
        <nav class="nav-links" aria-label="Primary">
          <a href="#/dashboard" class="active">Paneli Im</a>
          <a href="#/courses">Kurset</a>
          <a href="#/learn/python-fundamentals">Mësimet</a>
          <a href="#/workshop/email-simulator">Workshop</a>
          ${user?.role === 'admin' ? '<a href="#/admin" class="admin-badge-nav">Admin</a>' : ''}
        </nav>
        <div class="nav-actions">
          <div class="user-stats-pill" title="Seria e ditëve dhe pikët XP">
            <span class="stat-pill-item">🔥 <b>${streak}</b> ditë</span>
            <span class="stat-pill-divider">·</span>
            <span class="stat-pill-item">⚡ <b>${xp}</b> XP</span>
          </div>
          <button class="button button-quiet theme-toggle" type="button" data-theme-toggle>◐ Theme</button>
          <button class="button button-secondary" type="button" id="dash-logout-btn">Dil</button>
        </div>
      </div>
    </header>
  `;
}

function dashboardFooter() {
  return `<footer class="footer"><div class="container footer-inner"><span>© 2026 CodePath</span><span>Mëso me qëllim · E ndërtuar për progres real</span></div></footer>`;
}

function findRecommendedNext(chapterList, state) {
  for (const chapter of chapterList) {
    const progress = state.chapterProgress?.[chapter.id];
    if (!progress || !progress.exam?.passed) {
      return {
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        moduleTitle: chapter.moduleTitle,
        stage: progress?.stage || 'literature'
      };
    }
  }
  return {
    chapterId: chapterList[0].id,
    chapterTitle: chapterList[0].title,
    moduleTitle: chapterList[0].moduleTitle,
    stage: 'literature'
  };
}

export function renderDashboard() {
  const user = authService.getCurrentUser() || { fullName: 'Nxënës', role: 'student', isLocal: true };
  const stats = progressStore.getStats();
  const state = progressStore.state;
  const achievements = evaluateAchievements(state, stats.streak);
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  const totalLessons = 35; // across curriculum
  const completedLessons = stats.completedLessonsCount;
  const percentCompleted = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

  const recommended = findRecommendedNext(chapterFlows, state);

  app.innerHTML = `
    ${dashboardHeader(user, stats.streak, stats.totalXp)}
    <main class="dashboard-shell">
      <div class="container">
        
        <!-- Welcome Hero -->
        <section class="dash-hero">
          <div class="dash-hero-content">
            <span class="eyebrow">${user.role === 'admin' ? 'Paneli i Administratorit & Nxënësit' : 'Hapësira e Nxënësit'}</span>
            <h1>Përshëndetje, ${esc(user.fullName)} 👋</h1>
            <p class="dash-hero-sub">Mirësevjen përsëri në qendrën tënde të mësimit. Çdo rresht kodi që shkruan të afron më pranë qëllimit.</p>
          </div>
          <div class="dash-hero-action">
            <a href="#/chapter/${recommended.chapterId}" class="button button-primary button-large">
              ▶ Vazhdo Mësimin: ${esc(recommended.chapterTitle)}
            </a>
          </div>
        </section>

        <!-- Stat Cards Grid -->
        <section class="dash-stats-grid">
          <div class="dash-stat-card">
            <div class="stat-card-icon">🔥</div>
            <div class="stat-card-info">
              <span class="stat-label">Seria e Mësimit</span>
              <strong class="stat-value">${stats.streak} ditë</strong>
              <span class="stat-subtext">${stats.streak > 0 ? 'Seria është aktive sot!' : 'Mëso sot për të filluar serinë!'}</span>
            </div>
          </div>

          <div class="dash-stat-card">
            <div class="stat-card-icon">⚡</div>
            <div class="stat-card-info">
              <span class="stat-label">Pikët Totale XP</span>
              <strong class="stat-value">${stats.totalXp} XP</strong>
              <span class="stat-subtext">Niveli ${stats.levelInfo.level} · ${esc(stats.levelInfo.title)}</span>
            </div>
            <div class="level-progress-bar">
              <div class="level-progress-fill" style="width: ${stats.levelInfo.percent}%"></div>
            </div>
          </div>

          <div class="dash-stat-card">
            <div class="stat-card-icon">📚</div>
            <div class="stat-card-info">
              <span class="stat-label">Mësime të Përfunduara</span>
              <strong class="stat-value">${completedLessons} / ${totalLessons}</strong>
              <span class="stat-subtext">${percentCompleted}% e bazave të përfunduara</span>
            </div>
          </div>

          <div class="dash-stat-card">
            <div class="stat-card-icon">🏆</div>
            <div class="stat-card-info">
              <span class="stat-label">Arritje të Zhbllokuara</span>
              <strong class="stat-value">${unlockedCount} / ${achievements.length}</strong>
              <span class="stat-subtext">${achievements.length - unlockedCount} arritje të disponueshme</span>
            </div>
          </div>
        </section>

        <!-- Main Layout: 2 Columns -->
        <div class="dash-main-grid">
          
          <!-- Left Column: Chapters Overview & Roadmap -->
          <div class="dash-content-column">
            
            <section class="dash-section">
              <div class="section-head-row">
                <h2>Rrugëtimi i Kapitujve në Python</h2>
                <span class="badge-subtle">7 Kapituj të Plotë</span>
              </div>
              <div class="dash-chapters-list">
                ${chapterFlows.map((chapter, index) => {
                  const cp = state.chapterProgress?.[chapter.id];
                  const isPassed = Boolean(cp?.exam?.passed);
                  const isStarted = Boolean(cp);
                  return `
                    <article class="dash-chapter-row ${isPassed ? 'is-complete' : isStarted ? 'is-active' : ''}">
                      <div class="chapter-row-left">
                        <span class="chapter-number">${String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <p class="chapter-row-module">${esc(chapter.moduleTitle)}</p>
                          <h3>${esc(chapter.title)}</h3>
                          <div class="chapter-row-pills">
                            <span class="pill">${chapter.lessons.length} mësime</span>
                            <span class="pill">${chapter.tasks.length} ushtrime</span>
                            <span class="pill">Workshop</span>
                            <span class="pill">Provim</span>
                          </div>
                        </div>
                      </div>
                      <div class="chapter-row-right">
                        <span class="chapter-status-tag ${isPassed ? 'tag-done' : isStarted ? 'tag-progress' : 'tag-locked'}">
                          ${isPassed ? '✓ Përfunduar' : isStarted ? 'Në Zhvillim' : 'E Disponueshme'}
                        </span>
                        <a href="#/chapter/${chapter.id}" class="button button-secondary button-small">
                          ${isPassed ? 'Rishiko' : isStarted ? 'Vazhdo' : 'Fillo'}
                        </a>
                      </div>
                    </article>
                  `;
                }).join('')}
              </div>
            </section>

            <!-- Workshop Feature Card -->
            <section class="dash-section">
              <div class="dash-promo-card">
                <div class="dash-promo-text">
                  <span class="eyebrow">Projekt Praktik i Avancuar</span>
                  <h2>Email Simulator Workshop</h2>
                  <p>Ndërto një sistem të plotë simulimi të postës elektronike hap pas hapi me klasa, metoda, enkapsulim dhe testime automatike në Python.</p>
                  <a href="#/workshop/email-simulator" class="button button-primary">
                    Hap Workshop-in (12 Hapa) →
                  </a>
                </div>
                <div class="dash-promo-badge">📧</div>
              </div>
            </section>

          </div>

          <!-- Right Column: Achievements & Activity Log -->
          <div class="dash-sidebar-column">
            
            <!-- Achievements Box -->
            <section class="dash-section dash-card">
              <div class="section-head-row">
                <h3>Arritjet e Mia</h3>
                <span class="badge-count">${unlockedCount} / ${achievements.length}</span>
              </div>
              <div class="dash-badges-grid">
                ${achievements.map(b => `
                  <div class="dash-badge-item ${b.isUnlocked ? 'is-unlocked' : 'is-locked'}" title="${esc(b.description)} (+${b.xpReward} XP)">
                    <span class="badge-icon">${b.icon}</span>
                    <strong class="badge-title">${esc(b.title)}</strong>
                    <span class="badge-reward">+${b.xpReward} XP</span>
                  </div>
                `).join('')}
              </div>
            </section>

            <!-- Recent Activity Timeline -->
            <section class="dash-section dash-card">
              <div class="section-head-row">
                <h3>Aktiviteti i Fundit</h3>
              </div>
              ${stats.activityLog.length ? `
                <ul class="activity-timeline">
                  ${stats.activityLog.slice(0, 6).map(item => `
                    <li class="activity-item">
                      <span class="activity-dot"></span>
                      <div class="activity-body">
                        <p class="activity-title">${esc(item.title)}</p>
                        <div class="activity-meta">
                          <span>${new Date(item.timestamp).toLocaleDateString()}</span>
                          ${item.xpEarned ? `<span class="activity-xp">+${item.xpEarned} XP</span>` : ''}
                        </div>
                      </div>
                    </li>
                  `).join('')}
                </ul>
              ` : `
                <p class="empty-activity-copy">Nuk ka aktivitet ende. Fillo mësimin e parë për të regjistruar progresin tënd!</p>
              `}
            </section>

          </div>

        </div>

      </div>
    </main>
    ${dashboardFooter()}
  `;

  document.querySelector('#dash-logout-btn')?.addEventListener('click', async () => {
    await authService.logout();
    location.hash = '#/';
  });
}
