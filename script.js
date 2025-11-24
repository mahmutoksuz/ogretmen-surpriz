const welcome = document.getElementById('welcome');
const startBtn = document.getElementById('startBtn');
const playerContainer = document.getElementById('player-container');
const confettiContainer = document.getElementById('confetti-container');

const notes = [
    { text: "“Öğretmenler yeni nesil sizin eseriniz olacaktır.” – Atatürk", img: "images/ataturk_teacher.jpeg", bg: "#ffecd2" },
    { text: "24 Kasım Öğretmenler Günü kutlu olsun! 🌸", img: "images/24kasim.jpeg", bg: "#fcb69f" },
    { text: "“Benim naçiz vücudum elbet bir gün toprak olacaktır, fakat Türkiye Cumhuriyeti ilelebet payidar kalacaktır.” – Atatürk", img: "images/ataturk-flag.jpeg", bg: "#c3e0e5" },
    { text: "Sınıfın ışığısın, öğretmenim! ✨", img: "images/teacher_icon.jpeg", bg: "#d8b4fe" }
];

let usedIndexes = [];
let player;

startBtn.addEventListener('click', () => {
    welcome.style.opacity = '0';
    setTimeout(() => {
        welcome.style.display = 'none';
        launchConfetti(100);
        setTimeout(() => {
            playerContainer.style.display = 'block';
            playYouTubeVideo('7Fxz6TZfr3E');
        }, 1500);
    }, 1000);
});

// YouTube iframe API
function playYouTubeVideo(videoId) {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// Video bitince notları aç
function onPlayerStateChange(event) {
    if(event.data === YT.PlayerState.ENDED){
        playerContainer.style.display = 'none';
        showRandomNote();
    }
}

// Rastgele not gösterme
function showRandomNote() {
    if(usedIndexes.length === notes.length) return;
    let index;
    do { index = Math.floor(Math.random()*notes.length); } 
    while(usedIndexes.includes(index));
    usedIndexes.push(index);

    const noteData = notes[index];
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', 'show');
    noteDiv.style.background = "rgba(255,255,255,0.95)";
    document.body.style.background = noteData.bg;

    const noteText = document.createElement('p');
    noteText.innerText = noteData.text;

    const noteImg = document.createElement('img');
    noteImg.src = noteData.img;

    const nextBtn = document.createElement('button');
    nextBtn.innerText = "Sonraki";
    nextBtn.classList.add('nextBtn');
    nextBtn.addEventListener('click', () => {
        noteDiv.classList.remove('show');
        setTimeout(() => { noteDiv.remove(); showRandomNote(); }, 800);
    });

    noteDiv.appendChild(noteText);
    noteDiv.appendChild(noteImg);
    noteDiv.appendChild(nextBtn);
    document.body.appendChild(noteDiv);
}

// Konfeti
function launchConfetti(amount){
    for(let i=0;i<amount;i++){
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = `hsl(${Math.random()*360},100%,75%)`;
        confetti.style.left = Math.random()*100 + "vw";
        confetti.style.animationDuration = 2 + Math.random()*3 + "s";
        confettiContainer.appendChild(confetti);
        setTimeout(()=>{ confetti.remove(); }, 4000);
    }
}
