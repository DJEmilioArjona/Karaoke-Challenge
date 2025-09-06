let currentLyrics = [];
let audio = document.getElementById("audio");
let lyricsDiv = document.getElementById("lyrics");
let highlightIndex = -1;
let fadeInterval = null;

// Lista de canciones
const songs = [
  {
    folder: "si_antes_te_hubiera_conocido",
    cover: "songs/si_antes_te_hubiera_conocido/caratula.jpg",
    audio: "songs/si_antes_te_hubiera_conocido/karaoke.mp3",
    lyrics: "songs/si_antes_te_hubiera_conocido/lyrics.json"
  }
];

// Cambiar de pantalla
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Cargar canciones dinámicamente en la lista
async function loadSongs() {
  const songList = document.getElementById("song-list");
  songList.innerHTML = "";

  for (let song of songs) {
    try {
      const response = await fetch(song.lyrics);
      const data = await response.json();

      let card = document.createElement("div");
      card.className = "song-card";

      card.innerHTML = `
        <img src="${song.cover}" alt="Carátula">
        <div class="song-info">
          <h3>${data.title}</h3>
          <p>${data.artist}</p>
        </div>
        <button>Jugar</button>
      `;

      songList.appendChild(card);
      card.querySelector("button").onclick = () => startKaraoke(song.audio, song.lyrics);
    } catch (err) {
      console.error("Error cargando la canción:", song.lyrics, err);
    }
  }
}

// Iniciar karaoke
async function startKaraoke(audioFile, lyricsFile) {
  showScreen("karaoke");

  audio.src = audioFile;
  audio.currentTime = 0;
  audio.volume = 1;
  audio.play();

  setupFadeOut(audio, 5);

  const response = await fetch(lyricsFile);
  const data = await response.json();

  document.getElementById("song-title").textContent = data.title;
  document.getElementById("song-artist").textContent = data.artist;
  document.getElementById("song-cover").src = audioFile.replace("karaoke.mp3", "caratula.jpg");

  currentLyrics = data.lyrics;
  lyricsDiv.innerHTML = "";
  currentLyrics.forEach(line => {
    let p = document.createElement("p");
    p.textContent = line.text;
    lyricsDiv.appendChild(p);
  });

  highlightIndex = -1;
  requestAnimationFrame(updateLyrics);
  pulseLyrics();
}

// Sincronizar letra
function updateLyrics() {
  if (!audio.paused) {
    let currentTime = audio.currentTime;
    for (let i = 0; i < currentLyrics.length; i++) {
      if (currentTime >= currentLyrics[i].time && (!currentLyrics[i + 1] || currentTime < currentLyrics[i + 1].time)) {
        if (highlightIndex !== i) {
          lyricsDiv.querySelectorAll("p").forEach(p => p.classList.remove("highlight"));
          lyricsDiv.querySelectorAll("p")[i].classList.add("highlight");
          highlightIndex = i;
          lyricsDiv.querySelectorAll("p")[i].scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }
  requestAnimationFrame(updateLyrics);
}

// Fade out en los últimos X segundos
function setupFadeOut(audio, duration = 5) {
  const fadeTime = duration;
  const intervalTime = 50;
  const fadeStep = audio.volume / (fadeTime * 1000 / intervalTime);

  if (fadeInterval) clearInterval(fadeInterval);

  fadeInterval = setInterval(() => {
    if (audio.currentTime >= audio.duration - fadeTime) {
      audio.volume = Math.max(0, audio.volume - fadeStep);
      if (audio.volume <= 0) clearInterval(fadeInterval);
    }
  }, intervalTime);
}

// Salir del karaoke
function stopKaraoke() {
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 1;
  showScreen("songs");
}

// Efecto pulso neón en la letra
function pulseLyrics() {
  document.querySelectorAll('#lyrics p.highlight').forEach(p => {
    p.style.textShadow = `0 0 ${Math.random()*10+5}px #0ff,
                          0 0 ${Math.random()*20+10}px #0ff,
                          0 0 ${Math.random()*30+15}px #0ff,
                          0 0 ${Math.random()*40+20}px #0ff`;
  });
  requestAnimationFrame(pulseLyrics);
}

// Inicializar al cargar la página
window.onload = loadSongs;
