// Fade-in animation for cards
window.addEventListener("scroll", () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
      card.style.transition = "all 0.6s ease";
    }
  });
});
