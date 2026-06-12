// BHARATSCALES — Website Scripts

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const onNavScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 8);
};
onNavScroll();
window.addEventListener('scroll', onNavScroll);

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

// Industry tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById(target);
    panel.classList.add('active');

    // Re-run counters for the newly shown panel
    panel.querySelectorAll('.metric-num').forEach(el => {
      el.dataset.counted = '';
      animateCount(el);
    });
  });
});

// Animated number counter
function animateCount(el) {
  if (el.dataset.counted === 'true') return;
  el.dataset.counted = 'true';

  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = !Number.isInteger(target);
  const duration = 1200;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
  };
  requestAnimationFrame(step);
}

// Scroll-triggered animations + counters
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('metric-num') ||
          entry.target.classList.contains('trust-num') ||
          entry.target.classList.contains('result-num')) {
        animateCount(entry.target);
      }
    }
  });
}, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.solution-card, .resource-card, .contact-info, .contact-form, .statement-title')
  .forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

document.querySelectorAll('.metric-num, .trust-num, .result-num').forEach(el => observer.observe(el));

// Contact form handling
// n8n webhook for "Contact us" submissions
const CONTACT_WEBHOOK_URL = 'https://n8n.bharatscales.com/webhook/demo';
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(contactForm).entries());

    const serviceSelect = contactForm.querySelector('#service');
    if (serviceSelect && serviceSelect.selectedIndex >= 0) {
      data.service = serviceSelect.options[serviceSelect.selectedIndex].text;
    }

    data.submittedAt = new Date().toISOString();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formNote.textContent = '';
    formNote.className = 'form-note';

    try {
      const res = await fetch(CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      formNote.textContent = "Thank you! We'll get back to you within 24 hours.";
      formNote.className = 'form-note success';
      contactForm.reset();

      setTimeout(() => {
        formNote.textContent = '';
        formNote.className = 'form-note';
      }, 5000);
    } catch (err) {
      console.error('Contact submit failed:', err);
      formNote.textContent = 'Something went wrong. Please try again or email info@bharatscales.com.';
      formNote.className = 'form-note error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request';
    }
  });
}

// Subscribe form handling
const subscribeForm = document.getElementById('subscribeForm');
const subscribeNote = document.getElementById('subscribeNote');

if (subscribeForm) {
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    subscribeNote.textContent = 'Subscribed! Watch your inbox for insights.';
    subscribeForm.reset();
    setTimeout(() => { subscribeNote.textContent = ''; }, 5000);
  });
}
