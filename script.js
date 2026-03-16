(function () {
  var yearNodes = document.querySelectorAll("#systemYear");
  var currentYear = new Date().getFullYear();

  yearNodes.forEach(function (node) {
    node.textContent = currentYear;
  });

  var btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  function toggleButton() {
    if (window.scrollY > 260) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  }

  window.addEventListener("scroll", toggleButton, { passive: true });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  toggleButton();
})();
