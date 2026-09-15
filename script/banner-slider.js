const header = document.querySelector("header");
const menuButton = document.querySelector(".menu-trigger");
const categoryButtons = document.querySelectorAll(".category-button");

menuButton.addEventListener("click", function () {
  header.classList.toggle("menu-open");
});

categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const menuItem = button.parentElement;
    const category = menuItem.nextElementSibling;
    const categoryDetail = category.querySelector("details");

    category.classList.toggle("open");
    categoryDetail.open = category.classList.contains("open");
  });
});
document.querySelectorAll('.banner.swiper').forEach((banner) => {
  new Swiper(banner, {
    loop: true,
    speed: 700,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: banner.querySelector('.swiper-pagination'),
      clickable: true,
    },
    keyboard: { enabled: true },
  });
});
