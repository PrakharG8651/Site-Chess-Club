import gsap from "/node_modules/gsap";

gsap.to(".box", {
  x: 300,
  duration: 2,
  rotation: 360,
  backgroundColor: "#00ffcc",
  ease: "power2.out"
});
