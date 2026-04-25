// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT - V2.1
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem(); // Runs on all pages now
  initLetters();
  initAudioUnlock();
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
// DONATION
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

  const ussd = `*185*9*7037856*${amount}#`;
  const a = document.createElement('a');
  a.href = "tel:" + encodeURIComponent(ussd);
  a.click();
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

  const quranText = document.getElementById("quranText");
  if (quranText) quranText.innerHTML = "Loading...";

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
    if (quranText) quranText.innerHTML = html;
  } catch (err) {
    console.log("Surah error:", err);
    if (quranText) quranText.innerHTML = "Failed to load Surah";
  }
}

// ===============================
// AUDIO MANAGEMENT
// ===============================
let currentAudio = null;
let letterAudio = null;
let adhanAudio = null;
let audioUnlocked = false;

function stopAllAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (letterAudio) { letterAudio.pause(); letterAudio = null; }
}

// ===============================
// ===============================
// AYAH AUDIO - FIXED FOR ALL RECITERS
// ===============================
let currentAudio = null;
let currentSurah = null;
let currentAyah = null;
let ayahElements = [];
let isPlayingSequence = false;

function getAudioUrl(reciter, surah, ayah) {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://everyayah.com/data/${reciter}/${s}${a}.mp3`;
}

function playAyah(surah, ayah, el) {
  stopAllAudio();

  if (currentAudio && currentSurah === surah && currentAyah === ayah) {
    currentAudio.paused? currentAudio.play() : currentAudio.pause();
    return;
  }

  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("playing"));
  el.classList.add("playing");
  el.scrollIntoView({behavior:"smooth", block:"center"});

  currentSurah = surah;
  currentAyah = ayah;
  ayahElements = document.querySelectorAll(".ayah");
  isPlayingSequence = true;

  // Get reciter from select - this was hardcoded before
  const reciter = document.getElementById("reciterSelect").value || "Alafasy_128kbps";
  const url = getAudioUrl(reciter, surah, ayah);

  currentAudio = new Audio(url);

  currentAudio.onerror = () => {
    console.log(`Audio failed for ${reciter}`);
    el.classList.remove("playing");
    // Auto-skip to next ayah if this one fails
    if(isPlayingSequence) playNextAyah();
  };

  currentAudio.play().catch(e => {
    console.log("Ayah play error:", e);
    alert("Tap the screen once to enable audio, then try again.");
  });

  currentAudio.onended = () => {
    if(isPlayingSequence) playNextAyah();
  };
}

function playNextAyah(){
  if(!isPlayingSequence) return;
  const next = currentAyah + 1;
  if (ayahElements[next - 1]) {
    playAyah(currentSurah, next, ayahElements[next - 1]);
  } else {
    stopAudio();
  }
}

function stopAudio(){
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (letterAudio) {
    letterAudio.pause();
    letterAudio = null;
  }
  isPlayingSequence = false;
  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("playing"));
}

// ===============================
// ADHAN SYSTEM - FIXED FOR ANDROID
// ===============================
let prayerTimings = {};
let lastAdhanPlayed = "";
let lastAdhanDate = "";
let adhanCheckInterval = null;

const KAMPALA_LAT = 0.3476;
const KAMPALA_LON = 32.5825;

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function saveAdhanCache(data) {
  localStorage.setItem('adhanData', JSON.stringify({
    date: getTodayKey(),
    timings: data
  }));
}

function loadAdhanCache() {
  const cached = localStorage.getItem('adhanData');
  if (!cached) return null;
  const parsed = JSON.parse(cached);
  if (parsed.date === getTodayKey()) return parsed.timings;
  return null;
}

// Request notification permission early
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

// ===============================
// AUDIO UNLOCK - ANDROID PROOF
// ===============================
function unlockAudio() {
  if (audioUnlocked) return true;
  if (!adhanAudio) {
    adhanAudio = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
    adhanAudio.preload = "auto";
  }

  const originalVolume = adhanAudio.volume;
  adhanAudio.volume = 0; // Silent unlock

  const playPromise = adhanAudio.play();
  if (playPromise!== undefined) {
    return playPromise.then(() => {
      adhanAudio.pause();
      adhanAudio.currentTime = 0;
      adhanAudio.volume = originalVolume;
      audioUnlocked = true;
      const msg = document.getElementById("unlockMsg");
      if (msg) msg.style.display = "none";
      console.log("Adhan audio unlocked");
      return true;
    }).catch(e => {
      console.log("Unlock attempt failed:", e);
      adhanAudio.volume = originalVolume;
      return false;
    });
  }
  return Promise.resolve(false);
}

