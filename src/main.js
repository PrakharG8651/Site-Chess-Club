window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded");
});

window.addEventListener("load", () => {
  console.log("Window fully loaded");

  // Wait a bit extra to ensure everything is ready
  setTimeout(() => {
    // Test if DrawSVG works with a simple animation
    const testPath = document.querySelector("#c-path");
    if (testPath) {
      console.log("Found test path, attempting animation");
      gsap.set(testPath, { drawSVG: "0%" });
      gsap.to(testPath, {
        drawSVG: "100%",
        duration: 2,
        onStart: () => console.log("Test animation started"),
        onComplete: () => {
          console.log("Test animation complete, starting full animation");
          startFullAnimation();
        }
      });
    } else {
      console.error("Test path not found");
    }
  }, 2000);

  function startFullAnimation() {
    console.log("Starting full animation sequence");

    // Create timeline
    const tl = gsap.timeline();

    // Hide all paths initially
    const paths = [
      "#c-path", "#h-path", "#e-path", "#s1-path", "#s2-path",
      "#i1-path", "#i2-path", "#t-path", "#k-path"
    ];

    gsap.set(paths, { drawSVG: "0%" });
    gsap.set("#i1-dot, #i2-dot", { autoAlpha: 0 });

    // Animate dot first
    tl.fromTo("#dot",
      { scale: 0, transformOrigin: "center" },
      { scale: 1, duration: 0.5, ease: "back.out(1.5)" }
    );

    // Animate each path
    paths.forEach(path => {
      tl.to(path, {
        drawSVG: "100%",
        duration: 0.6,
        ease: "power2.inOut"
      }, "-=0.3");

      if (path === "#i1-path") {
        tl.to("#i1-dot", { autoAlpha: 1, duration: 0.3 }, "-=0.2");
      }

      if (path === "#i2-path") {
        tl.to("#i2-dot", { autoAlpha: 1, duration: 0.3 }, "-=0.2");
      }
    });

    console.log("Animation setup complete");
  }

  const svgObject = document.getElementById("pawn-svg");
  const progressBar = document.getElementById("bar");
  const loader = document.getElementById("loader");
  const siteContent = document.getElementById("site-content");

  function startLoading() {
    try {
      const svgDoc = svgObject.contentDocument;
      if (!svgDoc) {
        console.warn("SVG document not loaded yet.");
        return;
      }

      const pawnShapes = svgDoc.querySelectorAll("path, rect, circle, polygon");

      if (pawnShapes.length === 0) {
        console.warn("No animatable shapes found inside pawn SVG.");
      } else {
        gsap.to(pawnShapes, {
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          repeatDelay: 0.5,
          stagger: {
            amount: 1,
            from: "center"
          },
          keyframes: [
            { fill: "#00ff88" },
            { fill: "#5f9b41" },
            { fill: "#a97c50" },
            { fill: "#3b6cb7" },
            { fill: "#444c56" },
            { fill: "#5ec8d8" },
            { fill: "#e6c79c" },
            { fill: "#ffd700" },
            { fill: "#c0c0c0" },
            { fill: "#ffffff" }
          ]
        });
      }
    } catch (e) {
      console.warn("Pawn animation skipped:", e);
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1.5;
      progressBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);

        loader.style.transition = "opacity 0.8s ease";
        loader.style.opacity = 0;

        setTimeout(() => {
          loader.style.display = "none";
          siteContent.style.display = "block";
          requestAnimationFrame(() => {
            siteContent.style.opacity = 1;
          });
        }, 800);
      }
    }, 30);
  }

  svgObject.addEventListener("load", startLoading);

  if (svgObject.contentDocument) {
    startLoading();
  }
});

// Add IITK logo interaction
window.addEventListener("DOMContentLoaded", () => {
  const iitkChars = document.querySelectorAll(".char.iitk");

  iitkChars.forEach((char) => {
    const icon = document.createElement("div");
    icon.classList.add("icon", "logo");
    char.appendChild(icon);
  });
});

