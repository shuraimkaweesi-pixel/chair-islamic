// ----------------------
// script.js - Chair Islamic TV Full Features
// ----------------------

// ----------------------
// 1. Quran Reader
// ----------------------
const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const quranText = document.getElementById('quranText');

// Setup reciters
const reciters = {
  afasy: "afasy",
  baset: "baset",
  ghamdi: "ghamdi"
};

// Load Quran JSON (quran_en.json)
async function loadSurahList() {
  try {
    const res = await fetch('./quran_en.json');
    const quranData = await res.json();

    // Save data
    window.quranData = quranData;

    // Populate Surah dropdown
    quranData.forEach(surah => {
      const opt = document.createElement('option');
      opt.value = surah.number;
      opt.textContent = `${surah.number}. ${surah.name} (${surah.englishName || surah.english})`;
      surahSelect.appendChild(opt);
    });

  } catch (err) {
    console.error("Failed to load Quran JSON:", err);
    alert("Failed to load quran_en.json — check file path and name.");
  }
}

// Display selected Surah
function loadSurah() {
  const surahNum = Number(surahSelect.value);
  const reciter = reciterSelect.value.toLowerCase();

  if (!surahNum) return;
  if (!window.quranData) return alert("Quran data not loaded yet.");

  const surah = window.quranData.find(s => s.number === surahNum);
  if (!surah) return alert("Surah not found.");

  quranText.innerHTML = '';

  surah.ayahs.forEach(a => {
    // Some JSON use different keys for English—try a.en or a.translation
    const englishText = a.en || a.translation || a.textEn || "";

    quranText.innerHTML += `
      <div class="ayah">
        <div class="ayah-number">(${a.numberInSurah || a.number})</div>
        <div class="arabic">${a.text}</div>
        <div class="translation">${englishText}</div>
      </div>
    `;
  });

  // Load audio if file exists
  if (reciters[reciter]) {
    const audioFile = `/audio/${reciter}/${String(surahNum).padStart(3,'0')}.mp3`;
    audioPlayer.innerHTML = `
      <audio controls style="width:100%">
        <source src="${audioFile}" type="audio/mpeg">
        Your browser does not support audio playback.
      </audio>
    `;
  }
}

// ----------------------
// 2. Latest YouTube video
// ----------------------
const youtubeDiv = document.getElementById('youtubeVideos');

async function loadLatestYouTube() {
  try {
    const channelId = "UC5_wjk8WksHOOZHflU9heJQ"; // your channel
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const vid = data.items[0].link.split('v=')[1];
      youtubeDiv.innerHTML = `
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/${vid}" allowfullscreen></iframe>
      `;
    }
  } catch (err) {
    youtubeDiv.innerHTML = "<p>Unable to load video.</p>";
  }
}

// ----------------------
// 3. Prayer Times
// ----------------------
async function getPrayerTimes() {
  const city = document.getElementById('cityInput').value;
  if (!city) return;

  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=2`);
    const data = await res.json();
    const times = data.data.timings;

    document.getElementById('prayerTimes').innerHTML = `
      <p>Fajr: ${times.Fajr}</p>
      <p>Dhuhr: ${times.Dhuhr}</p>
      <p>Asr: ${times.Asr}</p>
      <p>Maghrib: ${times.Maghrib}</p>
      <p>Isha: ${times.Isha}</p>
    `;
  } catch {
    alert("Unable to load prayer times.");
  }
}

// ----------------------
// 4. Ask question
// ----------------------
function sendQuestion() {
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const question = document.getElementById('userQuestion').value;

  if (!name || !email || !question) return;

  window.location.href = `mailto:shuraimkaweesi@gmail.com?subject=Question from ${name}&body=${encodeURIComponent(question + "\n\nEmail: " + email)}`;
  document.getElementById('questionStatus').textContent = "Opening email…";
}

// ----------------------
// Init
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
  loadSurahList();
  loadLatestYouTube();
  surahSelect.addEventListener('change', loadSurah);
  reciterSelect.addEventListener('change', loadSurah);
});
