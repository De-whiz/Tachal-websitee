document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("our-work-grid");
    const WORK_JSON_PATH = "https://raw.githubusercontent.com/De-whiz/tachael-landing/master/assets/our-work.json";
    let workData = {};
  
    // Typewriter effect for hero section
    function initTypewriter() {
      const typewriterText = document.getElementById('typewriter-text');
      if (!typewriterText) return;
      
      const words = ['Delivers', 'Drive Results', 'Convert', 'Work for You', 'Sell', 'Build Brands', 'Get You Noticed', 'Grow Businesses'];
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typingSpeed = 100;
      
      function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
          // Deleting characters
          typewriterText.textContent = currentWord.substring(0, charIndex - 1);
          charIndex--;
          typingSpeed = 50; // Faster when deleting
        } else {
          // Typing characters
          typewriterText.textContent = currentWord.substring(0, charIndex + 1);
          charIndex++;
          typingSpeed = 100; // Normal speed when typing
        }
        
        // Check if word is complete
        if (!isDeleting && charIndex === currentWord.length) {
          // Pause at the end of word
          typingSpeed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          // Move to next word
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          typingSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(type, typingSpeed);
      }
      
      // Start the typewriter effect
      setTimeout(type, 1000);
    }
  
    // Shuffle utility
    function shuffleArray(arr) {
      const array = arr.slice();
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    // Display 1 random image from 6 random categories
    function displayRandomProjects() {
      if (!gridContainer) return;
  
      gridContainer.innerHTML = ""; // Clear previous entries
  
      const categories = Object.keys(workData);
      const selectedCategories = shuffleArray(categories).slice(0, 6);
  
      selectedCategories.forEach(category => {
        const images = workData[category];
        if (!images || images.length === 0) return;
  
        const image = shuffleArray(images)[0];
  
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("work-category", "fade-start");
  
        const title = document.createElement("h3");
        title.textContent = category;
        categoryDiv.appendChild(title);
  
        const img = document.createElement("img");
        img.src = image;
        img.alt = category;
        img.classList.add("work-image");
  
        categoryDiv.appendChild(img);
        gridContainer.appendChild(categoryDiv);
      });
  
      observeNewFadeElements(); // Trigger observer for new elements
    }
  
    // Observer setup for animations
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // support both legacy "fade-*" and new "reveal-*" variants
          if (entry.target.classList.contains('fade-start')) {
            entry.target.classList.add('fade-in');
          }
          if (entry.target.classList.contains('reveal-start')) {
            entry.target.classList.add('reveal-in');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });
  
    // Attach observer to new fade-start elements
    function observeNewFadeElements() {
      const selector = '.fade-start:not(.fade-in), .reveal-start:not(.reveal-in)';
      const newCards = document.querySelectorAll(selector);
      newCards.forEach((card, idx) => {
        // add a small stagger so the reveal feels more polished
        const delay = `${(idx % 6) * 70}ms`;
        card.style.transitionDelay = delay;
        // also set for transforms/images inside
        card.querySelectorAll('img, h1, h2, p').forEach(el => el.style.transitionDelay = delay);
        observer.observe(card);
      });
    }

    // Observe any existing fade-start elements (e.g., service cards in the HTML)
    observeNewFadeElements();

    // Load data
    fetch(WORK_JSON_PATH)
    .then(res => res.json())
    .then(json => {
      workData = json;
      displayRandomProjects();
      setInterval(displayRandomProjects, 5000); // every 5 sec
    })
    .catch(err => {
      console.error("Failed to load ourwork.json", err);
    });
    
    // Initialize typewriter effect
    initTypewriter();
});

// Header / nav toggle behavior
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelector('#main-nav');

  if (!navToggle || !siteHeader || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteHeader.classList.toggle('nav-open');
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = siteHeader.classList.contains('nav-open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    siteHeader.classList.remove('nav-open');
    document.body.style.overflow = ''; // Restore scrolling
  }));

  // Close menu on resize to large screens
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && siteHeader.classList.contains('nav-open')) {
      siteHeader.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (siteHeader.classList.contains('nav-open') && 
        !siteHeader.contains(e.target) && 
        !navLinks.contains(e.target)) {
      siteHeader.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
});

document.getElementById('whatsapp-button').addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default link behavior

  const phone = '2349033952309'; // Your desired number
  const message = "Hi TACHAEL, I'd like to book a design service.";
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

  window.open(url, '_blank'); // Open WhatsApp with new link
});