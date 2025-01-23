// ==================== Globale Variabelen ====================
let isPaused = false;
let gameInterval;
let randomizeInterval;

let hunger = 10;
let energy = 10;
let happiness = 10;

let feedCount = 0;
let playCount = 0;
let sleepCount = 0;

let achievements = {
    'First Meal': false,
    'Hungry No More': false,
    'Master Chef': false,
    'Playtime Beginner': false,
    'Playtime Pro': false,
    'Playtime Champion': false,
    'Good Night\'s Sleep': false,
    'Sleepyhead': false,
    'Sleep Master': false
};

const audio = new Audio('background-music.mp3');
audio.loop = true;

// ==================== Game State Management ====================
function togglePause() {
    isPaused = !isPaused;
    const pauseMenu = document.getElementById('pause-menu');
    if (isPaused) {
        pauseMenu.style.display = 'flex';
        clearInterval(gameInterval);
        clearInterval(randomizeInterval);
    } else {
        pauseMenu.style.display = 'none';
        gameInterval = setInterval(decreaseBars, 5000);
        randomizeInterval = setInterval(randomizeBars, 1500);
    }
}

function goToHome() {
    window.location.href = 'THome.html';
}

function resumeGame() {
    togglePause();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        togglePause();
    }
});

// ==================== Audio Management ====================
function setMusicPreference(preference) {
    localStorage.setItem('playMusic', preference);
    if (preference === 'yes') {
        audio.play();
    } else {
        audio.pause();
    }
}

function toggleMute() {
    if (audio.muted) {
        audio.muted = false;
        document.getElementById('mute-icon').src = 'unmute-icon.png';
        localStorage.setItem('isMuted', 'false');
    } else {
        audio.muted = true;
        document.getElementById('mute-icon').src = 'volume-mute.png';
        localStorage.setItem('isMuted', 'true');
    }
}

// Controleer de muziekvoorkeur bij het laden van de pagina
function checkMusicPreference() {
    const musicPreference = localStorage.getItem('playMusic');
    if (musicPreference === 'yes') {
        audio.play();
    }
}

// Controleer de mute-status bij het laden van de pagina
function checkMuteStatus() {
    const isMuted = localStorage.getItem('isMuted');
    if (isMuted === 'true') {
        audio.muted = true;
        document.getElementById('mute-icon').src = "volume-mute.png";
    } else {
        audio.muted = false;
        document.getElementById('mute-icon').src = "unmute-icon.png";
    }
}

// Toon de muziekprompt bij het laden van de pagina
window.onload = () => {
    if (localStorage.getItem('musicPromptShown') !== 'true') {
        const musicModal = document.createElement('div');
        musicModal.id = 'music-modal';
        musicModal.className = 'modal';
        musicModal.innerHTML = `
            <div class="modal-content">
                <p>Wil je achtergrondmuziek tijdens het spelen van het spel?</p>
                <button onclick="setMusicPreference('yes')">Yes</button>
                <button onclick="setMusicPreference('no')">No</button>
            </div>
        `;
        document.body.appendChild(musicModal);
        musicModal.style.display = 'block';
        localStorage.setItem('musicPromptShown', 'true');
    }

    checkMusicPreference();
    checkMuteStatus();
};

// ==================== Tamagotchi Management ====================
function updateBars() {
    document.getElementById('hunger-bar').style.width = hunger * 10 + '%';
    document.getElementById('hunger-value').textContent = hunger;
    document.getElementById('energy-bar').style.width = energy * 10 + '%';
    document.getElementById('energy-value').textContent = energy;
    document.getElementById('happiness-bar').style.width = happiness * 10 + '%';
    document.getElementById('happiness-value').textContent = happiness;
    checkGameOver();
}

function decreaseBars() {
    if (hunger > 0) hunger = Math.max(hunger - 1, 0);
    if (energy > 0) energy = Math.max(energy - 1, 0);
    if (happiness > 0) happiness = Math.max(happiness - 1, 0);
    updateBars();
    updateChat();
}

function randomizeBars() {
    hunger = Math.max(hunger - Math.floor(Math.random() * 2), 0);
    energy = Math.max(energy - Math.floor(Math.random() * 2), 0);
    happiness = Math.max(happiness - Math.floor(Math.random() * 2), 0);
    updateBars();
}

function checkGameOver() {
    if (hunger === 0 || energy === 0 || happiness === 0) {
        document.getElementById('game-over').style.display = 'block';
        clearInterval(gameInterval);
        clearInterval(randomizeInterval);
        resetAchievements();
    }
}

