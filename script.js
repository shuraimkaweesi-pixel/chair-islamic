// ----------------------
// script.js - Chair Islamic TV Full Features
// ----------------------

// ----------------------
// 1. Quran Reader
// ----------------------

const surahSelect = document.getElementById("surahSelect");
const reciterSelect = document.getElementById("reciterSelect");
const audioPlayer = document.getElementById("audioPlayer");
const quranText = document.getElementById("quranText");

let quranData = [];
let audioData = [];

// Load Quran text
async function loadQuran() {
  try {

    const res = await fetch("quran-complete.json");
    quranData = await res.json();

    quranData.forEach((surah, index) => {

      const option = document.createElement("option");

      option.value = index + 1;

      option.textContent =
        `${index + 1}. ${surah.name_translations?.ar || surah.name}
        (${surah.name_translations?.en || ""})`;

      surahSelect.appendChild(option);

    });

  } catch (err) {

    console.error("Quran JSON failed to load", err);

  }
}


// Load reciter audio list
async function loadAudio() {

  try {

    const res = await fetch("quran.json");
    audioData = await res.json();

  } catch (err) {

    console.error("Audio JSON failed", err);

  }

}


// Load selected surah
function loadSurah() {

  const surahNum = parseInt(surahSelect.value);

  if (!surahNum) {

    alert("Please select a Surah!");

    return;

  }

  const surah = quranData[surahNum - 1];

  if (!surah) {

    alert("Surah not found");

    return;

  }

  quranText.innerHTML = "";

  // AUDIO
  const reciterIndex = reciterSelect.selectedIndex;

  if (audioData[reciterIndex]) {

    const recitationURL =
      audioData[reciterIndex].recitation.replace("001.mp3",
      surahNum.toString().padStart(3,"0") + ".mp3");

    audioPlayer.innerHTML = `
      <audio controls style="width:100%">
      <source src="${recitationURL}" type="audio/mpeg">
      </audio>
    `;

  }

  // AYAH DISPLAY
  const ayahs = surah.ayahs || surah.verses || [];

  ayahs.forEach((ayah, index) => {

    const arabic =
      ayah.text || ayah.arabic || "";

    const translation =
      ayah.translation?.en ||
      ayah.translation ||
      ayah.en ||
      "";

    const div = document.createElement("div");

    div.className = "ayah";

    div.innerHTML = `
      <div class="arabic">
      ${arabic}
      </div>

      <div class="translation">
      ${translation}
      </div>
    `;

    quranText.appendChild(div);

  });

}



// ----------------------
// 2. Auto Latest YouTube Video
// ----------------------

const youtubeDiv = document.getElementById("youtubeVideos");

async function loadLatestYouTube() {

  try {

    const channelId = "UC-chairislamictv";

    const rssUrl =
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const proxyUrl =
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const response = await fetch(proxyUrl);

    const data = await response.json();

    if (data.items && data.items.length > 0) {

      const latestVideoId =
        data.items[0].link.split("v=")[1];

      youtubeDiv.innerHTML = `
      <iframe width="100%" height="315"
      src="https://www.youtube.com/embed/${latestVideoId}"
      frameborder="0" allowfullscreen>
      </iframe>
      `;

    } else {

      youtubeDiv.innerHTML =
        "<p>No videos found.</p>";

    }

  } catch (err) {

    console.error("YouTube load error", err);

    youtubeDiv.innerHTML =
      "<p>Failed to load latest video.</p>";

  }

}



// ----------------------
// 3. Prayer Times
// ----------------------

async function getPrayerTimes() {

  const city =
    document.getElementById("cityInput").value;

  if (!city)
    return alert("Enter a city!");

  try {

    const res =
      await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=2`
      );

    const data = await res.json();

    const t = data.data.timings;

    document.getElementById("prayerTimes").innerHTML = `
      <p>Fajr: ${t.Fajr}</p>
      <p>Dhuhr: ${t.Dhuhr}</p>
      <p>Asr: ${t.Asr}</p>
      <p>Maghrib: ${t.Maghrib}</p>
      <p>Isha: ${t.Isha}</p>
    `;

  } catch (err) {

    alert("Failed to load prayer times");

  }

}



// ----------------------
// 4. Ask Question Email
// ----------------------

function sendQuestion() {

  const name =
    document.getElementById("userName").value;

  const email =
    document.getElementById("userEmail").value;

  const question =
    document.getElementById("userQuestion").value;

  if (!name || !email || !question)
    return alert("All fields required!");

  window.location.href =
    `mailto:shuraimkaweesi@gmail.com?subject=Question from ${name}&body=${
      encodeURIComponent(question + "\n\nEmail: " + email)
    }`;

}



// ----------------------
// 5. Initialize
// ----------------------

document.addEventListener("DOMContentLoaded", () => {

  loadQuran();

  loadAudio();

  loadLatestYouTube();

});
