console.log("JavaScript")
let currentSong = new Audio();
let songs;
let currFolder;

function convertToMinSec(timeInSeconds) {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) {
        return "00:00"
    }
    const totalSeconds = Math.floor(timeInSeconds); // remove milliseconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;
    return `${paddedMinutes}:${paddedSeconds}`;

}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}/`)[1])
        }

    }


    //play the first song




    //Show all the song playlists
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("", "")}</div>
                                <div>Guru Randahawa</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="playbutton2.svg" alt="">
                            </div> </li>`;
    }
    //Attach and event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    });
    return songs
}
const playMusic = (track, pause1 = false) => {
    // let audio = new Audio("/song/"+track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause1) {
        currentSong.play()
        pause.src = "pause.svg"
    }

    document.querySelector(".song-info").innerHTML = decodeURI(track)
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00"
}


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/song/ `)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
            if (e.href.includes("/song")) {
            let folder = e.href.split("/").slice(-2)[0]
            //Get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:3000/song/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}"  class="card">
                        <div class="play">
                            <svg width="40px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img"
                                aria-hidden="true">
                                <circle cx="12" cy="12" r="12" fill="#30b229ff" />
                                <g transform="translate(12,12) scale(0.5) translate(-12,-12)">
                                    <path
                                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"
                                        fill="black" />
                                </g>
                            </svg>
                        </div>
                        <img src="/song/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    //Load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`song/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
    })
}


async function main() {

    //Get the list of all the songs
    await getSongs("song/sirra")
    playMusic(songs[0], true)

    //Diplay all the album on the page
    displayAlbums()

    //Attach an event listener to previous,pause ,and next
    pause.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            pause.src = "pause.svg"
        }
        else {
            currentSong.pause()
            pause.src = "playbutton.svg"
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${convertToMinSec(currentSong
            .currentTime)} / ${convertToMinSec(currentSong.duration)}`;

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an eventlistener in seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })


    //adding EventListener for hamburger 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //adding EventListener for close 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //adding EventListener for previous and next
    previous.addEventListener("click", () => {
      
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) > 1) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < (songs.length)) {
            playMusic(songs[index + 1])
        }
    })


    //volume eventlistener
    document.querySelector(".range1").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    

    //Add the event listener to mute the volume
    document.querySelector(".vol>img").addEventListener("click",e=>{
        
         if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0;
            document.querySelector(".range1").getElementsByTagName("input")[0].value=0
         }
         else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume=.30;
             document.querySelector(".range1").getElementsByTagName("input")[0].value=30
         }
    })

    



}
main()