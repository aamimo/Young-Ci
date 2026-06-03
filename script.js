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

  // Updated Contact form with Silent Redirect
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending...";

      const data = new FormData(form);

      fetch("https://formspree.io/f/xzdoalgl", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          // Success: Redirect to your custom page
          window.location.href = "thanks.html";
        } else {
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


// Dynamic 3D Interactive Tilt & Shine Effect for Support Cards
const cards = document.querySelectorAll('.visual-tilt');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    
    // Calculate accurate mouse position coordinate inside the card boundary bounding box
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Assign positional coordinates as custom CSS variables for our radial spot reflection element
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    // Mathematical rotation coordinates mapping center point vectors (-0.5 to 0.5 ratio bounds)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Max tilt up/down up to 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10;  // Max tilt left/right up to 10 degrees
    
    // Apply smooth 3D transform values dynamically matrix-wide
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Dynamically illuminate border lines on tracking states using custom inline attribute color data
    const hoverColor = card.getAttribute('data-color');
    card.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.3), 0 0 15px ${hoverColor}`;
  });

  // Re-center smoothly when mouse leaves the element frame area boundaries completely
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = 'none';
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.stat-num');
  const speed = 100; // Lower numbers make it faster, higher numbers make it slower

  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText.replace(/,/g, '').replace(/\+/g, '');

      // Determine how fast to increment based on target size
      const increment = target / speed;

      if (count < target) {
        // Add the increment value and round it up
        const nextCount = Math.ceil(count + increment);
        
        // Format numbers cleanly as they count up
        if (target === 1000) {
          counter.innerText = nextCount.toLocaleString(); // Adds the comma for 1,000
        } else if (target === 200) {
          counter.innerText = nextCount + "+"; // Adds the plus sign back to 200+
        } else {
          counter.innerText = nextCount;
        }

        // Call function again after a micro-delay (approx 15-20ms)
        setTimeout(updateCount, 15);
      } else {
        // Ensure it settles precisely on the exact target format at the finish
        if (target === 1000) counter.innerText = "1,000";
        else if (target === 200) counter.innerText = "200+";
        else counter.innerText = target;
      }
    };

    updateCount();
  });
});
