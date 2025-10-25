// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        stopAutoScroll();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Music player functionality
const musicUrl = './assets/BG-Music-1.mp3';
const playPause = document.getElementById('playPause');
const playPauseMobile = document.getElementById('playPauseMobile');
let audio = new Audio(musicUrl);
audio.loop = false;
audio.volume = 0.2;

let isPlaying = false;
let autoScrollInterval = null;
let isAutoScrolling = false;
let autoScrollCompleted = false;

audio.addEventListener('ended', function () {
    isPlaying = false;
    updatePlayButtons(false);
    stopAutoScroll();
    autoScrollCompleted = false;
});

// Update both play buttons
function updatePlayButtons(playing) {
    const icon = playing ? '<i class="fa-solid fa-circle-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    if (playPause) playPause.innerHTML = icon;
    if (playPauseMobile) playPauseMobile.innerHTML = icon;
}

// Auto-scroll function
function startAutoScroll() {
    if (isAutoScrolling || autoScrollCompleted) return;
    isAutoScrolling = true;

    autoScrollInterval = setInterval(() => {
        window.scrollBy({
            top: 5,
            behavior: 'smooth'
        });

        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            stopAutoScroll();
        }
    }, 30);
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
['click', 'wheel', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, function (e) {
        if (!e.target.closest('#playPause') &&
            !e.target.closest('#playPauseMobile') &&
            !e.target.closest('#themeToggle') &&
            !e.target.closest('#themeToggleMobile') &&
            !e.target.closest('.music-control') &&
            !e.target.closest('.theme-control')) {
            stopAutoScroll();
        }
    });
});

// Toggle music function
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        updatePlayButtons(false);
        stopAutoScroll();
    } else {
        audio.play();
        updatePlayButtons(true);
        autoScrollCompleted = false;
        startAutoScroll();
        triggerZoomAnimation();
    }
    isPlaying = !isPlaying;
}

// Play/Pause buttons
if (playPause) {
    playPause.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMusic();
    });
}

if (playPauseMobile) {
    playPauseMobile.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMusic();
    });
}

// Zoom animation
function triggerZoomAnimation() {
    const containers = document.querySelectorAll('.container');
    containers.forEach((container, index) => {
        setTimeout(() => {
            container.classList.add('zoom-animate');
            setTimeout(() => {
                container.classList.remove('zoom-animate');
            }, 800);
        }, index * 150);
    });
}

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const body = document.body;

// Track theme in memory instead of localStorage
let isDarkMode = true; // Default to dark mode

// Update both theme buttons
function updateThemeButtons(isDark) {
    const icon = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    if (themeToggle) themeToggle.innerHTML = icon;
    if (themeToggleMobile) themeToggleMobile.innerHTML = icon;
}

// Initialize with dark mode
body.classList.add('dark-mode');
updateThemeButtons(true);

// Toggle theme function
function toggleTheme() {
    body.classList.toggle('dark-mode');
    isDarkMode = body.classList.contains('dark-mode');
    updateThemeButtons(isDarkMode);
}

// Desktop theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleTheme();
    });
}

// Mobile theme toggle
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleTheme();
    });
}

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

// Certification Toggle Functionality
document.querySelectorAll('.cert-toggle').forEach(button => {
    button.addEventListener('click', function (e) {
        e.stopPropagation();

        const certItem = this.closest('.cert-item');
        const details = certItem.querySelector('.cert-details');
        const icon = this.querySelector('i');

        // Close all other open certifications
        document.querySelectorAll('.cert-item').forEach(item => {
            if (item !== certItem) {
                item.querySelector('.cert-details').classList.remove('active');
                item.querySelector('.cert-toggle').classList.remove('active');
            }
        });

        // Toggle current certification
        details.classList.toggle('active');
        this.classList.toggle('active');
    });
});