// Animated logo dot effect for "chessiitK"
/*window.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("animated-logo");
  const circle = document.getElementById("circle");
  const letters = Array.from(document.querySelectorAll(".logo-letter"));

  if (!logo || !circle || letters.length === 0) return;

  let currentIdx = 0; // 0 = before first letter, 1 = before second, etc.

  // Helper: move the circle before the letter at idx, and shift the letter to make space
  function moveCircleTo(idx, pop = true) {
    const rectLogo = logo.getBoundingClientRect();
    let target;
    let left, top;
    // Reset all letter shifts
    letters.forEach((letter, i) => {
      gsap.to(letter, { x: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(letter, { zIndex: 1, duration: 0.01 });
    });

    // Default: dot is slightly below the baseline
    let circleY = 18; // px down (adjust for your font size)
    let circleZ = 2;

    if (idx === 0) {
      target = letters[0];
      const rectTarget = target.getBoundingClientRect();
      left = rectTarget.left - rectLogo.left - circle.offsetWidth / 2 - 2;
    } else {
      target = letters[idx - 1];
      const rectTarget = target.getBoundingClientRect();
      left = rectTarget.right - rectLogo.left - circle.offsetWidth / 2 + 2;
      // Shift the letter to the left to make space for the dot
      gsap.to(target, {
        x: -circle.offsetWidth - 8, // 8px gap, adjust as needed
        duration: 0.25,
        ease: "power2.out",
        zIndex: 1
      });
      // When dot is popping up, animate Y from below to baseline
      if (pop) {
        circleY = 0;
        circleZ = 3;
      }
    }

    // Animate the circle
    gsap.to(circle, {
      x: left,
      y: circleY,
      zIndex: circleZ,
      duration: 0.32,
      ease: pop ? "back.out(1.7)" : "power2.inOut"
    });
    currentIdx = idx;
  }

  // Initial position (dot below the first letter)
  gsap.set(circle, { y: 18, zIndex: 2 });
  moveCircleTo(0, false);

  // Add hover listeners to each letter
  letters.forEach((letter, idx) => {
    letter.addEventListener("mouseenter", () => {
      moveCircleTo(idx + 1, true);
    });
    letter.addEventListener("mousemove", () => {
      moveCircleTo(idx + 1, true);
    });
  });

  // When mouse enters the logo area but not on a letter, reset to 0
  logo.addEventListener("mouseenter", (e) => {
    if (!e.target.classList.contains("logo-letter")) {
      moveCircleTo(0, true);
    }
  });

  // When mouse leaves the logo, animate back step-by-step to 0, popping down
  logo.addEventListener("mouseleave", () => {
    function stepBack(idx) {
      if (idx <= 0) {
        // Animate dot down below baseline at the end
        gsap.to(circle, { y: 18, duration: 0.32, ease: "power2.in" });
        return;
      }
      moveCircleTo(idx - 1, false);
      setTimeout(() => stepBack(idx - 1), 60);
    }
    stepBack(currentIdx);
  });
});*/

// Ensure this runs after page fully loads with images and everything
/*window.addEventListener("load", () => {
  console.log("Starting logo animation...");

  // Make sure GSAP plugins are registered
  if (typeof gsap === "undefined") {
    console.error("GSAP not loaded!");
    return;
  }

  if (!gsap.getProperty || !gsap.getProperty("div", "x")) {
    console.warn("GSAP not fully initialized yet, delaying...");
    setTimeout(initAnimation, 500);
  } else {
    initAnimation();
  }

  function initAnimation() {
    // Debug checks
    const allPathsExist = [
      "#dot", "#c-path", "#h-path", "#e-path", "#s1-path", "#s2-path",
      "#i1-path", "#i1-dot", "#i2-path", "#i2-dot", "#t-path", "#k-path"
    ].every(sel => {
      const el = document.querySelector(sel);
      if (!el) console.error(`Element ${sel} not found!`);
      return !!el;
    });

    if (!allPathsExist) {
      console.error("Some SVG paths are missing!");
      return;
    }

    const paths = [
      "#c-path", "#h-path", "#e-path", "#s1-path", "#s2-path",
      "#i1-path", "#i2-path", "#t-path", "#k-path"
    ];

    // Set initial state (invisible)
    gsap.set(paths, { drawSVG: "0% 0%" });
    gsap.set("#dot", { scale: 0, transformOrigin: "50% 50%" });
    gsap.set("#i1-dot", { autoAlpha: 0 });
    gsap.set("#i2-dot", { autoAlpha: 0 });

    // Create a timeline for sequenced animation
    const tl = gsap.timeline();

    // Animate dot first
    tl.to("#dot", {
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    });

    // Animate each letter path in sequence
    paths.forEach((selector, i) => {
      tl.to(selector, {
        drawSVG: "0% 100%",
        duration: 0.7,
        ease: "power1.inOut"
      }, "-=0.4"); // More overlap for smoother flow

      // Fade in i-dots after their stems
      if (selector === "#i1-path") {
        tl.to("#i1-dot", {
          autoAlpha: 1,
          duration: 0.3
        }, "-=0.3");
      }
      if (selector === "#i2-path") {
        tl.to("#i2-dot", {
          autoAlpha: 1,
          duration: 0.3
        }, "-=0.3");
      }
    });

    // Debug check - wait 1s for anything that might not be fully initialized
    setTimeout(() => {
      console.log("Starting the actual animation now...");

      // Reset all to visible first (for testing)
      gsap.set("#dot", { scale: 1, opacity: 1 });
      gsap.set("#i1-dot, #i2-dot", { opacity: 1 });

      // Animate just ONE path to test DrawSVGPlugin
      gsap.fromTo("#c-path",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 2 }
      );

      console.log("Animation started!");
    }, 1000);
  }
});*/

