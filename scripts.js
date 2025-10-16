// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        stopAutoScroll(); // Stop auto-scroll when user clicks nav
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Music player functionality with hardcoded music
const musicUrl = './assets/In-Dreamland.mp3';

const playPause = document.getElementById('playPause');
let audio = new Audio(musicUrl);
audio.loop = false;
audio.volume = 0.1;
audio.addEventListener('ended', function() {
    isPlaying = false;
    playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    stopAutoScroll();
    autoScrollCompleted = false;  // Reset to allow replay
});
let isPlaying = false;
let autoScrollInterval = null;
let isAutoScrolling = false;
let autoScrollCompleted = false;

// Auto-scroll function
function startAutoScroll() {
    if (isAutoScrolling || autoScrollCompleted) return;
    isAutoScrolling = true;

    autoScrollInterval = setInterval(() => {
        window.scrollBy({
            top: 1.5,
            behavior: 'smooth'
        });

        // Stop at bottom of page
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            stopAutoScroll();
        }
    }, 30); // Adjust speed: lower = faster, higher = slower
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
        isAutoScrolling = false;
        autoScrollCompleted = true;
    }
}

// Stop auto-scroll on user interaction
const stopScrollEvents = ['click', 'wheel', 'touchstart', 'keydown'];
stopScrollEvents.forEach(event => {
    document.addEventListener(event, function (e) {
        // Don't stop if clicking the play/pause button or theme toggle
        if (!e.target.closest('#playPause') && !e.target.closest('#themeToggle')) {
            stopAutoScroll();
        }
    });
});

// Play/Pause button functionality
playPause.addEventListener('click', function (e) {
    e.stopPropagation();

    if (isPlaying) {
        audio.pause();
        playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
        stopAutoScroll();
    } else {
        audio.play();
        playPause.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
        autoScrollCompleted = false;  // Reset to allow auto-scroll on replay
        startAutoScroll();

        // Trigger zoom animation on all sections
        triggerZoomAnimation();
    }
    isPlaying = !isPlaying;
});

// Zoom animation for sections when music starts
function triggerZoomAnimation() {
    const containers = document.querySelectorAll('.container');

    containers.forEach((container, index) => {
        // Add animation with staggered delay
        setTimeout(() => {
            container.classList.add('zoom-animate');

            // Remove class after animation completes so it can be triggered again
            setTimeout(() => {
                container.classList.remove('zoom-animate');
            }, 800);
        }, index * 150); // 150ms delay between each section
    });
}

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference - defaults to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// Active nav link
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(a => {
        const isDark = body.classList.contains('dark-mode');
        a.style.color = isDark ? '#e0e0e0' : '#333';
        if (a.getAttribute('href').includes(current)) {
            a.style.color = isDark ? '#64b5f6' : '#0078d7';
        }
    });
});