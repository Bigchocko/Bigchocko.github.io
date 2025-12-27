const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let playing = false;
let volume = 0.75;
let isDragging = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3.5;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
    }
    draw() {
        ctx.fillStyle = `rgba(0, 255, 65, ${this.alpha})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
    }
}

for(let i=0; i<95; i++) particles.push(new Particle());

const songs = [
    { title: "JZ Stan Umysłu", artist: "BigChocko", src: "assets/music/benger.mp3" },
    { title: "SOON", artist: "BigChocko", src: "assets/music/track2.mp3" }
];
let songIndex = 0;

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-pause');
const progressBar = document.getElementById('progress-bar');
const vibeStatus = document.getElementById('vibe-status');

function loadSong(song) {
    document.getElementById('current-title').innerText = song.title;
    document.getElementById('current-artist').innerText = song.artist;
    audio.src = song.src;
    if (playing) audio.play();
}
loadSong(songs[songIndex]);

playBtn.onclick = () => {
    if (playing) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.body.classList.remove('music-on');
        vibeStatus.innerText = "STYPA";
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.body.classList.add('music-on');
        vibeStatus.innerText = "CHILLING";
    }
    playing = !playing;
};

audio.ontimeupdate = () => {
    if (!isDragging && audio.duration) {
        const val = (audio.currentTime / audio.duration) * 100;
        progressBar.value = val || 0;
        updateTimeDisplay();
    }
};

function updateTimeDisplay() {
    const format = s => { 
        let m = Math.floor(s/60); 
        let sec = Math.floor(s%60); 
        return `${m}:${sec < 10 ? '0'+sec : sec}`; 
    };
    document.getElementById('time-display').innerText = `${format(audio.currentTime)} / ${format(audio.duration || 0)}`;
}

progressBar.onmousedown = () => { isDragging = true; };
progressBar.oninput = () => {
    if (audio.duration) {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
        updateTimeDisplay();
    }
};
progressBar.onchange = () => { isDragging = false; };

document.getElementById('next').onclick = () => { songIndex = (songIndex + 1) % songs.length; loadSong(songs[songIndex]); };
document.getElementById('prev').onclick = () => { songIndex = (songIndex - 1 + songs.length) % songs.length; loadSong(songs[songIndex]); };

document.getElementById('volume-slider').oninput = (e) => {
    volume = e.target.value / 100;
    audio.volume = volume;
};

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (playing) particles.forEach(p => { p.update(); p.draw(); });
    updateBeatVisualizer();
    requestAnimationFrame(animate);
}

function updateBeatVisualizer() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (playing) {
            const h = (Math.sin(Date.now() * 0.01 + index) * 25 + 35) * volume + (Math.random() * 15);
            bar.style.height = h + 'px';
        } else {
            bar.style.height = '8px';
        }
    });
}

animate();