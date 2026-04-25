// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT - V3.2
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem();
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

  const names = ["Al-Fatiha", "Al-Baqarah", "Aal-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu’minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu’ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"];

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
  stopAllAudio();

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
        <div class="arabic">${ar[i].text} ﴿${i+1}﴾</div>
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
// UNIFIED AUDIO MANAGEMENT
// ===============================
let currentAudio = null;
let letterAudio = null;
let adhanAudio = null;
let audioUnlocked = false;
let currentSurah = null;
let currentAyah = null;
let ayahElements = [];
let isPlayingSequence = false;
let isLetterPaused = false;

function stopAllAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (letterAudio) { letterAudio.pause(); letterAudio = null; }
  speechSynthesis.cancel();
  isPlayingSequence = false;
  isLetterPaused = false;
  document.querySelectorAll(".ayah,.lesson").forEach(a => a.classList.remove("playing", "active"));
}

// ===============================
// AYAH AUDIO - WORKING RECITERS
// ===============================
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

  const reciter = document.getElementById("reciterSelect").value || "Alafasy_128kbps";
  const url = getAudioUrl(reciter, surah, ayah);

  currentAudio = new Audio(url);

  currentAudio.onerror = () => {
    console.log(`Audio failed for ${reciter}`);
    el.classList.remove("playing");
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
    stopAllAudio();
  }
}

// ===============================
// ADHAN SYSTEM
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

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

function unlockAudio() {
  if (audioUnlocked) return true;
  if (!adhanAudio) {
    adhanAudio = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
    adhanAudio.preload = "auto";
  }

  const originalVolume = adhanAudio.volume;
  adhanAudio.volume = 0;

  const playPromise = adhanAudio.play();
  if (playPromise!== undefined) {
    return playPromise.then(() => {
      adhanAudio.pause();
      adhanAudio.currentTime = 0;
      adhanAudio.volume = originalVolume;
      audioUnlocked = true;
      const msg = document.getElementById("unlockMsg");
      if (msg) msg.style.display = "none";
      return true;
    }).catch(e => {
      adhanAudio.volume = originalVolume;
      return false;
    });
  }
  return Promise.resolve(false);
}

