document.addEventListener('DOMContentLoaded', function () {
  var galleryTrack = document.getElementById('gallery-mobile-track');
  var gallerySlides = Array.from(document.querySelectorAll('.gallery-slide'));
  var galleryThumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
  var galleryCurrentIndex = document.getElementById('gallery-current-index');
  var galleryMainImg = document.getElementById('gallery-main-img');
  var desktopVariantMedia = document.getElementById('desktop-variant-media');
  var galleryPrev = document.getElementById('gallery-prev');
  var galleryNext = document.getElementById('gallery-next');

  var jarOptions = Array.from(document.querySelectorAll('.jar-option'));
  var autoRefillToggle = document.getElementById('auto-refill-toggle');
  var autoRefillTitle = document.getElementById('auto-refill-title');

  var qtyValue = document.getElementById('qty-value');
  var minusBtn = document.querySelector('.qty-minus');
  var plusBtn = document.querySelector('.qty-plus');
  var addToCartBtn = document.getElementById('add-to-cart');
  var cartCountLabel = document.getElementById('cart-count-label');

  var accordionItems = document.querySelectorAll('[data-accordion]');
  var faqItems = document.querySelectorAll('[data-faq]');
  var seeAllBtn = document.getElementById('see-all-btn');
  var modal = document.getElementById('ingredients-modal');
  var modalClose = document.getElementById('modal-close');

  var resultsSlides = Array.from(document.querySelectorAll('.result-slide'));
  var avatarBtns = Array.from(document.querySelectorAll('.avatar-btn'));
  var dotsContainer = document.getElementById('carousel-dots');
  var dots = Array.from(dotsContainer ? dotsContainer.querySelectorAll('.dot') : []);
  var prevBtn = document.getElementById('results-prev');
  var nextBtn = document.getElementById('results-next');
  var resultsViewport = document.querySelector('.results-viewport');

  var videoThumbs = Array.from(document.querySelectorAll('.video-thumb'));
  var ingredientsRow = document.getElementById('ingredients-row');

  var quantity = 1;
  var cartCount = 0;
  var selectedOption = jarOptions.find(function (option) {
    return option.classList.contains('selected');
  }) || jarOptions[0];

  function formatPrice(value) {
    return '$' + Number(value).toFixed(2);
  }

  function updateGalleryUI(index) {
    if (!gallerySlides.length || !galleryThumbs.length) {
      return;
    }

    gallerySlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === index);
    });

    galleryThumbs.forEach(function (thumb, thumbIndex) {
      thumb.classList.toggle('active', thumbIndex === index);
      thumb.setAttribute('aria-current', thumbIndex === index ? 'true' : 'false');
    });

    if (galleryCurrentIndex) {
      galleryCurrentIndex.textContent = String(index + 1);
    }
  }

  function goToGalleryIndex(index, behavior) {
    if (!galleryTrack || !gallerySlides.length) {
      return;
    }

    var safeIndex = Math.max(0, Math.min(index, gallerySlides.length - 1));
    var slideWidth = galleryTrack.clientWidth;

    galleryTrack.scrollTo({
      left: safeIndex * slideWidth,
      behavior: behavior || 'smooth'
    });

    updateGalleryUI(safeIndex);
  }

  function syncGalleryFromScroll() {
    if (!galleryTrack || !gallerySlides.length) {
      return;
    }

    var slideWidth = galleryTrack.clientWidth || 1;
    var index = Math.round(galleryTrack.scrollLeft / slideWidth);
    updateGalleryUI(index);
  }

  function updateVariantMedia(imageSrc) {
    if (desktopVariantMedia) {
      desktopVariantMedia.src = imageSrc;
    }

    if (galleryMainImg) {
      galleryMainImg.src = imageSrc;
    }

    if (gallerySlides[0]) {
      var slideImg = gallerySlides[0].querySelector('img');
      if (slideImg) {
        slideImg.src = imageSrc;
      }
    }

    if (galleryThumbs[0]) {
      var thumbImg = galleryThumbs[0].querySelector('img');
      if (thumbImg) {
        thumbImg.src = imageSrc;
      }
    }
  }

  function renderJarPricing() {
    var useSubscription = autoRefillToggle ? autoRefillToggle.checked : true;

    jarOptions.forEach(function (option) {
      var current = option.querySelector('.price-current');
      var compare = option.querySelector('.price-compare');
      var daily = option.querySelector('.price-daily');
      var price = useSubscription ? option.dataset.subscription : option.dataset.regular;
      var comparePrice = useSubscription ? option.dataset.subscriptionCompare : option.dataset.regularCompare;

      if (current) {
        current.textContent = formatPrice(price);
      }

      if (compare) {
        if (comparePrice) {
          compare.textContent = formatPrice(comparePrice);
          compare.style.display = 'inline-block';
        } else {
          compare.textContent = '';
          compare.style.display = 'none';
        }
      }

      if (daily) {
        if (useSubscription) {
          daily.textContent = formatPrice(option.dataset.daily) + ' per day';
          daily.style.display = 'block';
        } else {
          daily.textContent = '';
          daily.style.display = 'none';
        }
      }
    });

    if (selectedOption && autoRefillTitle) {
      autoRefillTitle.textContent = 'Save ' + selectedOption.dataset.discount + '% with Automatic Refills!';
      updateVariantMedia(selectedOption.dataset.image);
    }
  }

  function setSelectedOption(option) {
    selectedOption = option;

    jarOptions.forEach(function (item) {
      var isSelected = item === option;
      item.classList.toggle('selected', isSelected);
      item.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    renderJarPricing();
    goToGalleryIndex(0, 'smooth');
  }

  jarOptions.forEach(function (option) {
    option.setAttribute('aria-pressed', option.classList.contains('selected') ? 'true' : 'false');
    option.addEventListener('click', function () {
      setSelectedOption(option);
    });
  });

  if (autoRefillToggle) {
    autoRefillToggle.addEventListener('change', renderJarPricing);
  }

  renderJarPricing();

  if (galleryTrack) {
    galleryTrack.addEventListener('scroll', syncGalleryFromScroll, { passive: true });
  }

  galleryThumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      goToGalleryIndex(Number(thumb.dataset.index), 'smooth');
    });
  });

  if (galleryPrev) {
    galleryPrev.addEventListener('click', function () {
      var activeIndex = gallerySlides.findIndex(function (slide) {
        return slide.classList.contains('is-active');
      });
      goToGalleryIndex(Math.max(0, activeIndex - 1), 'smooth');
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', function () {
      var activeIndex = gallerySlides.findIndex(function (slide) {
        return slide.classList.contains('is-active');
      });
      goToGalleryIndex(Math.min(gallerySlides.length - 1, activeIndex + 1), 'smooth');
    });
  }

  window.addEventListener('resize', function () {
    syncGalleryFromScroll();
  });

  updateGalleryUI(0);

  if (minusBtn && qtyValue) {
    minusBtn.addEventListener('click', function () {
      if (quantity > 1) {
        quantity -= 1;
        qtyValue.textContent = String(quantity);
      }
    });
  }

  if (plusBtn && qtyValue) {
    plusBtn.addEventListener('click', function () {
      if (quantity < 10) {
        quantity += 1;
        qtyValue.textContent = String(quantity);
      }
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      if (addToCartBtn.disabled) {
        return;
      }

      var originalLabel = addToCartBtn.textContent;

      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'Adding...';

      window.setTimeout(function () {
        cartCount += quantity;
        if (cartCountLabel) {
          cartCountLabel.textContent = '(' + cartCount + ' in cart)';
        }
        addToCartBtn.textContent = originalLabel;
        addToCartBtn.disabled = false;
      }, 650);
    });
  }

  accordionItems.forEach(function (item) {
    var header = item.querySelector('.accordion-header');
    var body = item.querySelector('.accordion-body');
    var icon = item.querySelector('.accordion-icon');

    if (!header || !body) {
      return;
    }

    header.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      item.classList.toggle('open', !isOpen);
      body.style.display = isOpen ? 'none' : 'block';
      header.setAttribute('aria-expanded', isOpen ? 'false' : 'true');

      if (icon) {
        icon.textContent = isOpen ? '+' : '−';
      }
    });
  });

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    if (!question || !answer) {
      return;
    }

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      answer.style.display = isOpen ? 'none' : 'block';
    });
  });

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
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  function getResultsCardsPerPage() {
    if (window.innerWidth <= 768) {
      return 1;
    }

    return 2;
  }

  function getResultsMaxPage() {
    return Math.max(0, resultsSlides.length - getResultsCardsPerPage());
  }

  function syncResultDots() {
    if (!dotsContainer) {
      return;
    }

    var requiredDots = getResultsMaxPage() + 1;
    var dotMarkup = '';
    var dotIndex = 0;

    for (dotIndex = 0; dotIndex < requiredDots; dotIndex += 1) {
      dotMarkup += '<span class="dot' + (dotIndex === 0 ? ' active' : '') + '" data-dot="' + dotIndex + '"></span>';
    }

    dotsContainer.innerHTML = dotMarkup;
    dots = Array.from(dotsContainer.querySelectorAll('.dot'));
  }

  function setActiveResultAvatar(index) {
    avatarBtns.forEach(function (btn, btnIndex) {
      btn.classList.toggle('active', btnIndex === index);
    });
  }

  function setActiveResultDot(index) {
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === index);
    });
  }

  function showResultSlide(index, activeAvatarIndex) {
    if (!resultsSlides.length || !resultsViewport) {
      return 0;
    }

    var safePage = Math.max(0, Math.min(index, getResultsMaxPage()));
    var slidesTrack = document.getElementById('results-slides');
    var targetSlide = resultsSlides[safePage];
    var maxTranslate = Math.max(0, slidesTrack.scrollWidth - resultsViewport.clientWidth);
    var translateX = targetSlide ? Math.min(targetSlide.offsetLeft, maxTranslate) : 0;

    slidesTrack.style.transform = 'translateX(-' + translateX + 'px)';

    resultsSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === (activeAvatarIndex != null ? activeAvatarIndex : safePage));
    });

    setActiveResultAvatar(activeAvatarIndex != null ? activeAvatarIndex : safePage);
    setActiveResultDot(safePage);

    return safePage;
  }

  var currentResultSlide = 0;
  var currentActiveAvatar = 0;

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      currentResultSlide = currentResultSlide <= 0 ? getResultsMaxPage() : currentResultSlide - 1;
      currentActiveAvatar = currentResultSlide;
      showResultSlide(currentResultSlide, currentActiveAvatar);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      currentResultSlide = currentResultSlide >= getResultsMaxPage() ? 0 : currentResultSlide + 1;
      currentActiveAvatar = currentResultSlide;
      showResultSlide(currentResultSlide, currentActiveAvatar);
    });
  }

  avatarBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var avatarIndex = Number(btn.dataset.slide);
      currentActiveAvatar = avatarIndex;
      currentResultSlide = Math.min(avatarIndex, getResultsMaxPage());
      showResultSlide(currentResultSlide, currentActiveAvatar);
    });
  });

  if (dotsContainer) {
    dotsContainer.addEventListener('click', function (event) {
      var dot = event.target.closest('.dot');

      if (!dot) {
        return;
      }

      currentResultSlide = Number(dot.dataset.dot);
      currentActiveAvatar = Math.min(currentResultSlide, resultsSlides.length - 1);
      showResultSlide(currentResultSlide, currentActiveAvatar);
    });
  }

  var resultsAutoplay = window.setInterval(function () {
    currentResultSlide = currentResultSlide >= getResultsMaxPage() ? 0 : currentResultSlide + 1;
    currentActiveAvatar = currentResultSlide;
    showResultSlide(currentResultSlide, currentActiveAvatar);
  }, 6500);

  var resultsCarousel = document.getElementById('results-carousel');
  if (resultsCarousel) {
    resultsCarousel.addEventListener('mouseenter', function () {
      window.clearInterval(resultsAutoplay);
    });

    resultsCarousel.addEventListener('mouseleave', function () {
      window.clearInterval(resultsAutoplay);
      resultsAutoplay = window.setInterval(function () {
        currentResultSlide = currentResultSlide >= getResultsMaxPage() ? 0 : currentResultSlide + 1;
        currentActiveAvatar = currentResultSlide;
        showResultSlide(currentResultSlide, currentActiveAvatar);
      }, 6500);
    });
  }

  window.addEventListener('resize', function () {
    syncResultDots();
    currentResultSlide = Math.min(currentResultSlide, getResultsMaxPage());
    currentActiveAvatar = Math.min(currentActiveAvatar, resultsSlides.length - 1);
    showResultSlide(currentResultSlide, currentActiveAvatar);
  });

  syncResultDots();
  showResultSlide(0, 0);

  videoThumbs.forEach(function (thumb) {
    var video = thumb.querySelector('video');

    if (!video) {
      return;
    }

    thumb.addEventListener('click', function () {
      var isPlaying = !video.paused;

      videoThumbs.forEach(function (otherThumb) {
        var otherVideo = otherThumb.querySelector('video');
        if (otherVideo && otherVideo !== video) {
          otherVideo.pause();
          otherThumb.classList.remove('is-playing');
        }
      });

      if (isPlaying) {
        video.pause();
        thumb.classList.remove('is-playing');
      } else {
        video.play().catch(function () {
          return null;
        });
        thumb.classList.add('is-playing');
      }
    });

    video.addEventListener('pause', function () {
      thumb.classList.remove('is-playing');
    });

    video.addEventListener('play', function () {
      thumb.classList.add('is-playing');
    });
  });

  if (ingredientsRow) {
    var isDown = false;
    var startX = 0;
    var scrollLeft = 0;

    ingredientsRow.addEventListener('mousedown', function (event) {
      isDown = true;
      startX = event.pageX - ingredientsRow.offsetLeft;
      scrollLeft = ingredientsRow.scrollLeft;
      ingredientsRow.style.cursor = 'grabbing';
    });

    ingredientsRow.addEventListener('mouseleave', function () {
      isDown = false;
      ingredientsRow.style.cursor = '';
    });

    ingredientsRow.addEventListener('mouseup', function () {
      isDown = false;
      ingredientsRow.style.cursor = '';
    });

    ingredientsRow.addEventListener('mousemove', function (event) {
      if (!isDown) {
        return;
      }

      event.preventDefault();
      var x = event.pageX - ingredientsRow.offsetLeft;
      var walk = (x - startX) * 2;
      ingredientsRow.scrollLeft = scrollLeft - walk;
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
