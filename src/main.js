import { renderCatalogue, renderHome, renderLearning, renderPlaceholder } from './ui/render.js';
import { renderWorkshop, unmountWorkshop } from './ui/workshop.js';
import { getWorkshop } from './data/workshops/index.js';
import { findChapterFlow } from './data/chapter-flows.js';
import { renderChapterFlow, unmountChapterFlow } from './ui/chapter-flow.js';
import { allItems, curriculum } from './data/curriculum.js';
import { renderLogin, renderResetPassword, renderSignUp } from './ui/auth.js';
import { renderDashboard } from './ui/dashboard.js';
import { renderAdmin } from './ui/admin.js';
import { authService } from './services/auth.js';

function route() {
  const hash = location.hash || '#/';
  if (!hash.startsWith('#/chapter/')) unmountChapterFlow();
  if (hash !== '#/workshop/email-simulator') unmountWorkshop();
  if (hash === '#/' || hash === '#') return renderHome();
  if (hash === '#/courses') return renderCatalogue();
  if (hash === '#/dashboard') return renderDashboard();
  if (hash === '#/login') return renderLogin();
  if (hash === '#/signup') return renderSignUp();
  if (hash === '#/reset-password') return renderResetPassword();
  if (hash === '#/admin') return renderAdmin();
  if (hash === '#/logout') {
    authService.logout();
    return location.replace('#/');
  }
  if (hash.startsWith('#/workshop/')) {
    const workshop = getWorkshop(hash.slice('#/workshop/'.length));
    return workshop ? renderWorkshop(workshop) : renderPlaceholder('Workshop not found.', 'Choose a workshop from the learning path to continue.');
  }
  if (hash.startsWith('#/chapter/')) {
    const [chapterId, query = ''] = hash.slice('#/chapter/'.length).split('?');
    const chapter = findChapterFlow(chapterId);
    return chapter ? renderChapterFlow(chapter, new URLSearchParams(query).get('lesson')) : renderPlaceholder('Chapter not found.', 'Choose a chapter from the Python learning path.');
  }
  if (hash === '#/learn/python-fundamentals' || hash === '#/learn/python-fundamentals/') return location.replace('#/chapter/getting-started');
  if (hash.startsWith('#/learn/')) {
    const itemId = hash.split('/')[3]?.split('?')[0];
    const item = allItems(curriculum).find(entry => entry.id === itemId);
    if (item && item.type !== 'workshop') return location.replace(`#/chapter/${item.chapterId}?lesson=${encodeURIComponent(item.id)}`);
    return renderLearning();
  }
  if (hash === '#/about') return renderPlaceholder('Thoughtful learning, built for real progress.', 'CodePath is designed around clarity, practice, and the confidence that comes from understanding what you build.');
  return renderHome();
}

window.addEventListener('hashchange', route);
route();
