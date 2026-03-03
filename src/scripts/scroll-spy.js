const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

// Track which sections are currently intersecting
const activeSections = new Map();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSections.set(entry.target.id, entry.target);
      } else {
        activeSections.delete(entry.target.id);
      }
    });

    // Find the topmost intersecting section (closest to top of viewport)
    let activeId = null;
    let minTop = Infinity;
    activeSections.forEach((section, id) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < minTop) {
        minTop = rect.top;
        activeId = id;
      }
    });

    // Update all nav links
    navLinks.forEach((link) => {
      const isActive = activeId !== null && link.getAttribute('href') === `#${activeId}`;
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  },
  {
    // Start detection below the fixed header (80px).
    // Bottom margin leaves top 40% of visible area as the "active zone".
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0,
  }
);

sections.forEach((section) => observer.observe(section));
