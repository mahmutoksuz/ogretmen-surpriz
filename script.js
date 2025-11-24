// CONFIG: kart içeriği
const notes = [
  { text: '“Öğretmenler yeni nesil sizin eseriniz olacaktır.” – Atatürk', img: 'images/ataturk-flag.jpeg' },
  { text: '24 Kasım Öğretmenler Günü kutlu olsun! 🌸', img: 'images/24kasim.jpeg' },
  { text: 'Güzeller güzeli bir öğretmen var buradaaa !', img: 'images/teacher_icon.png' },
  { text: 'Sınıfın tatlı öğretmeni! ✨', img: 'images/ilkokul.png' },
  { text: 'İyi ki varsın. Seni çok seviyorum.' }
];

// DOM refs
const curiousBtn = document.getElementById('curiousBtn');
const videoWrap = document.getElementById('videoWrap');
const introVideo = document.getElementById('introVideo');
const skipBtn = document.getElementById('skipBtn');
const cardsArea = document.getElementById('cardsArea');
const nextBtn = document.getElementById('nextBtn');
const confettiCanvas = document.getElementById('confettiCanvas');

let current = -1;
let confettiLoaded = false;

// small delay helper
const wait = ms => new Promise(r => setTimeout(r, ms));

// lazy-load confetti lib
function ensureConfetti(){
  return new Promise(resolve => {
    if(window.confetti) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    s.onload = () => { confettiLoaded = true; resolve(); };
    document.body.appendChild(s);
  });
}

// show video with animation
async function openVideo(){
  videoWrap.classList.remove('hidden');
  await wait(40);
  videoWrap.classList.add('show');

  try{
    introVideo.currentTime = 0;
    introVideo.muted = true; // autoplay safety
    await introVideo.play();
    setTimeout(()=>{ try{ introVideo.muted = false }catch(e){} }, 700);
  }catch(e){
    introVideo.controls = true;
  }
}

// hide video (promise ile)
function closeVideo(){
  return new Promise(resolve => {
    try{ introVideo.pause(); }catch(e){}
    videoWrap.classList.remove('show');
    setTimeout(()=>{
      videoWrap.classList.add('hidden');
      resolve();
    }, 420);
  });
}

// render single card (sabit boyut, ortada). If no img -> center text.
function renderCard(data){
  cardsArea.classList.remove('hidden');
  cardsArea.style.pointerEvents = 'auto';
  cardsArea.innerHTML = ''; // yalnızca bir kart göster

  const card = document.createElement('article');
  card.className = 'card';

  const txt = document.createElement('div');
  txt.className = 'text';
  txt.textContent = data.text || '';
  card.appendChild(txt);

  if(data.img){
    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'media';
    const img = document.createElement('img');
    img.src = data.img;
    img.alt = '';
    mediaWrap.appendChild(img);
    card.appendChild(mediaWrap);
  } else {
    card.classList.add('centered'); // görsel yoksa metni tam ortala
  }

  cardsArea.appendChild(card);
  requestAnimationFrame(()=> card.classList.add('show'));

  // confetti burst
  ensureConfetti().then(()=> confetti({ particleCount: 90, spread: 110, origin: { y: 0.5 } }));
}

// show next card
function showNextCard(){
  current++;
  if(current >= notes.length){
    // finale
    nextBtn.classList.add('hidden');
    ensureConfetti().then(()=> {
      confetti({ particleCount: 240, spread: 150, origin: { y: 0.35 } });
      setTimeout(()=> confetti({ particleCount: 300, spread: 200, origin: { y: 0.25 } }), 300);
    });
    return;
  }
  renderCard(notes[current]);
  if(current < notes.length - 1) nextBtn.classList.remove('hidden'); else nextBtn.classList.add('hidden');
}

// EVENT FLOW
curiousBtn.addEventListener('click', async () => {
  await openVideo();
});

// skip
skipBtn.addEventListener('click', async () => {
  await closeVideo();
  const intro = document.getElementById('intro');
  if(intro) intro.remove();
  current = -1;
  await wait(160);
  showNextCard();
});

// when video ends
introVideo.addEventListener('ended', async () => {
  await closeVideo();
  const intro = document.getElementById('intro');
  if(intro) intro.remove();
  await wait(220);
  current = -1;
  showNextCard();
});

// manual next
nextBtn.addEventListener('click', async () => {
  const last = cardsArea.querySelector('.card');
  if(last){
    last.classList.remove('show');
    await wait(420);
  }
  showNextCard();
});

// keyboard friendly
window.addEventListener('keydown', (e) => {
  if((e.key === ' ' || e.key === 'Enter') && !nextBtn.classList.contains('hidden')){
    e.preventDefault();
    nextBtn.click();
  }
});
