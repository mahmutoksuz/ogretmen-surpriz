// CONFIG: notlar ve kaynaklar
const notes = [
  { text: '“Öğretmenler yeni nesil sizin eseriniz olacaktır.” – Atatürk', img: 'images/ataturk_teacher.jpeg' },
  { text: '24 Kasım Öğretmenler Günü kutlu olsun! 🌸', img: 'images/24kasim.jpeg' },
  { text: 'Sınıfın ışığısın, öğretmenim! ✨', img: 'images/teacher_icon.jpeg' },
  { text: 'İyi ki varsın. Teşekkürler.' , img: 'images/celebrate.jpeg' }
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

// helper: small delay
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

// show video with cinematic animation
async function openVideo(){
  // show overlay
  videoWrap.classList.remove('hidden');
  await wait(40);
  videoWrap.classList.add('show'); // CSS handles video transform

  // play (user gesture guaranteed from button click)
  try{
    introVideo.currentTime = 0;
    introVideo.muted = true; // autoplay safety for some browsers
    await introVideo.play();
    // optionally unmute after short time:
    setTimeout(()=>{ try{ introVideo.muted = false }catch(e){} }, 700);
  }catch(e){
    // fallback: show controls if autoplay blocked
    introVideo.controls = true;
  }
}

// hide video — artık promise döndürüyor, animasyon tamamlanana kadar bekler
function closeVideo(){
  return new Promise(resolve => {
    try{ introVideo.pause(); }catch(e){}
    // play hide animation
    videoWrap.classList.remove('show');
    // küçük bir timeout, CSS geçişine göre ayarla (0.45s güvenli)
    setTimeout(()=>{
      videoWrap.classList.add('hidden');
      resolve();
    }, 480);
  });
}

// create and show next card
async function showNextCard(autoShown = false){
  // eğer tüm kartlar gösterildiyse finali göster
  if(current + 1 >= notes.length){
    showFinalCard();
    return;
  }
  current++;
  const data = notes[current];

  // create card element
  const card = document.createElement('article');
  card.className = 'card';
  const p = document.createElement('p');
  p.textContent = data.text;
  card.appendChild(p);
  if(data.img){
    const img = document.createElement('img');
    img.src = data.img;
    img.alt = '';
    card.appendChild(img);
  }

  // ensure cards area visible and interactable
  cardsArea.classList.remove('hidden');
  cardsArea.style.pointerEvents = 'auto';

  cardsArea.appendChild(card);
  // allow CSS transition
  await wait(30);
  card.classList.add('show');

  // show next button if there are more cards
  if(current < notes.length - 1) nextBtn.classList.remove('hidden');
  else nextBtn.classList.add('hidden');

  // confetti small burst after card appears (only for automatic appearance or if you want always)
  ensureConfetti().then(()=> {
    confetti({ particleCount: 90, spread: 110, origin: { y: 0.45 } });
  });
}

// final card special
async function showFinalCard(){
  // small celebratory card
  const card = document.createElement('article');
  card.className = 'card';
  const p = document.createElement('p');
  p.textContent = 'İyi ki varsın. 24 Kasım Öğretmenler Günü kutlu olsun ❤️';
  card.appendChild(p);
  const img = document.createElement('img');
  img.src = 'images/celebrate.jpeg';
  img.alt = '';
  card.appendChild(img);

  cardsArea.appendChild(card);
  await wait(30);
  card.classList.add('show');

  // big confetti finale
  ensureConfetti().then(()=> {
    confetti({ particleCount: 220, spread: 160, origin: { y: 0.35 } });
    setTimeout(()=> confetti({ particleCount: 300, spread: 200, origin: { y: 0.25 } }), 300);
  });

  nextBtn.classList.add('hidden');
}

// EVENT FLOW
curiousBtn.addEventListener('click', async () => {
  // cinematic open
  await openVideo();
});

// skip button
skipBtn.addEventListener('click', async () => {
  // close and start cards flow
  await closeVideo();
  // tiny delay so CSS settle
  await wait(160);
  showNextCard();
});

// when video ends
introVideo.addEventListener('ended', async () => {
  // close video with animation (wait for close)
  await closeVideo();
  // short pause to make soft transition
  await wait(220);
  // show first card automatically
  showNextCard(true);
});

// next button for advancing
nextBtn.addEventListener('click', async () => {
  // hide last card smoothly
  const last = cardsArea.querySelector('.card:last-child');
  if(last){
    last.classList.remove('show');
    // give transition time
    await wait(420);
  }
  showNextCard();
});

// keyboard friendly: space/enter to progress
window.addEventListener('keydown', (e) => {
  if((e.key === ' ' || e.key === 'Enter') && !nextBtn.classList.contains('hidden')){
    e.preventDefault();
    nextBtn.click();
  }
});
