import { gsap } from "gsap";

window.addEventListener("load", () => {
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
