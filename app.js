// Game State
let currentGame = null;
let score = 0;
let level = 1;
let currentQuestion = null;

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showWelcome() {
    showScreen('welcomeScreen');
    resetGame();
}

function showGameMenu() {
    showScreen('gameMenuScreen');
}

function resetGame() {
    score = 0;
    level = 1;
    currentGame = null;
    currentQuestion = null;
}

// Start Game
function startGame(gameType) {
    currentGame = gameType;
    score = 0;
    level = 1;
    showScreen('gameScreen');
    
    const titles = {
        math: '➕ Math Adventure',
        word: '📝 Word Builder',
        science: '🔬 Science Explorer',
        memory: '🧠 Memory Match',
        puzzle: '🧩 Puzzle World',
        quiz: '🏁 Quiz Race'
    };
    
    document.getElementById('gameTitle').textContent = titles[gameType];
    updateStats();
    loadQuestion();
}

function updateStats() {
    document.getElementById('score').textContent = `⭐ ${score}`;
    document.getElementById('level').textContent = `Level ${level}`;
}

// Load Question Based on Game Type
function loadQuestion() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';
    
    switch(currentGame) {
        case 'math':
            loadMathQuestion();
            break;
        case 'word':
            loadWordQuestion();
            break;
        case 'science':
            loadScienceQuestion();
            break;
        case 'memory':
            loadMemoryGame();
            break;
        case 'puzzle':
            loadPuzzleQuestion();
            break;
        case 'quiz':
            loadQuizQuestion();
            break;
    }
}

// Math Game
function loadMathQuestion() {
    const maxNum = 5 + (level * 3);
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * Math.min(operations.length, level))];
    
    let correctAnswer;
    let questionText;
    
    if (operation === '+') {
        correctAnswer = num1 + num2;
        questionText = `${num1} + ${num2}`;
    } else if (operation === '-') {
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        correctAnswer = larger - smaller;
        questionText = `${larger} - ${smaller}`;
    } else {
        correctAnswer = num1 * num2;
        questionText = `${num1} × ${num2}`;
    }
    
    currentQuestion = { answer: correctAnswer };
    
    const options = generateOptions(correctAnswer, 4);
    
    const html = `
        <div class="question-box">
            <h2>Solve this problem!</h2>
            <div class="question-text">${questionText} = ?</div>
            <div class="options-grid">
                ${options.map(opt => `
                    <button class="option-btn" onclick="checkAnswer(${opt}, ${correctAnswer})">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('gameArea').innerHTML = html;
}

// Word Game
function loadWordQuestion() {
    const words = [
        { word: 'CAT', emoji: '🐱', hint: 'A furry pet that says meow' },
        { word: 'DOG', emoji: '🐶', hint: 'A loyal pet that barks' },
        { word: 'SUN', emoji: '☀️', hint: 'Bright and warm in the sky' },
        { word: 'TREE', emoji: '🌳', hint: 'Tall plant with leaves' },
        { word: 'FISH', emoji: '🐠', hint: 'Swims in water' },
        { word: 'BIRD', emoji: '🐦', hint: 'Flies in the sky' },
        { word: 'STAR', emoji: '⭐', hint: 'Shines at night' },
        { word: 'MOON', emoji: '🌙', hint: 'Glows at night' }
    ];
    
    const wordData = words[Math.floor(Math.random() * words.length)];
    currentQuestion = { answer: wordData.word };
    
    const letters = wordData.word.split('');
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const extraLetters = allLetters.filter(l => !letters.includes(l))
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
    
    const shuffledLetters = [...letters, ...extraLetters].sort(() => Math.random() - 0.5);
    
    const html = `
        <div class="word-container">
            <h2>${wordData.hint}</h2>
            <div class="word-image">${wordData.emoji}</div>
            <div class="letter-slots" id="letterSlots">
                ${letters.map((_, i) => `<div class="letter-slot" data-index="${i}"></div>`).join('')}
            </div>
            <div class="letter-buttons" id="letterButtons">
                ${shuffledLetters.map((letter, i) => `
                    <button class="letter-btn" onclick="selectLetter('${letter}', ${i})">${letter}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('gameArea').innerHTML = html;
    
    window.selectedLetters = [];
}

function selectLetter(letter, btnIndex) {
    if (window.selectedLetters.length >= currentQuestion.answer.length) return;
    
    const btn = document.querySelectorAll('.letter-btn')[btnIndex];
    btn.disabled = true;
    
    window.selectedLetters.push(letter);
    
    const slots = document.querySelectorAll('.letter-slot');
    const currentSlot = slots[window.selectedLetters.length - 1];
    currentSlot.textContent = letter;
    currentSlot.classList.add('filled');
    
    if (window.selectedLetters.length === currentQuestion.answer.length) {
        setTimeout(() => {
            const userAnswer = window.selectedLetters.join('');
            checkAnswer(userAnswer, currentQuestion.answer);
        }, 500);
    }
}

