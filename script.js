// NAVBAR TOGGLE
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

// SCROLL ANIMATIONS
window.addEventListener("scroll", function() {
  document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 50);

  document.querySelectorAll(".fade-in").forEach(section => {
    const rect = section.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100) {
      section.classList.add("show");
    }
  });
});

// AI SECTION
async function getAnswer() {
  const question = document.getElementById("userQuestion").value.trim();
  if(!question) return;

  const answerEl = document.getElementById("aiAnswer");
  answerEl.innerText = "Thinking...";

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    answerEl.innerText = data.answer || "Sorry, no answer available.";
    answerEl.classList.add("show");
  } catch(err) {
    answerEl.innerText = "Error contacting AI. Try again later.";
    console.error(err);
  }
}
