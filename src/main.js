// Main initialization function to organize all code
function initializeApp() {
  const loader = {
    element: document.getElementById("loader"),
    progressBar: document.getElementById("bar"),
    svgObject: document.getElementById("pawn-svg"),
    siteContent: document.getElementById("site-content"),
    
    // Start the loading animation and progress
    start() {
      // Animate SVG pawn
      try {
        const svgDoc = this.svgObject.contentDocument;
        if (svgDoc) {
          const pawnShapes = svgDoc.querySelectorAll("path, rect, circle, polygon");
          if (pawnShapes.length > 0) {
            gsap.to(pawnShapes, {
              duration: 2.5,
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
              repeatDelay: 0.5,
              stagger: { amount: 1, from: "center" },
              keyframes: [
                { fill: "#00ff88" }, { fill: "#5f9b41" }, { fill: "#a97c50" },
                { fill: "#3b6cb7" }, { fill: "#444c56" }, { fill: "#5ec8d8" },
                { fill: "#e6c79c" }, { fill: "#ffd700" }, { fill: "#c0c0c0" },
                { fill: "#ffffff" }
              ]
            });
          }
        }
      } catch (e) {
        console.warn("Pawn animation skipped:", e);
      }

      // Progress bar animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1.5;
        this.progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
          clearInterval(interval);
          this.hide();
        }
      }, 30);
    },
    
    // Hide loader and show content
    hide() {
      this.element.style.transition = "opacity 0.8s ease";
      this.element.style.opacity = 0;

      setTimeout(() => {
        this.element.style.display = "none";
        this.siteContent.style.display = "block";
        requestAnimationFrame(() => {
          this.siteContent.style.opacity = 1;
        });
      }, 800);
    }
  };

  // Robot controller manages the 3D robot and speech bubble
  const robotController = {
    model: document.querySelector('.robot-model'),
    speechBubble: document.getElementById('robot-speech'),
    hitArea: null,
    
    initialize() {
      // Create hit area for clicks
      this.createHitArea();
      
      // Setup mouse tracking for rotation
      this.setupMouseTracking();
      
      // Initial speech bubble
      this.showInitialGreeting();
    },
    
    createHitArea() {
      this.hitArea = document.createElement('div');
      this.hitArea.className = 'robot-hit-area';
      this.hitArea.style.cssText = `
        position: fixed;
        right: 0;
        top: 150px;
        width: 300px;
        height: 500px;
        background-color: transparent;
        z-index: 15;
        cursor: pointer;
      `;
      document.body.appendChild(this.hitArea);
      
      // Click handler
      this.hitArea.addEventListener('click', () => {
        if (!this.speechBubble.classList.contains('visible')) {
          this.showSpeechBubble();
        }
      });
      
      // Backup click handler on the model itself
      if (this.model) {
        this.model.addEventListener('click', (event) => {
          event.stopPropagation();
          if (!this.speechBubble.classList.contains('visible')) {
            this.showSpeechBubble();
          }
        });
      }
    },
    
    setupMouseTracking() {
      if (!this.model) return;
      
      this.model.addEventListener('load', () => {
        document.addEventListener('mousemove', (event) => {
          const mouseX = this.calculateNormalizedMouseX(event.clientX);
          const viewportWidth = window.innerWidth;
          const normalizedX = (mouseX / viewportWidth) * 2 - 1;
          const rotationAngle = normalizedX * -120; // 120 deg range of motion
          
          // Update orbit
          const currentOrbit = this.model.getAttribute('camera-orbit').split(' ');
          currentOrbit[0] = `${rotationAngle}deg`;
          this.model.setAttribute('camera-orbit', currentOrbit.join(' '));
        });
      });
      
      // Set initial camera position
      setTimeout(() => {
        if (this.model) {
          const initialOrbit = this.model.getAttribute('camera-orbit').split(' ');
          initialOrbit[0] = "0deg"; // Reset horizontal rotation
          this.model.setAttribute('camera-orbit', initialOrbit.join(' '));
        }
      }, 1000);
    },
    
    calculateNormalizedMouseX(mouseX) {
      // Map mouse X to desired ranges
      const rangeDecider = [280, 960, 1245, 1600];
      const values = [280, 560, 808, 1600];
      
      if (mouseX < rangeDecider[0]) {
        return values[0];
      } 
      else if (mouseX <= rangeDecider[1]) {
        return (values[1]-values[0])*(mouseX-rangeDecider[0])/(rangeDecider[1]-rangeDecider[0])+values[0];
      } 
      else if (mouseX <= rangeDecider[2]) {
        return (values[2]-values[1])*(mouseX-rangeDecider[1])/(rangeDecider[2]-rangeDecider[1])+values[1];
      } 
      else if (mouseX <= rangeDecider[3]) {
        return (values[3]-values[2])*(mouseX-rangeDecider[2])/(rangeDecider[3]-rangeDecider[2])+values[2];
      }
      return mouseX;
    },
    
    showInitialGreeting() {
      if (!this.speechBubble) return;
      
      setTimeout(() => {
        this.speechBubble.classList.add('visible');
        
        // Hide after delay
        setTimeout(() => {
          this.speechBubble.classList.remove('visible');
        }, 5000);
      }, 2500); // Show after site has loaded
    },
    
    showSpeechBubble() {
      if (!this.speechBubble) return;
      
      this.speechBubble.classList.add('visible');
      
      // Hide after delay
      setTimeout(() => {
        this.speechBubble.classList.remove('visible');
      }, 4000);
    }
  };

  // Content animations
  const contentAnimator = {
    initialize() {
      setTimeout(() => {
        const mainTitle = document.querySelector('.main-title');
        const quote = document.querySelector('.chess-quote');
        const description = document.querySelector('.main-description');
        
        const tl = gsap.timeline();
        
        if (mainTitle) {
          tl.fromTo(mainTitle, 
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
        }
        
        if (quote) {
          tl.fromTo(quote, 
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 
            "-=0.4"
          );
        }
        
        if (description) {
          tl.fromTo(description, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 
            "-=0.4"
          );
        }
        
        // Example: Animate in all elements with .hidden-on-load
        gsap.to('.hidden-on-load', {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out"
        });
      }, 2500); // Start after loader finishes
    }
  };
  
  // Initialize components
  if (loader.svgObject) {
    loader.svgObject.addEventListener("load", () => loader.start());
    // Start loading anyway if content document already exists
    if (loader.svgObject.contentDocument) {
      loader.start();
    }
  }
  
  // Initialize robot after a short delay
  setTimeout(() => {
    robotController.initialize();
    contentAnimator.initialize();
  }, 500);
}

// Start the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);