function resetAchievements() {
    achievements = {
        'First Meal': false,
        'Hungry No More': false,
        'Master Chef': false,
        'Playtime Beginner': false,
        'Playtime Pro': false,
        'Playtime Champion': false,
        'Good Night\'s Sleep': false,
        'Sleepyhead': false,
        'Sleep Master': false
    };

    feedCount = 0;
    playCount = 0;
    sleepCount = 0;

    updateAchievementsUI();
}

function updateAchievementsUI() {
    const achievementList = document.getElementById('achievement-list');
    const achievementsElements = achievementList.getElementsByTagName('li');

    for (let achievement of achievementsElements) {
        const achievementText = achievement.textContent.replace('✅ ', '').replace('🔒 ', '');
        if (achievements[achievementText]) {
            achievement.classList.remove('locked');
            achievement.classList.add('unlocked');
            achievement.textContent = '✅ ' + achievementText;
        } else {
            achievement.classList.remove('unlocked');
            achievement.classList.add('locked');
            achievement.textContent = '🔒 ' + achievementText;
        }
    }
}

function feed() {
    let eatSound = new Audio('eating-chocolate-67566.mp3');
    eatSound.play();

    setTimeout(() => {
        eatSound.pause();
        eatSound.currentTime = 0;
    }, 1000);

    hunger = Math.min(hunger + 1, 10);
    feedCount++;
    if (feedCount === 1) unlockAchievement('First Meal');
    if (feedCount === 15) unlockAchievement('Hungry No More');
    if (feedCount === 30) unlockAchievement('Master Chef');

    document.getElementById('tamagotchi-image').src = 'EatTM.png';
    setTimeout(() => {
        document.getElementById('tamagotchi-image').src = 'StartTM.png';
    }, 3000);
    updateBars();
    updateChat();
}

function play() {
    if (energy > 0) {
        happiness = Math.min(happiness + 1, 10);
        energy = Math.max(energy - 1, 0);
        playCount++;
        if (playCount === 1) unlockAchievement('Playtime Beginner');
        if (playCount === 15) unlockAchievement('Playtime Pro');
        if (playCount === 30) unlockAchievement('Playtime Champion');

        document.getElementById('tamagotchi-image').src = 'PlayTM.png';
        setTimeout(() => {
            document.getElementById('tamagotchi-image').src = 'StartTM.png';
        }, 3000);
        updateBars();
        updateChat();
    }
}

function sleep() {
    let sleepSound = new Audio('snoring-42710.mp3');
    sleepSound.play();

    setTimeout(() => {
        sleepSound.pause();
        sleepSound.currentTime = 0;
    }, 1000);

    energy = Math.min(energy + 2, 10);
    sleepCount++;
    if (sleepCount === 1) unlockAchievement('Good Night\'s Sleep');
    if (sleepCount === 15) unlockAchievement('Sleepyhead');
    if (sleepCount === 30) unlockAchievement('Sleep Master');

    document.getElementById('tamagotchi-image').src = 'SleepTM.png';
    setTimeout(() => {
        document.getElementById('tamagotchi-image').src = 'StartTM.png';
    }, 3000);
    updateBars();
    updateChat();
}

function retry() {
    hunger = 10;
    energy = 10;
    happiness = 10;
    updateBars();
    document.getElementById('game-over').style.display = 'none';
    gameInterval = setInterval(decreaseBars, 5000);
    randomizeInterval = setInterval(randomizeBars, 1500);
}

// ==================== UI Management ====================
function updateChat() {
    const chat = document.getElementById('tamagotchi-chat');
    if (hunger <= 3) {
        chat.textContent = "I'm so hungry! Please feed me!";
    } else if (energy <= 2) {
        chat.textContent = "I'm so tired... I need to sleep!";
    } else if (happiness <= 2) {
        chat.textContent = "I'm feeling lonely... let's play!";
    } else if (hunger <= 3) {
        chat.textContent = "Getting a bit hungry!";
    } else if (energy <= 3) {
        chat.textContent = "Feeling a bit tired...";
    } else if (happiness <= 3) {
        chat.textContent = "Could use some fun!";
    } else {
        chat.textContent = "I'm feeling great! Keep taking care of me!";
    }
}

function toggleAchievements() {
    const achievementsSection = document.querySelector('.achievements');
    achievementsSection.classList.toggle('hidden');
}

function unlockAchievement(achievementText) {
    achievements[achievementText] = true;
    updateAchievementsUI();
}

// ==================== Initialisatie ====================
updateBars();
gameInterval = setInterval(decreaseBars, 5000);
randomizeInterval = setInterval(randomizeBars, 1500);