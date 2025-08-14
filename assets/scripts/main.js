document.addEventListener("DOMContentLoaded", function () {
  const links = {
    "bg-ggbs": "ekoblend-ggbs.html",
    "bg-tarshakti": "tarshakti.html",
    "bg-gfrp": "ekobar-gfrp.html",
    "bg-market": "marketplace.html"
  };

  Object.entries(links).forEach(([className, url]) => {
    const el = document.querySelector(`.${className}`);
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", function () {
        window.location.href = url;
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Change breakpoint as per your mobile definition (e.g., 768px)
  if (window.innerWidth <= 768) {
    const images = document.querySelectorAll(".swiper-slide img");

    images.forEach((img) => {
      if (img.src.includes("home-banner-1.png")) {
        img.src = img.src.replace("home-banner-1.png", "home-banner-1m.jpg");
      } else if (img.src.includes("home-banner-2.png")) {
        img.src = img.src.replace("home-banner-2.png", "home-banner-2m.jpg");
      } else if (img.src.includes("home-banner-3.png")) {
        img.src = img.src.replace("home-banner-3.png", "home-banner-3m.jpg");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 768) { // Mobile breakpoint
    const images = document.querySelectorAll(".cities-carousel .carousel-items img");

    images.forEach((img) => {
      if (img.src.includes("cities-bg-mumbai.jpg")) {
        img.src = img.src.replace("cities-bg-mumbai.jpg", "cities-bg-mumbai-m.jpg");
      } else if (img.src.includes("cities-bg-chennai.jpg")) {
        img.src = img.src.replace("cities-bg-chennai.jpg", "cities-bg-chennai-m.jpg");
      } else if (img.src.includes("cities-bg-bangalore.jpg")) {
        img.src = img.src.replace("cities-bg-bangalore.jpg", "cities-bg-bangalore-m.jpg");
      } else if (img.src.includes("cities-bg-delhi.jpg")) {
        img.src = img.src.replace("cities-bg-delhi.jpg", "cities-bg-delhi-m.jpg");
      } else if (img.src.includes("cities-bg-hubli.jpg")) {
        img.src = img.src.replace("cities-bg-hubli.jpg", "cities-bg-hubli-m.jpg");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Calculate header height on load and resize, then store it in a CSS variable
  function setHeaderHeight() {
    const header = document.querySelector("header");
    if (header) {
      const headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerHeight}px`
      );
    }
  }
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  // Home banner swiper
  {
    const swiperContainer = document.querySelector(
      ".hero-banner-section .swiper"
    );
    if (swiperContainer) {
      // Attach slices to slides
      const SLICE_COUNT = 6;
      document.querySelectorAll(".swiper-slide").forEach((slide) => {
        const bgImg = slide.querySelector(".slide-bg")?.src;
        const slicesContainer = slide.querySelector(".slices-container");

        if (!bgImg || !slicesContainer) return;

        // Clear any hardcoded slices if present
        slicesContainer.innerHTML = "";

        for (let i = 0; i < SLICE_COUNT; i++) {
          const slice = document.createElement("div");
          slice.className = "slice";

          const img = document.createElement("img");
          img.src = bgImg;
          img.style.width = `${SLICE_COUNT * 100}%`;
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.position = "absolute";
          img.style.top = "0";
          img.style.left = "0";
          img.style.transform = `translateX(-${
            (100 / SLICE_COUNT) * i
          }%) scale(1.05)`;

          slice.appendChild(img);
          slicesContainer.appendChild(slice);
        }
      });
      const swiper = new Swiper(".swiper-container", {
        loop: true,
        speed: 400,
        effect: "fade",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
autoplay: {
    delay: 4000, // 4 seconds
    disableOnInteraction: false, // Keep autoplay even after user swipes
  },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          init: function () {
            animateSlide(this.slides[this.activeIndex]);
          },
          slideChangeTransitionStart: function () {
            // DO NOT reset here or you’ll see a flicker / black screen
          },
          slideChangeTransitionEnd: function () {
            // Reset all slides first
            this.slides.forEach(resetSlide);
            // Animate the new one
            animateSlide(this.slides[this.activeIndex]);
          },
        },
      });

      function animateSlide(slide) {
        if (!slide) return;

        const slices = slide.querySelectorAll(".slice");
        const content = slide.querySelector(".slide-content");
        const number = slide.querySelector(".slide-number");
        const bg = slide.querySelector(".slide-bg");

        // Animate slices with stagger
        slices.forEach((slice, index) => {
          setTimeout(() => {
            slice.classList.add("animate-in");
          }, index * 80);
        });

        // Show background image after slices animate
        setTimeout(() => {
          if (bg) bg.style.opacity = "1";
        }, slices.length * 80 + 300);

        // Animate text content and number
        setTimeout(() => {
          content?.classList.add("active");
          number?.classList.add("active");
        }, slices.length * 80 + 600);
      }

      function resetSlide(slide) {
        const slices = slide.querySelectorAll(".slice");
        const content = slide.querySelector(".slide-content");
        const number = slide.querySelector(".slide-number");
        const bg = slide.querySelector(".slide-bg");

        slices.forEach((slice, index) => {
          setTimeout(() => {
            slice.classList.remove("animate-in");
          }, index * 80);
        });

        content?.classList.remove("active");
        number?.classList.remove("active");
        if (bg) bg.style.opacity = "0";
      }

      // Trigger the first slide manually just in case
      setTimeout(() => {
        const firstSlide = document.querySelector(".swiper-slide-active");
        if (firstSlide) animateSlide(firstSlide);
      }, 300);
    }
  }


  // Cities section swiper
  {
    document.querySelectorAll(".cities-carousel").forEach(initCarousel);

    function initCarousel(carouselDom) {
      const nextBtn = carouselDom.querySelector(".arrows .next");
      const prevBtn = carouselDom.querySelector(".arrows .prev");
      const sliderDom = carouselDom.querySelector(".carousel-items");
      const thumbnailBorderDom = carouselDom.querySelector(
        ".carousel-thumbnails-inner"
      );
      const timeDom = carouselDom.querySelector(".time");

      let timeRunning = 3000;
      let timeAutoNext = 7000;
      let runTimeOut;
      let runNextAuto;

      function resetClasses() {
        carouselDom.classList.remove("next", "prev");
      }

      function resetAutoPlay() {
        clearTimeout(runNextAuto);
        runNextAuto = setTimeout(() => nextBtn.click(), timeAutoNext);
      }

      function moveToIndex(targetIndex) {
        const thumbnails = thumbnailBorderDom.querySelectorAll(".item");
        const activeIndex = 0;

        const steps = targetIndex - activeIndex;
        for (let i = 0; i <= steps; i++) {
          sliderDom.appendChild(sliderDom.children[0]);
          thumbnailBorderDom.appendChild(thumbnailBorderDom.children[0]);
        }

        carouselDom.classList.add("next");
        clearTimeout(runTimeOut);
        runTimeOut = setTimeout(resetClasses, timeRunning);
        resetAutoPlay();
        bindThumbnailClicks(); // Important
      }

      function bindThumbnailClicks() {
        const thumbnailItems = thumbnailBorderDom.querySelectorAll(".item");
        thumbnailItems.forEach((thumb) => {
          thumb.onclick = () => {
            resetClasses();
            const currentThumbnails = Array.from(
              thumbnailBorderDom.querySelectorAll(".item")
            );
            const clickedIndex = currentThumbnails.indexOf(thumb);
            setTimeout(() => {
              moveToIndex(clickedIndex);
            }, 200);
          };
        });
      }

      function showSlider(type) {
        if (type === "next") {
          sliderDom.appendChild(sliderDom.children[0]);
          thumbnailBorderDom.appendChild(thumbnailBorderDom.children[0]);
          carouselDom.classList.add("next");
        } else {
          sliderDom.prepend(sliderDom.lastElementChild);
          thumbnailBorderDom.prepend(thumbnailBorderDom.lastElementChild);
          carouselDom.classList.add("prev");
        }

        clearTimeout(runTimeOut);
        runTimeOut = setTimeout(resetClasses, timeRunning);
        resetAutoPlay();
        bindThumbnailClicks(); // rebind after move
      }

      nextBtn.onclick = () => showSlider("next");
      prevBtn.onclick = () => showSlider("prev");

      runNextAuto = setTimeout(() => nextBtn.click(), timeAutoNext);
      bindThumbnailClicks(); // Initial bind
    }
  }

  // Reviews section
  {
    document.querySelectorAll(".review-tile").forEach((tile) => {
      const cols = tile.getAttribute("data-cols") || 1;
      const rows = tile.getAttribute("data-rows") || 1;
      tile.style.gridColumn = `span ${cols}`;
      tile.style.gridRow = `span ${rows}`;

      // On click, swap content with active tile
      tile.addEventListener("click", () => {
        if (window.innerWidth <= 992) {
          // For mobile, just toggle active class
          document
            .querySelectorAll(".review-tile")
            .forEach((t) => t.classList.remove("active"));
          tile.classList.add("active");
          return;
        }

        const activeTile = document.querySelector(".review-tile.active");

        if (tile === activeTile) return; // no need to swap with itself

        // Elements to swap
        const activeTitle = activeTile.querySelector(".review-title");
        const activeContent = activeTile.querySelector(".review-content");

        const clickedTitle = tile.querySelector(".review-title");
        const clickedContent = tile.querySelector(".review-content");

        // Add transition classes
        activeTile.classList.add("fade-out");
        tile.classList.add("fade-out");

        setTimeout(() => {
          // Swap innerHTML
          const tempTitle = activeTitle.innerHTML;
          const tempContent = activeContent.innerHTML;

          activeTitle.innerHTML = clickedTitle.innerHTML;
          activeContent.innerHTML = clickedContent.innerHTML;

          clickedTitle.innerHTML = tempTitle;
          clickedContent.innerHTML = tempContent;

          // Remove transition classes after animation
          activeTile.classList.remove("fade-out");
          tile.classList.remove("fade-out");
        }, 300); // should match animation duration
      });
    });
  }

  // Counter animation
  // This function counts up from 0 to the target number over a specified duration
  {
    function countUp(el, duration = 1500) {
      const target = parseFloat(el.getAttribute("data-target"));
      const isDecimal = target % 1 !== 0;
      let start = 0;
      const fps = 120;
      const totalFrames = Math.round(duration / (1000 / fps));
      let frame = 0;

      function update() {
        frame++;
        const progress = frame / totalFrames;
        const current = target * progress;

        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

        if (frame < totalFrames) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
    }

    const counters = document.querySelectorAll(".counter");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(entry.target);
            obs.unobserve(entry.target); // run only once
          }
        });
      },
      {
        threshold: 0.6, // adjust based on how much should be visible
      }
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  }

  // GFRP application tiles
  {
    document.querySelectorAll(".gfrp-application-tile").forEach((tile) => {
      const cols = tile.getAttribute("data-cols") || 1;
      const rows = tile.getAttribute("data-rows") || 1;
      const bg = tile.getAttribute("data-bg") || "";
      tile.style.gridColumn = `span ${cols}`;
      tile.style.gridRow = `span ${rows}`;
      tile.style.backgroundImage = `url(${bg})`;
    });
  }
});

// filter animation

const filterButtons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    // Hide all items instantly
    items.forEach((item) => {
      item.classList.remove("show");
      item.style.display = "none";
    });

    // Then show only matching items with zoom-in
    setTimeout(() => {
      items.forEach((item) => {
        if (filter === "all" || item.classList.contains(filter)) {
          item.style.display = "block";
          setTimeout(() => item.classList.add("show"), 10); // trigger animation
        }
      });
    }, 100); // small delay to allow reset
  });
});

// Show all items on page load
window.onload = () => {
  items.forEach((item) => {
    item.style.display = "block";
    setTimeout(() => item.classList.add("show"), 10);
  });

  const getQuoteForm = document.getElementById("get-quote-form");

  // Newsletter form submission
  function showMessage(message, type = "info") {
    const messageDiv = getQuoteForm.querySelector(".response-message");
    messageDiv.textContent = message;
    messageDiv.classList.remove("info", "success", "error");
    messageDiv.classList.add(type);
  }

  getQuoteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const phone = this.phone.value.trim();
    const message = this.message.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9\-\+\s\(\)]+$/;

    if (name.length < 2) {
      showMessage("Please enter a valid name (min 2 characters).", "error");
      return;
    }

    if (!emailPattern.test(email)) {
      showMessage("Please enter a valid email.", "error");
      return;
    }

    if (!phonePattern.test(phone)) {
      showMessage("Please enter a valid phone number.", "error");
      return;
    }

    if (message.length < 10) {
      showMessage("Message must be at least 10 characters.", "error");
      return;
    }

    const formData = new FormData(this);

    try {
      const response = await fetch("send_mail.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      showMessage(
        result.message,
        result.status === "success" ? "success" : "error"
      );

      if (result.status === "success") {
        this.reset(); // Clear form on success
      }
    } catch (error) {
      showMessage("An unexpected error occurred. Please try again.", "error");
    }
  });
};

// Marketplace

