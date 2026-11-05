/**
 * Minimal JavaScript for Regulo Sarmiento's Engineering Portfolio
 * Focus: High performance, zero bloat, crisp interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  initEmailLinks();
  initCopyActions();
  initMobileMenu();
  initImageLightbox();
});

/* Assemble the address at runtime to deter basic email scrapers. */
function initEmailLinks() {
  const email = `${['regulo', 'sarmiento'].join('.')}@${['gmail', 'com'].join('.')}`;

  document.querySelectorAll('[data-email-link]').forEach(link => {
    link.href = `mailto:${email}`;
    if (link.hasAttribute('data-email-text')) link.textContent = email;
  });

  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.dataset.copy = email;
  });
}

/* Copy to clipboard with toast notification */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('copy-toast');
  let timeoutId = null;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`);
      }).catch(err => {
        console.error('Copy failed: ', err);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-message');
    if (msgEl) msgEl.textContent = message;

    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2800);
  }
}

/* Mobile navigation drawer */
function initMobileMenu() {
  const btn = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-close');

  if (!btn || !menu) return;

  const setMenuState = (isOpen) => {
    menu.classList.toggle('hidden', !isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  };

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('hidden');
    setMenuState(isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => setMenuState(false));
  }

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });
}

/* Lightbox to inspect architecture diagrams and screenshots full-size */
function initImageLightbox() {
  const images = document.querySelectorAll('[data-lightbox]');
  let modal = document.getElementById('lightbox-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'lightbox-modal';
    modal.className = 'fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm hidden flex items-center justify-center p-4 cursor-zoom-out';
    modal.innerHTML = `
      <div class="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center">
        <button class="absolute -top-10 right-0 text-white text-sm font-mono hover:text-emerald-400 p-2">✕ Close</button>
        <img id="lightbox-img" src="" alt="Full size preview" class="max-w-full max-h-[85vh] object-contain rounded-lg border border-slate-700 bg-white shadow-2xl">
        <p id="lightbox-caption" class="text-xs text-slate-300 font-mono mt-3"></p>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  images.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalImg = modal.querySelector('#lightbox-img');
      const caption = modal.querySelector('#lightbox-caption');
      modalImg.src = img.src;
      caption.textContent = img.alt || 'Technical Architecture Diagram';
      modal.classList.remove('hidden');
    });
  });
}
