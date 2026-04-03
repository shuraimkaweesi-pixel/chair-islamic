// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem(); // start adhan
});

// ===============================
// PWA INSTALL + SERVICE WORKER
// ===============================
let deferredPrompt;

function initPWA() {

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW failed", err));
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.getElementById("installBtn");

    if (installBtn) {
      installBtn.style.display = "block";

      installBtn.onclick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      };
    }
  });
}

// ===============================
// YOUTUBE VIDEOS
// ===============================
function loadYoutubeVideos() {
  const youtubeContainer = document.getElementById("youtubeVideos");
  if (!youtubeContainer) return;

  const videoIDs = ["ZGwG7UBlFCc", "zGIBIOMA0PQ"];

  youtubeContainer.innerHTML = videoIDs.map(id => `
    <iframe width="100%" height="315"
      src="https://www.youtube.com/embed/${id}"
      allowfullscreen>
    </iframe><br><br>
  `).join("");
}

// ===============================
// PRAYER TIMES (DISPLAY)
// ===============================
function getPrayerTimes() {

  const city = document.getElementById("cityInput")?.value || "Kampala";
  const prayerBox = document.getElementById("prayerTimes");

  if (!prayerBox) return;

  fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`)
    .then(r => r.json())
    .then(data => {

      const t = data.data.timings;

      prayerBox.innerHTML = `
        Fajr: ${t.Fajr}<br>
        Dhuhr: ${t.Dhuhr}<br>
        Asr: ${t.Asr}<br>
        Maghrib: ${t.Maghrib}<br>
        Isha: ${t.Isha}
      `;
    })
    .catch(() => {
      prayerBox.innerHTML = "Failed to load prayer times";
    });
}

// ===============================
// 🔊 REAL ADHAN SYSTEM (FIXED)
// ===============================

let prayerTimesCache = {};
let lastNotifiedPrayer = "";

// ask permission once
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

async function startAdhanSystem() {

  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=Kampala&country=Uganda&method=2`
    );

    const data = await res.json();
    const t = data.data.timings;

    // clean times
    prayerTimesCache = {
      Fajr: t.Fajr.slice(0,5),
      Dhuhr: t.Dhuhr.slice(0,5),
      Asr: t.Asr.slice(0,5),
      Maghrib: t.Maghrib.slice(0,5),
      Isha: t.Isha.slice(0,5)
    };

    console.log("Adhan Times Loaded:", prayerTimesCache);

    // check every 15 seconds
    setInterval(checkPrayerTime, 15000);

  } catch (err) {
    console.log("Adhan fetch error", err);
  }
}

function checkPrayerTime() {

  const now = new Date();
  const currentTime =
    now.getHours().toString().padStart(2, "0") + ":" +
    now.getMinutes().toString().padStart(2, "0");

  for (let name in prayerTimesCache) {

    if (
      prayerTimesCache[name] === currentTime &&
      lastNotifiedPrayer !== name
    ) {
      triggerAdhan(name);
      lastNotifiedPrayer = name;
    }
  }
}

// ===============================
// 🔊 TRIGGER ADHAN
// ===============================
function triggerAdhan(prayer) {

  console.log("Adhan:", prayer);

  // 🔔 PUSH TO SERVICE WORKER (BACKGROUND)
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "PLAY_ADHAN",
      prayer: prayer
    });
  }

  // 🔊 Play sound if app is open
  const audio = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
  audio.play().catch(() => {});

  // 🔔 Notification
  if (Notification.permission === "granted") {
    new Notification("🕌 Prayer Time", {
      body: `It's time for ${prayer}`
    });
  }
}

// ===============================
// DONATION
// ===============================
function donateAirtel() {
  const amount = document.getElementById("donationAmount")?.value;

  if (!amount) {
    alert("Enter donation amount");
    return;
  }

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
    const data = await res.json();

    const random =
      data.hadiths[Math.floor(Math.random() * data.hadiths.length)];

    box.innerHTML = `
      <div class="arabic">${random.arab}</div>
      <div class="translation">${random.en}</div>
    `;
  } catch {
    box.innerText = "Could not load Hadith";
  }
}

// ===============================
// QURAN AUDIO FIX (NO DOUBLE PLAY)
// ===============================
let currentAudio;
let fullSurahAudio;

function playAyah(surah, ayah, element) {

  // STOP FULL SURAH
  if (fullSurahAudio) fullSurahAudio.pause();

  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("playing"));
  element.classList.add("playing");

  const surahCode = String(surah).padStart(3, "0");
  const ayahCode = String(ayah).padStart(3, "0");

  const url =
    "https://everyayah.com/data/Alafasy_128kbps/" +
    surahCode + ayahCode + ".mp3";

  if (currentAudio) currentAudio.pause();

  currentAudio = new Audio(url);
  currentAudio.play();

  document.getElementById("audioPlayer").innerHTML =
    `<audio controls autoplay src="${url}" style="width:100%"></audio>`;
}

// ===============================
// DOWNLOAD
// ===============================
function downloadSurah() {

  const surahNumber = parseInt(document.getElementById("surahSelect").value);

  if (!surahNumber) {
    alert("Select a Surah first");
    return;
  }

  const code = String(surahNumber).padStart(3, "0");
  const url = "https://server8.mp3quran.net/afs/" + code + ".mp3";

  const a = document.createElement("a");
  a.href = url;
  a.download = "Surah_" + code + ".mp3";
  a.click();
}
