// Clock functionality
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = daysOfWeek[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    document.getElementById('date').textContent = `${day}, ${date} ${month} ${year}`;

    // Auto dark mode between 6 PM and 6 AM
    if (now.getHours() >= 18 || now.getHours() < 6) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Timer functionality
let timerInterval;
let timeLeft = 0;
let isTimerRunning = false;
let originalTime = 0;

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Add progress color
    const progress = (timeLeft / originalTime) * 100;
    if (progress <= 25) {
        timerDisplay.style.color = '#ff4444';
    } else if (progress <= 50) {
        timerDisplay.style.color = '#ffa700';
    } else {
        timerDisplay.style.color = '#85603f';
    }
}

function startTimer() {
    if (!isTimerRunning && timeLeft === 0) {
        const hours = parseInt(document.getElementById('hours-input').value) || 0;
        const minutes = parseInt(document.getElementById('minutes-input').value) || 0;
        const seconds = parseInt(document.getElementById('seconds-input').value) || 0;
        
        if (hours === 0 && minutes === 0 && seconds === 0) {
            return; // Don't start if no time is set
        }
        
        timeLeft = hours * 3600 + minutes * 60 + seconds;
        originalTime = timeLeft;
    }
    
    if (timeLeft > 0 && !isTimerRunning) {
        isTimerRunning = true;
        document.getElementById('startTimer').textContent = 'Resume';
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                document.getElementById('startTimer').textContent = 'Start';
                showCompletionModal();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        document.getElementById('startTimer').textContent = 'Resume';
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = 0;
    originalTime = 0;
    document.getElementById('startTimer').textContent = 'Start';
    document.getElementById('hours-input').value = '';
    document.getElementById('minutes-input').value = '';
    document.getElementById('seconds-input').value = '';
    document.getElementById('timer').style.color = '#85603f';
    updateTimerDisplay();
}

// Modal functionality
function showCompletionModal() {
    const modal = document.getElementById('completionModal');
    modal.classList.add('active');
    createConfetti();
}

function closeModal() {
    const modal = document.getElementById('completionModal');
    modal.classList.remove('active');
    
    // Remove all confetti elements
    const confetti = document.querySelectorAll('.confetti');
    confetti.forEach(element => element.remove());
}

// Confetti effect
function createConfetti() {
    const colors = ['#ff4444', '#ffa700', '#85603f', '#a67f65'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        document.querySelector('.modal').appendChild(confetti);
        
        // Remove confetti after animation
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}

// Input validation
function validateInput(input) {
    let value = parseInt(input.value) || 0;
    const max = parseInt(input.max);
    
    if (value > max) {
        value = max;
    } else if (value < 0) {
        value = 0;
    }
    
    input.value = value ? value : ''; // Show empty string instead of 0
}

// Background animation
function createBackgroundElements() {
    const container = document.querySelector('.background-animation');
    
    // Create floating elements periodically
    setInterval(() => {
        const element = document.createElement('div');
        element.classList.add(Math.random() > 0.5 ? 'balloon' : 'book');
        element.style.left = Math.random() * 100 + 'vw';
        container.appendChild(element);
        
        // Remove element after animation
        element.addEventListener('animationend', () => {
            element.remove();
        });
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize clock
    setInterval(updateClock, 1000);
    updateClock();
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Start background animations
    createBackgroundElements();
    
    // Timer controls
    document.getElementById('startTimer').addEventListener('click', startTimer);
    document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
    document.getElementById('resetTimer').addEventListener('click', resetTimer);
    
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
    
    // Input validation
    const inputs = document.querySelectorAll('.timer-input input');
    inputs.forEach(input => {
        input.addEventListener('change', () => validateInput(input));
        input.addEventListener('keyup', () => validateInput(input));
    });
    
    // Close modal on click outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('completionModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});