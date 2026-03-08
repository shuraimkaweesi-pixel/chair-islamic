// SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered.', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

// INSTALL APP
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});
installBtn.addEventListener('click', async () => {
  installBtn.style.display = 'none';
  deferredPrompt.prompt();
  deferredPrompt = null;
});

// YOUTUBE LATEST
const youtubeVideosDiv = document.getElementById('youtubeVideos');
const latestYouTubeVideo = "https://www.youtube.com/embed/zGIBIOMA0PQ?autoplay=0";
youtubeVideosDiv.innerHTML = `
  <iframe width="100%" height="400" src="${latestYouTubeVideo}" frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen></iframe>
`;

// PRAYER TIMES
async function getPrayerTimes() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert("Please enter a city.");
  try {
    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`);
    const data = await response.json();
    const timings = data.data.timings;
    const div = document.getElementById('prayerTimes');
    div.innerHTML = `
      <p>Fajr: ${timings.Fajr}</p>
      <p>Dhuhr: ${timings.Dhuhr}</p>
      <p>Asr: ${timings.Asr}</p>
      <p>Maghrib: ${timings.Maghrib}</p>
      <p>Isha: ${timings.Isha}</p>
    `;
  } catch (err) {
    console.log(err);
    alert("Unable to fetch prayer times. Try again.");
  }
}

// ASK QUESTION
function sendQuestion() {
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const question = document.getElementById('userQuestion').value;
  if (!name || !email || !question) return alert("Fill all fields!");

  const subject = encodeURIComponent("Islamic Question from Chair Islamic TV");
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nQuestion:\n${question}`);

  window.location.href = `mailto:shuraimkaweesi@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById('questionStatus').innerText = "Email client opened. You can send your question now!";
}

// QURAN READER
const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayerDiv = document.getElementById('audioPlayer');
const quranTextDiv = document.getElementById('quranText');

// Populate surahs
for (let i = 1; i <= 114; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = `Surah ${i}`;
  surahSelect.appendChild(option);
}

// Reciters audio base URLs (reliable source)
const reciters = {
  afasy: 'https://cdn.islamic.network/quran/audio-surah/ar.alafasy/',
  sudais: 'https://cdn.islamic.network/quran/audio-surah/ar.abdulrahmanalsudais/',
  ghamdi: 'https://cdn.islamic.network/quran/audio-surah/ar.saadghamdi/'
};

async function loadSurah() {
  const surah = surahSelect.value;
  const reciter = reciterSelect.value;
  if (!surah) return alert("Select a surah!");

  // Audio
  const audioLink = `${reciters[reciter]}${surah}.mp3`;
  audioPlayerDiv.innerHTML = `<audio controls style="width:100%">
    <source src="${audioLink}" type="audio/mpeg">
    Your browser does not support audio.
  </audio>`;

  // Arabic + English translation
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/en.asad`);
    const data = await res.json();
    quranTextDiv.innerHTML = '';
    data.data.ayahs.forEach(a => {
      const ayahDiv = document.createElement('div');
      ayahDiv.classList.add('ayah');
      ayahDiv.innerHTML = `
        <div class="arabic">${a.text}</div>
        <div class="translation">${a.translation}</div>
      `;
      quranTextDiv.appendChild(ayahDiv);
    });
  } catch (err) {
    console.log(err);
    quranTextDiv.innerHTML = "Unable to load Quran text. Try again.";
  }
}
