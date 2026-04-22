// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT - FIXED
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem();
  initLetters();
  unlockAudio(); // unlocks audio for Adhan + Ayah
});

// ===============================
// PWA
// ===============================
let deferredPrompt;

function initPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(e => console.log("SW failed:", e));
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById("installBtn");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = async () => {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        btn.style.display = "none";
      };
    }
  });
}

// ===============================
// YOUTUBE
// ===============================
function loadYoutubeVideos() {
  const box = document.getElementById("youtubeVideos");
  if (!box) return;

  const vids = ["ZGwG7UBlFCc", "zGIBIOMA0PQ"];
  box.innerHTML = vids.map(id => `
    <iframe width="100%" height="315"
    src="https://www.youtube.com/embed/${id}"
    title="YouTube video"
    frameborder="0"
    allowfullscreen></iframe><br><br>
  `).join("");
}

// ===============================
// DONATION - SINGLE VERSION
// ===============================
let hasCopied = false;

function copyMerchant() {
  navigator.clipboard.writeText("7037856").then(() => {
    hasCopied = true;
    alert("✅ Merchant number copied. You can now donate.");
    const btn = document.getElementById("donateBtn");
    if (btn) btn.style.display = "block";
  }).catch(() => {
    alert("Copy failed. Please copy manually: 7037856");
  });
}

function donate() {
  if (!hasCopied) {
    alert("⚠️ Please copy the merchant number first");
    return;
  }

  const amount = document.getElementById("amount").value;
  if (!amount || amount < 1000) {
    alert("Enter valid amount (minimum 1000 UGX)");
    return;
  }

  // NOTE: This USSD is Airtel only. MTN is *165*3*...
  const ussd = `*185*9*7037856*${amount}#`;
  window.location.href = "tel:" + encodeURIComponent(ussd);
}