// Remove these imports at the top
// import { gsap } from "gsap";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Instead, add this after waiting for the script to load
/*
window.addEventListener("load", () => {
  // Make sure the global version is being used
  if (window.gsap && window.DrawSVGPlugin) {
    gsap.registerPlugin(DrawSVGPlugin);
    console.log("DrawSVGPlugin registered from globals");
    
    // Wait for everything to be truly ready
    setTimeout(initAnimation, 2000);
  } else {
    console.error("Global GSAP or DrawSVGPlugin not available");
  }
  
  function initAnimation() {
    // Simplified animation just to test
    console.log("Starting simple test animation");
    
    // Make dot visible immediately (for testing)
    gsap.set("#dot", { scale: 1 });
    
    // Test a single path
    const cPath = document.querySelector("#c-path");
    if (cPath) {
      // Make sure DrawSVG is being called correctly
      gsap.set(cPath, { drawSVG: "0%" });
      gsap.to(cPath, {
        drawSVG: "100%",
        duration: 2,
        delay: 0.5,
        onStart: () => console.log("Path animation started"),
        onComplete: () => console.log("Path animation complete")
      });
    }
  }
});*/

window.addEventListener("load", () => {
  setTimeout(() => {
    console.log("Starting alternative animation approach");
    
    // First hide all paths
    const paths = document.querySelectorAll("#chessiitk-svg path");
    const dots = [document.querySelector("#dot"), document.querySelector("#i1-dot"), document.querySelector("#i2-dot")];
    
    // Hide paths initially using stroke-dasharray/dashoffset technique
    paths.forEach(path => {
      if (path) {
        const length = path.getTotalLength ? path.getTotalLength() : 100;
        gsap.set(path, { 
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1
        });
      }
    });
    
    // Hide dots initially
    gsap.set(dots, { scale: 0, transformOrigin: "center" });
    
    // Create animation timeline
    const tl = gsap.timeline();
    
    // Animate the main dot first
    tl.to("#dot", { scale: 1, duration: 0.5, ease: "back.out(1.7)" });
    
    // Animate each letter path
    const pathIds = ["#c-path", "#h-path", "#e-path", "#s1-path", "#s2-path", 
                     "#i1-path", "#i2-path", "#t-path", "#k-path"];
    
    pathIds.forEach((id, index) => {
      const path = document.querySelector(id);
      if (path) {
        tl.to(path, { 
          strokeDashoffset: 0, 
          duration: 0.6,
          ease: "power1.inOut" 
        }, "-=0.3");
        
        // Add the i-dots after their stems
        if (id === "#i1-path") {
          tl.to("#i1-dot", { scale: 1, duration: 0.3 }, "-=0.2");
        }
        if (id === "#i2-path") {
          tl.to("#i2-dot", { scale: 1, duration: 0.3 }, "-=0.2");
        }
      }
    });
    
  }, 2000); // 2 second delay
});