// Science Game
function loadScienceQuestion() {
    const questions = [
        { q: 'What do plants need to grow?', options: ['Sunlight', 'Darkness', 'Ice', 'Rocks'], answer: 'Sunlight', fact: 'Plants use sunlight to make food through photosynthesis!' },
        { q: 'What do we breathe?', options: ['Air', 'Water', 'Fire', 'Sand'], answer: 'Air', fact: 'Air contains oxygen that our body needs!' },
        { q: 'What makes rain?', options: ['Clouds', 'Trees', 'Cars', 'Houses'], answer: 'Clouds', fact: 'Water vapor in clouds turns into rain drops!' },
        { q: 'What is the hottest?', options: ['Sun', 'Ice', 'Snow', 'Water'], answer: 'Sun', fact: 'The Sun is a giant ball of hot gas!' },
        { q: 'What helps us see?', options: ['Eyes', 'Ears', 'Nose', 'Mouth'], answer: 'Eyes', fact: 'Our eyes detect light and send signals to our brain!' }
    ];
    
    const q = questions[Math.floor(Math.random() * questions.length)];
    currentQuestion = { answer: q.answer, fact: q.fact };
    
    const html = `
        <div class="question-box">
            <h2>Science Question!</h2>
            <div class="question-text">${q.q}</div>
            <div class="options-grid">
                ${q.options.map(opt => `
                    <button class="option-btn" onclick="checkAnswer('${opt}', '${q.answer}')">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('gameArea').innerHTML = html;
}

// Memory Game
function loadMemoryGame() {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const gameEmojis = emojis.slice(0, 4 + level).concat(emojis.slice(0, 4 + level));
    gameEmojis.sort(() => Math.random() - 0.5);
    
    const html = `
        <div class="memory-grid" style="grid-template-columns: repeat(${Math.min(4, 2 + level)}, 1fr);">
            ${gameEmojis.map((emoji, i) => `
                <div class="memory-card" data-emoji="${emoji}" data-index="${i}" onclick="flipCard(${i})">
                    <span style="display:none;">${emoji}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('gameArea').innerHTML = html;
    
    window.memoryGame = {
        flipped: [],
        matched: [],
        canFlip: true
    };
}

function flipCard(index) {
    if (!window.memoryGame.canFlip) return;
    
    const cards = document.querySelectorAll('.memory-card');
    const card = cards[index];
    
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    card.querySelector('span').style.display = 'block';
    window.memoryGame.flipped.push(index);
    
    if (window.memoryGame.flipped.length === 2) {
        window.memoryGame.canFlip = false;
        
        const [first, second] = window.memoryGame.flipped;
        const firstEmoji = cards[first].dataset.emoji;
        const secondEmoji = cards[second].dataset.emoji;
        
        setTimeout(() => {
            if (firstEmoji === secondEmoji) {
                cards[first].classList.add('matched');
                cards[second].classList.add('matched');
                window.memoryGame.matched.push(first, second);
                celebrateCharacter();
                
                if (window.memoryGame.matched.length === cards.length) {
                    setTimeout(() => showResult(true), 1000);
                }
            } else {
                cards[first].classList.remove('flipped');
                cards[second].classList.remove('flipped');
                cards[first].querySelector('span').style.display = 'none';
                cards[second].querySelector('span').style.display = 'none';
            }
            
            window.memoryGame.flipped = [];
            window.memoryGame.canFlip = true;
        }, 1000);
    }
}

