// 반응형 헤더 메뉴
const header = document.querySelector("header");
const navigation = header?.querySelector("nav");
if (navigation) {
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "menu-toggle";
  toggle.innerHTML = '<span></span><span></span><span></span>';
  navigation.id = "header-menu";
  toggle.setAttribute("aria-controls", navigation.id);
  header.insertBefore(toggle, navigation);
  header.classList.add("has-menu-toggle");
  const mobileMenu = window.matchMedia("(max-width: 1024px)");

  function setMenu(open) {
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    if (!open) navigation.querySelectorAll("details[open]").forEach(detail => detail.open = false);
  }

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  navigation.addEventListener("click", event => {
    if (event.target.closest("a") && mobileMenu.matches) setMenu(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  mobileMenu.addEventListener("change", () => {
    const focused = document.activeElement;
    setMenu(false);
    if (mobileMenu.matches && navigation.contains(focused)) toggle.focus();
    else if (!mobileMenu.matches && focused === toggle) navigation.querySelector("a")?.focus();
  });
  setMenu(false);
}

// 상품 검색
const products = document.querySelector("#products");
if (products) {
  const buttons = [...document.querySelectorAll("[data-category]")];
  const cards = [...products.querySelectorAll(".card")];
  const search = document.querySelector("#search");
  const requested = new URLSearchParams(location.search).get("category");
  let category = buttons.some(button => button.dataset.category === requested) ? requested : "전체";
  function filter() {
    const query = search.value.replace(/\s/g, "").toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const match = (category === "전체" || card.dataset.group === category) && card.dataset.name.toLowerCase().includes(query);
      card.hidden = !match;
      if (match) count++;
    });
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === category)));
    document.querySelector("#count").textContent = count;
    document.querySelector("#empty").hidden = count !== 0;
  }
  buttons.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.category;
    filter();
  }));
  search.addEventListener("input", filter);
  filter();
}


// 메인 배너
const banner = document.querySelector("[data-banner]");

if (banner) {
    const pictures = [
        "image/main/메인 배너.png",
        "image/main/메인배너(2).png",
        "image/main/메인배너(3).png",
        "image/main/메인배너(4).png"
    ];

    Promise.all(pictures.map(src => new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(src);
        image.onerror = () => resolve(null);
        image.src = src;
    }))).then(loaded => {
        const images = loaded.filter(Boolean);
        if (images.length < 2) return;

        const slide = document.createElement("div");
        slide.className = "slide";
        slide.setAttribute("aria-hidden", "true");
        const track = document.createElement("div");
        track.className = "track";

        [...images, images[0]].forEach(src => {
            const image = document.createElement("img");
            image.src = src;
            image.alt = "";
            track.append(image);
        });
        slide.append(track);
        banner.prepend(slide);

        let current = 0;
        let timer;

        function reset() {
            if (current !== images.length) return;
            track.style.transition = "none";
            current = 0;
            track.style.transform = "translateX(0)";
        }

        track.addEventListener("transitionend", event => {
            if (event.propertyName === "transform") reset();
        });

        function start() {
            clearInterval(timer);
            if (document.hidden) return;
            reset();
            timer = setInterval(() => {
                track.style.transition = "transform 1s ease-in-out";
                current++;
                track.style.transform = "translateX(-" + current * 100 + "%)";
            }, 4000);
        }

        document.addEventListener("visibilitychange", start);
        start();
    });
}

// 모든 페이지에서 따라오는 맨 위로 버튼
const backToTop = document.createElement("button");
backToTop.type = "button";
backToTop.className = "back-to-top";
backToTop.setAttribute("aria-label", "맨 위로 이동");
backToTop.textContent = "TOP";
backToTop.hidden = window.scrollY < 300;
document.body.append(backToTop);
window.addEventListener("scroll", () => {
  backToTop.hidden = window.scrollY < 300;
}, { passive: true });
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  header?.querySelector(".logo")?.focus({ preventScroll: true });
});
