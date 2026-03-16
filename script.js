// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

initPWA();
loadYoutubeVideos();
loadHadith();
initSurahList();

});

// ===============================
// PWA INSTALL BUTTON
// ===============================

let deferredPrompt;

function initPWA(){

const installBtn = document.getElementById("installBtn");

if(!installBtn) return;

window.addEventListener("beforeinstallprompt", (e)=>{

e.preventDefault();
deferredPrompt = e;
installBtn.style.display = "block";

});

installBtn.addEventListener("click", async ()=>{

if(!deferredPrompt) return;

deferredPrompt.prompt();

const choice = await deferredPrompt.userChoice;

console.log(choice.outcome === "accepted"
? "App Installed"
: "Install dismissed");

deferredPrompt = null;

});

}

// ===============================
// YOUTUBE VIDEOS
// ===============================

function loadYoutubeVideos(){

const youtubeContainer = document.getElementById("youtubeVideos");

if(!youtubeContainer) return;

const videoIDs = [
"ZGwG7UBlFCc",
"zGIBIOMA0PQ"
];

let html = "";

videoIDs.forEach(id => {

html += `
<iframe 
src="https://www.youtube.com/embed/${id}"
allowfullscreen>
</iframe><br><br>
`;

});

youtubeContainer.innerHTML = html;

}

// ===============================
// PRAYER TIMES
// ===============================

