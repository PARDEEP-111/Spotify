
console.log("Let's write some JS!!");

let song;
let currentFolder;
let currentSong = new Audio();

function secondsToMinutesSconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function main(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songul = document.querySelector(".your-library-song-container ul");
  songul.innerHTML = ""; // clear old songs

  for (const s of songs) {
    songul.innerHTML += `
      <li>
        <img class="music-icon" src="assets/music_note_40dp_DCEAD5_FILL0_wght400_GRAD0_opsz40.png" alt="">
        <div class="info">
          <div class="song-name">${s.replaceAll("%20", " ")}</div>
          <div class="artist">Pardeep</div>
        </div>
        <div class="play-now">
          <span>Play now</span>
          <img class="playlist-song-play-btn" src="assets/play_circle_40dp_D9D9D9_FILL0_wght400_GRAD0_opsz40.png" alt="">
        </div>
      </li>`;
  }

  Array.from(document.querySelectorAll(".your-library-song-container li")).forEach(e => {
    e.addEventListener("click", () => {
      PlayMusic(e.querySelector(".info .song-name").innerHTML);
    });
  });

  return songs; // ✅ Return the list
}

const PlayMusic = (track, pause = false) => {
  currentSong.src = `/${currentFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "assets/pause_circle_40dp_EFEFEF_FILL0_wght400_GRAD0_opsz40.png";
  }

  document.querySelector(".song-info").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let cardContainer = document.querySelector(".playlist-card-container");
  let a = await fetch(`http://127.0.0.1:5500/songs`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-1)[0]; // ✅ FIXED

      if (folder && folder !== "songs") {
        try {
          // ✅ Fetch folder metadata
          let infoResponse = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
          let info = await infoResponse.json();

          // ✅ Add card dynamically
          cardContainer.innerHTML += `
            <div data-folder="${folder}" class="playlist-card">
              <div class="play-svg">
                <svg class="play-svg-icon" xmlns="http://www.w3.org/2000/svg" width="70" height="77" viewBox="0 0 70 77">
                  <circle cx="35" cy="38.5" r="30" fill="#1DB954"/>
                  <polygon points="28,22 52,38.5 28,55" fill="black"/>
                </svg>
              </div>
              <img class="playlist-img" src="songs/${folder}/cover.png" alt="cover">
              <p class="playlist-heading">${info.title}</p>
              <p class="playlist-paragraph">${info.description}</p>
            </div>`;
        } catch (err) {
          console.warn(`❌ Missing or invalid info.json in ${folder}`);
        }
      }
    }
  }

  // ✅ Add click listeners after cards are created
  Array.from(document.getElementsByClassName("playlist-card")).forEach(e => {
    e.addEventListener("click", async item => {
      console.log(item.currentTarget.dataset.folder);
      song = await main(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

async function getSongs() {
  song = await main("songs/ncs");
  PlayMusic(song[0], true);

  // ✅ Display all albums
  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/pause_circle_40dp_EFEFEF_FILL0_wght400_GRAD0_opsz40.png";
    } else {
      currentSong.pause();
      play.src = "assets/play_circle_40dp_D9D9D9_FILL0_wght400_GRAD0_opsz40.png";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSconds(currentSong.currentTime)} / ${secondsToMinutesSconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seek-bar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamberger-icon").addEventListener("click", () => {
    document.querySelector(".left-responsive").style.left = "2px";
  });
  document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".left-responsive").style.left = "-450%";
  });

  document.querySelector(".song-back-btn").addEventListener("click", () => {
    let index = song.indexOf(currentSong.src.split("/").slice(-1)[0]);
    currentSong.pause();
    if (index - 1 >= 0) PlayMusic(song[index - 1]);
  });

  document.querySelector(".song-forward-btn").addEventListener("click", () => {
    let index = song.indexOf(currentSong.src.split("/").slice(-1)[0]);
    currentSong.pause();
    if (index + 1 < song.length) PlayMusic(song[index + 1]);
  });

  document.querySelector(".rang input").addEventListener("change", e => {
    currentSong.volume = e.target.value / 100;
  });
}

getSongs();

