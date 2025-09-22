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

// Mostrar modal
function showModal(type) {
  document.getElementById("modal-" + type).classList.remove("hidden");
}

// Cerrar modal
function closeModal(type) {
  document.getElementById("modal-" + type).classList.add("hidden");
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
          <button onclick="alert('Aquí irá el karaoke de ${song.title}')">Jugar</button>
        `;
        container.appendChild(card);
      });
    });
}