function getPrayerTimes(){

const city =
document.getElementById("cityInput")?.value || "Kampala";

const prayerBox =
document.getElementById("prayerTimes");

if(!prayerBox) return;

fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`)

.then(res => res.json())

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

.catch(err => {

console.error(err);

prayerBox.innerHTML =
"Could not load prayer times";

});

}

// ===============================
// SEND QUESTION
// ===============================

function sendQuestion(){

const name =
document.getElementById("userName")?.value;

const email =
document.getElementById("userEmail")?.value;

const q =
document.getElementById("userQuestion")?.value;

if(!name || !email || !q){

alert("Please fill all fields");

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

async function loadHadith(){

const box =
document.getElementById("hadithBox");

if(!box) return;

try{

const res = await fetch("hadith.json");

const data = await res.json();

const hadiths = data.hadiths;

const random =
hadiths[Math.floor(Math.random()*hadiths.length)];

box.innerHTML = `
<div class="arabic">${random.arab}</div>
<div class="translation">${random.en}</div>
<p style="color:gold">
Hadith #${random.number || ""}
</p>
`;

}

catch(err){

console.error(err);

box.innerText =
"Could not load Hadith";

}

}

// ===============================
// QURAN PAGE
// ===============================

function initSurahList(){

const surahSelect =
document.getElementById("surahSelect");

if(!surahSelect) return;

const surahNames = [

"Al-Fatiha","Al-Baqarah","Aal-Imran","An-Nisa",
"Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal",
"At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd",
"Ibrahim","Al-Hijr","An-Nahl","Al-Isra",
"Al-Kahf","Maryam","Ta-Ha","Al-Anbiya",
"Al-Hajj","Al-Mu’minun","An-Nur","Al-Furqan",
"Ash-Shu'ara","An-Naml","Al-Qasas",
"Al-Ankabut","Ar-Rum","Luqman","As-Sajdah",
"Al-Ahzab","Saba","Fatir","Ya-Sin",
"As-Saffat","Sad","Az-Zumar","Ghafir",
"Fussilat","Ash-Shura","Az-Zukhruf",
"Ad-Dukhan","Al-Jathiyah","Al-Ahqaf",
"Muhammad","Al-Fath","Al-Hujurat","Qaf",
"Adh-Dhariyat","At-Tur","An-Najm",
"Al-Qamar","Ar-Rahman","Al-Waqi'ah",
"Al-Hadid","Al-Mujadila","Al-Hashr",
"Al-Mumtahanah","As-Saff","Al-Jumu’ah",
"Al-Munafiqun","At-Taghabun","At-Talaq",
"At-Tahrim","Al-Mulk","Al-Qalam",
"Al-Haqqah","Al-Ma'arij","Nuh",
"Al-Jinn","Al-Muzzammil","Al-Muddathir",
"Al-Qiyamah","Al-Insan","Al-Mursalat",
"An-Naba","An-Nazi'at","Abasa",
"At-Takwir","Al-Infitar","Al-Mutaffifin",
"Al-Inshiqaq","Al-Buruj","At-Tariq",
"Al-A'la","Al-Ghashiyah","Al-Fajr",
"Al-Balad","Ash-Shams","Al-Layl",
"Ad-Duha","Ash-Sharh","At-Tin",
"Al-Alaq","Al-Qadr","Al-Bayyinah",
"Az-Zalzalah","Al-Adiyat","Al-Qari'ah",
"At-Takathur","Al-Asr","Al-Humazah",
"Al-Fil","Quraysh","Al-Ma'un",
"Al-Kawthar","Al-Kafirun","An-Nasr",
"Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"

];

surahNames.forEach((name,i)=>{

const option =
document.createElement("option");

option.value = i+1;

option.textContent =
(i+1)+" - "+name;

surahSelect.appendChild(option);

});

}

// ===============================
// SEARCH SURAH
// ===============================

function searchSurah(){

const surahSelect =
document.getElementById("surahSelect");

const input =
document.getElementById("surahSearch")
.value.toLowerCase();

for(let i=0;i<surahSelect.options.length;i++){

const txt =
surahSelect.options[i].text.toLowerCase();

surahSelect.options[i].hidden =
!txt.includes(input);

}

}

// ===============================
// LOAD SURAH
// ===============================

async function loadSurah(){

const surahNumber =
parseInt(
document.getElementById("surahSelect").value
);

if(!surahNumber){

alert("Select a Surah");

return;

}

try{

const arabicRes =
await fetch("quran.json");

const englishRes =
await fetch("quran_en.json");

const arabicData =
await arabicRes.json();

const englishData =
await englishRes.json();

const arabicSurah =
arabicData[surahNumber-1];

const englishSurah =
englishData[surahNumber-1];

let html="";

for(let i=0;i<arabicSurah.verses.length;i++){

const ar =
arabicSurah.verses[i].text;

const en =
englishSurah.verses[i]?.translation
|| "Translation unavailable";

html += `
<div class="ayah"
onclick="playAyah(${surahNumber},${i+1},this)">

<div class="arabic">
${i+1}. ${ar}
</div>

<div class="translation">
${i+1}. ${en}
</div>

</div>
`;

}

document.getElementById("quranText")
.innerHTML = html;

}

catch(err){

console.error(err);

document.getElementById("quranText")
.innerHTML =
"<p style='color:red'>Failed to load Surah</p>";

}

}

// ===============================
// PLAY AYAH
// ===============================

let currentAudio;

function playAyah(surah, ayah, element){

document.querySelectorAll(".ayah")
.forEach(a=>a.classList.remove("playing"));

element.classList.add("playing");

const surahCode =
String(surah).padStart(3,"0");

const ayahCode =
String(ayah).padStart(3,"0");

const audioURL =
"https://everyayah.com/data/Alafasy_128kbps/"
+ surahCode + ayahCode + ".mp3";

if(currentAudio){

currentAudio.pause();

}

currentAudio =
new Audio(audioURL);

currentAudio.play();

document.getElementById("audioPlayer")
.innerHTML =
`<audio controls autoplay
style="width:100%"
src="${audioURL}"></audio>`;

}

// ===============================
// AIRTel DONATION
// ===============================

function donateAirtel(){

const amount =
document.getElementById("donationAmount")?.value;

if(!amount){

alert("Enter donation amount");

return;

}

const ussd =
`*185*9*7037856*${amount}#`;

window.location.href =
"tel:"+encodeURIComponent(ussd);

}
const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

const MERCHANT_CODE = "7037856";
const AIRTEL_API_URL = "https://sandbox.africapayments.com/airtel"; // replace with live API
const CALLBACK_URL = "https://your-website.com/donation-callback";

app.post("/api/airtel-donate", async (req, res) => {
  const { amount } = req.body;

  if(!amount || amount < 1000){
    return res.json({ status:"error", message:"Invalid amount" });
  }

  try {
    const payload = {
      merchantCode: MERCHANT_CODE,
      amount: amount,
      callbackUrl: CALLBACK_URL
    };

    const apiRes = await fetch(`${AIRtel_API_URL}/collect`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer YOUR_API_TOKEN"
      },
      body: JSON.stringify(payload)
    });

    const data = await apiRes.json();

    if(data.status === "success"){
      res.json({ status:"success", message:"Payment initiated" });
    } else {
      res.json({ status:"error", message:data.message });
    }

  } catch(err){
    console.error(err);
    res.json({ status:"error", message:"Failed to contact Airtel API" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
