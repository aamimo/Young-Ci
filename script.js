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

  // --- UPDATED CONTACT FORM LOGIC ---
  const form = document.getElementById("contactForm");
  
  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // 1. Show the user something is happening
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending...";

      // 2. Prepare the data
      const data = new FormData(form);

      // 3. Send to Formspree via AJAX (in the background)
      fetch("https://formspree.io/f/xzdoalgl", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          // 4. If successful, jump to your custom thanks.html page!
          window.location.href = "thanks.html";
        } else {
          // If there's an error, let the user know
          alert("Oops! There was a problem. Please try again.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }).catch(error => {
        alert("Connection error. Please check your internet.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    });
  }
})();