// ===============================
// HADITH
// ===============================
async function loadHadith() {
  const box = document.getElementById("hadithBox");
  if (!box) return;

  try {
    const res = await fetch("hadith.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const h = data.hadiths[Math.floor(Math.random() * data.hadiths.length)];
    box.innerHTML = `
      <div class="arabic">${h.arab}</div>
      <div class="translation">${h.en}</div>
    `;
  } catch (err) {
    console.log("Hadith error:", err);
    box.innerText = "Failed to load Hadith";
  }
}

// ===============================
// SURAH LIST
// ===============================
function initSurahList() {
  const select = document.getElementById("surahSelect");
  if (!select) return;

  const names = ["Al-Fatiha", "Al-Baqarah", "Aal-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha"];
  names.forEach((n, i) => {
    const opt = document.createElement("option");
    opt.value = i + 1;
    opt.textContent = (i + 1) + " - " + n;
    select.appendChild(opt);
  });
}

// ===============================
// LOAD SURAH
// ===============================
async function loadSurah() {
  const num = parseInt(document.getElementById("surahSelect").value);
  if (!num) { alert("Select a Surah"); return; }

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,en.sahih`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    const ar = data.data[0].ayahs;
    const en = data.data[1].ayahs;
    let html = "";

    for (let i = 0; i < ar.length; i++) {
      html += `
      <div class="ayah" onclick="playAyah(${num},${i + 1},this)">
        <div class="arabic">${i + 1}. ${ar[i].text}</div>
        <div class="translation">${i + 1}. ${en[i].text}</div>
      </div>`;
    }
    document.getElementById("quranText").innerHTML = html;
  } catch (err) {
    console.log("Surah error:", err);
    document.getElementById("quranText").innerHTML = "Failed to load Surah";
  }
}

// ===============================
// AUDIO MANAGEMENT
// ===============================
let currentAudio = null;
let letterAudio = null;
let adhanAudio = null; // Reused audio object for Adhan to avoid autoplay block

function stopAllAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (letterAudio) { letterAudio.pause(); letterAudio = null; }
}

// ===============================
// AYAH AUDIO
// ===============================
let currentSurah = null;
let currentAyah = null;
let ayahElements = [];

function playAyah(surah, ayah, el) {
  stopAllAudio(); // stop letter audio if playing

  if (currentAudio && currentSurah === surah && currentAyah === ayah) {
    currentAudio.paused? currentAudio.play() : currentAudio.pause();
    return;
  }

  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("playing"));
  el.classList.add("playing");

  currentSurah = surah;
  currentAyah = ayah;
  ayahElements = document.querySelectorAll(".ayah");

  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  const url = `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;

  currentAudio = new Audio(url);
  currentAudio.play().catch(e => console.log("Ayah play error:", e));

  currentAudio.onended = () => {
    const next = ayah + 1;
    if (ayahElements[next - 1]) {
      playAyah(surah, next, ayahElements[next - 1]);
    }
  };
}

// ===============================
// ADHAN SYSTEM - FIXED
// ===============================
let prayerTimings = {};
let lastAdhanPlayed = "";
let lastAdhanDate = "";

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

function unlockAudio() {
  document.body.addEventListener("click", () => {
    // Create the adhan audio object once after user interaction
    if (!adhanAudio) {
      adhanAudio = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
      adhanAudio.load(); // preload
    }
  }, { once: true });
}

async function startAdhanSystem() {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Kampala&country=Uganda&method=2`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const t = data.data.timings;

    prayerTimings = {
      Fajr: t.Fajr.slice(0, 5),
      Dhuhr: t.Dhuhr.slice(0, 5),
      Asr: t.Asr.slice(0, 5),
      Maghrib: t.Maghrib.slice(0, 5),
      Isha: t.Isha.slice(0, 5)
    };

    setInterval(checkAdhanTime, 15000);
  } catch (err) {
    console.log("Adhan error:", err);
  }
}

function checkAdhanTime() {
  if (!Object.keys(prayerTimings).length) return;

  const now = new Date();
  const today = now.toDateString();
  const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

  // Reset lastAdhanPlayed at midnight so Fajr can play again next day
  if (lastAdhanDate!== today) {
    lastAdhanPlayed = "";
    lastAdhanDate = today;
  }

  for (let p in prayerTimings) {
    if (currentTime === prayerTimings[p] && lastAdhanPlayed!== p) {
      triggerAdhan(p);
      lastAdhanPlayed = p;
    }
  }
}

function triggerAdhan(prayer) {
  stopAllAudio(); // stop other audio first

  if (adhanAudio) {
    adhanAudio.currentTime = 0;
    adhanAudio.play().catch(e => console.log("Adhan blocked:", e));
  } else {
    // Fallback if user never clicked
    console.log("Adhan: user hasn't interacted yet, audio blocked");
  }

  if (Notification.permission === "granted") {
    new Notification("🕌 Prayer Time", { body: "It's time for " + prayer });
  }

  if (navigator.vibrate) {
    navigator.vibrate([500, 300, 500]);
  }
}

// ===============================
// YASARNAH - NOTE: URLs need replacing
// ===============================
const letters = [
  { a: "ا", name: "Alif", url: "REPLACE_ME" },
  { a: "ب", name: "Ba", url: "REPLACE_ME" },
  //... rest of letters. islamcan.com links don't work.
  // Use everyayah.com letter audios or host your own files
];

let currentIndex = null;
let repeat = 0;
let repeatCount = 3;

function initLetters() {
  const box = document.getElementById("lessonBox");
  if (!box) return;

  box.innerHTML = "";
  letters.forEach((l, i) => {
    box.innerHTML += `
    <div class="lesson" onclick="toggleLetter(${i})">
      <h2 style="font-size:42px">${l.a}</h2>
      <p>${l.name}</p>
    </div>`;
  });
}

function toggleLetter(i) {
  if (currentIndex === i && letterAudio) {
    letterAudio.paused? letterAudio.play() : letterAudio.pause();
    return;
  }
  startLetter(i);
}

function startLetter(i) {
  stopAllAudio(); // stop ayah audio if playing
  currentIndex = i;
  repeat = 0;
  playLetter();
}

function playLetter() {
  const l = letters[currentIndex];
  if (l.url === "REPLACE_ME") {
    console.log("Letter audio URL not set for", l.name);
    return;
  }
  letterAudio = new Audio(l.url);
  letterAudio.play().catch(e => console.log("Letter audio error:", e));
  highlightLetter(currentIndex);

  letterAudio.onended = () => {
    repeat++;
    if (repeat < repeatCount) {
      playLetter();
      return;
    }
    currentIndex++;
    if (currentIndex < letters.length) {
      repeat = 0;
      playLetter();
    }
  };
}

function highlightLetter(i) {
  document.querySelectorAll(".lesson").forEach((el, index) => {
    el.style.border = index === i? "2px solid gold" : "none";
  });
}
