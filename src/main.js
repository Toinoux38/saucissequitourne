import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="bg-saucisse"></div>
  <button id="music-btn" class="music-btn-discret">Appuyer pour la musique</button>
  <audio id="saucisse-audio" src="/music.mp3"></audio>
  <audio id="disco-audio" src="/disco.mp3"></audio>
`;

const audio = document.getElementById('saucisse-audio');
const discoAudio = document.getElementById('disco-audio');
const btn = document.getElementById('music-btn');
const bg = document.querySelector('.bg-saucisse');
let clickCount = 0;
let discoMode = false;
let discoGifs = [];
let discoGifInterval = null;
let discoGifIndex = 0;
const gifNames = [1,2,3,4,5,6,7,8,9];

function spawnOneDiscoGif() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const gifNum = gifNames[Math.floor(Math.random()*gifNames.length)];
  const el = document.createElement('img');
  el.src = `/gif${gifNum}.gif`;
  el.className = 'disco-gif';
  el.style.left = Math.random() * (w-150) + 'px';
  el.style.top = Math.random() * (h-150) + 'px';
  document.body.appendChild(el);
  let dx = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random()*3);
  let dy = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random()*3);
  discoGifs.push({el, dx, dy});
}

function moveDiscoGifs() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  discoGifs.forEach(g => {
    let x = parseFloat(g.el.style.left);
    let y = parseFloat(g.el.style.top);
    x += g.dx;
    y += g.dy;
    if (x < 0 || x > w-140) g.dx *= -1;
    if (y < 0 || y > h-140) g.dy *= -1;
    x = Math.max(0, Math.min(w-140, x));
    y = Math.max(0, Math.min(h-140, y));
    g.el.style.left = x + 'px';
    g.el.style.top = y + 'px';
  });
}

let discoInterval = null;

function startDiscoGifs() {
  spawnOneDiscoGif();
  discoInterval = setInterval(moveDiscoGifs, 18);
  discoGifInterval = setInterval(() => {
    spawnOneDiscoGif();
  }, 5000);
}
function stopDiscoGifs() {
  discoGifs.forEach(g => g.el.remove());
  discoGifs = [];
  if (discoInterval) clearInterval(discoInterval);
  discoInterval = null;
  if (discoGifInterval) clearInterval(discoGifInterval);
  discoGifInterval = null;
}

btn.onclick = () => {
  if (discoMode) {
    audio.pause();
    audio.currentTime = 0;
    document.body.classList.add('disco-mode');
    bg.classList.add('bw-invert');
    discoAudio.currentTime = 0;
    discoAudio.play();
    startDiscoGifs();
    return;
  }
  clickCount++;
  if (clickCount === 1) {
    audio.play();
    btn.textContent = 'Music Playing!';
  } else if (clickCount === 2) {
    btn.textContent = 'Oh mon gars, ya deja la musique là';
  } else if (clickCount >= 3) {
    btn.textContent = '...';
    discoMode = true;
    btn.classList.add('disco-ready');
  }
};

btn.onmouseenter = () => {
  if (discoMode) {
    btn.classList.add('disco-hover');
  }
};
btn.onmouseleave = () => {
  btn.classList.remove('disco-hover');
};

window.addEventListener('beforeunload', () => {
  document.body.classList.remove('disco-mode');
  bg.classList.remove('bw-invert');
  stopDiscoGifs();
});
