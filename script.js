// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT
// ===============================

// Run after page loads
document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
});

// ===============================
// PWA INSTALL + SERVICE WORKER
// ===============================
let deferredPrompt;

function initPWA() {

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW failed", err));
  }

  // Install Button
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.getElementById("installBtn");

    if (installBtn) {
      installBtn.style.display = "block";

      installBtn.onclick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        console.log(choice.outcome);
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

  let html = "";

  videoIDs.forEach(id => {
    html += `
    <iframe 
      width="100%" height="315"
      src="https://www.youtube.com/embed/${id}"
      frameborder="0"
      allowfullscreen>
    </iframe><br><br>`;
  });

  youtubeContainer.innerHTML = html;
}

// ===============================
// PRAYER TIMES
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
// REAL PRAYER ADHAN SYSTEM 🔊
// ===============================

// Request permission once
if ("Notification" in window) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

// Prevent repeating same prayer alert
let lastNotifiedPrayer = "";

// Start Adhan system
function startAdhanSystem(){

const city = "Kampala";

fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`)
.then(res => res.json())
.then(data => {

const t = data.data.timings;

// Clean prayer times (remove seconds if any)
const prayers = {
Fajr: t.Fajr.slice(0,5),
Dhuhr: t.Dhuhr.slice(0,5),
Asr: t.Asr.slice(0,5),
Maghrib: t.Maghrib.slice(0,5),
Isha: t.Isha.slice(0,5)
};

// Check every 20 seconds
setInterval(() => {

const now = new Date();
const currentTime =
now.getHours().toString().padStart(2,"0") + ":" +
now.getMinutes().toString().padStart(2,"0");

for(let name in prayers){

if(prayers[name] === currentTime && lastNotifiedPrayer !== name){

triggerAdhan(name);
lastNotifiedPrayer = name;

}

}

},20000);

})
.catch(err => console.log("Adhan fetch error", err));

}

// ===============================
// TRIGGER ADHAN
// ===============================
function triggerAdhan(prayer){

// Send to Service Worker (background notification)
if(navigator.serviceWorker && navigator.serviceWorker.controller){
  navigator.serviceWorker.controller.postMessage({
    type: "PRAYER_ALERT",
    prayer: prayer
  });
}

// Play sound (only if app open)
const audio = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
audio.play().catch(()=>{});

console.log("Adhan triggered:", prayer);

}

// Start system when page loads
startAdhanSystem();
// ===============================
// DONATION (AIRTEL USSD)
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
// SEND QUESTION
// ===============================
function sendQuestion() {

  const name = document.getElementById("userName")?.value;
  const email = document.getElementById("userEmail")?.value;
  const q = document.getElementById("userQuestion")?.value;

  if (!name || !email || !q) {
    alert("Fill all fields");
    return;
  }

  const subject = "Question from Chair Islamic TV";

  const body = `Name: ${name}
Email: ${email}

Question:
${q}`;

  window.location.href =
    `mailto:shuraimkaweesi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ===============================
// DAILY HADITH
// ===============================
async function loadHadith() {

  const box = document.getElementById("hadithBox");
  if (!box) return;

  try {

    const res = await fetch("hadith.json");
    const data = await res.json();

    const hadiths = data.hadiths;
    const random = hadiths[Math.floor(Math.random() * hadiths.length)];

    box.innerHTML = `
      <div class="arabic">${random.arab}</div>
      <div class="translation">${random.en}</div>
      <p style="color:gold">Hadith #${random.number || ""}</p>
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

  surahNames.forEach((name, i) => {
    const option = document.createElement("option");
    option.value = i + 1;
    option.textContent = (i + 1) + " - " + name;
    surahSelect.appendChild(option);
  });
}

// ===============================
// LOAD SURAH (API VERSION)
// ===============================
async function loadSurah() {

  const surahNumber = parseInt(document.getElementById("surahSelect").value);

  if (!surahNumber) {
    alert("Select a Surah");
    return;
  }

  try {

    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`
    );

    const data = await res.json();

    const arabic = data.data[0].ayahs;
    const english = data.data[1].ayahs;

    let html = "";

    for (let i = 0; i < arabic.length; i++) {

      html += `
      <div class="ayah" onclick="playAyah(${surahNumber},${i + 1},this)">
        <div class="arabic">${i + 1}. ${arabic[i].text}</div>
        <div class="translation">${i + 1}. ${english[i].text}</div>
      </div>`;
    }

    document.getElementById("quranText").innerHTML = html;

  } catch {
    document.getElementById("quranText").innerHTML =
      "<p style='color:red'>Failed to load Surah</p>";
  }
}

// ===============================
// PLAY AYAH
// ===============================
let currentAudio;

function playAyah(surah, ayah, element) {

  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("playing"));
  element.classList.add("playing");

  const surahCode = String(surah).padStart(3, "0");
  const ayahCode = String(ayah).padStart(3, "0");

  const audioURL =
    "https://everyayah.com/data/Alafasy_128kbps/" +
    surahCode + ayahCode + ".mp3";

  if (currentAudio) currentAudio.pause();

  currentAudio = new Audio(audioURL);
  currentAudio.play();

  document.getElementById("audioPlayer").innerHTML =
    `<audio controls autoplay style="width:100%" src="${audioURL}"></audio>`;
}

// ===============================
// DOWNLOAD SURAH
// ===============================
function downloadSurah() {

  const surahNumber = parseInt(document.getElementById("surahSelect").value);

  if (!surahNumber) {
    alert("Select a Surah first");
    return;
  }

  const surahCode = String(surahNumber).padStart(3, "0");

  const audioURL =
    "https://server8.mp3quran.net/afs/" + surahCode + ".mp3";

  const a = document.createElement("a");
  a.href = audioURL;
  a.download = "Surah_" + surahCode + ".mp3";
  a.click();
  }
function showNotification(title, body){
if(Notification.permission === "granted"){
new Notification(title,{body});
}
}

if(Notification.permission !== "granted"){
Notification.requestPermission();
}

// Example test
setTimeout(()=>{
showNotification("Prayer Time","It's time for Salah 🕌");
},5000);