document.addEventListener('DOMContentLoaded', () => {
  // Get the model viewer element
  const modelViewer = document.querySelector('.robot-model');
  
  // Make sure the model is loaded before attempting to manipulate it
  modelViewer.addEventListener('load', () => {
    // Add mouse move event listener to the document
    document.addEventListener('mousemove', (event) => {
      // Get the mouse position
      var mouseX = event.clientX;
      const rangeDecider= [280,960,1245,1600];
      const values=[280,560,808,1600];
      if(mouseX<rangeDecider[0]){
        mouseX=values[0];
      }
      else if(mouseX<=rangeDecider[1]){
        mouseX=(values[1]-values[0])*(mouseX-rangeDecider[0])/(rangeDecider[1]-rangeDecider[0])+values[0];
      }
      else if(mouseX<=rangeDecider[2]){
        mouseX=(values[2]-values[1])*(mouseX-rangeDecider[1])/(rangeDecider[2]-rangeDecider[1])+values[1];
      }
      else if(mouseX<=rangeDecider[3]){
        mouseX=(values[3]-values[2])*(mouseX-rangeDecider[2])/(rangeDecider[3]-rangeDecider[2])+values[2];
      }
      // Get the viewport width
      var viewportWidth = window.innerWidth;

      // Calculate the normalized position (-1 to 1)
      var normalizedX = (mouseX / viewportWidth) * 2 - 1;

      // Calculate the rotation angle (in degrees)
      // Map from -1...1 to -45...45 degrees of rotation
      const rotationAngle = normalizedX * -120; // 120 deg range of motion

      // Apply the rotation to the model by changing the camera orbit
      const currentOrbit = modelViewer.getAttribute('camera-orbit').split(' ');
      currentOrbit[0] = `${rotationAngle}deg`;
      
      // Update the camera orbit with the new rotation angle
      modelViewer.setAttribute('camera-orbit', currentOrbit.join(' '));
    });
  });
  
  // Add a small delay to ensure the model is fully loaded
  setTimeout(() => {
    // Set initial camera orbit
    const initialOrbit = modelViewer.getAttribute('camera-orbit').split(' ');
    initialOrbit[0] = "0deg"; // Reset horizontal rotation
    modelViewer.setAttribute('camera-orbit', initialOrbit.join(' '));
  }, 1000);
});

// Speech bubble behavior - only show on first load and when clicked

document.addEventListener('DOMContentLoaded', function() {
  // Get the speech bubble and model elements
  const speechBubble = document.getElementById('robot-speech');
  const modelViewer = document.querySelector('.robot-model');
  
  // Show the speech bubble when the page loads
  setTimeout(() => {
    speechBubble.classList.add('visible');
    
    // Hide the speech bubble after 5 seconds
    setTimeout(() => {
      speechBubble.classList.remove('visible');
    }, 5000);
  }, 1500); // Show after 1.5 seconds
  
  // Make the hit area for the robot clickable
  const robotHitArea = document.createElement('div');
  robotHitArea.className = 'robot-hit-area';
  robotHitArea.style.cssText = `
    position: fixed;
    right: 0;
    top: 150px;
    width: 300px;
    height: 500px;
    background-color: transparent;
    z-index: 15;
    cursor: pointer;
  `;
  document.body.appendChild(robotHitArea);
  
  // Make the bubble reappear when clicking the robot
  robotHitArea.addEventListener('click', () => {
    console.log('Robot clicked!'); // Debug log
    // Only show if it's not already visible
    if (!speechBubble.classList.contains('visible')) {
      speechBubble.classList.add('visible');
      
      // Hide it again after 4 seconds
      setTimeout(() => {
        speechBubble.classList.remove('visible');
      }, 4000);
    }
  });
  
  // Add direct click handler to the model viewer as a backup
  modelViewer.addEventListener('click', (event) => {
    console.log('Model viewer clicked!'); // Debug log
    event.stopPropagation();
    
    if (!speechBubble.classList.contains('visible')) {
      speechBubble.classList.add('visible');
      
      setTimeout(() => {
        speechBubble.classList.remove('visible');
      }, 4000);
    }
  });
});