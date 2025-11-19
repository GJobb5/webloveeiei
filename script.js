const START_DATE = new Date(2023, 9, 17); // 17 ตุลาคม 2023

/* --- Time Logic --- */
function getDateDiff(start, end) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  
  // Time difference
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  // Adjust negative time
  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }

  // Adjust negative date
  if (days < 0) {
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days, hours, minutes, seconds };
}

function updateTime() {
  const now = new Date();
  const diff = getDateDiff(START_DATE, now);

  const dateText = `${diff.years > 0 ? diff.years + ' ปี ' : ''}${diff.months} เดือน ${diff.days} วัน`;
  const timeText = `${pad(diff.hours)} : ${pad(diff.minutes)} : ${pad(diff.seconds)}`;

  document.getElementById('datePart').textContent = dateText;
  document.getElementById('timePart').textContent = timeText;

  // ทุกๆ 10 วินาทีสุ่มสร้างหัวใจ
  if (Math.random() < 0.1) createFloatingEmoji('💖');
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

/* --- Visual Effects --- */
function createFloatingEmoji(emoji) {
  const el = document.createElement('div');
  el.textContent = emoji;
  el.style.position = 'fixed';
  el.style.left = Math.random() * 90 + 5 + '%';
  el.style.bottom = '-50px';
  el.style.fontSize = (Math.random() * 20 + 20) + 'px';
  el.style.transition = 'transform 5s linear, opacity 5s ease-in';
  el.style.zIndex = '1';
  el.style.opacity = '0.8';
  
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = `translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
    el.style.opacity = '0';
  });

  setTimeout(() => el.remove(), 5000);
}

/* --- Theme & Canvas Logic --- */
function initCanvas() {
    const canvas = document.getElementById("background");
    const ctx = canvas.getContext("2d");
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Simple Gradient Animation
    let hue = 0;
    function animate() {
        hue = (hue + 0.5) % 360;
        const isLight = document.body.classList.contains('light');
        
        // สร้าง Gradient ที่นุ่มนวลขึ้น
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        
        if (isLight) {
            gradient.addColorStop(0, `hsl(${hue}, 60%, 95%)`);
            gradient.addColorStop(1, `hsl(${hue + 30}, 60%, 90%)`);
        } else {
            // Dark mode: Midnight Purple theme
            gradient.addColorStop(0, '#2a1b3d');
            gradient.addColorStop(1, '#1a0b1c');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add subtle stars
        if(!isLight) {
            if(Math.random() < 0.05) {
                ctx.fillStyle = '#FFF';
                ctx.fillRect(Math.random()*width, Math.random()*height, 2, 2);
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}

// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    const btn = document.getElementById('themeToggle');
    btn.textContent = document.body.classList.contains('light') ? '🌞' : '🌙';
});

/* --- Music Player Logic --- */
const audio = document.getElementById("audio");
const playBtn = document.getElementById("musicToggle");
const listBtn = document.getElementById("playlistToggle");
const player = document.getElementById("musicPlayer");
const songList = document.getElementById("songList");
const volumeSlider = document.getElementById("volumeSlider");

// Play/Pause
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().catch(e => alert("กรุณาแตะที่หน้าจอหนึ่งครั้งก่อนเล่นเพลง"));
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
});

// Toggle Playlist
listBtn.addEventListener("click", () => {
    player.classList.toggle("expanded");
});

// Update Progress
audio.addEventListener("timeupdate", () => {
    const cur = formatTime(audio.currentTime);
    const dur = formatTime(audio.duration || 0);
    document.getElementById("musicTime").textContent = `${cur} / ${dur}`;
});

function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
}

// Change Song
songList.addEventListener("change", (e) => {
    audio.src = e.target.value;
    document.getElementById("songTitle").textContent = e.target.options[e.target.selectedIndex].text.split(' - ')[1] || "เพลงรัก";
    audio.play();
    playBtn.textContent = "⏸";
});

// Volume
volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});

window.onload = function() {
    updateTime();
    setInterval(updateTime, 1000);
    initCanvas();
    
    const footerText = "รักนะคั้บ ฟ้ า ใ ส ❤️";
    const footerEl = document.getElementById('footerText');
    let i = 0;
    function type() {
        if(i < footerText.length) {
            footerEl.textContent += footerText.charAt(i);
            i++;
            setTimeout(type, 150);
        }
    }
    type();
};