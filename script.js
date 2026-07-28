// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT - V3.3
// ===============================

// Global Audio References
let currentAudio = null;
let letterAudio = null;
let adhanAudio = null; // Will be assigned on DOMContentLoaded
let audioUnlocked = false;

document.addEventListener("DOMContentLoaded", () => {
  // Grab the audio element from HTML
  adhanAudio = document.getElementById("adhanAudio");
  
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem();
  initLetters();
  initAudioUnlock();
});

// ===============================
// AUDIO UNLOCK SYSTEM
// ===============================
function initAudioUnlock() {
  const unlock = () => {
    if (audioUnlocked) return;

    if (!adhanAudio) {
      adhanAudio = document.getElementById("adhanAudio");
    }

    if (adhanAudio) {
      adhanAudio.play().then(() => {
        adhanAudio.pause();
        adhanAudio.currentTime = 0;
        audioUnlocked = true;
        
        const unlockMsg = document.getElementById("unlockMsg");
        if (unlockMsg) unlockMsg.style.display = "none";
        
        console.log("Audio System: Active and Unlocked");
      }).catch(e => {
        console.log("Audio unlock pending user interaction:", e);
      });
    }
  };

  document.body.addEventListener("click", unlock, { once: true });
  document.body.addEventListener("touchstart", unlock, { once: true });
}

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
    const res = await fetch("hadiths.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.hadiths;
    
    if (!list || list.length === 0) throw new Error("No data found");

    const h = list[Math.floor(Math.random() * list.length)];
    
    box.innerHTML = `
      <div class="arabic" dir="rtl">${h.arabic || h.arab || ''}</div>
      <div class="translation">${h.english || h.en || ''}</div>
      <div class="reference" style="font-size: 0.8em; opacity: 0.7;">${h.reference || ''}</div>
    `;
  } catch (err) {
    console.error("Hadith error:", err);
    box.innerText = "Prophetic wisdom loading...";
  }
}

// ===============================
// SURAH LIST & QURAN
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

async function loadSurah() {
  const select = document.getElementById("surahSelect");
  if (!select) return;
  const num = parseInt(select.value);
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
let currentSurah = null;
let currentAyah = null;
let ayahElements = [];
let isPlayingSequence = false;

function stopAllAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (letterAudio) { letterAudio.pause(); letterAudio = null; }
  stopAdhan();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  isPlayingSequence = false;
  document.querySelectorAll(".ayah,.lesson").forEach(a => a.classList.remove("playing", "active"));
}

function getAudioUrl(reciter, surah, ayah) {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://everyayah.com/data/${reciter}/${s}${a}.mp3`;
}

function playAyah(surah, ayah, el) {
  stopAllAudio();

  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("playing"));
  el.classList.add("playing");
  el.scrollIntoView({behavior:"smooth", block:"center"});

  currentSurah = surah;
  currentAyah = ayah;
  ayahElements = document.querySelectorAll(".ayah");
  isPlayingSequence = true;

  const reciterSelect = document.getElementById("reciterSelect");
  const reciter = reciterSelect ? reciterSelect.value : "Alafasy_128kbps";
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

const cleanTime = (timeStr) => timeStr ? timeStr.trim().slice(0, 5) : "";

function saveAdhanCache(data) {
  localStorage.setItem('adhanCache', JSON.stringify(data));
}

function loadAdhanCache() {
  const cached = localStorage.getItem('adhanCache');
  return cached ? JSON.parse(cached) : null;
}

