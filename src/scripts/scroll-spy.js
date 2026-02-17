const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
      }
    });
  },
  {
    // Thin detection band near top of viewport.
    // Section is "active" when its top edge crosses the top ~10%.
    rootMargin: '-5% 0% -90% 0%',
  }
);

sections.forEach((section) => observer.observe(section));