function initAudioUnlock() {
  // Try unlock on any interaction, keeps retrying until it works
  const tryUnlock = () => { unlockAudio(); };
  document.body.addEventListener("click", tryUnlock);
  document.body.addEventListener("touchstart", tryUnlock);
}

// ===============================
// TEST ADHAN - FORCES UNLOCK FIRST
// ===============================
async function testAdhan() {
  const unlocked = await unlockAudio();
  if (!unlocked &&!audioUnlocked) {
    alert("Browser blocked audio. Tap the screen anywhere first, then press Test Adhan again.");
    return;
  }
  triggerAdhan("Test");
}

async function startAdhanSystem() {
  const cached = loadAdhanCache();
  if (cached) {
    prayerTimings = cached;
    if (!adhanCheckInterval) setInterval(checkAdhanTime, 15000);
  }

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

    saveAdhanCache(prayerTimings);
    if (!adhanCheckInterval) setInterval(checkAdhanTime, 15000);

  } catch (err) {
    console.log("Adhan error:", err);
  }

  if (navigator.geolocation &&!cached) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const distance = Math.abs(lat - KAMPALA_LAT) + Math.abs(lon - KAMPALA_LON);
      if (distance > 0.5) {
        fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
        .then(r => r.json())
        .then(d => {
            const t = d.data.timings;
            prayerTimings = {
              Fajr: t.Fajr.slice(0, 5),
              Dhuhr: t.Dhuhr.slice(0, 5),
              Asr: t.Asr.slice(0, 5),
              Maghrib: t.Maghrib.slice(0, 5),
              Isha: t.Isha.slice(0, 5)
            };
            saveAdhanCache(prayerTimings);
          }).catch(()=>{});
      }
    }, ()=>{}, {timeout: 5000});
  }
}

function checkAdhanTime() {
  if (!Object.keys(prayerTimings).length) return;

  const now = new Date();
  const today = now.toDateString();
  const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

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
  stopAllAudio();

  if (adhanAudio && audioUnlocked) {
    adhanAudio.currentTime = 0;
    adhanAudio.play().catch(e => {
      console.log("Adhan blocked:", e);
      alert("Adhan time but browser blocked audio. Keep the page open and tap Test Adhan once to enable.");
    });
  } else {
    console.log("Adhan time but audio not unlocked yet.");
    alert("It's time for " + prayer + " but audio is blocked. Tap the page then use Test Adhan button.");
  }

  if (Notification.permission === "granted") {
    new Notification("🕌 Prayer Time", {
      body: "It's time for " + prayer,
      icon: "logo.png"
    });
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
  { a: "ت", name: "Ta", url: "REPLACE_ME" },
  { a: "ث", name: "Tha", url: "REPLACE_ME" },
  { a: "ج", name: "Jeem", url: "REPLACE_ME" },
  { a: "ح", name: "Ha", url: "REPLACE_ME" },
  { a: "خ", name: "Kha", url: "REPLACE_ME" },
  { a: "د", name: "Dal", url: "REPLACE_ME" },
  { a: "ذ", name: "Dhal", url: "REPLACE_ME" },
  { a: "ر", name: "Ra", url: "REPLACE_ME" },
  { a: "ز", name: "Zay", url: "REPLACE_ME" },
  { a: "س", name: "Seen", url: "REPLACE_ME" },
  { a: "ش", name: "Sheen", url: "REPLACE_ME" },
  { a: "ص", name: "Sad", url: "REPLACE_ME" },
  { a: "ض", name: "Dad", url: "REPLACE_ME" },
  { a: "ط", name: "Taa", url: "REPLACE_ME" },
  { a: "ظ", name: "Zaa", url: "REPLACE_ME" },
  { a: "ع", name: "Ain", url: "REPLACE_ME" },
  { a: "غ", name: "Ghain", url: "REPLACE_ME" },
  { a: "ف", name: "Fa", url: "REPLACE_ME" },
  { a: "ق", name: "Qaf", url: "REPLACE_ME" },
  { a: "ك", name: "Kaf", url: "REPLACE_ME" },
  { a: "ل", name: "Lam", url: "REPLACE_ME" },
  { a: "م", name: "Meem", url: "REPLACE_ME" },
  { a: "ن", name: "Noon", url: "REPLACE_ME" },
  { a: "ه", name: "Ha", url: "REPLACE_ME" },
  { a: "و", name: "Waw", url: "REPLACE_ME" },
  { a: "ي", name: "Yaa", url: "REPLACE_ME" }
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
  stopAllAudio();
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
