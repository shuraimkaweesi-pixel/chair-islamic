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

<script>

// =====================
// WAIT FOR PAGE LOAD
// =====================
document.addEventListener("DOMContentLoaded", () => {

initLetters();

unlockAudio(); // 🔓 fix mobile audio

});


// =====================
// ARABIC LETTERS
// =====================

const letters = [
{a:"ا", name:"Alif", sound:"a"},
{a:"ب", name:"Ba", sound:"ba"},
{a:"ت", name:"Ta", sound:"ta"},
{a:"ث", name:"Tha", sound:"tha"},
{a:"ج", name:"Jeem", sound:"ja"},
{a:"ح", name:"Ha", sound:"ha"},
{a:"خ", name:"Kha", sound:"kha"},
{a:"د", name:"Dal", sound:"da"},
{a:"ذ", name:"Dhal", sound:"dha"},
{a:"ر", name:"Ra", sound:"ra"},
{a:"ز", name:"Zay", sound:"za"},
{a:"س", name:"Seen", sound:"sa"},
{a:"ش", name:"Sheen", sound:"sha"},
{a:"ص", name:"Sad", sound:"sa"},
{a:"ض", name:"Dad", sound:"da"},
{a:"ط", name:"Taa", sound:"ta"},
{a:"ظ", name:"Zaa", sound:"za"},
{a:"ع", name:"Ain", sound:"aa"},
{a:"غ", name:"Ghain", sound:"gha"},
{a:"ف", name:"Fa", sound:"fa"},
{a:"ق", name:"Qaf", sound:"qa"},
{a:"ك", name:"Kaf", sound:"ka"},
{a:"ل", name:"Lam", sound:"la"},
{a:"م", name:"Meem", sound:"ma"},
{a:"ن", name:"Noon", sound:"na"},
{a:"ه", name:"Ha", sound:"ha"},
{a:"و", name:"Waw", sound:"wa"},
{a:"ي", name:"Yaa", sound:"ya"}
];


// =====================
// SETTINGS
// =====================
let repeatCount = 3;


// =====================
// LOAD UI
// =====================
function initLetters(){

const box = document.getElementById("lessonBox");
if(!box) return;

box.innerHTML = "";

letters.forEach((l,i)=>{

box.innerHTML += `
<div class="lesson">

<h2 style="font-size:40px">${l.a}</h2>

<p>${l.name}</p>
<p style="color:#aaa">${l.sound}</p>

<button onclick="startLetter(${i})">▶ Start</button>

</div>
`;

});

}



<script>

// =====================
// REAL AUDIO MAP (QARI STYLE)
// =====================

const letterAudio = {
"ا": "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
"ب": "https://everyayah.com/data/Alafasy_128kbps/002001.mp3",
"ت": "https://everyayah.com/data/Alafasy_128kbps/003001.mp3",
"ث": "https://everyayah.com/data/Alafasy_128kbps/004001.mp3",
"ج": "https://everyayah.com/data/Alafasy_128kbps/005001.mp3",
"ح": "https://everyayah.com/data/Alafasy_128kbps/006001.mp3",
"خ": "https://everyayah.com/data/Alafasy_128kbps/007001.mp3",
"د": "https://everyayah.com/data/Alafasy_128kbps/008001.mp3",
"ذ": "https://everyayah.com/data/Alafasy_128kbps/009001.mp3",
"ر": "https://everyayah.com/data/Alafasy_128kbps/010001.mp3",
"ز": "https://everyayah.com/data/Alafasy_128kbps/011001.mp3",
"س": "https://everyayah.com/data/Alafasy_128kbps/012001.mp3",
"ش": "https://everyayah.com/data/Alafasy_128kbps/013001.mp3",
"ص": "https://everyayah.com/data/Alafasy_128kbps/014001.mp3",
"ض": "https://everyayah.com/data/Alafasy_128kbps/015001.mp3",
"ط": "https://everyayah.com/data/Alafasy_128kbps/016001.mp3",
"ظ": "https://everyayah.com/data/Alafasy_128kbps/017001.mp3",
"ع": "https://everyayah.com/data/Alafasy_128kbps/018001.mp3",
"غ": "https://everyayah.com/data/Alafasy_128kbps/019001.mp3",
"ف": "https://everyayah.com/data/Alafasy_128kbps/020001.mp3",
"ق": "https://everyayah.com/data/Alafasy_128kbps/021001.mp3",
"ك": "https://everyayah.com/data/Alafasy_128kbps/022001.mp3",
"ل": "https://everyayah.com/data/Alafasy_128kbps/023001.mp3",
"م": "https://everyayah.com/data/Alafasy_128kbps/024001.mp3",
"ن": "https://everyayah.com/data/Alafasy_128kbps/025001.mp3",
"ه": "https://everyayah.com/data/Alafasy_128kbps/026001.mp3",
"و": "https://everyayah.com/data/Alafasy_128kbps/027001.mp3",
"ي": "https://everyayah.com/data/Alafasy_128kbps/028001.mp3"
};


// =====================
// PLAY LETTER (UPDATED)
// =====================

function playLetter(){

const letter = letters[currentIndex];

const url = letterAudio[letter.a];

if(!url){
console.log("No audio found for", letter.a);
return;
}

currentAudio = new Audio(url);
currentAudio.play();

highlight(currentIndex);

// repeat + next
currentAudio.onended = ()=>{

if(!isPlaying) return;

repeat++;

if(repeat < repeatCount){
playLetter();
return;
}

// next
currentIndex++;

if(currentIndex < letters.length){
repeat = 0;
playLetter();
}else{
stopLesson();
}

};

}

</script>


// =====================
// HIGHLIGHT
// =====================
function highlightLetter(index){

document.querySelectorAll(".lesson").forEach((l,i)=>{
l.style.border = (i === index) ? "2px solid gold" : "none";
});

}


// =====================
// 🔓 UNLOCK AUDIO (MOBILE FIX)
// =====================
function unlockAudio(){

document.body.addEventListener("click", () => {

const a = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");

a.play().then(()=>{
a.pause();
a.currentTime = 0;
}).catch(()=>{});

}, { once: true });

}

</script>
