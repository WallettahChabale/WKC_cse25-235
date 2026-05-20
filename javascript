// =========================
// SCROLL REVEAL ANIMATION
// =========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// =========================
// MAP POPUP
// =========================
function openMap() {
  const popup = document.getElementById("mapPopup");
  if (popup) {
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeMap() {
  const popup = document.getElementById("mapPopup");
  if (popup) {
    popup.style.display = "none";
    document.body.style.overflow = "";
  }
}

// Close map popup with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMap();
});

// =========================
// FORM SUBMISSIONS
// =========================
document.addEventListener('click', function(e) {
  const submitBtn = e.target.closest('button[type="submit"], button.hero-btn');
  if (!submitBtn) return;

  const form = submitBtn.closest('form');
  if (!form) return;

  // Check HTML5 validity first
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  e.preventDefault();

  const hasBookingFields =
    form.querySelector('input[type="date"]') ||
    form.querySelector('input[type="time"]') ||
    form.querySelector('input[type="number"]');

  const hasReviewField =
    form.querySelector('textarea') &&
    form.querySelector('.star-select');

  const hasContactField =
    form.querySelector('input[placeholder="Subject"]');

  if (hasBookingFields) {
    showToast('Booking confirmed! We look forward to seeing you.');
  } else if (hasReviewField) {
    showToast('Thank you for your review!');
  } else if (hasContactField) {
    showToast('Message sent! We will get back to you soon.');
  } else {
    showToast('Submitted successfully!');
  }

  form.reset();
  resetStars();

  // Close modal if form is inside one
  const modal = form.closest('.modal');
  if (modal) {
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) {
      setTimeout(() => bsModal.hide(), 800);
    }
  }
});

// =========================
// SUBSCRIBE
// =========================
function subscribeUser() {
  const input = document.getElementById('email') || document.getElementById('subscribe-email');
  if (!input || !input.value.trim()) {
    showToast('Please enter a valid email address.', true);
    return;
  }
  showToast('Subscribed! Thank you for joining us.');
  input.value = '';
}

// =========================
// TOAST NOTIFICATION
// =========================
function showToast(message, isError = false) {
  // Remove existing toast
  const existing = document.getElementById('haven-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'haven-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: ${isError ? '#c46a3b' : '#2c1f0e'};
    color: #f5f0e8;
    padding: 16px 28px;
    border-radius: 2px;
    font-family: 'Jost', sans-serif;
    font-size: 0.85rem;
    font-weight: 300;
    letter-spacing: 0.05em;
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    z-index: 99999;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.4s ease, transform 0.4s ease;
    border-left: 3px solid ${isError ? '#f5f0e8' : '#c9a84c'};
    max-width: 320px;
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
  });

  // Animate out after 3.5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// =========================
// STAR RATING (TESTIMONIALS)
// =========================
function initStars() {
  const stars = document.querySelectorAll('.star-select .star');
  if (!stars.length) return;

  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const val = star.dataset.value;
      stars.forEach(s => {
        s.style.color = s.dataset.value <= val
          ? 'var(--gold)'
          : 'rgba(107,76,42,0.2)';
      });
    });

    star.addEventListener('click', () => {
      stars.forEach(s => {
        s.classList.toggle('selected', s.dataset.value <= star.dataset.value);
        s.style.color = s.classList.contains('selected')
          ? 'var(--gold)'
          : 'rgba(107,76,42,0.2)';
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => {
        s.style.color = s.classList.contains('selected')
          ? 'var(--gold)'
          : 'rgba(107,76,42,0.2)';
      });
    });
  });
}

function resetStars() {
  const stars = document.querySelectorAll('.star-select .star');
  stars.forEach(s => {
    s.classList.remove('selected');
    s.style.color = 'rgba(107,76,42,0.2)';
  });
}

initStars();

// =========================
// GALLERY SCROLL
// =========================
function scrollGallery(rowId, direction) {
  const row = document.getElementById(rowId);
  if (row) row.scrollBy({ left: direction * 320, behavior: 'smooth' });
}

// =========================
// LIGHTBOX
// =========================
let allImages = [];
let currentIndex = 0;

function initLightbox() {
  const items = document.querySelectorAll('.gallery-item img');
  if (!items.length) return;

  items.forEach((img, index) => {
    allImages.push(img.src);
    img.addEventListener('click', () => {
      currentIndex = index;
      openLightbox(img.src);
    });
  });
}

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (!lb || !lbImg) return;
  lbImg.src = src;
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.style.display = 'none';
  document.body.style.overflow = '';
}

function changeImage(direction) {
  currentIndex = (currentIndex + direction + allImages.length) % allImages.length;
  const lbImg = document.getElementById('lightbox-img');
  if (lbImg) lbImg.src = allImages[currentIndex];
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.style.display !== 'flex') return;
  if (e.key === 'ArrowRight') changeImage(1);
  if (e.key === 'ArrowLeft') changeImage(-1);
});

initLightbox();