async function startAdhanSystem() {
  const cached = loadAdhanCache();
  if (cached) {
    prayerTimings = cached;
  }

  if (!adhanCheckInterval) {
    adhanCheckInterval = setInterval(checkAdhanTime, 20000); // 20-second check
  }

  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Kampala&country=Uganda&method=2`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const t = data.data.timings;

    prayerTimings = {
      Fajr: cleanTime(t.Fajr),
      Dhuhr: cleanTime(t.Dhuhr),
      Asr: cleanTime(t.Asr),
      Maghrib: cleanTime(t.Maghrib),
      Isha: cleanTime(t.Isha)
    };

    saveAdhanCache(prayerTimings);
    console.log("Prayer times updated:", prayerTimings);

  } catch (err) {
    console.log("Adhan fetch error:", err);
  }
}

function checkAdhanTime() {
  if (!Object.keys(prayerTimings).length) return;

  const now = new Date();
  const today = now.toDateString();
  const currentTime = now.getHours().toString().padStart(2, "0") + ":" + 
                      now.getMinutes().toString().padStart(2, "0");

  if (lastAdhanDate !== today) {
    lastAdhanPlayed = "";
    lastAdhanDate = today;
  }

  for (let p in prayerTimings) {
    if (currentTime === prayerTimings[p] && lastAdhanPlayed !== p) {
      triggerAdhan(p);
      lastAdhanPlayed = p;
    }
  }
}

function triggerAdhan(prayer) {
  stopAllAudio();

  if (!adhanAudio) {
    adhanAudio = document.getElementById("adhanAudio");
  }

  if (adhanAudio && audioUnlocked) {
    adhanAudio.currentTime = 0;
    adhanAudio.volume = 1.0; 
    
    adhanAudio.play().then(() => {
      console.log(`Playing Adhan for ${prayer}`);
      const stopBtn = document.getElementById("stopAdhanBtn");
      if(stopBtn) stopBtn.style.display = "block";
    }).catch(e => {
      console.log("Adhan blocked:", e);
      alert("Time for " + prayer + "! (Tap anywhere to enable audio)");
    });
  } else {
    alert("🕌 It is time for " + prayer);
  }

  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("🕌 Prayer Time", {
      body: `It's time for ${prayer} in Kampala`,
      icon: "logo.png"
    });
  }

  if (navigator.vibrate) navigator.vibrate([500, 300, 500]);
}

function stopAdhan() {
  if (adhanAudio) {
    adhanAudio.pause();
    adhanAudio.currentTime = 0;
  }
  const stopBtn = document.getElementById("stopAdhanBtn");
  if(stopBtn) stopBtn.style.display = "none";
}

// Called by <button onclick="testAdhan()">
function testAdhan() {
  if (!audioUnlocked) {
    alert("Tap anywhere on the screen first to enable audio.");
    return;
  }
  triggerAdhan("Test");
}

// =====================
// DATA: YASARNAH / LETTERS
// =====================
const yasarnahPages = [
  {
    title: "Dars 1: Alif - Yaa",
    info: "Single Letters",
    letters: [
      {a:"ا", name:"Alif", file:"blog/alif.mp3"},
      {a:"ب", name:"Ba", file:"blog/baa.mp3"},
      {a:"ت", name:"Ta", file:"blog/taa.mp3"},
      {a:"ث", name:"Tha", file:"blog/thaa.mp3"},
      {a:"ج", name:"Jim", file:"blog/jeem.mp3"},
      {a:"ح", name:"Ha", file:"blog/haa.mp3"},
      {a:"خ", name:"Kha", file:"blog/khaa.mp3"},
      {a:"د", name:"Dal", file:"blog/daal.mp3"}
    ]
  }
];

let currentDarsIndex = 0;
let currentLetterIndex = null;

function initLetters() {
  const darsTitle = document.getElementById("darsTitle");
  if (darsTitle) loadDars(0);
}

function loadDars(index) {
  stopAllAudio();
  currentDarsIndex = index;
  const dars = yasarnahPages[index];
  if (!dars) return;
  
  const titleEl = document.getElementById("darsTitle");
  const infoEl = document.getElementById("darsInfo");
  const counterEl = document.getElementById("darsCounter");
  const box = document.getElementById("lessonBox");

  if (titleEl) titleEl.innerText = dars.title;
  if (infoEl) infoEl.innerText = dars.info;
  if (counterEl) counterEl.innerText = `Page ${index + 1} / ${yasarnahPages.length}`;
  
  if (box) {
    box.innerHTML = ""; 
    dars.letters.forEach((l, i) => {
      box.innerHTML += `
        <div class="lesson" id="letter-${i}" onclick="startLetter(${i})">
          <div class="arabic">${l.a}</div>
          <div class="name">${l.name}</div>
        </div>
      `;
    });
  }
}

function startLetter(i) {
  stopAllAudio();
  currentLetterIndex = i;
  const dars = yasarnahPages[currentDarsIndex];
  if (!dars || !dars.letters[i]) return;

  const letter = dars.letters[i];
  
  document.querySelectorAll(".lesson").forEach((el, index) => {
    el.classList.toggle("active", index === i);
  });

  letterAudio = new Audio(letter.file);
  letterAudio.play().catch(e => {
    console.error("Letter audio failed:", e);
  });
}
