// BHARATSCALES — Job detail page

// ── n8n integration ──────────────────────────────────────────────
// Paste your n8n Webhook node "Production URL" here.
// In n8n: add a Webhook node (HTTP Method: POST) and copy its URL.
const N8N_WEBHOOK_URL = 'https://n8n.bharatscales.com/webhook/career';
// ─────────────────────────────────────────────────────────────────

const params = new URLSearchParams(window.location.search);
const slug = params.get('role');
const job = (window.JOBS || {})[slug];

function fillList(el, items) {
  el.innerHTML = '';
  items.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    el.appendChild(li);
  });
}

function renderJob() {
  if (!job) {
    document.getElementById('jobTitle').textContent = 'Opening not found';
    document.getElementById('jobIntro').textContent =
      'This role may have been filled or the link is invalid. Browse all current openings.';
    document.getElementById('jobLocationTop').innerHTML =
      '<a href="index.html#careers" class="link-arrow">View all openings →</a>';
    return;
  }

  document.title = `${job.title} | BHARATSCALES Careers`;
  document.getElementById('jobTitle').textContent = job.title;
  document.getElementById('jobLocationTop').textContent = job.location;

  document.getElementById('metaCategory').textContent = job.category;
  document.getElementById('metaLocation').textContent = job.location;
  document.getElementById('metaDate').textContent = job.datePosted;
  document.getElementById('metaType').textContent = job.type;
  document.getElementById('metaExperience').textContent = job.experience;
  document.getElementById('metaTravel').textContent = job.travel;

  document.getElementById('jobIntro').textContent = job.intro;
  fillList(document.getElementById('jobResponsibilities'), job.responsibilities);
  fillList(document.getElementById('jobRequirements'), job.requirements);
  fillList(document.getElementById('jobBenefits'), job.benefits);

  document.getElementById('asideTitle').textContent = job.title;
  document.getElementById('asideLocation').textContent = job.location;
  document.getElementById('asideType').textContent = job.type;
  document.getElementById('asideExperience').textContent = job.experience;
}

renderJob();

// ── Sticky tab active state on scroll ────────────────────────────
const tabLinks = Array.from(document.querySelectorAll('.job-tab'));
const sections = tabLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      tabLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => sectionObserver.observe(sec));

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Apply modal ──────────────────────────────────────────────────
const applyModal = document.getElementById('applyModal');
const applyForm = document.getElementById('applyForm');
const applyRole = document.getElementById('applyRole');
const applyModalTitle = document.getElementById('applyModalTitle');
const applyResume = document.getElementById('applyResume');
const fileText = document.getElementById('fileText');
const fileDrop = document.querySelector('.file-drop');
const applyNote = document.getElementById('applyNote');
const defaultFileText = fileText.textContent;
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

function openApplyModal() {
  const role = job ? job.title : (slug || 'this role');
  applyRole.value = role;
  applyModalTitle.textContent = `Apply — ${role}`;
  applyModal.classList.add('open');
  applyModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('applyName').focus(), 100);
}

function closeApplyModal() {
  applyModal.classList.remove('open');
  applyModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  applyForm.reset();
  fileText.textContent = defaultFileText;
  fileDrop.classList.remove('has-file');
  applyNote.textContent = '';
  applyNote.className = 'form-note';
}

['applyTopBtn', 'applyBottomBtn', 'applyAsideBtn'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', openApplyModal);
});

applyModal.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', closeApplyModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && applyModal.classList.contains('open')) closeApplyModal();
});

applyResume.addEventListener('change', () => {
  const file = applyResume.files[0];
  if (!file) {
    fileText.textContent = defaultFileText;
    fileDrop.classList.remove('has-file');
    return;
  }
  if (file.size > MAX_RESUME_BYTES) {
    applyResume.value = '';
    fileText.textContent = defaultFileText;
    fileDrop.classList.remove('has-file');
    applyNote.textContent = 'File is too large. Please upload a resume under 5MB.';
    applyNote.className = 'form-note error';
    return;
  }
  applyNote.textContent = '';
  applyNote.className = 'form-note';
  fileText.textContent = file.name;
  fileDrop.classList.add('has-file');
});

applyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!applyForm.checkValidity()) {
    applyForm.reportValidity();
    return;
  }

  const submitBtn = applyForm.querySelector('button[type="submit"]');
  const file = applyResume.files[0];

  // Build multipart payload so the resume is sent as a real file (binary)
  const payload = new FormData();
  payload.append('role', applyRole.value);
  payload.append('name', applyForm.name.value);
  payload.append('email', applyForm.email.value);
  payload.append('phone', applyForm.phone.value);
  payload.append('linkedin', applyForm.linkedin.value);
  payload.append('submittedAt', new Date().toISOString());
  if (file) payload.append('resume', file, file.name);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  applyNote.textContent = '';
  applyNote.className = 'form-note';

  try {
    const res = await fetch(N8N_WEBHOOK_URL, { method: 'POST', body: payload });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    applyNote.textContent = "Application received! We'll be in touch soon.";
    applyNote.className = 'form-note success';
    applyForm.reset();
    fileText.textContent = defaultFileText;
    fileDrop.classList.remove('has-file');
    setTimeout(closeApplyModal, 2200);
  } catch (err) {
    console.error('Application submit failed:', err);
    applyNote.textContent = 'Something went wrong. Please try again or email careers@bharatscales.com.';
    applyNote.className = 'form-note error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit application';
  }
});
