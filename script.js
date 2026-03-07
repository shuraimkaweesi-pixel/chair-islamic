<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chair Islamic TV – Authentic Islamic Knowledge</title>
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#0f4d3a">
<style>
body{margin:0;font-family:'Segoe UI',sans-serif;color:white;background:linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.8)),url("images/background.jpg");background-size:cover;background-position:center;background-attachment:fixed;}
.navbar{display:flex;justify-content:center;align-items:center;padding:20px 40px;position:fixed;width:100%;background: rgba(0,0,0,0.85);backdrop-filter: blur(10px);z-index:1000;}
.nav-links{list-style:none;display:flex;gap:25px;}
.nav-links a{color:#ffffff;text-decoration:none;font-weight:bold;transition:0.3s;}
.nav-links a:hover{color:#FFD700;}
.hero{padding-top:120px;text-align:center;padding-bottom:60px;}
.hero h1{font-size:42px;color:#FFD700;text-shadow:0 0 10px #FFD700;}
.hero p{max-width:700px;margin:20px auto 0;color:#bfffc1;font-size:18px;line-height:1.6;}
section{max-width:1100px;margin:60px auto;padding:40px 20px;background: rgba(0,0,0,0.75);border-left:5px solid #FFD700;border-radius:12px;box-shadow:0 0 20px rgba(255,215,0,0.2);}
h2{color:#FFD700;margin-bottom:20px;font-size:28px;text-shadow:0 0 5px #FFD700;}
.card{background: rgba(0,0,0,0.7);padding:20px;border-radius:12px;margin-bottom:20px;border-left:5px solid #FFD700;transition:0.3s;}
.card:hover{background: rgba(255,215,0,0.1);transform:scale(1.02);}
iframe{width:100%;height:400px;border-radius:12px;border:3px solid #FFD700;}
#radioPlayer.playing{animation:glow 1.5s infinite alternate;}
@keyframes glow{0%{box-shadow:0 0 10px #FFD700;}50%{box-shadow:0 0 25px #FFD700;}100%{box-shadow:0 0 10px #FFD700;}}
#quranReader{display:none;padding:20px;background: rgba(0,0,0,0.85);border-radius:12px;max-width:1100px;margin:auto;color:white;}
.ayah{margin-bottom:15px;}
.ayah .arabic{font-size:22px;direction:rtl;text-align:right;}
.ayah .translation{font-size:16px;color:#bfffc1;}
.audioBtn{padding:5px 10px;margin-top:5px;border:none;border-radius:5px;background:#FFD700;cursor:pointer;}
.audioBtn:hover{background:#e6c200;}
#ask input,#ask button{padding:10px 15px;margin:5px 0;border-radius:5px;border:none;}
#ask button{background:#FFD700;font-weight:bold;cursor:pointer;}
#ask button:hover{background:#e6c200;}
footer{text-align:center;padding:40px 20px;background:#0f4d3a;color:#fff;font-weight:bold;letter-spacing:1px;border-top:3px solid #FFD700;}
footer a{color:#FFD700;text-decoration:none;}
footer a:hover{text-decoration:underline;}
</style>
</head>
<body>

<nav class="navbar">
  <ul class="nav-links">
    <li><a href="#featured">Featured</a></li>
    <li><a href="#posts">Posts</a></li>
    <li><a href="#radio">Radio</a></li>
    <li><a href="#youtube">YouTube</a></li>
    <li><a href="#tiktok">TikTok</a></li>
    <li><a href="#quran">Quran</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<div class="hero">
  <h1>Chair Islamic TV – Authentic Islamic Knowledge</h1>
  <p>Spreading Quran, Sunnah and beneficial reminders to empower the Ummah. Founded by Shuraim Kaweesi.</p>
</div>

<section id="featured">
  <h2>Featured Lecture</h2>
  <iframe src="https://www.youtube.com/embed/zGIBIOMA0PQ?si=v092ktNEtmo-8l5f" allowfullscreen></iframe>
</section>

<section id="posts">
  <h2>Latest Reflections</h2>
  <div class="card">
    <h3>Reflection on Surah Al-Baqarah</h3>
    <p>A reminder about patience and trust in Allah.</p>
  </div>
</section>

<section id="radio">
  <h2>Live Radio</h2>
  <audio id="radioPlayer" controls>
    <source src="https://example.com/live-stream.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>
</section>

<section id="youtube">
  <h2>YouTube Channel</h2>
  <iframe src="https://www.youtube.com/embed?listType=user_uploads&list=JhxtruR_p9HxolTu" allowfullscreen></iframe>
</section>

<section id="tiktok">
  <h2>TikTok Live</h2>
  <iframe src="https://www.tiktok.com/embed/v1/live/@chairislamictv" allowfullscreen></iframe>
</section>

<section id="ask">
  <h2>Ask a Question</h2>
  <input type="text" id="userQuestion" placeholder="Type your question...">
  <button onclick="sendQuestion()">Send via Email</button>
  <p id="questionStatus"></p>
</section>

<section id="quran">
  <h2>Quran</h2>
  <button onclick="openQuranReader()">Open Quran Reader</button>
  <div id="quranReader">
    <select id="surahSelect"><option value="">Select Surah</option></select>
    <select id="reciterSelect">
      <option value="afasy">Mishary Al-Afasy</option>
      <option value="abdulbasit">Abdul Basit</option>
      <option value="saad">Saad Al-Ghamdi</option>
    </select>
    <button onclick="closeQuranReader()">Close</button>
    <div id="ayahContainer"></div>
  </div>
</section>

<section id="contact">
  <h2>Contact</h2>
  <p>Email: <a href="mailto:shuraimkaweesi@gmail.com">shuraimkaweesi@gmail.com</a></p>
  <p>Phone/WhatsApp: 0754178966</p>
</section>

<footer>
  © 2026 Chair Islamic TV | Founded by Shuraim Kaweesi
</footer>

<script>
// Register Service Worker
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').then(()=>console.log('SW Registered'));}

// Ask via email
function sendQuestion(){
  const q=document.getElementById('userQuestion').value;
  if(q.trim()===''){document.getElementById('questionStatus').innerText='Please type a question.';return;}
  window.location.href=`mailto:shuraimkaweesi@gmail.com?subject=Question from Chair Islamic TV&body=${encodeURIComponent(q)}`;
  document.getElementById('questionStatus').innerText='Opening email client...';
}

// Quran Reader Setup
const surahs=["Al-Fatiha","Al-Baqarah","Al-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajda","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqia","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahina","As-Saff","Al-Jumua","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haaqqa","Al-Maarij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Naziat","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-Ala","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Lail","Ad-Dhuha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat","Al-Qaria","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraish","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];
const surahSelect=document.getElementById("surahSelect");
surahs.forEach((s,i)=>{const opt=document.createElement("option");opt.value=i+1;opt.text=s;surahSelect.appendChild(opt);});
function openQuranReader(){document.getElementById("quranReader").style.display="block";}
function closeQuranReader(){document.getElementById("quranReader").style.display="none";}
const audioBase="https://everyayah.com/data/";
function getSurahAudioUrl(surah,reciter){return `${audioBase}${reciter}/${String(surah).padStart(3,'0')}.mp3`;}
surahSelect.addEventListener("change",()=>{
  const surah=surahSelect.value;
  const reciter=document.getElementById("reciterSelect").value;
  const ayahContainer=document.getElementById("ayahContainer");
  if(!surah){ayahContainer.innerHTML="";return;}
  ayahContainer.innerHTML=`<p style="color:#FFD700; font-weight:bold;">Playing Surah ${surah} — ${reciter.toUpperCase()}</p>
    <audio controls autoplay src="${getSurahAudioUrl(surah,reciter)}" style="width:100%; border-radius:10px;">
      Your browser does not support audio.
    </audio>`;
});
</script>

</body>
</html>
