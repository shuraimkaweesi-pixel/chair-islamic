// ==========================
// Quran Reader Upgrade
// ==========================

const surahs = [
"Al-Fatiha","Al-Baqarah","Al-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
"Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
"Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum",
"Luqman","As-Sajda","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
"Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
"Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqia","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahina",
"As-Saff","Al-Jumua","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haaqqa","Al-Maarij",
"Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Naziat","Abasa",
"At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-Ala","Al-Ghashiyah","Al-Fajr","Al-Balad",
"Ash-Shams","Al-Lail","Ad-Dhuha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat",
"Al-Qaria","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraish","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
"Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];

const surahSelect = document.getElementById("surahSelect");

surahs.forEach((name, index)=>{
const option=document.createElement("option");
option.value=index+1;
option.textContent=`${index+1}. ${name}`;
surahSelect.appendChild(option);
});

function loadSurah(){

const surahNumber=document.getElementById("surahSelect").value;

if(!surahNumber) return;

fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`)
.then(res=>res.json())
.then(data=>{

const arabic=data.data[0].ayahs;
const translation=data.data[1].ayahs;

let html="";

for(let i=0;i<arabic.length;i++){

html+=`
<div class="ayah">
<p style="font-size:22px;direction:rtl;text-align:right">${arabic[i].text}</p>
<p style="color:#bfffc1">${translation[i].text}</p>
<hr>
</div>
`;

}

document.getElementById("quranText").innerHTML=html;

});

loadAudio();

}

function loadAudio(){

const surahNumber=document.getElementById("surahSelect").value;
const reciter=document.getElementById("reciterSelect").value;

const reciters={
afasy:"https://server8.mp3quran.net/afs/",
sudais:"https://server7.mp3quran.net/sds/",
ghamdi:"https://server7.mp3quran.net/s_gmd/"
};

const surahCode=String(surahNumber).padStart(3,"0");

const audioURL=reciters[reciter]+surahCode+".mp3";

document.getElementById("audioPlayer").innerHTML=
`
<h3>Surah Audio</h3>
<audio controls style="width:100%">
<source src="${audioURL}" type="audio/mpeg">
</audio>
`;

}
// ==========================
// Prayer Times
// ==========================

function getPrayerTimes(){

const city=document.getElementById("cityInput").value || "Kampala";

fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`)
.then(res=>res.json())
.then(data=>{

const t=data.data.timings;

document.getElementById("prayerTimes").innerHTML=
`
<h3>Prayer Times for ${city}</h3>

<p>🕌 Fajr: ${t.Fajr}</p>
<p>🌅 Sunrise: ${t.Sunrise}</p>
<p>🕌 Dhuhr: ${t.Dhuhr}</p>
<p>🌇 Asr: ${t.Asr}</p>
<p>🌆 Maghrib: ${t.Maghrib}</p>
<p>🌙 Isha: ${t.Isha}</p>
`;

});

}
