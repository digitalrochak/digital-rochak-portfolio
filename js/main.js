/* ==========================================================================
   Digital Rochak - Portfolio JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize All Interactive Components ---
  initNavbar();
  initActiveScrollSpy();
  initPortfolioFilters();
  initRoiCalculator();
  initModals();
  initContactForm();
  initBackToTop();
});

/* ==========================================
   1. Navbar Scroll Effect & Mobile Drawer
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Scroll blur background toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu hamburger toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking link
    navLinkItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }
}

/* ==========================================
   2. Active Scroll Spy
   ========================================== */
function initActiveScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================
   3. Portfolio Filterable Gallery
   ========================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   4. Interactive ROI Estimator Slider
   ========================================== */
function initRoiCalculator() {
  const budgetSlider = document.getElementById('adBudgetSlider');
  const budgetDisplay = document.getElementById('budgetDisplay');
  const estReach = document.getElementById('estReach');
  const estLeads = document.getElementById('estLeads');
  const estRoas = document.getElementById('estRoas');

  if (!budgetSlider) return;

  function calculateResults(budget) {
    // Dynamic marketing calculation heuristics
    const reach = Math.round((budget / 10) * 1250);
    const minLeads = Math.round((budget / 25) * 1.8);
    const maxLeads = Math.round((budget / 20) * 2.5);
    const estimatedRoasMultiplier = (budget > 1000) ? '3.8x - 5.2x' : '3.0x - 4.5x';

    budgetDisplay.textContent = `$${Number(budget).toLocaleString()}`;
    estReach.textContent = `~${reach.toLocaleString()} Impressions`;
    estLeads.textContent = `${minLeads} - ${maxLeads} High Quality Leads`;
    estRoas.textContent = estimatedRoasMultiplier;
  }

  budgetSlider.addEventListener('input', (e) => {
    calculateResults(e.target.value);
  });

  // Initial calculation trigger
  calculateResults(budgetSlider.value);
}

/* ==========================================
   5. Modal Window Popup Manager
   ========================================== */
function initModals() {
  const modalOverlay = document.getElementById('globalModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalCloseBtn');

  if (!modalOverlay) return;

  // Global open function
  window.openModal = function(title, bodyHtml) {
    modalContent.innerHTML = `
      <h2 style="font-size: 1.8rem; margin-bottom: 1rem; color: var(--primary-cyan);">${title}</h2>
      <div>${bodyHtml}</div>
    `;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Handle service inquiry buttons
  document.querySelectorAll('.open-service-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      const selectElement = document.getElementById('serviceSelect');
      if (selectElement) {
        selectElement.value = serviceName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================
   6. Contact Form & Toast Feedback
   ========================================== */
function sanitizeInput(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    // Anti-Spam Bot Security Honeypot Check
    const honeyField = contactForm.querySelector('input[name="_honey"]');
    if (honeyField && honeyField.value.trim() !== '') {
      console.warn('[Security] Automated spam bot submission blocked by honeypot.');
      e.preventDefault();
      return false;
    }

    // If browsing locally as a file (file://), allow native POST submission directly to FormSubmit
    if (window.location.protocol === 'file:') {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting to digitalrochak.official@gmail.com...';
      }
      return; // Allow native form submission!
    }

    // If hosted on a web server (http:// or https://), handle via AJAX
    e.preventDefault();

    const name = sanitizeInput(document.getElementById('formName').value.trim());
    const email = sanitizeInput(document.getElementById('formEmail').value.trim());
    const message = sanitizeInput(document.getElementById('formMessage').value.trim());

    if (!name || !email || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending to digitalrochak.official@gmail.com...';
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch('https://formsubmit.co/ajax/digitalrochak.official@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok || data.success === 'true' || data.success === true) {
        showToast(`Thank you ${name}! Your message was delivered directly to digitalrochak.official@gmail.com`, 'success');
        contactForm.reset();
      } else {
        // Fallback to native POST if AJAX returns unactivated error
        contactForm.submit();
      }
    } catch (err) {
      console.warn('FormSubmit AJAX fallback to native submit:', err);
      contactForm.submit();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    }
  });
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}" style="color: ${type === 'success' ? 'var(--accent-green)' : '#ef4444'};"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================
   7. Back to Top Button
   ========================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