function initAudioUnlock() {
  const tryUnlock = () => { unlockAudio(); };
  document.body.addEventListener("click", tryUnlock);
  document.body.addEventListener("touchstart", tryUnlock);
}

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
      alert("Adhan time but browser blocked audio. Tap Test Adhan once to enable.");
    });
  } else {
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
// YASARNAH - PAGINATED QAIDA BOOK
// ===============================

// Split into pages/dars like real Qaida Nooraniyah
const yasarnahPages = [
  {
    title: "Dars 1: Single Letters",
    info: "Alif to Khaa",
    letters: [
      {a:"ا", name:"Alif"}, {a:"ب", name:"Ba"}, {a:"ت", name:"Ta"},
      {a:"ث", name:"Tha"}, {a:"ج", name:"Jeem"}, {a:"ح", name:"Haa"}, {a:"خ", name:"Kha"}
    ]
  },
  {
    title: "Dars 2: Single Letters",
    info: "Dal to Seen",
    letters: [
      {a:"د", name:"Dal"}, {a:"ذ", name:"Dhal"}, {a:"ر", name:"Ra"},
      {a:"ز", name:"Zay"}, {a:"س", name:"Seen"}, {a:"ش", name:"Sheen"}
    ]
  },
  {
    title: "Dars 3: Single Letters",
    info: "Sad to Ain",
    letters: [
      {a:"ص", name:"Sad"}, {a:"ض", name:"Dad"}, {a:"ط", name:"Taa"},
      {a:"ظ", name:"Zaa"}, {a:"ع", name:"Ain"}, {a:"غ", name:"Ghain"}
    ]
  },
  {
    title: "Dars 4: Single Letters",
    info: "Fa to Yaa",
    letters: [
      {a:"ف", name:"Fa"}, {a:"ق", name:"Qaf"}, {a:"ك", name:"Kaf"},
      {a:"ل", name:"Lam"}, {a:"م", name:"Meem"}, {a:"ن", name:"Noon"},
      {a:"ه", name:"Ha"}, {a:"و", name:"Waw"}, {a:"ي", name:"Yaa"}
    ]
  },
  {
    title: "Dars 5: Harakat - Fatha",
    info: "Letters with Zabar",
    letters: [
      {a:"اَ", name:"Alif Fatha"}, {a:"بَ", name:"Ba Fatha"}, {a:"تَ", name:"Ta Fatha"},
      {a:"ثَ", name:"Tha Fatha"}, {a:"جَ", name:"Jeem Fatha"}, {a:"حَ", name:"Haa Fatha"}
    ]
  },
  {
    title: "Dars 6: Harakat - Kasra",
    info: "Letters with Zer",
    letters: [
      {a:"اِ", name:"Alif Kasra"}, {a:"بِ", name:"Ba Kasra"}, {a:"تِ", name:"Ta Kasra"},
      {a:"ثِ", name:"Tha Kasra"}, {a:"جِ", name:"Jeem Kasra"}, {a:"حِ", name:"Haa Kasra"}
    ]
  },
  {
    title: "Dars 7: Harakat - Damma",
    info: "Letters with Pesh",
    letters: [
      {a:"اُ", name:"Alif Damma"}, {a:"بُ", name:"Ba Damma"}, {a:"تُ", name:"Ta Damma"},
      {a:"ثُ", name:"Tha Damma"}, {a:"جُ", name:"Jeem Damma"}, {a:"حُ", name:"Haa Damma"}
    ]
  },
  {
    title: "Dars 8: Sukoon/Jazm",
    info: "Letters with Sukoon",
    letters: [
      {a:"اَبْ", name:"Ab"}, {a:"اَتْ", name:"At"}, {a:"اَثْ", name:"Ath"},
      {a:"اَجْ", name:"Aj"}, {a:"اَحْ", name:"Ah"}, {a:"اَخْ", name:"Akh"}
    ]
  },
  {
    title: "Dars 9: Shaddah",
    info: "Letters with Tashdeed",
    letters: [
      {a:"اَبَّ", name:"Abba"}, {a:"اَتَّ", name:"Atta"}, {a:"اَثَّ", name:"Aththa"},
      {a:"اَجَّ", name:"Ajja"}, {a:"اَحَّ", name:"Ahha"}, {a:"اَخَّ", name:"Akhkha"}
    ]
  },
  {
    title: "Dars 10: Tanween - Fathatain",
    info: "Two Zabar",
    letters: [
      {a:"بً", name:"Ban"}, {a:"تً", name:"Tan"}, {a:"ثً", name:"Than"},
      {a:"جً", name:"Jan"}, {a:"حً", name:"Han"}, {a:"خً", name:"Khan"}
    ]
  },
  {
    title: "Dars 11: Tanween - Kasratain",
    info: "Two Zer",
    letters: [
      {a:"بٍ", name:"Bin"}, {a:"تٍ", name:"Tin"}, {a:"ثٍ", name:"Thin"},
      {a:"جٍ", name:"Jin"}, {a:"حٍ", name:"Hin"}, {a:"خٍ", name:"Khin"}
    ]
  },
  {
    title: "Dars 12: Tanween - Dammatain",
    info: "Two Pesh",
    letters: [
      {a:"بٌ", name:"Bun"}, {a:"تٌ", name:"Tun"}, {a:"ثٌ", name:"Thun"},
      {a:"جٌ", name:"Jun"}, {a:"حٌ", name:"Hun"}, {a:"خٌ", name:"Khun"}
    ]
  }
];

let currentDarsIndex = 0;
let currentLetterIndex = null;
let letterRepeat = 0;
let letterRepeatCount = 3;

function initLetters() {
  loadDars(currentDarsIndex);
}

function loadDars(index) {
  if(index < 0 || index >= yasarnahPages.length) return;

  currentDarsIndex = index;
  stopLetterLesson();

  const dars = yasarnahPages[index];
  document.getElementById("darsTitle").textContent = dars.title;
  document.getElementById("darsInfo").textContent = dars.info;
  document.getElementById("darsCounter").textContent = `Page ${index + 1} / ${yasarnahPages.length}`;

  const box = document.getElementById("lessonBox");
  if (!box) return;

  box.innerHTML = "";
  dars.letters.forEach((l, i) => {
    box.innerHTML += `
    <div class="lesson" id="letter-${i}" onclick="startLetter(${i})">
      <div class="arabic">${l.a}</div>
      <p>${l.name}</p>
    </div>`;
  });

  document.getElementById("letterProgress").textContent = "Tap any letter to start";
}

function nextDars() {
  if(currentDarsIndex < yasarnahPages.length - 1) {
    loadDars(currentDarsIndex + 1);
  }
}

function prevDars() {
  if(currentDarsIndex > 0) {
    loadDars(currentDarsIndex - 1);
  }
}

function startLetter(i) {
  stopAllAudio();
  currentLetterIndex = i;
  letterRepeat = 0;
  isPlayingSequence = false;
  playCurrentLetter();
}

function playCurrentLetter(){
  const dars = yasarnahPages[currentDarsIndex];
  if(currentLetterIndex === null || currentLetterIndex >= dars.letters.length){
    stopLetterLesson();
    return;
  }

  const letter = dars.letters[currentLetterIndex];
  highlightLetter(currentLetterIndex);
  updateLetterProgress();

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(letter.a);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.7;
  utterance.pitch = 1;

  utterance.onend = () => {
    if(isLetterPaused) return;

    if(!isPlayingSequence){
      setTimeout(() => {
        document.querySelectorAll(".lesson").forEach(l => l.classList.remove("active"));
      }, 300);
      return;
    }

    letterRepeat++;
    if(letterRepeat < letterRepeatCount){
      setTimeout(playCurrentLetter, 500);
    } else {
      currentLetterIndex++;
      letterRepeat = 0;
      if(currentLetterIndex < dars.letters.length && isPlayingSequence){
        setTimeout(playCurrentLetter, 800);
      } else {
        stopLetterLesson();
        document.getElementById("letterProgress").textContent = "✅ Dars complete! Press Next for next page";
      }
    }
  };

  utterance.onerror = () => {
    console.log("Speech error for", letter.name);
    if(isPlayingSequence){
      currentLetterIndex++;
      letterRepeat = 0;
      setTimeout(playCurrentLetter, 300);
    }
  };

  speechSynthesis.speak(utterance);
}

function toggleLetterSequence(){
  const playBtn = document.getElementById("letterPlayBtn");
  if(isPlayingSequence &&!isLetterPaused){
    speechSynthesis.pause();
    isLetterPaused = true;
    if(playBtn) playBtn.textContent = "▶ Resume";
  } else if(isLetterPaused){
    speechSynthesis.resume();
    isLetterPaused = false;
    if(playBtn) playBtn.textContent = "⏸ Pause";
  } else {
    stopAllAudio();
    currentLetterIndex = 0;
    letterRepeat = 0;
    isPlayingSequence = true;
    if(playBtn) playBtn.textContent = "⏸ Pause";
    playCurrentLetter();
  }
}

function stopLetterLesson(){
  speechSynthesis.cancel();
  isPlayingSequence = false;
  isLetterPaused = false;
  currentLetterIndex = null;
  letterRepeat = 0;
  const playBtn = document.getElementById("letterPlayBtn");
  if(playBtn) playBtn.textContent = "▶ Play Dars";
  document.querySelectorAll(".lesson").forEach(l => l.classList.remove("active"));
  const progress = document.getElementById("letterProgress");
  if(progress) progress.textContent = "Tap any letter to start";
}

function highlightLetter(i) {
  document.querySelectorAll(".lesson").forEach((el, index) => {
    el.classList.toggle("active", index === i);
  });
  const activeEl = document.getElementById(`letter-${i}`);
  if(activeEl) activeEl.scrollIntoView({behavior:"smooth", block:"center"});
}

function updateLetterProgress(){
  const progress = document.getElementById("letterProgress");
  const dars = yasarnahPages[currentDarsIndex];
  if(progress && currentLetterIndex!== null){
    progress.textContent = `${dars.letters[currentLetterIndex].name} - Repeat ${letterRepeat + 1}/${letterRepeatCount}`;
  }
  }
