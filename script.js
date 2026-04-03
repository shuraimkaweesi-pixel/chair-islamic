// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT
// ===============================

// Run after page loads
document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem(); // ✅ start once
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
    allowfullscreen></iframe><br><br>
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

let prayerTimes = {};
let lastNotifiedPrayer = "";

// Ask permission once
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

async function startAdhanSystem(){

  try {

    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=Kampala&country=Uganda&method=2`
    );

    const data = await res.json();
    const t = data.data.timings;

    prayerTimes = {
      Fajr: t.Fajr.slice(0,5),
      Dhuhr: t.Dhuhr.slice(0,5),
      Asr: t.Asr.slice(0,5),
      Maghrib: t.Maghrib.slice(0,5),
      Isha: t.Isha.slice(0,5)
    };

    console.log("Adhan Times:", prayerTimes);

    // check every 15 sec
    setInterval(checkPrayerTime, 15000);

  } catch (err) {
    console.log("Adhan error", err);
  }
}

function checkPrayerTime(){

  const now = new Date();

  const currentTime =
    now.getHours().toString().padStart(2,"0") + ":" +
    now.getMinutes().toString().padStart(2,"0");

  for(let name in prayerTimes){

    if(prayerTimes[name] === currentTime && lastNotifiedPrayer !== name){

      triggerAdhan(name);
      lastNotifiedPrayer = name;

    }
  }
}

// ===============================
// 🔔 TRIGGER ADHAN
// ===============================
function triggerAdhan(prayer){

  console.log("Adhan:", prayer);

  // send to service worker
  if(navigator.serviceWorker && navigator.serviceWorker.controller){
    navigator.serviceWorker.controller.postMessage({
      type: "PRAYER_ALERT",
      prayer: prayer
    });
  }

  // play sound if app open
  const audio = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
  audio.play().catch(()=>{});

  // notification
  if(Notification.permission === "granted"){
    new Notification("🕌 Prayer Time", {
      body: "It's time for " + prayer
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

    const random = data.hadiths[Math.floor(Math.random()*data.hadiths.length)];

    box.innerHTML = `
      <div class="arabic">${random.arab}</div>
      <div class="translation">${random.en}</div>
    `;

  } catch {
    box.innerText = "Could not load Hadith";
  }
}

// ===============================
// QURAN SETUP
// ===============================
function initSurahList() {

  const surahSelect = document.getElementById("surahSelect");
  if (!surahSelect) return;

  const surahNames = ["Al-Fatiha","Al-Baqarah","Aal-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu’minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu’ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddathir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat","Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];

  surahNames.forEach((name,i)=>{
    const option = document.createElement("option");
    option.value = i+1;
    option.textContent = (i+1)+" - "+name;
    surahSelect.appendChild(option);
  });
}

// ===============================
// LOAD SURAH (JSON SAFE VERSION)
// ===============================
async function loadSurah(){

const surahNumber = parseInt(document.getElementById("surahSelect").value);

if(!surahNumber){
alert("Select a Surah");
return;
}

try{

const arabicRes = await fetch("quran.json");
const englishRes = await fetch("quran_en.json");

const arabicData = await arabicRes.json();
const englishData = await englishRes.json();

const arabicSurah = arabicData[surahNumber-1];
const englishSurah = englishData[surahNumber-1];

let html = "";

for(let i=0;i<arabicSurah.verses.length;i++){

html += `
<div class="ayah" onclick="playAyah(${surahNumber},${i+1},this)">
<div class="arabic">${i+1}. ${arabicSurah.verses[i].text}</div>
<div class="translation">${i+1}. ${englishSurah.verses[i]?.translation}</div>
</div>`;
}

document.getElementById("quranText").innerHTML = html;

}catch(err){

console.error(err);
document.getElementById("quranText").innerHTML =
"<p style='color:red'>Failed to load Surah</p>";

}
}

// ===============================
// PLAY AYAH (NO DOUBLE AUDIO)
// ===============================
let currentAudio;
let fullSurahAudio;

function playAyah(surah, ayah, element){

if(fullSurahAudio){
fullSurahAudio.pause();
}

document.querySelectorAll(".ayah").forEach(a=>a.classList.remove("playing"));
element.classList.add("playing");

const surahCode = String(surah).padStart(3,"0");
const ayahCode = String(ayah).padStart(3,"0");

const url =
"https://everyayah.com/data/Alafasy_128kbps/" +
surahCode + ayahCode + ".mp3";

if(currentAudio){
currentAudio.pause();
}

currentAudio = new Audio(url);
currentAudio.play();

document.getElementById("audioPlayer").innerHTML =
`<audio controls autoplay src="${url}" style="width:100%"></audio>`;
}

// ===============================
// DOWNLOAD
// ===============================
function downloadSurah(){

const surahNumber = parseInt(document.getElementById("surahSelect").value);

if(!surahNumber){
alert("Select a Surah first");
return;
}

const code = String(surahNumber).padStart(3,"0");
const url = "https://server8.mp3quran.net/afs/" + code + ".mp3";

const a = document.createElement("a");
a.href = url;
a.download = "Surah_" + code + ".mp3";
a.click();

}
