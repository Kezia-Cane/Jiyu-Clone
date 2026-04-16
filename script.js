// ========================================
// Gallery Logic
// ========================================
(function () {
  const mainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const galleryImages = [];

  // Collect all thumbnail sources as gallery images
  thumbs.forEach(function (thumb) {
    galleryImages.push(thumb.querySelector('img').src);
  });

  // Thumbnail click switches main image
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-index'), 10);
      if (mainImg && galleryImages[idx]) {
        mainImg.style.opacity = '0';
        setTimeout(function () {
          mainImg.src = galleryImages[idx];
          mainImg.style.opacity = '1';
        }, 150);
      }
      // Active state
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
    });
  });
})();

// ========================================
// Variant Selection (Jar Quantity)
// ========================================
(function () {
  const jarOptions = document.querySelectorAll('.jar-option');

  jarOptions.forEach(function (option) {
    option.addEventListener('click', function () {
      jarOptions.forEach(function (o) { o.classList.remove('selected'); });
      this.classList.add('selected');
    });
  });
})();

// ========================================
// Quantity Stepper
// ========================================
(function () {
  const qtyValue = document.getElementById('qty-value');
  const minusBtn = document.querySelector('.qty-minus');
  const plusBtn = document.querySelector('.qty-plus');
  let quantity = 1;

  if (minusBtn && plusBtn && qtyValue) {
    minusBtn.addEventListener('click', function () {
      if (quantity > 1) {
        quantity--;
        qtyValue.textContent = quantity;
      }
    });

    plusBtn.addEventListener('click', function () {
      if (quantity < 10) {
        quantity++;
        qtyValue.textContent = quantity;
      }
    });
  }
})();

// ========================================
// CTA Logic
// ========================================
(function () {
  const addToCartBtn = document.getElementById('add-to-cart');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      var originalText = this.textContent;
      this.textContent = 'Added to Cart ✓';
      this.style.background = '#006D41';
      var btn = this;
      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    });
  }
})();

// ========================================
// Accordion Logic
// ========================================
(function () {
  var accordionItems = document.querySelectorAll('[data-accordion]');

  accordionItems.forEach(function (item) {
    var header = item.querySelector('.accordion-header');
    var body = item.querySelector('.accordion-body');
    var icon = item.querySelector('.accordion-icon');

    if (header && body) {
      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        if (isOpen) {
          item.classList.remove('open');
          body.style.display = 'none';
          if (icon) icon.textContent = '+';
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          body.style.display = 'block';
          if (icon) icon.textContent = '−';
          header.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
})();

// ========================================
// FAQ Accordion Logic
// ========================================
(function () {
  var faqItems = document.querySelectorAll('[data-faq]');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        if (isOpen) {
          item.classList.remove('open');
          answer.style.display = 'none';
        } else {
          item.classList.add('open');
          answer.style.display = 'block';
        }
      });
    }
  });
})();

// ========================================
// Modal Logic
// ========================================
(function () {
  var seeAllBtn = document.getElementById('see-all-btn');
  var modal = document.getElementById('ingredients-modal');
  var modalClose = document.getElementById('modal-close');

  if (seeAllBtn && modal) {
    seeAllBtn.addEventListener('click', function () {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', function () {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
})();

// ========================================
// Testimonial / Results Carousel Logic
// ========================================
(function () {
  var slides = document.querySelectorAll('.result-slide');
  var avatarBtns = document.querySelectorAll('.avatar-btn');
  var dots = document.querySelectorAll('.dot');
  var prevBtn = document.getElementById('results-prev');
  var nextBtn = document.getElementById('results-next');
  var currentSlide = 0;
  var totalSlides = slides.length;

  function showSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    slides.forEach(function (s) { s.classList.remove('active'); });
    slides[currentSlide].classList.add('active');

    avatarBtns.forEach(function (a) { a.classList.remove('active'); });
    if (avatarBtns[currentSlide]) avatarBtns[currentSlide].classList.add('active');

    // Map slides to dots (3 dots for 4 slides)
    dots.forEach(function (d) { d.classList.remove('active'); });
    var dotIndex = Math.min(currentSlide, dots.length - 1);
    if (dots[dotIndex]) dots[dotIndex].classList.add('active');
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      showSlide(currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      showSlide(currentSlide + 1);
    });
  }

  avatarBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(this.getAttribute('data-slide'), 10);
      showSlide(idx);
    });
  });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(this.getAttribute('data-dot'), 10);
      showSlide(idx);
    });
  });

  // Auto-play carousel
  var autoPlay = setInterval(function () {
    showSlide(currentSlide + 1);
  }, 6000);

  // Pause on hover
  var carouselContainer = document.getElementById('results-carousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', function () {
      clearInterval(autoPlay);
    });
    carouselContainer.addEventListener('mouseleave', function () {
      autoPlay = setInterval(function () {
        showSlide(currentSlide + 1);
      }, 6000);
    });
  }
})();

// ========================================
// Auto Refill Toggle
// ========================================
(function () {
  var autoRefill = document.getElementById('auto-refill');
  if (autoRefill) {
    var checkbox = autoRefill.querySelector('.auto-refill__checkbox');
    var isChecked = true;

    autoRefill.addEventListener('click', function () {
      isChecked = !isChecked;
      if (isChecked) {
        checkbox.classList.add('checked');
        checkbox.innerHTML = '<svg width="18" height="18" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#006D41"/><path d="M5 10l3 3 7-7" stroke="#fff" stroke-width="2" fill="none"/></svg>';
      } else {
        checkbox.classList.remove('checked');
        checkbox.innerHTML = '<svg width="18" height="18" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="none" stroke="#006D41" stroke-width="2"/></svg>';
      }
    });
  }
})();

// ========================================
// Newsletter Form
// ========================================
(function () {
  var form = document.getElementById('newsletter-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('.newsletter-input');
      var submitBtn = form.querySelector('.newsletter-submit');

      if (input && input.value) {
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'SUBSCRIBED ✓';
        submitBtn.style.background = '#006D41';
        input.value = '';
        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }
})();

// ========================================
// Responsive Behavior
// ========================================
(function () {
  // Ingredients horizontal scroll with drag support
  var ingredientsRow = document.getElementById('ingredients-row');

  if (ingredientsRow) {
    var isDown = false;
    var startX;
    var scrollLeft;

    ingredientsRow.addEventListener('mousedown', function (e) {
      isDown = true;
      ingredientsRow.style.cursor = 'grabbing';
      startX = e.pageX - ingredientsRow.offsetLeft;
      scrollLeft = ingredientsRow.scrollLeft;
    });

    ingredientsRow.addEventListener('mouseleave', function () {
      isDown = false;
      ingredientsRow.style.cursor = '';
    });

    ingredientsRow.addEventListener('mouseup', function () {
      isDown = false;
      ingredientsRow.style.cursor = '';
    });

    ingredientsRow.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - ingredientsRow.offsetLeft;
      var walk = (x - startX) * 2;
      ingredientsRow.scrollLeft = scrollLeft - walk;
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