// Puzzle Game
function loadPuzzleQuestion() {
    const patterns = [
        { sequence: ['🔴', '🔵', '🔴', '🔵'], answer: '🔴', options: ['🔴', '🔵', '🟢'] },
        { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙', options: ['⭐', '🌙', '☀️'] },
        { sequence: ['🍎', '🍌', '🍎', '🍌'], answer: '🍎', options: ['🍎', '🍌', '🍇'] },
        { sequence: ['🐶', '🐱', '🐶', '🐱'], answer: '🐶', options: ['🐶', '🐱', '🐭'] }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    currentQuestion = { answer: pattern.answer };
    
    const html = `
        <div class="puzzle-container">
            <h2>Complete the Pattern!</h2>
            <div class="pattern-row">
                ${pattern.sequence.map(item => `<div class="pattern-item">${item}</div>`).join('')}
                <div class="pattern-item empty">?</div>
            </div>
            <div class="pattern-choices">
                ${pattern.options.map(opt => `
                    <button class="pattern-btn" onclick="checkAnswer('${opt}', '${pattern.answer}')">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('gameArea').innerHTML = html;
}

// Quiz Game
function loadQuizQuestion() {
    const quizzes = [
        { q: 'How many legs does a spider have?', options: ['8', '6', '4', '10'], answer: '8', fact: 'Spiders are arachnids with 8 legs!' },
        { q: 'What color is the sky?', options: ['Blue', 'Green', 'Red', 'Yellow'], answer: 'Blue', fact: 'The sky appears blue because of how sunlight scatters!' },
        { q: 'How many days in a week?', options: ['7', '5', '6', '8'], answer: '7', fact: 'A week has 7 days: Monday through Sunday!' },
        { q: 'What do bees make?', options: ['Honey', 'Milk', 'Juice', 'Water'], answer: 'Honey', fact: 'Bees collect nectar and turn it into honey!' }
    ];
    
    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    currentQuestion = { answer: quiz.answer, fact: quiz.fact };
    
    const html = `
        <div class="question-box">
            <h2>Quick Quiz!</h2>
            <div class="question-text">${quiz.q}</div>
            <div class="options-grid">
                ${quiz.options.map(opt => `
                    <button class="option-btn" onclick="checkAnswer('${opt}', '${quiz.answer}')">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('gameArea').innerHTML = html;
}

// Check Answer
function checkAnswer(userAnswer, correctAnswer) {
    const isCorrect = String(userAnswer) === String(correctAnswer);
    
    if (isCorrect) {
        score += 10 * level;
        updateStats();
        celebrateCharacter();
        
        const buttons = document.querySelectorAll('.option-btn, .pattern-btn');
        buttons.forEach(btn => {
            if (btn.textContent === String(correctAnswer) || btn.onclick?.toString().includes(String(correctAnswer))) {
                btn.classList.add('correct');
            }
            btn.disabled = true;
        });
        
        setTimeout(() => showResult(true), 1500);
    } else {
        sadCharacter();
        
        const buttons = document.querySelectorAll('.option-btn, .pattern-btn');
        buttons.forEach(btn => {
            if (btn.textContent === String(userAnswer)) {
                btn.classList.add('wrong');
            }
            btn.disabled = true;
        });
        
        setTimeout(() => showResult(false), 1500);
    }
}

// Character Animations
function celebrateCharacter() {
    const character = document.getElementById('character');
    character.classList.remove('sad');
    character.classList.add('happy');
    setTimeout(() => character.classList.remove('happy'), 1500);
}

function sadCharacter() {
    const character = document.getElementById('character');
    character.classList.remove('happy');
    character.classList.add('sad');
    setTimeout(() => character.classList.remove('sad'), 1000);
}

// Show Result
function showResult(isCorrect) {
    showScreen('resultScreen');
    
    const resultTitle = document.getElementById('resultTitle');
    const resultScore = document.getElementById('resultScore');
    const resultMessage = document.getElementById('resultMessage');
    const learningMessage = document.getElementById('learningMessage');
    const starsContainer = document.getElementById('stars');
    
    if (isCorrect) {
        resultTitle.textContent = ['Amazing!', 'Fantastic!', 'Brilliant!', 'Superb!'][Math.floor(Math.random() * 4)];
        resultMessage.textContent = 'You got it right!';
        
        const starCount = Math.min(3, Math.floor(score / 30) + 1);
        starsContainer.innerHTML = '';
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.textContent = '⭐';
            starsContainer.appendChild(star);
        }
    } else {
        resultTitle.textContent = 'Good Try!';
        resultMessage.textContent = 'Keep practicing!';
        starsContainer.innerHTML = '<div class="star">⭐</div>';
    }
    
    resultScore.textContent = `Score: ${score}`;
    
    const learningFacts = {
        math: 'Math helps us count, add, and solve problems every day!',
        word: 'Learning new words helps us read and communicate better!',
        science: currentQuestion?.fact || 'Science helps us understand the world around us!',
        memory: 'Memory games help improve your concentration and focus!',
        puzzle: 'Patterns are everywhere in nature and help us predict what comes next!',
        quiz: currentQuestion?.fact || 'Learning fun facts makes you smarter every day!'
    };
    
    learningMessage.textContent = learningFacts[currentGame] || 'Great job learning something new!';
}

function nextLevel() {
    level++;
    showScreen('gameScreen');
    updateStats();
    loadQuestion();
}

function quitGame() {
    showGameMenu();
}

// Generate Random Options
function generateOptions(correctAnswer, count) {
    const options = [correctAnswer];
    while (options.length < count) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const option = correctAnswer + offset;
        if (option > 0 && !options.includes(option)) {
            options.push(option);
        }
    }
    return options.sort(() => Math.random() - 0.5);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showWelcome();
});
