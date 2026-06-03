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
  const statsSection = document.querySelector('.stats');
  const counters = document.querySelectorAll('.stat-num');
  
  // Base speed setting for large numbers (like 200 and 1,000)
  const speedSetting = 180; 

  const startCounting = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      
      const updateCount = () => {
        const count = +counter.innerText.replace(/,/g, '').replace(/\+/g, '');

        // CALCULATE STEP SIZE:
        // For small numbers (2 and 5), we force the increment to be exactly 1 
        // so they tick up individual step-by-step instead of jumping to the end.
        let increment;
        if (target <= 10) {
          increment = 1; 
        } else {
          increment = target / speedSetting;
        }

        if (count < target) {
          const nextCount = Math.ceil(count + increment);
          
          if (nextCount >= target) {
            finalizeCounter(counter, target);
          } else {
            // Format text dynamically during countdown
            if (target === 1000) {
              counter.innerText = nextCount.toLocaleString();
            } else if (target === 200) {
              counter.innerText = nextCount + "+";
            } else {
              counter.innerText = nextCount;
            }

            // ADJUST DELAY BASED ON TARGET:
            // Small numbers get a much longer delay (300ms) between numbers 
            // so the user can actually see them count 1... 2... 3...
            const currentDelay = target <= 10 ? 300 : 20;
            setTimeout(updateCount, currentDelay);
          }
        } else {
          finalizeCounter(counter, target);
        }
      };

      updateCount();
    });
  };

  // Helper function to set exact final appearance
  const finalizeCounter = (element, targetValue) => {
    if (targetValue === 1000) element.innerText = "1,000";
    else if (targetValue === 200) element.innerText = "200+";
    else element.innerText = targetValue;
  };

  // Scroll Trigger Logic using Intersection Observer
  if (statsSection) {
    const observerOptions = {
      root: null,
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounting();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(statsSection);
  } else {
    startCounting();
  }
});
