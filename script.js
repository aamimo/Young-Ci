// Simple tab/page router using hash
(function () {
  const pages = document.querySelectorAll(".page");
  const links = document.querySelectorAll("[data-link]");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("menuToggle");

  function show(name) {
    pages.forEach((p) => p.classList.toggle("active", p.id === "page-" + name));
    links.forEach((l) =>
      l.classList.toggle("active", l.getAttribute("data-link") === name)
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    nav.classList.remove("open");
    document.title = titleFor(name);
  }

  function titleFor(name) {
    const map = {
      home: "Young City Foundation — Inspiring Young Lives Through Dance",
      about: "About — Young City Foundation",
      gallery: "Gallery — Young City Foundation",
      programs: "Programs — Young City Foundation",
      contact: "Contact — Young City Foundation",
    };
    return map[name] || map.home;
  }

  function fromHash() {
    const name = (location.hash || "#home").replace("#", "");
    show(["home", "about", "gallery", "programs", "contact"].includes(name) ? name : "home");
  }

  links.forEach((l) =>
    l.addEventListener("click", (e) => {
      e.preventDefault();
      const name = l.getAttribute("data-link");
      history.pushState(null, "", "#" + name);
      show(name);
    })
  );

  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  window.addEventListener("popstate", fromHash);
  fromHash();

  // Contact form
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! Your message has been received.");
      form.reset();
    });
  }
})();
