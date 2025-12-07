document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.getElementById("main-container");
  const navList = document.getElementById("nav-dots");
  const outroSection = document.querySelector(".outro-section");

  // Gallery Data
  const galleryData = [
    { name: "1", count: 2, title: "" },
    { name: "2대학원", count: 38, title: "대학원" },
    { name: "4양화진", count: 10, title: "양화진" },
    { name: "5이스라엘", count: 4, title: "이스라엘" },
    { name: "6메노라", count: 14, title: "메노라" },
    { name: "7히브리", count: 39, title: "히브리" },
    { name: "8독수리", count: 12, title: "독수리" },
    { name: "9전경", count: 7, title: "전경" },
    { name: "10포스터", count: 11, title: "포스터" },
  ];

  // 1. Generate Gallery Sections and insert before Outro
  galleryData.forEach((data, index) => {
    const section = document.createElement("section");
    section.className = "page-section gallery-section";

    // Title
    const title = document.createElement("h2");
    title.className = "section-title fade-up";
    title.style.marginBottom = "50px";
    title.textContent = `Part ${index + 4}. ${data.title}`;
    section.appendChild(title);

    // Slider Container
    const sliderContainer = document.createElement("div");
    sliderContainer.className = "slider-container fade-in";

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "slider-wrapper";

    const createImg = (i) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      const img = document.createElement("img");
      img.src = `assets/${data.name}/${i}.jpg`;
      img.alt = `${data.title} ${i}`;
      img.loading = "lazy";
      img.onerror = function () {
        if (this.src.endsWith(".jpg")) {
          this.src = this.src.replace(".jpg", ".png");
        } else {
          this.parentElement.style.display = "none";
        }
      };
      slide.appendChild(img);
      return slide;
    };

    // Repeat logic for smooth marquee
    let repeatCount = 2;
    if (data.count < 5) repeatCount = 6;
    else if (data.count < 10) repeatCount = 4;

    for (let r = 0; r < repeatCount; r++) {
      for (let i = 1; i <= data.count; i++) {
        sliderWrapper.appendChild(createImg(i));
      }
    }

    // Animation Duration
    const totalImages = data.count * repeatCount;
    const duration = Math.max(15, totalImages * 2.5);
    sliderWrapper.style.setProperty("--duration", `${duration}s`);

    sliderContainer.appendChild(sliderWrapper);
    section.appendChild(sliderContainer);

    // Append after Outro (at the end of mainContainer)
    mainContainer.appendChild(section);
  });

  // 1.5 Generate Link Section to All Gallery
  const linkSection = document.createElement("section");
  linkSection.className = "page-section link-section";
  linkSection.style.display = "flex";
  linkSection.style.justifyContent = "center";
  linkSection.style.alignItems = "center";
  linkSection.style.background = "black";

  const linkBtn = document.createElement("a");
  linkBtn.href = "gallery.html";
  linkBtn.className = "gallery-link-btn";
  linkBtn.textContent = "VIEW ALL GALLERY";
  linkBtn.style.padding = "20px 40px";
  linkBtn.style.border = "1px solid var(--accent-gold)";
  linkBtn.style.color = "var(--accent-gold)";
  linkBtn.style.textDecoration = "none";
  linkBtn.style.fontSize = "1.5rem";
  linkBtn.style.fontFamily = "var(--font-heading)";
  linkBtn.style.transition = "0.3s";

  linkBtn.onmouseover = () => {
    linkBtn.style.background = "var(--accent-gold)";
    linkBtn.style.color = "black";
  };
  linkBtn.onmouseout = () => {
    linkBtn.style.background = "transparent";
    linkBtn.style.color = "var(--accent-gold)";
  };

  linkSection.appendChild(linkBtn);
  mainContainer.appendChild(linkSection);

  // Lightbox Logic (Removed from here as it's now in gallery.html)
  // But we need to remove the event listeners if they exist, or just clean up.
  // Since we are replacing the code block, it's fine.

  // 2. Generate Nav Dots for ALL sections
  const allSections = document.querySelectorAll(".page-section");
  allSections.forEach((_, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;
    if (index === 0) li.classList.add("active");
    navList.appendChild(li);
  });

  // Initialize Scroll Logic
  initScrollLogic(allSections);
});

function initScrollLogic(sections) {
  const mainContainer = document.getElementById("main-container");
  const navDots = document.querySelectorAll(".side-nav li");
  let currentSectionIndex = 0;
  let isScrolling = false;
  const totalSections = sections.length;

  // Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const animatedElements = entry.target.querySelectorAll(
          ".fade-up, .fade-right, .fade-left"
        );
        animatedElements.forEach((el) => el.classList.add("visible"));
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // Scroll Function
  function scrollToSection(index) {
    if (index < 0 || index >= totalSections) return;

    currentSectionIndex = index;
    const offset = -currentSectionIndex * 100;
    mainContainer.style.transform = `translateY(${offset}%)`;

    navDots.forEach((dot) => dot.classList.remove("active"));
    if (navDots[currentSectionIndex]) {
      navDots[currentSectionIndex].classList.add("active");
    }

    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }

  // Only enable custom scroll events on desktop
  if (window.innerWidth > 768) {
    // Wheel Event
    window.addEventListener(
      "wheel",
      (e) => {
        if (isScrolling) return;
        if (e.deltaY > 0) {
          if (currentSectionIndex < totalSections - 1) {
            isScrolling = true;
            scrollToSection(currentSectionIndex + 1);
          }
        } else {
          if (currentSectionIndex > 0) {
            isScrolling = true;
            scrollToSection(currentSectionIndex - 1);
          }
        }
      },
      { passive: false }
    );

    // Keyboard Event
    window.addEventListener("keydown", (e) => {
      if (isScrolling) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (currentSectionIndex < totalSections - 1) {
          isScrolling = true;
          scrollToSection(currentSectionIndex + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (currentSectionIndex > 0) {
          isScrolling = true;
          scrollToSection(currentSectionIndex - 1);
        }
      }
    });

    // Nav Dot Click Event
    navDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        if (isScrolling || currentSectionIndex === index) return;
        isScrolling = true;
        scrollToSection(index);
      });
    });
  }

  // Hero Animation
  const titleSpans = document.querySelectorAll(".main-title span");
  titleSpans.forEach((span, index) => {
    span.style.opacity = "0";
    span.style.transform = "translateY(20px)";
    span.style.transition = "opacity 1s ease, transform 1s ease";
    setTimeout(() => {
      span.style.opacity = "1";
      span.style.transform = "translateY(0)";
    }, 500 + index * 400);
  });
}
