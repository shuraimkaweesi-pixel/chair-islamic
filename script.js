// ===============================
// SURAH LIST
// ===============================

const surahNames = [
"Al-Fatiha","Al-Baqarah","Aal-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
"Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
"Al-Anbiya","Al-Hajj","Al-Mu’minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum",
"Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
"Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
"Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
"As-Saff","Al-Jumu’ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij",
"Nuh","Al-Jinn","Al-Muzzammil","Al-Muddathir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa",
"At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad",
"Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat",
"Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
"Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
]

// ===============================
// POPULATE SURAH DROPDOWN
// ===============================

const surahSelect = document.getElementById("surahSelect")

surahNames.forEach((name,i)=>{
let option=document.createElement("option")
option.value=i+1
option.textContent=(i+1)+" - "+name
surahSelect.appendChild(option)
})


// ===============================
// SURAH SEARCH
// ===============================

function searchSurah(){

let input=document.getElementById("surahSearch").value.toLowerCase()

for(let i=0;i<surahSelect.options.length;i++){

let txt=surahSelect.options[i].text.toLowerCase()

surahSelect.options[i].style.display=
txt.includes(input) ? "block":"none"

}

}


async function loadSurah() {

  const surahNumber = parseInt(document.getElementById("surahSelect").value);

  if (!surahNumber) {
    alert("Please select a Surah");
    return;
  }

  try {

    // Fetch Quran files
    const arabicRes = await fetch("quran.json");
    const englishRes = await fetch("quran_en.json");

    if (!arabicRes.ok || !englishRes.ok) {
      throw new Error("Quran JSON files not found");
    }

    const arabicData = await arabicRes.json();
    const englishData = await englishRes.json();

    // Support different JSON structures
    const arabicSurah =
      arabicData[surahNumber - 1] ||
      arabicData.data?.surahs?.[surahNumber - 1] ||
      arabicData.surahs?.[surahNumber - 1];

    const englishSurah =
      englishData[surahNumber - 1] ||
      englishData.data?.surahs?.[surahNumber - 1] ||
      englishData.surahs?.[surahNumber - 1];

    if (!arabicSurah) {
      throw new Error("Surah not found in Arabic file");
    }

    const arabicAyahs = arabicSurah.ayahs || arabicSurah.verses || [];
    const englishAyahs = englishSurah?.ayahs || englishSurah?.verses || [];

let html = "";

for (let i = 0; i < arabicAyahs.length; i++) {

const arabicText = arabicAyahs[i].text;

const englishText =
englishAyahs[i]?.translation ||
englishAyahs[i]?.text ||
"Translation unavailable";

html += `
<div class="ayah">

<div class="arabic">
${i + 1}. ${arabicText}
</div>

<div class="translation">
${i + 1}. ${englishText}
</div>

</div>
`;

}

    document.getElementById("quranText").innerHTML = html;

    // AUDIO PLAYER
    const reciter = document.getElementById("reciterSelect").value;

    const reciters = {
      afasy: "https://server8.mp3quran.net/afs/",
      baset: "https://server8.mp3quran.net/bas/",
      ghamdi: "https://server7.mp3quran.net/s_gmd/"
    };

    const surahCode = String(surahNumber).padStart(3, "0");
    const audioURL = reciters[reciter] + surahCode + ".mp3";

    document.getElementById("audioPlayer").innerHTML = `
      <audio controls>
        <source src="${audioURL}" type="audio/mpeg">
      </audio>
    `;

  } catch (error) {

    console.error(error);

    document.getElementById("quranText").innerHTML =
      "<p style='color:red'>Failed to load Surah. Check Quran JSON files.</p>";
  }
}


// ===============================
// PRAYER TIMES
// ===============================

function getPrayerTimes(){

let city=document.getElementById("cityInput").value || "Kampala"

fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`)
.then(r=>r.json())
.then(data=>{

let t=data.data.timings

document.getElementById("prayerTimes").innerHTML=`

Fajr: ${t.Fajr}<br>
Dhuhr: ${t.Dhuhr}<br>
Asr: ${t.Asr}<br>
Maghrib: ${t.Maghrib}<br>
Isha: ${t.Isha}

`

})

}


// ===============================
// ASK QUESTION EMAIL
// ===============================

function sendQuestion(){

let name=document.getElementById("userName").value
let email=document.getElementById("userEmail").value
let q=document.getElementById("userQuestion").value

let subject="Question from Chair Islamic TV"

let body=`Name: ${name}

Email: ${email}

Question:
${q}`

window.location.href=`mailto:shuraimkaweesi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

}


// ===============================
// DAILY HADITH (Offline, Auto-update Daily)
// ===============================
async function loadHadith() {
  try {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("hadithDate");
    const storedHadith = localStorage.getItem("hadithContent");

    // If already loaded today, use cached version
    if (storedDate === today && storedHadith) {
      document.getElementById("hadithBox").innerHTML = storedHadith;
      return;
    }

    // Fetch local JSON file
    const res = await fetch("hadith.json");
    if (!res.ok) throw new Error("Failed to load local Hadith file");

    const data = await res.json();
    const hadiths = data.hadiths;

    // Pick a random Hadith
    const randomHadith = hadiths[Math.floor(Math.random() * hadiths.length)];

    const arabicText = randomHadith.arab || "Arabic not available";
    const englishText = randomHadith.en || "Translation not available";

    const hadithHTML = `
      <div class="arabic">${arabicText}</div>
      <div class="translation">${englishText}</div>
      <p style="color:#FFD700">Sahih Muslim #${randomHadith.number || "-"}</p>
    `;

    document.getElementById("hadithBox").innerHTML = hadithHTML;

    // Save to localStorage so it shows same Hadith for today
    localStorage.setItem("hadithDate", today);
    localStorage.setItem("hadithContent", hadithHTML);

  } catch (err) {
    console.error(err);
    document.getElementById("hadithBox").innerText = "Could not load Hadith";
  }
}

loadHadith();


// ===============================
// YOUTUBE VIDEOS - Reliable Embed
// ===============================
const youtubeContainer = document.getElementById("youtubeVideos");

// Your channel ID
const channelID = "UC5_wjk8WksHOOZHflU9heJQ";

// YouTube embed URLs for latest 5 videos
const videoIDs = [
  "ZGwG7UBlFCc",
  "zGIBIOMA0PQ",
];

// If you want to auto update, you can later fetch via YouTube API key
function loadYouTubeVideos() {
  let html = "";
  videoIDs.forEach(id => {
    html += `
      <iframe width="100%" height="315"
        src="https://www.youtube.com/embed/${id}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe><br><br>
    `;
  });
  youtubeContainer.innerHTML = html;
}

loadYouTubeVideos();

// ===============================
// PWA INSTALL BUTTON
// ===============================

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = "block";

});

installBtn.addEventListener("click", async () => {

  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const choice = await deferredPrompt.userChoice;

  if (choice.outcome === "accepted") {
    console.log("User installed the app");
  } else {
    console.log("User dismissed install");
  }

  deferredPrompt = null;

});
