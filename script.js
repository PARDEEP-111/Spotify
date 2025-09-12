console.log("Lets write some js!!")
  async function main(params) {
  let a= await fetch("http://127.0.0.1:5500/songs/")  
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div")
    div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs=[]
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split("/songs/")[1]) 
    }
    
  }
return songs;
    
 }
 async function getSongs(params) {
  let song = await main()
  console.log(song);
   let songul =document.querySelector(".your-library-song-container").getElementsByTagName("ul")[0]
   for (const songs of song) {
    songul.innerHTML = songul.innerHTML+`<li>

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
  
 }
 getSongs()  