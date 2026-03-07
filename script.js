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
<script>
const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  toggle.textContent =
    document.body.classList.contains("light-mode") ? "🌞" : "🌙";
});
</script>
<script>
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
    }
  });
});

sections.forEach(section=>{
  observer.observe(section);
});
</script>
function playAyah(surah, ayah, reciter) {
  const audioUrl = `https://everyayah.com/data/${reciter}/${String(surah).padStart(3,'0')}${String(ayah).padStart(3,'0')}.mp3`;
  const audio = new Audio(audioUrl);
  audio.play();
}
