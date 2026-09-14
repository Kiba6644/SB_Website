/**
 * BMSCE IEEE Student Branch
 * Utilitarian Minimalist Client Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initGridCellPulse();
  initScrollReveals();
  initRegistrationDrawer();
  initKeyboardShortcuts();
});

/**
 * Scroll Entry Reveals via IntersectionObserver
 * Resolves over 600ms cubic-bezier(0.16, 1, 0.3, 1)
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-card');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Subtle cascade delay between visible peers
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, idx * 40);
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Slide-Out Event Registration Drawer Management
 */
function initRegistrationDrawer() {
  const drawer = document.getElementById('registration-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('close-drawer-btn');
  const openButtons = document.querySelectorAll('.open-registration-btn, #search-trigger');
  const form = document.getElementById('event-registration-form');
  const confirmationView = document.getElementById('confirmation-view');
  const resetBtn = document.getElementById('reset-reg-btn');

  const regEventInput = document.getElementById('reg-event');
  const regChapterInput = document.getElementById('reg-chapter');
  const nameInput = document.getElementById('reg-name');
  const usnInput = document.getElementById('reg-usn');
  const emailInput = document.getElementById('reg-email');

  function openDrawer(eventTitle = 'IEEEXtreme 19.0 Global Hackathon', chapter = 'Computer Society') {
    if (regEventInput) regEventInput.value = eventTitle;
    if (regChapterInput) regChapterInput.value = chapter;
    
    // Reset view states
    if (form) form.hidden = false;
    if (confirmationView) confirmationView.hidden = true;

    drawer.classList.add('active');
    backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 200);
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Listeners for Opening
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventTitle = btn.getAttribute('data-event-title') || 'IEEE Day Annual Symposium';
      const chapter = btn.getAttribute('data-chapter') || 'BMSCE IEEE';
      openDrawer(eventTitle, chapter);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Form Submission & Verification
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const nameError = document.getElementById('name-error');
      const usnError = document.getElementById('usn-error');
      const emailError = document.getElementById('email-error');

      // Clear previous errors
      if (nameError) nameError.textContent = '';
      if (usnError) usnError.textContent = '';
      if (emailError) emailError.textContent = '';

      if (!nameInput.value.trim()) {
        if (nameError) nameError.textContent = 'Please provide your full name';
        isValid = false;
      }

      if (!usnInput.value.trim() || usnInput.value.trim().length < 6) {
        if (usnError) usnError.textContent = 'Please enter a valid BMSCE USN (e.g., 1BM23CS042)';
        isValid = false;
      }

      if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
        if (emailError) emailError.textContent = 'Please enter a valid college or personal email';
        isValid = false;
      }

      if (!isValid) return;

      // Generate verification receipt
      const receiptCode = 'IEEE-BMS-' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('receipt-id').textContent = receiptCode;
      document.getElementById('receipt-name').textContent = nameInput.value.trim();
      document.getElementById('receipt-event').textContent = regEventInput.value;

      form.hidden = true;
      confirmationView.hidden = false;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.hidden = false;
      confirmationView.hidden = true;
      if (nameInput) nameInput.focus();
    });
  }

  // Expose to window for external triggers
  window.openBMSCERegistration = openDrawer;
  window.closeBMSCERegistration = closeDrawer;
}

/**
 * Keyboard Shortcuts
 * Press '/' to quickly open registration
 * Press 'Escape' to dismiss drawer
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // If typing in an input, ignore '/'
    const activeTagName = document.activeElement.tagName.toLowerCase();
    if (activeTagName === 'input' || activeTagName === 'textarea' || activeTagName === 'select') {
      if (e.key === 'Escape') {
        if (typeof window.closeBMSCERegistration === 'function') {
          window.closeBMSCERegistration();
        }
      }
      return;
    }

    if (e.key === '/') {
      e.preventDefault();
      if (typeof window.openBMSCERegistration === 'function') {
        window.openBMSCERegistration('General Orientation & Chapter Induction', 'BMSCE IEEE Branch');
      }
    } else if (e.key === 'Escape') {
      if (typeof window.closeBMSCERegistration === 'function') {
        window.closeBMSCERegistration();
      }
    }
  });
}

/**
 * Dark Mode Theme Toggle
 * Switches between Light and Bklit.com Dark mode
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  function updateAriaLabel() {
    const isDark = document.documentElement.classList.contains('dark');
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  updateAriaLabel();

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {}
    updateAriaLabel();
  });
}

/**
 * Dynamic CAD Grid Cell Pulse & Hover Animation Engine
 * Replicates the exact 1:1 behavior of Bklit.com GridCellPulse:
 * - Cycles 1-3 random cells through fade-in, sustained hatch pattern, and fade-out
 * - Interactive pointer tracking: illuminates whichever cell the user hovers over
 */
function initGridCellPulse() {
  const pulseLayer = document.querySelector('[data-grid-pulse]');
  if (!pulseLayer) return;

  const cells = Array.from(pulseLayer.querySelectorAll('.pulse-cell'));
  if (!cells.length) return;

  const activeCells = new Set();
  const maxActive = 3;
  let isHovering = false;
  let hoveredCell = null;

  function activateCell(cell, duration = null) {
    if (!cell || activeCells.has(cell)) return;
    activeCells.add(cell);
    cell.classList.add('is-active');

    const stayTime = duration || (2000 + Math.random() * 2400);
    setTimeout(() => {
      // If user is currently hovering this cell, keep it active until hover ends
      if (hoveredCell === cell) {
        // Will be removed on mouseleave or move
        activeCells.delete(cell);
        return;
      }
      cell.classList.remove('is-active');
      setTimeout(() => {
        activeCells.delete(cell);
      }, 1200);
    }, stayTime);
  }

  function pulseLoop() {
    // Only pulse if document is visible and not reduced-motion
    if (!document.hidden) {
      const available = cells.filter(c => !activeCells.has(c) && c !== hoveredCell);
      if (available.length > 0 && activeCells.size < maxActive) {
        const randomCell = available[Math.floor(Math.random() * available.length)];
        activateCell(randomCell);
      }
    }

    const nextDelay = 1100 + Math.random() * 1400;
    setTimeout(pulseLoop, nextDelay);
  }

  // Pre-illuminate 2 initial random cells for instant aesthetic
  const initialPicks = [...cells].sort(() => Math.random() - 0.5);
  activateCell(initialPicks[0], 2800);
  setTimeout(() => activateCell(initialPicks[1], 3400), 700);

  // Start continuous pulse cycle
  setTimeout(pulseLoop, 1600);

  // Interactive mouse pointer tracking
  const gridBox = document.querySelector('.bklit-grid-box');
  if (gridBox) {
    gridBox.addEventListener('mousemove', (e) => {
      const rect = gridBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const cols = 6;
      const rows = 3;
      const col = Math.min(cols - 1, Math.max(0, Math.floor((x / rect.width) * cols)));
      const row = Math.min(rows - 1, Math.max(0, Math.floor((y / rect.height) * rows)));
      const idx = row * cols + col;
      const cell = cells[idx];

      if (cell && cell !== hoveredCell) {
        if (hoveredCell && !activeCells.has(hoveredCell)) {
          hoveredCell.classList.remove('is-active');
        }
        hoveredCell = cell;
        hoveredCell.classList.add('is-active');
      }
    });

    gridBox.addEventListener('mouseleave', () => {
      if (hoveredCell && !activeCells.has(hoveredCell)) {
        hoveredCell.classList.remove('is-active');
      }
      hoveredCell = null;
    });
  }
}

