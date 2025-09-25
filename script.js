console.log("Lets write some js!!")
let song
let currentFolder
let currentSong = new Audio();
function secondsToMinutesSconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function main(folder) {
  currentFolder = folder;
let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }

  }
  return songs;

}
const PlayMusic = (track, pause = false) => {
  currentSong.src = `/${currentFolder}/` + track;
  if (!pause) {
    currentSong.play()
    play.src = "assets/pause_circle_40dp_EFEFEF_FILL0_wght400_GRAD0_opsz40.png"
  }
  // let audio  = new Audio()
  // play.src="assets/pause_circle_40dp_EFEFEF_FILL0_wght400_GRAD0_opsz40.png"
  document.querySelector(".song-info").innerHTML = decodeURI(track)
  document.querySelector(".song-time").innerHTML = "00:00 / 00:00"
}
async function getSongs(params) {

  song = await main("songs/ncs")
  PlayMusic(song[0], true)
  let songul = document.querySelector(".your-library-song-container").getElementsByTagName("ul")[0]
  for (const songs of song) {
    songul.innerHTML = songul.innerHTML + `<li>

                            <img class="music-icon" src="assets/music_note_40dp_DCEAD5_FILL0_wght400_GRAD0_opsz40.png" alt="">
                        <div class="info">
                            <div class="song-name">${songs.replaceAll("%20", " ")}</div>
                            <div class="artist">Pardeep</div>
                        </div>
                        <div class="play-now">
                            <span> Play now</span>
                            <img class="playlist-song-play-btn" src="assets/play_circle_40dp_D9D9D9_FILL0_wght400_GRAD0_opsz40.png" alt="">
                        </div>              
     </li>`
  }
  Array.from(document.querySelector(".your-library-song-container").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      PlayMusic(e.querySelector(".info").firstElementChild.innerHTML)

    })
    play.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play()
        play.src = "assets/pause_circle_40dp_EFEFEF_FILL0_wght400_GRAD0_opsz40.png"
      }
      else {
        currentSong.pause()
        play.src = "assets/play_circle_40dp_D9D9D9_FILL0_wght400_GRAD0_opsz40.png"
      }
    })

  })
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSconds(currentSong.currentTime)} / ${secondsToMinutesSconds(currentSong.duration)
      }`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
  })

  document.querySelector(".seek-bar").addEventListener("click", e => {
    let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = (persent) * 100 + "%"
    currentSong.currentTime = ((currentSong.duration) * persent) / 100
  })
  document.querySelector(".hamberger-icon").addEventListener("click", () => {
    document.querySelector(".left-responsive").style.left = "0px"
  })
  document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".left-responsive").style.left = "-350%"
  })

  // previous btn 
  document.querySelector(".song-back-btn").addEventListener("click", () => {
    let index = song.indexOf(currentSong.src.split("/").slice(-1)[0])
 currentSong.pause()
    if ((index - 1) >= 0) {

      PlayMusic(song[index - 1])
    }

  })

  // song next btn
  document.querySelector(".song-forward-btn").addEventListener("click", () => {
    let index = song.indexOf(currentSong.src.split("/").slice(-1)[0])
    currentSong.pause()
    if ((index + 1) < song.length) {
      PlayMusic(song[index + 1])
    }


  })
  // add event to volume
  document.querySelector(".rang").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
currentSong.volume = (e.target.value) /100

  })
  // load the playlist whenever the card is cliked
   Array.from(document.getElementsByClassName("playlist-card")).forEach(e=>{
e.addEventListener("click",async item=>{
  console.log(e);
  
  song = await main( `songs/${song = await main("songs/ncs")}`)
  item.dataset.folder
})
  })
}
getSongs()  