let currentLyrics = [];
let audio;

// Mostrar canciones
function showSongs() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("song-list").classList.remove("hidden");

  loadSongs();
}

// Volver al menú principal
function backToMenu() {
  document.getElementById("song-list").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

// Volver de karaoke a canciones
function backToSongs() {
  document.getElementById("karaoke").classList.add("hidden");
  document.getElementById("song-list").classList.remove("hidden");

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// Mostrar modal
function showModal(type) {
  document.getElementById("modal-" + type).classList.remove("hidden");
}

// Cerrar modal y volver al menú
function closeModal(type) {
  document.getElementById("modal-" + type).classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

// Cargar canciones desde songs.json
function loadSongs() {
  fetch("songs.json")
    .then(res => res.json())
    .then(songs => {
      const container = document.getElementById("songs-container");
      container.innerHTML = "";

      songs.forEach(song => {
        const card = document.createElement("div");
        card.style.display = "flex";
        card.style.alignItems = "center";
        card.style.justifyContent = "space-between";
        card.style.background = "#333";
        card.style.padding = "10px";
        card.style.borderRadius = "10px";

        card.innerHTML = `
          <div style="display:flex; align-items:center; gap:15px;">
            <img src="songs/${song.folder}/${song.cover}" width="80" height="80" style="border-radius:8px;">
            <div style="text-align:left;">
              <strong>${song.title}</strong><br>
              <span>${song.artist}</span>
            </div>
          </div>
          <button onclick="startKaraoke('${song.folder}', '${song.title}', '${song.artist}', '${song.audio}', '${song.lyric}')">Jugar</button>
        `;
        container.appendChild(card);
      });
    });
}

// Iniciar karaoke
function startKaraoke(folder, title, artist, audioFile, lyricFile) {
  document.getElementById("song-list").classList.add("hidden");
  document.getElementById("karaoke").classList.remove("hidden");

  document.getElementById("karaoke-title").textContent = title;
  document.getElementById("karaoke-artist").textContent = artist;

  audio = document.getElementById("karaoke-audio");
  audio.src = `songs/${folder}/${audioFile}`;
  audio.load();

  // Cargar letra
  fetch(`songs/${folder}/${lyricFile}`)
    .then(res => res.text())
    .then(text => {
      currentLyrics = parseLRC(text);
      renderLyrics(currentLyrics);
    });

  // Sincronizar letra
  audio.ontimeupdate = () => updateLyrics(audio.currentTime, audio.duration);

  // Fade out en últimos 5 seg
  audio.onplay = () => {
    audio.volume = 1.0;
    const fadeInterval = setInterval(() => {
      if (audio.duration - audio.currentTime <= 5) {
        audio.volume = Math.max(0, audio.volume - 0.05);
        if (audio.volume <= 0) clearInterval(fadeInterval);
      }
    }, 500);
  };
}

// Parsear archivo LRC
function parseLRC(lrc) {
  const lines = lrc.split("\n");
  let lyrics = [];
  const regex = /\[(\d+):(\d+\.\d+)\](.*)/;

  lines.forEach(line => {
    const match = regex.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseFloat(match[2]);
      const time = min * 60 + sec;
      const text = match[3].trim();
      lyrics.push({ time, text });
    }
  });

  return lyrics;
}

// Renderizar letra
function renderLyrics(lyrics) {
  const box = document.getElementById("lyrics-box");
  box.innerHTML = "";
  lyrics.forEach((line, index) => {
    const p = document.createElement("p");
    p.id = "line-" + index;
    p.textContent = line.text;
    box.appendChild(p);
  });
}

// Actualizar letra según el tiempo
function updateLyrics(currentTime, duration) {
  currentLyrics.forEach((line, index) => {
    const nextLine = currentLyrics[index + 1];
    if (currentTime >= line.time && (!nextLine || currentTime < nextLine.time)) {
      document.querySelectorAll("#lyrics-box p").forEach(p => p.classList.remove("active-line"));
      document.getElementById("line-" + index).classList.add("active-line");
      document.getElementById("line-" + index).scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
