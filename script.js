// ===========================
// SERVICE WORKER INSTALL
// ===========================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered:', reg))
    .catch(err => console.log('SW failed:', err));
}

// ===========================
// INSTALL APP PROMPT
// ===========================
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    installBtn.style.display = 'none';
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt = null;
    }
  });
}

// ===========================
// AUTO YOUTUBE VIDEO
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const youtubeContainer = document.getElementById('youtubeVideos');
  const latestVideoID = "zGIBIOMA0PQ"; 
  youtubeContainer.innerHTML = `
    <iframe width="100%" height="400"
      src="https://www.youtube.com/embed/${latestVideoID}"
      frameborder="0" allowfullscreen>
    </iframe>
  `;
});

// ===========================
// PRAYER TIMES
// ===========================
async function getPrayerTimes() {
  const city = document.getElementById('cityInput').value || "Kampala";
  try {
    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`);
    const data = await response.json();
    const t = data.data.timings;
    document.getElementById('prayerTimes').innerHTML = `
      <p>Fajr: ${t.Fajr}</p>
      <p>Dhuhr: ${t.Dhuhr}</p>
      <p>Asr: ${t.Asr}</p>
      <p>Maghrib: ${t.Maghrib}</p>
      <p>Isha: ${t.Isha}</p>
    `;
  } catch (err) {
    console.error("Prayer API error", err);
    alert("Could not load prayer times");
  }
}

// ===========================
// ASK QUESTION
// ===========================
function sendQuestion() {
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const question = document.getElementById('userQuestion').value;
  if (!name || !email || !question) {
    document.getElementById('questionStatus').innerText = "Fill all fields first!";
    return;
  }
  const subject = encodeURIComponent("Islamic Question");
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nQuestion:\n${question}`);
  window.location.href = `mailto:shuraimkaweesi@gmail.com?subject=${subject}&body=${body}`;
}

// ===========================
// QURAN SECTION
// ===========================
document.addEventListener('DOMContentLoaded', async () => {

  const surahSelect = document.getElementById('surahSelect');
  const reciterSelect = document.getElementById('reciterSelect');
  const audioPlayerDiv = document.getElementById('audioPlayer');
  const quranTextDiv = document.getElementById('quranText');

  // LOAD SURAH LIST
  try {
    const listRes = await fetch("https://alquran-api.pages.dev/api/quran?lang=en");
    const listData = await listRes.json();
    listData.surahs.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.id}. ${s.name.arabic} (${s.name.english})`;
      surahSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Surah list failed:", err);
    surahSelect.innerHTML = '<option value="">Failed to load</option>';
  }

  window.loadSurah = async function() {
    const surah = surahSelect.value;
    const reciter = reciterSelect.value;

    if (!surah) return alert("Select a Surah!");

    // AUDIO
    const reciterCodes = {
      afasy: 'ar.alafasy',
      sudais: 'ar.abdulrahmanalsudais',
      ghamdi: 'ar.saadghamdi'
    };

    const audioLink = `https://cdn.islamic.network/quran/audio-surah/${reciterCodes[reciter]}/${surah}.mp3`;

    audioPlayerDiv.innerHTML = `
      <audio controls style="width:100%">
        <source src="${audioLink}" type="audio/mpeg">
        Your browser doesn't support audio.
      </audio>
    `;

    // TEXT + TRANSLATION
    try {
      const surahRes = await fetch(`https://alquran-api.pages.dev/api/quran/surah/${surah}?lang=en`);
      const surahData = await surahRes.json();

      quranTextDiv.innerHTML = "";
      surahData.verses.forEach(v => {
        const div = document.createElement('div');
        div.classList.add('ayah');
        div.innerHTML = `
          <div class="arabic">${v.text || ''}</div>
          <div class="translation">${v.translation || ''}</div>
        `;
        quranTextDiv.appendChild(div);
      });
    } catch (err) {
      console.error("Quran fetch failed:", err);
      quranTextDiv.innerHTML = "Could not load Surah text";
    }
  };

});
