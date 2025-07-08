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
            const currentThumbnails = Array.from(
              thumbnailBorderDom.querySelectorAll(".item")
            );
            const clickedIndex = currentThumbnails.indexOf(thumb);
            moveToIndex(clickedIndex);
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
    $(".reviews-grid").masonry({
      columnWidth: $(".reviews-grid").width() / 12,
      itemSelector: ".review-tile",
      percentPosition: true,
    });

    $(".reviews-grid").on("click", ".review-tile", function () {
      const activeTile = $(".review-tile.active");
      $(this).addClass("active");
      $(".review-tile").not(this).removeClass("active");

      // Replace the data-rows and data-cols attributes with active previous active tile
      const activeRows = activeTile.attr("data-rows");
      const activeCols = activeTile.attr("data-cols");
      const currentRows = $(this).attr("data-rows");
      const currentCols = $(this).attr("data-cols");

      activeTile.attr("data-rows", currentRows);
      activeTile.attr("data-cols", currentCols);
      $(this).attr("data-rows", activeRows);
      $(this).attr("data-cols", activeCols);

      // Reinitialize Masonry layout
      $(".reviews-grid").masonry("layout");
    });
  }
});
