const START_DATE = new Date(2023, 9, 17); // 17 ตุลาคม 2023 (เดือนใน JS เริ่มที่ 0)

// --- CONFIG ---
const ANNIVERSARY_PASS = "17/10/2023"; // รหัสผ่านแบบมี /
const MAX_ATTEMPTS = 3;
let failedAttempts = 0;

// --- Elements ---
const loginScreen = document.getElementById('loginScreen');
const sulkingScreen = document.getElementById('sulkingScreen');
const loginBtn = document.getElementById('loginBtn');
const passInput = document.getElementById('passInput');
const errorMsg = document.getElementById('errorMsg');
const attemptMsg = document.getElementById('attemptMsg');
const mainContent = document.getElementById('mainContent');

// --- Input Formatting (เติม / อัตโนมัติ) ---
passInput.addEventListener('input', function(e) {
    // ลบทุกอย่างที่ไม่ใช่ตัวเลขออกก่อน
    let value = e.target.value.replace(/\D/g, '');
    
    // ตัดให้เหลือไม่เกิน 8 ตัวเลข (DDMMYYYY)
    if (value.length > 8) value = value.slice(0, 8);

    // เติม / ตามตำแหน่ง
    if (value.length > 4) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
    } else if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    e.target.value = value;
});

// --- Login Logic ---
function checkLogin() {
    const inputVal = passInput.value;

    if (inputVal === ANNIVERSARY_PASS) {
        // --- Login สำเร็จ ---
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.style.display = 'none';
            mainContent.style.display = 'flex';
            
            playAudio();
            type();
        }, 500);

    } else {
        // --- Login ผิด ---
        failedAttempts++;
        let remaining = MAX_ATTEMPTS - failedAttempts;
        
        // อนิเมชั่นสั่น
        const card = document.querySelector('.login-card');
        card.classList.remove('shake');
        void card.offsetWidth; // trigger reflow
        card.classList.add('shake');

        if (failedAttempts >= MAX_ATTEMPTS) {
            // ผิดครบ 3 ครั้ง -> งอน!
            setTimeout(() => {
                loginScreen.style.display = 'none';
                sulkingScreen.style.display = 'flex';
            }, 500);
        } else {
            // ยังผิดไม่ครบ -> แจ้งเตือน
            errorMsg.classList.add('show');
            attemptMsg.innerText = `เหลือโอกาสอีก ${remaining} ครั้งนะ!`;
            attemptMsg.style.color = '#ff6b6b';
            passInput.value = '';
            
            // ซ่อนข้อความ error เมื่อพิมพ์ใหม่
            passInput.addEventListener('input', () => {
                errorMsg.classList.remove('show');
            }, { once: true });
        }
    }
}

loginBtn.addEventListener('click', checkLogin);
passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkLogin();
});

// --- Existing Time & Animation Logic ---

function updateTime() {
    const now = new Date();
    const diff = now - START_DATE;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    const finalDays = remainingDays % 30;

    let dateText = `${days} DAYS`;
    if (months > 0 || years > 0) {
        dateText = `${years > 0 ? years + ' ปี ' : ''}${months} เดือน ${finalDays} วัน`;
    }

    document.getElementById('datePart').innerText = dateText;
    document.getElementById('timePart').innerText = 
        `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

function pad(n) { return n.toString().padStart(2, '0'); }

const texts = [
    "รักนะเจ้าดื้ออออออ 🐷",
    "อยู่ด้วยกันไปนานๆ น้าาาาาาาาาาา 😘"
];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

function type() {
    if (count === texts.length) count = 0;
    currentText = texts[count];
    letter = currentText.slice(0, ++index);
    
    document.getElementById('footerText').textContent = letter;
    
    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000);
    } else {
        setTimeout(type, 100);
    }
}

const canvas = document.getElementById('cuteCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Heart {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.velY = Math.random() * 1 + 0.5;
        this.size = Math.random() * 15 + 5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.emoji = Math.random() > 0.8 ? '✨' : (Math.random() > 0.5 ? '💖' : '🌸');
    }
    update() {
        this.y -= this.velY;
        if (this.y < -50) {
            this.y = canvas.height + 50;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px serif`;
        ctx.fillText(this.emoji, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    for (let i = 0; i < 30; i++) particles.push(new Heart());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playlistBtn = document.getElementById('playlistBtn');
const playlistPopup = document.getElementById('playlistPopup');
const discIcon = document.getElementById('discIcon');
const songListUI = document.querySelectorAll('#songListUI li');
const songTitle = document.getElementById('songTitle');
const volSlider = document.getElementById('volumeSlider');

function playAudio() {
    audio.play().then(() => {
        playBtn.textContent = "⏸";
        document.querySelector('.player-dock').classList.add('playing');
    }).catch((e) => console.log("รอ User interaction เพิ่มเติม"));
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        playAudio();
    } else {
        audio.pause();
        playBtn.textContent = "▶";
        document.querySelector('.player-dock').classList.remove('playing');
    }
});

playlistBtn.addEventListener('click', () => {
    playlistPopup.classList.toggle('show');
});

songListUI.forEach(li => {
    li.addEventListener('click', () => {
        songListUI.forEach(item => item.classList.remove('active'));
        li.classList.add('active');
        
        audio.src = li.getAttribute('data-src');
        songTitle.textContent = li.textContent.substring(3);
        playAudio();
        playlistPopup.classList.remove('show');
    });
});

volSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

window.onload = function() {
    updateTime();
    setInterval(updateTime, 1000);
    initParticles();
    animate();
};