const emojis = ['🦋', '🌸', '🦄', '🌈', '🎀', '⭐', '🌺', '🍭', '🎨', '🌙', '🌟', '🦚', '🎯', '🎪', '🎭', '🎡', '🎢', '🌊', '☀️', '🌍', '🦁', '🐉', '🍕', '🍟', '🍿', '🍣', '🍩', '🧁', '🍔', '🍉', '🍓', '🍒', '🍍'];
let flippedCards = [];
let moves = 0;
let timeLeft = 60;
let timerInterval;
let isGameActive = false;
let currentDifficulty = 'easy';

const difficultySettings = {
    easy: {
        grid: 4,
        time: 60,
        pairs: 8
    },
    medium: {
        grid: 5,
        time: 120,
        pairs: 15
    },
    hard: {
        grid: 8,
        time: 180,
        pairs: 18
    }
};

const gameContainer = document.getElementById('gameContainer');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const modal = document.getElementById('gameModal');

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.difficulty-btn.${difficulty}`).classList.add('active');
    
    gameContainer.className = `game-container ${difficulty}`;
    restartGame();
}

function updateTimer() {
    if (!isGameActive) return;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (timeLeft <= 10) {
        timerDisplay.classList.add('warning');
    }

    if (timeLeft <= 0) {
        endGame(false);
        return;
    }

    timeLeft--;
}

function showModal(won) {
    const resultTitle = document.getElementById('resultTitle');
    const resultDetails = document.getElementById('resultDetails');

    modal.className = won ? 'win modal' : 'fail modal';
    resultTitle.textContent = won ? '🎉 Victory! 🎉' : '⏰ Time is Up! ⏰';

    const matchedPairs = document.querySelectorAll('.card.matched').length / 2;
    const totalPairs = difficultySettings[currentDifficulty].pairs;
    resultDetails.textContent = won 
        ? `Amazing! You found all ${totalPairs} pairs in ${moves} moves with ${timeLeft + 1} seconds left!`
        : `You found ${matchedPairs} out of ${totalPairs} pairs in ${moves} moves. Keep practicing!`;
    
    modal.style.display = 'flex';
}

function endGame(won) {
    isGameActive = false;
    clearInterval(timerInterval);
    showModal(won);
}

function createCard(emoji) {
    const cardSlot = document.createElement('div');
    cardSlot.className = 'card-slot';
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-face card-front">${emoji}</div>
        <div class="card-face card-back">🎴</div>
    `;
    cardSlot.appendChild(card);
    return cardSlot;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleCardClick(cardSlot) {
    const card = cardSlot.querySelector('.card');
    if (!isGameActive || card.classList.contains('flipped') || 
        card.classList.contains('matched') || flippedCards.length === 2) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.querySelector('.card-front').innerHTML === 
                 card2.querySelector('.card-front').innerHTML;

    if (match) {
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            checkWin();
        }, 500);
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function checkWin() {
    const matchedCards = document.querySelectorAll('.card.matched').length;
    const totalCards = difficultySettings[currentDifficulty].pairs * 2;
    if (matchedCards === totalCards) {
        endGame(true);
    }
}

function initializeGame() {
    gameContainer.innerHTML = '';
    flippedCards = [];
    moves = 0;
    const settings = difficultySettings[currentDifficulty];
    timeLeft = settings.time;
    isGameActive = true;

    movesDisplay.textContent = moves;
    timerDisplay.textContent = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;
    timerDisplay.classList.remove('warning');
    modal.style.display = 'none';

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    const selectedEmojis = shuffleArray([...emojis]).slice(0, settings.pairs);
    const gameEmojis = [...selectedEmojis, ...selectedEmojis];
    shuffleArray(gameEmojis);

    gameEmojis.forEach(emoji => {
        const cardSlot = createCard(emoji);
        cardSlot.addEventListener('click', () => handleCardClick(cardSlot));
        gameContainer.appendChild(cardSlot);
    });
}

function restartGame() {
    initializeGame();
}

// Start the game
initializeGame();
