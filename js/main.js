let songs = [];
let currentIndex = 0;

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const durationSpan = document.getElementById("duration");
const playBtn = document.getElementById("playBtn");

fetch("songs.json")
  .then(response => response.json())
  .then(data => {
      songs = data;
      loadSong(currentIndex);
  });

function loadSong(index) {
    const song = songs[index];
    audio.src = `songs/${song.folder}/song.mp3`;
    cover.src = `songs/${song.folder}/cover.png`;
    title.textContent = song.title;
    artist.textContent = song.artist;

    audio.addEventListener("loadedmetadata", () => {
        durationSpan.textContent = formatTime(audio.duration);
    });
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

playBtn.addEventListener("click", () => {
    audio.play();
});
