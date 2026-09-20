/**
 * ==========================================================================
 * MANI KUMAR PORTFOLIO - JAVASCRIPT
 * Interactions, Animations, Filters & Navigation
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initStatsCounter();
  initProjectFilter();
  initConnectCanvasAnimation();
  initVideoModal();
  initImageModal();
  initBackToTop();
  handleUrlHashFilter();
  initReelCards();
  initVideoCollectionToggle();
});

/**
 * 1. Navbar: Sticky scroll effect, active link highlight & mobile drawer
 */
function initNavbar() {
  const header = document.querySelector('.header-wrapper');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopLinks = document.querySelectorAll('.nav-item-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }

    // ScrollSpy active state
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      desktopLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}` || href === `index.html#${currentSectionId}`) {
          link.classList.add('active');
        } else if (href.startsWith('#') || href.startsWith('index.html#')) {
          link.classList.remove('active');
        }
      });

      mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}` || href === `index.html#${currentSectionId}`) {
          link.classList.add('active');
        } else if (href.startsWith('#') || href.startsWith('index.html#')) {
          link.classList.remove('active');
        }
      });
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('is-open') && !mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      }
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      });
    });
  }
}

/**
 * 2. Scroll Reveal Animations (Intersection Observer)
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/**
 * 3. Statistics Counter Animation (Counts up strictly to verified numbers)
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600; // ms
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, stepTime);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(num => observer.observe(num));
  } else {
    statNumbers.forEach(num => {
      num.textContent = num.getAttribute('data-target');
    });
  }
}

/**
 * 4. Universal Project Category Filter (Supports both index and my-works pages)
 */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const projectCards = document.querySelectorAll('.project-card, .work-item');
  const sectionBlocks = document.querySelectorAll('.work-section-block');

  if (!filterBtns.length || (!projectCards.length && !sectionBlocks.length)) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter individual cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          // Hide immediately so a previous filter's delayed timer cannot restore this card.
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
        }
      });

      // Filter section blocks if on sectioned page
      if (sectionBlocks.length) {
        sectionBlocks.forEach(block => {
          const blockId = block.id.toLowerCase();
          if (filterValue === 'all') {
            block.style.display = '';
          } else if (
            (filterValue === 'websites' && blockId.includes('website')) ||
            (filterValue === 'social' && blockId.includes('social')) ||
            (filterValue === 'videos' && blockId.includes('video'))
          ) {
            block.style.display = '';
          } else {
            block.style.display = 'none';
          }
        });
      }
    });
  });
}

/**
 * 4.1 URL Hash Filter Handler (e.g., #websites, #social, #videos)
 */
