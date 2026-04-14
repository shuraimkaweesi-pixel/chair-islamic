// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem();
});

// ===============================
// PWA INSTALL
// ===============================
let deferredPrompt;

function initPWA() {

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
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

  const vids = ["ZGwG7UBlFCc","zGIBIOMA0PQ"];

  box.innerHTML = vids.map(id=>`
  <iframe width="100%" height="315"
  src="https://www.youtube.com/embed/${id}"
  allowfullscreen></iframe><br><br>
  `).join("");
}

// ===============================
// HADITH
// ===============================
async function loadHadith() {

  const box = document.getElementById("hadithBox");
  if (!box) return;

  try{
    const res = await fetch("hadith.json");
    const data = await res.json();

    const h = data.hadiths[Math.floor(Math.random()*data.hadiths.length)];

    box.innerHTML = `
      <div class="arabic">${h.arab}</div>
      <div class="translation">${h.en}</div>
    `;
  }catch{
    box.innerText = "Failed to load Hadith";
  }
}

// ===============================
// SURAH LIST
// ===============================
function initSurahList(){

const select = document.getElementById("surahSelect");
if(!select) return;

const names = ["Al-Fatiha","Al-Baqarah","Aal-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu’minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu’ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddathir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat","Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];

names.forEach((n,i)=>{
const opt = document.createElement("option");
opt.value = i+1;
opt.textContent = (i+1)+" - "+n;
select.appendChild(opt);
});

}

// ===============================
// LOAD SURAH
// ===============================
async function loadSurah(){

const num = parseInt(document.getElementById("surahSelect").value);

if(!num){
alert("Select a Surah");
return;
}

try{

const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,en.sahih`);
const data = await res.json();

const ar = data.data[0].ayahs;
const en = data.data[1].ayahs;

let html = "";

for(let i=0;i<ar.length;i++){

html += `
<div class="ayah" onclick="playAyah(${num},${i+1},this)">
<div class="arabic">${i+1}. ${ar[i].text}</div>
<div class="translation">${i+1}. ${en[i].text}</div>
</div>`;
}

document.getElementById("quranText").innerHTML = html;

}catch{
document.getElementById("quranText").innerHTML = "Failed to load Surah";
}

}

// ===============================
// 🔊 AYAH AUDIO SYSTEM (FINAL)
// ===============================
let currentAudio = null;
let currentSurah = null;
let currentAyah = null;
let ayahElements = [];

function playAyah(surah, ayah, el){

// toggle same ayah
if(currentAudio && currentSurah===surah && currentAyah===ayah){

if(!currentAudio.paused){
currentAudio.pause();
return;
}else{
currentAudio.play();
return;
}

}

// stop old
if(currentAudio) currentAudio.pause();

// highlight
document.querySelectorAll(".ayah").forEach(a=>a.classList.remove("playing"));
el.classList.add("playing");

// save
currentSurah = surah;
currentAyah = ayah;
ayahElements = document.querySelectorAll(".ayah");

// url
const s = String(surah).padStart(3,"0");
const a = String(ayah).padStart(3,"0");

const url = `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;

currentAudio = new Audio(url);
currentAudio.play();

// auto next
currentAudio.onended = ()=>{

const next = ayah + 1;

if(ayahElements[next-1]){
playAyah(surah,next,ayahElements[next-1]);
}

};

}

// =====================
// =====================
// 🔊 ADHAN SYSTEM (FIXED & WORKING)
// =====================

let prayerTimings = {};
let lastAdhanPlayed = "";

// ask permission once
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// 🔓 unlock audio (VERY IMPORTANT for phones)
document.addEventListener("click", () => {
  const a = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
  a.play().then(()=> {
    a.pause();
    a.currentTime = 0;
  }).catch(()=>{});
}, { once: true });


// =====================
// GET PRAYER TIMES (AUTO)
// =====================
async function startAdhanSystem(){

try{

const res = await fetch(
`https://api.aladhan.com/v1/timingsByCity?city=Kampala&country=Uganda&method=2`
);

const data = await res.json();
const t = data.data.timings;

// clean times
prayerTimings = {
Fajr: t.Fajr.slice(0,5),
Dhuhr: t.Dhuhr.slice(0,5),
Asr: t.Asr.slice(0,5),
Maghrib: t.Maghrib.slice(0,5),
Isha: t.Isha.slice(0,5)
};

console.log("Prayer Times Loaded:", prayerTimings);

// start watcher
setInterval(checkAdhanTime, 15000);

}catch(err){
console.log("Adhan error:", err);
}

}


// =====================
// CHECK TIME
// =====================
function checkAdhanTime(){

if(!prayerTimings) return;

const now = new Date();

const currentTime =
now.getHours().toString().padStart(2,"0") + ":" +
now.getMinutes().toString().padStart(2,"0");

for(let prayer in prayerTimings){

if(currentTime === prayerTimings[prayer] && lastAdhanPlayed !== prayer){

triggerAdhan(prayer);
lastAdhanPlayed = prayer;

}

}

}


// =====================
// PLAY ADHAN
// =====================
function triggerAdhan(prayer){

console.log("🕌 Adhan:", prayer);

// 🔊 play sound
const audio = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
audio.play().catch(()=>{});

// 🔔 notification
if(Notification.permission === "granted"){
new Notification("🕌 Prayer Time", {
body: "It's time for " + prayer
});
}

// 📳 vibrate (if supported)
if(navigator.vibrate){
navigator.vibrate([500,300,500]);
}

}

// ===============================
// DONATION
// ===============================
function donateAirtel(){

const amount = document.getElementById("donationAmount")?.value;

if(!amount){
alert("Enter amount");
return;
}

window.location.href = "tel:" + encodeURIComponent(`*185*9*7037856*${amount}#`);
  }
