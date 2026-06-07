/**
 * JOSEPH HOPE GLOBAL - WEBSITE SCRIPTS
 * Vanilla JS with modern ES6+ features
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // MOBILE NAVIGATIONDRAWER MENU
  // ==========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // SCROLL-ACTIVE HEADER STATE
  // ==========================================================================
  const header = document.getElementById('header');

  const handleScrollHeader = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader);
  handleScrollHeader(); // Initial run on load

  // Active Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  
  const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  };
  window.addEventListener('scroll', scrollActive);

  // ==========================================================================
  // INTERSECTION OBSERVER FOR SCROLL REVEALS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // TESTIMONIAL CAROUSEL ENGINE
  // ==========================================================================
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevButton = document.getElementById('prev-slide');
  const nextButton = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('slider-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoPlayTimer;

    // Create dot indicators
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.slider-dot');

    const updateSlider = () => {
      // Move track
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slideCount;
      updateSlider();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateSlider();
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateSlider();
      resetAutoPlay();
    };

    // Event Listeners
    if (nextButton && prevButton) {
      nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
      prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Auto Play
    const startAutoPlay = () => {
      autoPlayTimer = setInterval(nextSlide, 7000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    };

    startAutoPlay();

    // Touch Support for Mobile Swiping
    let startX = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
      clearInterval(autoPlayTimer);
    });

    track.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        isSwiping = false;
      }
    });

    track.addEventListener('touchend', () => {
      isSwiping = false;
      startAutoPlay();
    });
  }

  // ==========================================================================
  // FAQ ACCORDION LOGIC
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items first
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ==========================================================================
  // BOOKING / LEAD CAPTURE MODAL HANDLER
  // ==========================================================================
  const modalOverlay = document.getElementById('booking-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const openModal = (e) => {
    if (e) e.preventDefault();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================================================================
  // FORM SUBMISSION & CLIENT-SIDE VALIDATION
  // ==========================================================================
  
  // Newsletter Form Submission
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput.value.trim();

      if (email) {
        alert(`Thank you for subscribing! Joseph Hope's blueprints will be delivered to: ${email}`);
        newsletterForm.reset();
      }
    });
  }

  // Booking Modal Form Submission
  const bookingForm = document.getElementById('modal-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('booking-name').value.trim();
      const email = document.getElementById('booking-email').value.trim();
      const programSelect = document.getElementById('booking-program');
      const programText = programSelect.options[programSelect.selectedIndex].text;
      
      alert(`Success! Thank you, ${name}. Your consultation request for "${programText}" has been logged. We will contact you at ${email} within 24 hours.`);
      
      bookingForm.reset();
      closeModal();
    });
  }

  // Contact Section Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      
      alert(`Message Sent! Thank you, ${name}. We have received your message and will email you back at ${email} shortly.`);
      
      contactForm.reset();
    });
  }
});
