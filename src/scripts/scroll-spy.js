// Only track sections that have a matching nav link
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sectionIds = Array.from(navLinks).reduce((ids, link) => {
  const id = link.getAttribute('href')?.slice(1);
  if (id && !ids.includes(id)) ids.push(id);
  return ids;
}, []);

const HEADER_OFFSET = 80; // fixed header height in px

function getActiveSection() {
  const scrollY = window.scrollY;

  // At the bottom of the page, activate the last section
  if (window.innerHeight + Math.ceil(scrollY) >= document.body.scrollHeight) {
    return sectionIds[sectionIds.length - 1];
  }

  // Walk sections in DOM order; the last one whose top has scrolled
  // past the header is the active one.
  let activeId = sectionIds[0];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.offsetTop - HEADER_OFFSET - 1 <= scrollY) {
      activeId = id;
    }
  }
  return activeId;
}

function updateNav() {
  const activeId = getActiveSection();
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    link.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

// Throttle to one update per animation frame
let ticking = false;
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNav();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);

// Set initial state
updateNav();
