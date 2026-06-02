// Game State
let currentGame = null;
let score = 0;
let level = 1;
let currentQuestion = null;
let currentLanguage = 'english';
let currentTheme = 'purple';
let usedQuestions = {
    word: [],
    science: [],
    puzzle: [],
    quiz: []
};

// Theme Function
function changeTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme}`;
    localStorage.setItem('gameTheme', theme);
}

// Language Data
const translations = {
    english: {
        welcomeTitle: '🎮 Fun Learning Games 🎮',
        welcomeSubtitle: "Let's Play and Learn Together!",
        startButton: 'START ADVENTURE!',
        chooseGame: 'Choose Your Game!',
        mathGame: 'Math Adventure',
        wordGame: 'Word Builder',
        scienceGame: 'Science Explorer',
        memoryGame: 'Memory Match',
        puzzleGame: 'Puzzle World',
        quizGame: 'Quiz Race',
        backButton: '← Back',
        score: '⭐',
        level: 'Level',
        amazing: 'Amazing!',
        goodTry: 'Good Try!',
        youGotIt: 'You got it right!',
        keepPracticing: 'Keep practicing!',
        whatYouLearned: 'What You Learned:',
        nextLevel: 'Next Level →',
        gameMenu: 'Game Menu'
    },
    urdu: {
        welcomeTitle: '🎮 تعلیمی کھیل 🎮',
        welcomeSubtitle: 'آؤ کھیلیں اور سیکھیں!',
        startButton: 'شروع کریں!',
        chooseGame: 'اپنا کھیل منتخب کریں!',
        mathGame: 'ریاضی کا کھیل',
        wordGame: 'الفاظ بنائیں',
        scienceGame: 'سائنس کی دنیا',
        memoryGame: 'یادداشت کا کھیل',
        puzzleGame: 'پہیلی کی دنیا',
        quizGame: 'کوئز ریس',
        backButton: '→ واپس',
        score: '⭐',
        level: 'لیول',
        amazing: 'شاندار!',
        goodTry: 'اچھی کوشش!',
        youGotIt: 'آپ نے صحیح جواب دیا!',
        keepPracticing: 'مشق جاری رکھیں!',
        whatYouLearned: 'آپ نے کیا سیکھا:',
        nextLevel: 'اگلا لیول →',
        gameMenu: 'کھیل مینو'
    },
    roman: {
        welcomeTitle: '🎮 Talimi Khel 🎮',
        welcomeSubtitle: 'Aao Khelen Aur Seekhen!',
        startButton: 'SHURU KAREIN!',
        chooseGame: 'Apna Khel Muntakhib Karein!',
        mathGame: 'Riyazi Ka Khel',
        wordGame: 'Alfaz Banayein',
        scienceGame: 'Science Ki Duniya',
        memoryGame: 'Yadasht Ka Khel',
        puzzleGame: 'Paheli Ki Duniya',
        quizGame: 'Quiz Race',
        backButton: '← Wapas',
        score: '⭐',
        level: 'Level',
        amazing: 'Shandar!',
        goodTry: 'Achi Koshish!',
        youGotIt: 'Aap ne sahi jawab diya!',
        keepPracticing: 'Mashq jari rakhein!',
        whatYouLearned: 'Aap ne kya seekha:',
        nextLevel: 'Agla Level →',
        gameMenu: 'Khel Menu'
    }
};

function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateLanguageUI();
}

function updateLanguageUI() {
    const t = translations[currentLanguage];
    
    // Update welcome screen
    const welcomeTitle = document.querySelector('#welcomeScreen .title-rainbow');
    const welcomeSubtitle = document.querySelector('#welcomeScreen .subtitle');
    const startBtn = document.querySelector('#welcomeScreen .btn-primary');
    
    if (welcomeTitle) welcomeTitle.textContent = t.welcomeTitle;
    if (welcomeSubtitle) welcomeSubtitle.textContent = t.welcomeSubtitle;
    if (startBtn) startBtn.textContent = t.startButton;
    
    // Update game menu
    const menuTitle = document.querySelector('#gameMenuScreen .title-white');
    if (menuTitle) menuTitle.textContent = t.chooseGame;
    
    const gameCards = document.querySelectorAll('.game-card h3');
    if (gameCards.length >= 6) {
        gameCards[0].textContent = t.mathGame;
        gameCards[1].textContent = t.wordGame;
        gameCards[2].textContent = t.scienceGame;
        gameCards[3].textContent = t.memoryGame;
        gameCards[4].textContent = t.puzzleGame;
        gameCards[5].textContent = t.quizGame;
    }
    
    const backBtn = document.querySelector('#gameMenuScreen .btn-back');
    if (backBtn) backBtn.textContent = t.backButton;
}

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
    updateLanguageUI();
}

function showGameMenu() {
    showScreen('gameMenuScreen');
    updateLanguageUI();
}

function resetGame() {
    score = 0;
    level = 1;
    currentGame = null;
    currentQuestion = null;
    usedQuestions = {
        word: [],
        science: [],
        puzzle: [],
        quiz: []
    };
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
        { word: 'MOON', emoji: '🌙', hint: 'Glows at night' },
        { word: 'FROG', emoji: '🐸', hint: 'Green animal that hops' },
        { word: 'BEAR', emoji: '🐻', hint: 'Big furry animal' },
        { word: 'LION', emoji: '🦁', hint: 'King of the jungle' },
        { word: 'DUCK', emoji: '🦆', hint: 'Swims and says quack' },
        { word: 'ROSE', emoji: '🌹', hint: 'Beautiful flower' },
        { word: 'CAKE', emoji: '🎂', hint: 'Sweet birthday treat' },
        { word: 'BOOK', emoji: '📚', hint: 'We read this' },
        { word: 'BALL', emoji: '⚽', hint: 'Round toy to play with' },
        { word: 'RAIN', emoji: '🌧️', hint: 'Water falling from sky' },
        { word: 'SNOW', emoji: '❄️', hint: 'White and cold' },
        { word: 'FIRE', emoji: '🔥', hint: 'Hot and bright' },
        { word: 'LEAF', emoji: '🍃', hint: 'Green part of tree' }
    ];
    
    // Reset if all questions used
    if (usedQuestions.word.length >= words.length) {
        usedQuestions.word = [];
    }
    
    // Get unused questions
    const availableWords = words.filter((_, index) => !usedQuestions.word.includes(index));
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const wordData = availableWords[randomIndex];
    
    // Mark as used
    const originalIndex = words.indexOf(wordData);
    usedQuestions.word.push(originalIndex);
    
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
        { q: 'What helps us see?', options: ['Eyes', 'Ears', 'Nose', 'Mouth'], answer: 'Eyes', fact: 'Our eyes detect light and send signals to our brain!' },
        { q: 'What do fish use to breathe?', options: ['Gills', 'Lungs', 'Nose', 'Mouth'], answer: 'Gills', fact: 'Fish have gills that take oxygen from water!' },
        { q: 'What season comes after winter?', options: ['Spring', 'Summer', 'Fall', 'Winter'], answer: 'Spring', fact: 'Spring brings flowers and warmer weather!' },
        { q: 'What do bees collect from flowers?', options: ['Nectar', 'Water', 'Leaves', 'Dirt'], answer: 'Nectar', fact: 'Bees collect nectar to make honey!' },
        { q: 'What is frozen water called?', options: ['Ice', 'Steam', 'Fog', 'Dew'], answer: 'Ice', fact: 'Water freezes into ice at 0°C!' },
        { q: 'What gives us light at night?', options: ['Moon', 'Sun', 'Trees', 'Clouds'], answer: 'Moon', fact: 'The Moon reflects sunlight to shine at night!' },
        { q: 'What do birds use to fly?', options: ['Wings', 'Legs', 'Tail', 'Beak'], answer: 'Wings', fact: 'Birds flap their wings to fly through the air!' },
        { q: 'What color are most leaves?', options: ['Green', 'Blue', 'Red', 'Yellow'], answer: 'Green', fact: 'Leaves are green because of chlorophyll!' },
        { q: 'What do we use to hear?', options: ['Ears', 'Eyes', 'Nose', 'Hands'], answer: 'Ears', fact: 'Our ears detect sound waves in the air!' },
        { q: 'What planet do we live on?', options: ['Earth', 'Mars', 'Moon', 'Sun'], answer: 'Earth', fact: 'Earth is the only planet with life we know!' },
        { q: 'What makes thunder sound?', options: ['Lightning', 'Wind', 'Rain', 'Clouds'], answer: 'Lightning', fact: 'Lightning heats air so fast it makes thunder!' }
    ];
    
    // Reset if all questions used
    if (usedQuestions.science.length >= questions.length) {
        usedQuestions.science = [];
    }
    
    // Get unused questions
    const availableQuestions = questions.filter((_, index) => !usedQuestions.science.includes(index));
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const q = availableQuestions[randomIndex];
    
    // Mark as used
    const originalIndex = questions.indexOf(q);
    usedQuestions.science.push(originalIndex);
    
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
        { sequence: ['🐶', '🐱', '🐶', '🐱'], answer: '🐶', options: ['🐶', '🐱', '🐭'] },
        { sequence: ['🌸', '🌺', '🌸', '🌺'], answer: '🌸', options: ['🌸', '🌺', '🌻'] },
        { sequence: ['🚗', '🚙', '🚗', '🚙'], answer: '🚗', options: ['🚗', '🚙', '🚕'] },
        { sequence: ['🎈', '🎈', '🎁', '🎈', '🎈'], answer: '🎁', options: ['🎈', '🎁', '🎀'] },
        { sequence: ['🍕', '🍔', '🍕', '🍔'], answer: '🍕', options: ['🍕', '🍔', '🌭'] },
        { sequence: ['⚽', '🏀', '⚽', '🏀'], answer: '⚽', options: ['⚽', '🏀', '🎾'] },
        { sequence: ['🎵', '🎶', '🎵', '🎶'], answer: '🎵', options: ['🎵', '🎶', '🎸'] }
    ];
    
    // Reset if all questions used
    if (usedQuestions.puzzle.length >= patterns.length) {
        usedQuestions.puzzle = [];
    }
    
    // Get unused questions
    const availablePatterns = patterns.filter((_, index) => !usedQuestions.puzzle.includes(index));
    const randomIndex = Math.floor(Math.random() * availablePatterns.length);
    const pattern = availablePatterns[randomIndex];
    
    // Mark as used
    const originalIndex = patterns.indexOf(pattern);
    usedQuestions.puzzle.push(originalIndex);
    
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
        { q: 'What do bees make?', options: ['Honey', 'Milk', 'Juice', 'Water'], answer: 'Honey', fact: 'Bees collect nectar and turn it into honey!' },
        { q: 'How many wheels does a bicycle have?', options: ['2', '3', '4', '1'], answer: '2', fact: 'Bicycles have 2 wheels for balance!' },
        { q: 'What shape is a ball?', options: ['Circle', 'Square', 'Triangle', 'Star'], answer: 'Circle', fact: 'A ball is round like a circle or sphere!' },
        { q: 'How many fingers on one hand?', options: ['5', '4', '6', '10'], answer: '5', fact: 'Each hand has 5 fingers including the thumb!' },
        { q: 'What animal says "moo"?', options: ['Cow', 'Dog', 'Cat', 'Pig'], answer: 'Cow', fact: 'Cows say moo and give us milk!' },
        { q: 'What do we drink to stay healthy?', options: ['Water', 'Soda', 'Coffee', 'Juice'], answer: 'Water', fact: 'Water keeps our body hydrated and healthy!' },
        { q: 'How many colors in a rainbow?', options: ['7', '5', '6', '8'], answer: '7', fact: 'Rainbow has 7 colors: red, orange, yellow, green, blue, indigo, violet!' },
        { q: 'What season is the coldest?', options: ['Winter', 'Summer', 'Spring', 'Fall'], answer: 'Winter', fact: 'Winter is cold with snow and ice!' },
        { q: 'What do caterpillars turn into?', options: ['Butterfly', 'Bird', 'Bee', 'Spider'], answer: 'Butterfly', fact: 'Caterpillars transform into beautiful butterflies!' },
        { q: 'How many sides does a triangle have?', options: ['3', '4', '5', '6'], answer: '3', fact: 'A triangle has 3 sides and 3 corners!' },
        { q: 'What do we use to write?', options: ['Pencil', 'Spoon', 'Shoe', 'Hat'], answer: 'Pencil', fact: 'Pencils help us write and draw!' },
        { q: 'What fruit is yellow and curved?', options: ['Banana', 'Apple', 'Orange', 'Grape'], answer: 'Banana', fact: 'Bananas are yellow, curved, and full of energy!' }
    ];
    
    // Reset if all questions used
    if (usedQuestions.quiz.length >= quizzes.length) {
        usedQuestions.quiz = [];
    }
    
    // Get unused questions
    const availableQuizzes = quizzes.filter((_, index) => !usedQuestions.quiz.includes(index));
    const randomIndex = Math.floor(Math.random() * availableQuizzes.length);
    const quiz = availableQuizzes[randomIndex];
    
    // Mark as used
    const originalIndex = quizzes.indexOf(quiz);
    usedQuestions.quiz.push(originalIndex);
    
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
    
    const buttons = document.querySelectorAll('.option-btn, .pattern-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        score += 10 * level;
        updateStats();
        celebrateCharacter();
        
        // Only highlight the clicked correct button
        event.target.classList.add('correct');
        
        setTimeout(() => showResult(true), 1500);
    } else {
        sadCharacter();
        
        // Show wrong answer in red
        event.target.classList.add('wrong');
        
        // Show correct answer in green
        buttons.forEach(btn => {
            if (btn.textContent === String(correctAnswer)) {
                btn.classList.add('correct');
            }
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
    // Load saved theme
    const savedTheme = localStorage.getItem('gameTheme') || 'purple';
    changeTheme(savedTheme);
    
    showWelcome();
    updateLanguageUI();
});