function handleUrlHashFilter() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (!hash) return;

  const validFilters = ['websites', 'social', 'videos', 'all'];
  if (validFilters.includes(hash)) {
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
    if (targetBtn) {
      setTimeout(() => {
        targetBtn.click();
        const gallery = document.getElementById('gallerySection') || document.getElementById('worksGalleryContainer') || document.getElementById('projects');
        if (gallery) {
          gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }
}

/**
 * 5. Interactive Particle & Glow Constellation Animation Canvas
 * Beautiful animated particle network responding gently to cursor position
 */
function initConnectCanvasAnimation() {
  const canvas = document.getElementById('connectAnimCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];
  const particleCount = 45;

  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    createParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
      // Gold & green hues matching portfolio palette
      this.color = Math.random() > 0.4 ? 'rgba(245, 181, 27, ' : 'rgba(34, 197, 94, ';
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce on borders
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 1.5;
          this.y -= dirY * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(245, 181, 27, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(particleCount, Math.floor((width * height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectLines() {
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.strokeStyle = `rgba(245, 181, 27, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw subtle radial aura in top right
    const gradient = ctx.createRadialGradient(width * 0.8, height * 0.3, 10, width * 0.8, height * 0.3, width * 0.6);
    gradient.addColorStop(0, 'rgba(41, 75, 50, 0.2)');
    gradient.addColorStop(1, 'rgba(10, 20, 14, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectLines();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse interaction
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', debounce(resize, 100));

  // Initialize
  resize();
  animate();
}

// Generic debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 6. Video Reel Playback Modal
 */
function initVideoModal() {
  const reelCards = document.querySelectorAll('.reel-card, .reel-trigger');
  const modal = document.getElementById('videoModalOverlay');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalReelTitle');
  const modalCategory = document.getElementById('modalReelCategory');
  const modalDesc = document.getElementById('modalReelDesc');
  const modalVideo = document.getElementById('modalVideoPlayer');
  const modalFallback = document.getElementById('modalVideoFallback');
  let fallbackTimer;

  if (!reelCards.length || !modal || !modalVideo) return;

  reelCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.reel-mute-button')) return;
      e.preventDefault();
      const title = card.getAttribute('data-title') || 'AI Video Project';
      const category = card.getAttribute('data-category') || 'AI Reel';
      const desc = card.getAttribute('data-desc') || 'Created with AI-assisted creative workflows.';
      const videoSrc = card.getAttribute('data-drive-embed') ||
        (card.querySelector('video.reel-bg-poster')?.currentSrc || card.querySelector('video.reel-bg-poster')?.getAttribute('src') || '');

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalFallback) modalFallback.hidden = true;
      modalVideo.src = videoSrc;
      modalVideo.onload = () => {
        clearTimeout(fallbackTimer);
        if (modalFallback) modalFallback.hidden = true;
      };
      modalVideo.onerror = () => {
        clearTimeout(fallbackTimer);
        if (modalFallback) modalFallback.hidden = false;
      };
      fallbackTimer = setTimeout(() => {
        if (modalFallback) modalFallback.hidden = false;
      }, 10000);

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    clearTimeout(fallbackTimer);
    modalVideo.removeAttribute('src');
    modalVideo.onload = null;
    modalVideo.onerror = null;
    if (modalFallback) modalFallback.hidden = true;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/**
 * 6.1 Image Zoom Modal (For Web Mockups & Social Posts)
 */
function initImageModal() {
  const zoomBtns = document.querySelectorAll('.work-zoom-btn');
  const modal = document.getElementById('imageModalOverlay');
  const modalClose = document.getElementById('imageModalCloseBtn');
  const modalImg = document.getElementById('modalZoomImg');
  const modalTitle = document.getElementById('modalZoomTitle');

  if (!zoomBtns.length || !modal) return;

  zoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title') || 'Work Mockup';

      if (modalImg) modalImg.src = imgSrc;
      if (modalTitle) modalTitle.textContent = title;

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/**
 * 7. Back To Top
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
/**
 * 8. Reel Cards — Card mute controls and visibility cleanup
 */
function initReelCards() {
  const reelCards = document.querySelectorAll('.reel-card-vertical-9-16');
  if (!reelCards.length) return;

  const allVideos = Array.from(reelCards)
    .map(card => card.querySelector('video.reel-bg-poster'))
    .filter(Boolean);

  reelCards.forEach(card => {
    const video = card.querySelector('video.reel-bg-poster');
    if (!video) return;

    // Keep the mute icon in sync if the video's mute state changes.
    video.addEventListener('volumechange', () => {
      const muteBtn = card.querySelector('.reel-mute-button .mute-icon');
      if (muteBtn) muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });
  });

  // Dedicated mute/unmute button per card.
  document.querySelectorAll('.reel-mute-button').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const card = this.closest('.reel-card-vertical-9-16');
      const video = card ? card.querySelector('video') : null;
      if (!video) return;
      video.muted = !video.muted;
      this.querySelector('.mute-icon').textContent = video.muted ? '🔇' : '🔊';
    });
  });

  // Pause everything if the user scrolls the reel out of view entirely
  // (keeps things tidy if they navigate away without clicking pause).
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      allVideos.forEach(v => v.pause());
    }
  });
}

/**
 * 9. Video collection — reveal ten more cards at a time.
 */
function initVideoCollectionToggle() {
  const collection = document.querySelector('[data-video-collection]');
  const toggle = document.querySelector('.video-collection-toggle');
  if (!collection || !toggle) return;

  const cards = Array.from(collection.querySelectorAll('.reel-card-vertical-9-16'));
  const initialVisible = 10;
  const loadMoreCount = 10;
  let visibleCount = Math.min(initialVisible, cards.length);

  if (cards.length <= initialVisible) {
    toggle.hidden = true;
    return;
  }

  const render = () => {
    cards.forEach((card, index) => {
      card.hidden = index >= visibleCount;
      if (!card.hidden && index >= visibleCount - loadMoreCount) {
        card.classList.remove('video-card-reveal');
        requestAnimationFrame(() => card.classList.add('video-card-reveal'));
      }
    });

    const isExpanded = visibleCount >= cards.length;
    toggle.setAttribute('aria-expanded', String(isExpanded));
    toggle.textContent = isExpanded
      ? toggle.getAttribute('data-expanded-label')
      : toggle.getAttribute('data-collapsed-label');
  };

  render();

  toggle.addEventListener('click', () => {
    if (visibleCount >= cards.length) {
      visibleCount = Math.min(initialVisible, cards.length);
    } else {
      visibleCount = Math.min(visibleCount + loadMoreCount, cards.length);
    }
    render();
  });
}
