// Snake Learn Letters Game
class SnakeLettersGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.targetWordElement = document.getElementById('targetWord');
        this.scoreElement = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        this.hintElement = document.getElementById('hint');
        this.nextWordBtn = document.getElementById('nextWordBtn');
        this.wordCompleteOverlay = document.getElementById('wordCompleteOverlay');
        this.completedWordDisplay = document.querySelector('.completed-word-display');
        this.continueBtn = document.getElementById('continueBtn');
        this.gameTimerElement = document.getElementById('gameTimer');


        // Game state
        this.currentWordIndex = 0;
        this.currentLetterIndex = 0;
        this.gameWords = this.shuffleWords([
            // семья
            "МАМА","ПАПА","БРАТ","СЕСТРА",

            // части тела
            "РУКА","НОГА","УХО","НОС","РОТ","ЗУБ","ГЛАЗ","ЩЕКА",

            // животные
            "КОТ","ПЁС","СОВА","ЛИСА","ВОЛК","ЗАЯЦ","ТИГР","ЛЕВ","МУХА","ЖУК","РЫБА","ЁЖ","КРОТ",

            // игрушки
            "МЯЧ","КУБ","КУКЛА","КАРТЫ","ЛЕГО","ЮЛА",

            // предметы дома
            "ДОМ","СТОЛ","СТУЛ","ОКНО","ДВЕРЬ","КРОВАТЬ","ЛАМПА","КНИГА","ТЕЛЕВИЗОР",

            // природа
            "ЛЕС","САД","РЕКА","МОРЕ","ГОРА","НЕБО","СОЛНЦЕ","ЗВЕЗДА","ЛУНА","СНЕГ","ДОЖДЬ","ЦВЕТЫ","ТРАВА",

            // еда
            "ХЛЕБ","СЫР","СУП","КАША","МОЛОКО","СОК","ЧАЙ","МЯСО","РИС","ЯЙЦО","ТОРТ","ЯБЛОКО","ГРУША","СЛИВА","МОРКОВЬ",

            // транспорт
            "АВТО","ТАКСИ","ТРАМВАЙ","ПОЕЗД","САНИ","ЛОДКА",

            // одежда
            "ШУБА","ШАПКА","НОСКИ","ПАЛЬТО","САПОГИ","ПЛАТЬЕ","ЮБКА","ФУТБОЛКА",

            // разные простые слова
            "МИР","СОН","СВЕТ","ШКОЛА","ПАРК","ДРУГ","ИГРА","ПЕСНЯ","СЛОВО","КАРТА"
        ]);

        // Snake properties
        this.snake = {
            x: 100,
            y: 100,
            targetX: 100,
            targetY: 100,
            size: 25,
            speed: 3,
            path: [],
            body: [
                {x: 100, y: 100},
                {x: 75, y: 100},
                {x: 50, y: 100}
            ]
        };

        // Letters on field
        this.letters = [];
        this.particles = [];
        this.confetti = [];

        // Game timing
        this.lastTime = 0;
        this.hintTimer = 0;
        this.hintDelay = 5000; // 5 seconds
        this.gameStartTime = Date.now();
        this.gameTime = 0;

        // Audio context for letter pronunciation
        this.audioContext = null;
        this.initAudio();

        this.setupCanvas();
        this.setupEventListeners();
        this.initGame();
        this.hideWordCompletionOverlay(); // Ensure overlay is hidden on startup
        this.gameLoop();
    }

    shuffleWords(words) {
        // Fisher-Yates shuffle algorithm for proper randomization
        const shuffled = [...words]; // Create a copy to avoid mutating the original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    isVowel(letter) {
        // Russian vowels
        const vowels = ['А', 'Е', 'Ё', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я'];
        return vowels.includes(letter);
    }

    getLetterColors(letter) {
        if (this.isVowel(letter)) {
            return {
                background: '#FFE6E6', // Light red background
                border: '#DC143C',     // Dark red border
                text: '#8B0000'        // Dark red text
            };
        } else {
            return {
                background: '#E6F3FF', // Light blue background
                border: '#4169E1',     // Blue border
                text: '#191970'        // Navy blue text
            };
        }
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

                setupCanvas() {
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate available space (accounting for header and UI)
        const headerHeight = document.getElementById('gameHeader').offsetHeight || 80;
        const uiHeight = document.getElementById('gameUI').offsetHeight || 60;
        const padding = 20; // Minimal padding for fullscreen

        const availableWidth = viewportWidth - padding;
        const availableHeight = viewportHeight - headerHeight - uiHeight - padding;

        // Determine optimal canvas size to fill available space
        let canvasWidth = availableWidth;
        let canvasHeight = availableHeight;

        // Maintain reasonable aspect ratio while maximizing screen usage
        const screenAspectRatio = viewportWidth / viewportHeight;

        if (screenAspectRatio > 1.5) {
            // Wide screens - use more horizontal space
            const maxAspectRatio = 2.0;
            if (canvasWidth / canvasHeight > maxAspectRatio) {
                canvasWidth = canvasHeight * maxAspectRatio;
            }
        } else if (screenAspectRatio < 0.8) {
            // Tall screens - use more vertical space
            const maxAspectRatio = 0.6;
            if (canvasWidth / canvasHeight < maxAspectRatio) {
                canvasHeight = canvasWidth / maxAspectRatio;
            }
        }

        // Set minimum sizes
        canvasWidth = Math.max(320, canvasWidth);
        canvasHeight = Math.max(240, canvasHeight);

        // Update canvas dimensions
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        // Canvas will be sized by CSS flexbox to fill available space

        // Update snake position if it's outside new bounds
        this.adjustGameElementsToNewSize();
    }

    adjustGameElementsToNewSize() {
        // Keep snake within new bounds
        this.snake.x = Math.min(this.snake.x, this.canvas.width - 50);
        this.snake.y = Math.min(this.snake.y, this.canvas.height - 50);
        this.snake.targetX = Math.min(this.snake.targetX, this.canvas.width - 50);
        this.snake.targetY = Math.min(this.snake.targetY, this.canvas.height - 50);

        // Adjust snake body positions
        this.snake.body.forEach(segment => {
            segment.x = Math.min(segment.x, this.canvas.width - 50);
            segment.y = Math.min(segment.y, this.canvas.height - 50);
        });

        // Reposition letters to fit new canvas size
        this.letters.forEach(letter => {
            letter.x = Math.min(Math.max(30, letter.x), this.canvas.width - 30);
            letter.y = Math.min(Math.max(30, letter.y), this.canvas.height - 30);
        });

        // Resolve any overlaps that might have been created
        this.resolveLetterOverlaps();
    }

    setupEventListeners() {
        // Mouse and touch events for movement
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouch(e);
        });

        // Prevent context menu on long press
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Window resize handler with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.setupCanvas();
            }, 100); // Debounce resize events
        });

        // Orientation change handler for mobile devices
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setupCanvas();
            }, 500); // Wait for orientation change to complete
        });

        // Next word button handler
        this.nextWordBtn.addEventListener('click', () => this.nextWord());

        // Continue button handler for word completion overlay
        this.continueBtn.addEventListener('click', () => this.continueToNextWord());
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        this.snake.targetX = (e.clientX - rect.left) * scaleX;
        this.snake.targetY = (e.clientY - rect.top) * scaleY;

        this.resetHintTimer();


    }

    handleTouch(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const touch = e.touches[0];
        this.snake.targetX = (touch.clientX - rect.left) * scaleX;
        this.snake.targetY = (touch.clientY - rect.top) * scaleY;

        this.resetHintTimer();


    }

    initGame() {
        this.loadWord(this.currentWordIndex);
        this.generateLetters();
        this.updateWordDisplay();
        this.updateScore();
    }

    loadWord(index) {
        if (index >= this.gameWords.length) {
            this.showGameComplete();
            return;
        }

        this.currentWord = this.gameWords[index];
        this.currentLetterIndex = 0;
        this.resetHintTimer();

    }

    generateLetters() {
        this.letters = [];
        const currentWord = this.currentWord;
        const wordLetters = [...currentWord];

        // Add correct letters
        wordLetters.forEach(letter => {
            this.letters.push({
                letter: letter,
                x: Math.random() * (this.canvas.width - 60) + 30,
                y: Math.random() * (this.canvas.height - 60) + 30,
                isCorrect: true,
                collected: false,
                glowing: false
            });
        });

        // Add distractor letters
        const distractors = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ы', 'Э', 'Ю', 'Я'];
        const numDistractors = Math.min(4, Math.floor(currentWord.length * 1.5));

        for (let i = 0; i < numDistractors; i++) {
            let randomLetter;
            do {
                randomLetter = distractors[Math.floor(Math.random() * distractors.length)];
            } while (wordLetters.includes(randomLetter));

            this.letters.push({
                letter: randomLetter,
                x: Math.random() * (this.canvas.width - 60) + 30,
                y: Math.random() * (this.canvas.height - 60) + 30,
                isCorrect: false,
                collected: false,
                glowing: false
            });
        }

        // Ensure letters don't overlap
        this.resolveLetterOverlaps();
    }

    resolveLetterOverlaps() {
        const minDistance = 70;

        for (let i = 0; i < this.letters.length; i++) {
            for (let j = i + 1; j < this.letters.length; j++) {
                const dx = this.letters[i].x - this.letters[j].x;
                const dy = this.letters[i].y - this.letters[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                    const angle = Math.atan2(dy, dx);
                    const targetDistance = minDistance;
                    const moveDistance = (targetDistance - distance) / 2;

                    this.letters[i].x += Math.cos(angle) * moveDistance;
                    this.letters[i].y += Math.sin(angle) * moveDistance;
                    this.letters[j].x -= Math.cos(angle) * moveDistance;
                    this.letters[j].y -= Math.sin(angle) * moveDistance;

                    // Keep letters within bounds
                    this.letters[i].x = Math.max(30, Math.min(this.canvas.width - 30, this.letters[i].x));
                    this.letters[i].y = Math.max(30, Math.min(this.canvas.height - 30, this.letters[i].y));
                    this.letters[j].x = Math.max(30, Math.min(this.canvas.width - 30, this.letters[j].x));
                    this.letters[j].y = Math.max(30, Math.min(this.canvas.height - 30, this.letters[j].y));
                }
            }
        }
    }

        updateWordDisplay() {
        const word = this.currentWord;
        let html = '';

        for (let i = 0; i < word.length; i++) {
            const isCollected = i < this.currentLetterIndex;
            const letter = word[i];
            const colors = this.getLetterColors(letter);
            const className = isCollected ? 'letter collected' : 'letter';

            // Add inline styles for vowel/consonant colors
            const colorStyle = isCollected ? '' :
                `style="background-color: ${colors.background}; border-color: ${colors.border}; color: ${colors.text};"`;

            html += `<span class="${className}" ${colorStyle}>${letter}</span>`;
        }

        this.targetWordElement.innerHTML = html;
    }

    updateScore() {
        this.scoreElement.textContent = `Слово: ${this.currentWordIndex + 1}`;
    }

    updateGameTimer() {
        // Calculate elapsed time
        this.gameTime = Date.now() - this.gameStartTime;
        const seconds = Math.floor(this.gameTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;

        // Format time as M:SS
        const timeString = `${minutes}:${displaySeconds.toString().padStart(2, '0')}`;
        this.gameTimerElement.textContent = `⏱️ ${timeString}`;
    }

        moveSnake() {
        // If we don't have a path or reached the target, calculate new path
        if (!this.snake.path || this.snake.path.length === 0 || this.hasReachedTarget()) {
            this.calculatePath();
        }

        // Follow the path
        if (this.snake.path && this.snake.path.length > 0) {
            const nextPoint = this.snake.path[0];
            const dx = nextPoint.x - this.snake.x;
            const dy = nextPoint.y - this.snake.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 15) {
                // Reached this waypoint, move to next
                this.snake.path.shift();
                if (this.snake.path.length > 0) {
                    const newNext = this.snake.path[0];
                    const newDx = newNext.x - this.snake.x;
                    const newDy = newNext.y - this.snake.y;
                    const newDistance = Math.sqrt(newDx * newDx + newDy * newDy);

                    if (newDistance > 2) {
                        const moveX = (newDx / newDistance) * this.snake.speed;
                        const moveY = (newDy / newDistance) * this.snake.speed;

                        this.snake.x += moveX;
                        this.snake.y += moveY;
                    }
                }
            } else if (distance > 2) {
                const moveX = (dx / distance) * this.snake.speed;
                const moveY = (dy / distance) * this.snake.speed;

                this.snake.x += moveX;
                this.snake.y += moveY;
            }
        }

        // Update snake body
        this.snake.body[0] = {x: this.snake.x, y: this.snake.y};

        for (let i = 1; i < this.snake.body.length; i++) {
            const prev = this.snake.body[i - 1];
            const current = this.snake.body[i];
            const bodyDx = prev.x - current.x;
            const bodyDy = prev.y - current.y;
            const bodyDistance = Math.sqrt(bodyDx * bodyDx + bodyDy * bodyDy);

            if (bodyDistance > 25) {
                const ratio = 25 / bodyDistance;
                current.x = prev.x - bodyDx * ratio;
                current.y = prev.y - bodyDy * ratio;
            }
        }
    }

    hasReachedTarget() {
        const dx = this.snake.targetX - this.snake.x;
        const dy = this.snake.targetY - this.snake.y;
        return Math.sqrt(dx * dx + dy * dy) < 20;
    }

    calculatePath() {
        const start = {x: Math.round(this.snake.x / 20), y: Math.round(this.snake.y / 20)};
        const end = {x: Math.round(this.snake.targetX / 20), y: Math.round(this.snake.targetY / 20)};

        const path = this.findPath(start, end);

        if (path && path.length > 0) {
            // Convert grid coordinates back to world coordinates
            this.snake.path = path.map(point => ({
                x: point.x * 20,
                y: point.y * 20
            }));
        } else {
            // Fallback to direct movement if no path found
            this.snake.path = [{x: this.snake.targetX, y: this.snake.targetY}];
        }
    }

    findPath(start, end) {
        const gridWidth = Math.ceil(this.canvas.width / 20);
        const gridHeight = Math.ceil(this.canvas.height / 20);

        // Create obstacle grid
        const obstacles = this.createObstacleGrid(gridWidth, gridHeight);

        // A* pathfinding algorithm
        const openSet = [];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        const startKey = `${start.x},${start.y}`;
        const endKey = `${end.x},${end.y}`;

        openSet.push(start);
        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(start, end));

        while (openSet.length > 0) {
            // Find node with lowest fScore
            let current = openSet[0];
            let currentIndex = 0;

            for (let i = 1; i < openSet.length; i++) {
                const currentKey = `${openSet[i].x},${openSet[i].y}`;
                const bestKey = `${current.x},${current.y}`;
                if (fScore.get(currentKey) < fScore.get(bestKey)) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }

            const currentKey = `${current.x},${current.y}`;

            // Reached the goal
            if (currentKey === endKey) {
                return this.reconstructPath(cameFrom, current);
            }

            // Move current from open to closed set
            openSet.splice(currentIndex, 1);
            closedSet.add(currentKey);

            // Check all neighbors
            const neighbors = this.getNeighbors(current, gridWidth, gridHeight);

            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;

                // Skip if in closed set or is obstacle
                if (closedSet.has(neighborKey) || obstacles[neighbor.y] && obstacles[neighbor.y][neighbor.x]) {
                    continue;
                }

                const tentativeGScore = gScore.get(currentKey) + 1;

                // Add to open set if not already there
                if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= gScore.get(neighborKey)) {
                    continue;
                }

                // This path is the best so far
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, end));
            }
        }

        // No path found
        return null;
    }

    createObstacleGrid(gridWidth, gridHeight) {
        const obstacles = [];
        for (let y = 0; y < gridHeight; y++) {
            obstacles[y] = [];
            for (let x = 0; x < gridWidth; x++) {
                obstacles[y][x] = false;
            }
        }

        // Mark letters as obstacles (except the target letter)
        const expectedLetter = this.currentWord[this.currentLetterIndex];

        this.letters.forEach(letter => {
            if (letter.collected) return;

            // Don't treat the target letter as an obstacle
            if (letter.isCorrect && letter.letter === expectedLetter) return;

            const gridX = Math.round(letter.x / 20);
            const gridY = Math.round(letter.y / 20);

            // Mark a small area around each letter as obstacle
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const x = gridX + dx;
                    const y = gridY + dy;
                    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                        obstacles[y][x] = true;
                    }
                }
            }
        });

        return obstacles;
    }

    getNeighbors(node, gridWidth, gridHeight) {
        const neighbors = [];
        const directions = [
            {x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, // cardinal
            {x: -1, y: -1}, {x: 1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1} // diagonal
        ];

        for (const dir of directions) {
            const x = node.x + dir.x;
            const y = node.y + dir.y;

            if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                neighbors.push({x, y});
            }
        }

        return neighbors;
    }

    heuristic(a, b) {
        // Manhattan distance with diagonal movement
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        return Math.max(dx, dy);
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        let currentKey = `${current.x},${current.y}`;

        while (cameFrom.has(currentKey)) {
            current = cameFrom.get(currentKey);
            path.unshift(current);
            currentKey = `${current.x},${current.y}`;
        }

        return path;
    }

    checkCollisions() {
        const head = this.snake.body[0];

        this.letters.forEach(letter => {
            if (letter.collected) return;

            const dx = head.x - letter.x;
            const dy = head.y - letter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 35) {
                this.handleLetterCollection(letter);
            }
        });
    }

    handleLetterCollection(letter) {
        const expectedLetter = this.currentWord[this.currentLetterIndex];

        if (letter.isCorrect && letter.letter === expectedLetter) {
            // Correct letter collected
            letter.collected = true;
            this.currentLetterIndex++;

            // Grow snake
            const tail = this.snake.body[this.snake.body.length - 1];
            this.snake.body.push({x: tail.x - 25, y: tail.y});

            // Play correct sound
            this.playCorrectSound();

            // Create particles
            this.createParticles(letter.x, letter.y, '#32CD32');

            // Update word display
            this.updateWordDisplay();

            // Reset hint timer
            this.resetHintTimer();

            // Check if word is complete
            if (this.currentLetterIndex >= this.currentWord.length) {
                setTimeout(() => this.completeWord(), 500);
            }
                        } else {
            // Wrong letter collision - brief feedback only
            this.playWrongSound();
            this.createParticles(letter.x, letter.y, '#FF6347');

            // Brief shake effect
            this.shakeCanvas();

            // Move snake away from wrong letter to prevent continuous collision
            this.moveSnakeAwayFromLetter(letter);

            // Don't collect wrong letters - snake continues moving
        }
    }

            completeWord() {
        this.playSuccessSound();

        // Create confetti celebration
        this.createConfetti();

        // Show word completion overlay after confetti
        setTimeout(() => {
            this.showWordCompletionOverlay();
        }, 1500);
    }

        showWordCompletionOverlay() {
        // Display the completed word in large style
        this.completedWordDisplay.textContent = this.currentWord;

        // Ensure overlay is visible
        this.wordCompleteOverlay.classList.remove('hidden');
        this.wordCompleteOverlay.style.display = 'flex';
    }

            hideWordCompletionOverlay() {
        // Ensure overlay is completely hidden
        this.wordCompleteOverlay.classList.add('hidden');
        this.wordCompleteOverlay.style.display = 'none';
    }

    continueToNextWord() {
        // Hide the overlay completely
        this.hideWordCompletionOverlay();

        // Move to next word
        this.currentWordIndex++;
        this.loadWord(this.currentWordIndex);
        this.generateLetters();
        this.updateWordDisplay();
        this.updateScore();

        // Clear any remaining confetti
        this.confetti = [];
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: color,
                life: 1.0,
                decay: 0.02
            });
        }
    }

    createConfetti() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
        ];

        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            this.confetti.push({
                x: Math.random() * this.canvas.width,
                y: -20,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                life: 1.0,
                decay: 0.005,
                gravity: 0.1,
                shape: Math.random() < 0.5 ? 'rectangle' : 'circle'
            });
        }

        // Add some extra confetti bursts from different positions
        for (let burst = 0; burst < 3; burst++) {
            const burstX = (this.canvas.width / 4) * (burst + 1);

            for (let i = 0; i < 20; i++) {
                this.confetti.push({
                    x: burstX + (Math.random() - 0.5) * 100,
                    y: -10,
                    vx: (Math.random() - 0.5) * 6,
                    vy: Math.random() * 4 + 1,
                    width: Math.random() * 6 + 3,
                    height: Math.random() * 6 + 3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.3,
                    life: 1.0,
                    decay: 0.004,
                    gravity: 0.08,
                    shape: Math.random() < 0.3 ? 'star' : (Math.random() < 0.5 ? 'rectangle' : 'circle')
                });
            }
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // gravity
            particle.life -= particle.decay;
            return particle.life > 0;
        });
    }

    updateConfetti() {
        this.confetti = this.confetti.filter(piece => {
            // Update position
            piece.x += piece.vx;
            piece.y += piece.vy;

            // Apply gravity
            piece.vy += piece.gravity;

            // Air resistance
            piece.vx *= 0.99;
            piece.vy *= 0.99;

            // Rotation
            piece.rotation += piece.rotationSpeed;

            // Fade out
            piece.life -= piece.decay;

            // Remove if off screen or faded out
            return piece.life > 0 && piece.y < this.canvas.height + 50;
        });
    }

    showFeedback(text, type) {
        this.feedbackElement.textContent = text;
        this.feedbackElement.className = `feedback ${type}`;
        this.feedbackElement.classList.remove('hidden');

        setTimeout(() => {
            this.feedbackElement.classList.add('hidden');
        }, 2000);
    }

    shakeCanvas() {
        this.canvas.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            this.canvas.style.animation = '';
        }, 300);
    }

        moveSnakeAwayFromLetter(letter) {
        // Calculate direction away from the wrong letter
        const dx = this.snake.x - letter.x;
        const dy = this.snake.y - letter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // Normalize direction and move snake away
            const pushDistance = 80; // Distance to push snake away
            let normalizedX = dx / distance;
            let normalizedY = dy / distance;

            // Add random direction change (±45 degrees)
            const randomAngle = (Math.random() - 0.5) * Math.PI / 2; // ±90 degrees in radians
            const cos = Math.cos(randomAngle);
            const sin = Math.sin(randomAngle);

            // Apply rotation to the direction vector
            const rotatedX = normalizedX * cos - normalizedY * sin;
            const rotatedY = normalizedX * sin + normalizedY * cos;

            // Set new position away from the letter with random direction
            const newX = letter.x + rotatedX * pushDistance;
            const newY = letter.y + rotatedY * pushDistance;

            // Keep snake within canvas bounds
            this.snake.x = Math.max(30, Math.min(this.canvas.width - 30, newX));
            this.snake.y = Math.max(30, Math.min(this.canvas.height - 30, newY));

            // Update snake head position
            this.snake.body[0].x = this.snake.x;
            this.snake.body[0].y = this.snake.y;

            // Clear current path and stop movement
            this.snake.path = [];
            this.snake.targetX = this.snake.x;
            this.snake.targetY = this.snake.y;
        }
    }



    resetHintTimer() {
        this.hintTimer = 0;
        this.hintElement.classList.add('hidden');

        // Reset letter glowing
        this.letters.forEach(letter => {
            letter.glowing = false;
        });
    }

    updateHint(deltaTime) {
        this.hintTimer += deltaTime;

        if (this.hintTimer > this.hintDelay) {
            this.showHint();
        }
    }

    showHint() {
        const expectedLetter = this.currentWord[this.currentLetterIndex];
        const targetLetter = this.letters.find(letter =>
            letter.letter === expectedLetter && !letter.collected && letter.isCorrect
        );

        if (targetLetter) {
            targetLetter.glowing = true;
            this.hintElement.textContent = `Найди букву "${expectedLetter}"!`;
            this.hintElement.classList.remove('hidden');
        }
    }

    // Audio functions
    playCorrectSound() {
        this.playBeep(800, 0.1, 'sine');
    }

    playWrongSound() {
        this.playBeep(300, 0.2, 'sawtooth');
    }

    playSuccessSound() {
        // Play a series of ascending notes
        setTimeout(() => this.playBeep(523, 0.15, 'sine'), 0);
        setTimeout(() => this.playBeep(659, 0.15, 'sine'), 150);
        setTimeout(() => this.playBeep(784, 0.3, 'sine'), 300);
    }

    playBeep(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }



    nextWord() {
        // Disable button temporarily to prevent double clicks
        this.nextWordBtn.disabled = true;

        // Clear current game state
        this.confetti = [];
        this.particles = [];
        this.snake.path = [];

        // Move to next word
        this.currentWordIndex++;
        this.loadWord(this.currentWordIndex);
        this.generateLetters();
        this.updateWordDisplay();
        this.updateScore();

        // Re-enable button after a short delay
        setTimeout(() => {
            this.nextWordBtn.disabled = false;
        }, 500);
    }

    showGameComplete() {
        this.showFeedback('Поздравляем! Все слова изучены!', 'success');
        this.nextWordBtn.style.display = 'none';
        // Could add restart functionality here
    }

    // Rendering functions
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // Draw background pattern
        this.drawBackground();

        // Draw snake first (behind letters)
        this.drawSnake();

        // Draw path (for debugging - can be disabled)
        // this.drawPath();

        // Draw letters on top of snake
        this.drawLetters();

        // Draw particles
        this.drawParticles();

        // Draw confetti on top of everything
        this.drawConfetti();
    }

    drawBackground() {
        // Subtle grid pattern
        this.ctx.strokeStyle = 'rgba(200, 220, 255, 0.3)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

        drawLetters() {
        this.letters.forEach(letter => {
            if (letter.collected) return;

            const x = letter.x;
            const y = letter.y;
            const colors = this.getLetterColors(letter.letter);

            // Draw letter background
            this.ctx.save();

            if (letter.glowing) {
                // Glowing effect for hints
                this.ctx.shadowColor = '#FFD700';
                this.ctx.shadowBlur = 20;
                this.ctx.fillStyle = '#FFFFE0';
            } else {
                this.ctx.fillStyle = colors.background;
            }

            this.ctx.beginPath();
            this.ctx.arc(x, y, 25, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw border
            this.ctx.strokeStyle = colors.border;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            this.ctx.restore();

                    // Draw letter text
        this.ctx.fillStyle = colors.text;
        this.ctx.font = 'bold 24px "Helvetica Neue", Helvetica, Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(letter.letter, x, y);
        });
    }

    drawSnake() {
        // Draw snake body
        this.ctx.fillStyle = '#32CD32';
        this.ctx.strokeStyle = '#228B22';
        this.ctx.lineWidth = 2;

        this.snake.body.forEach((segment, index) => {
            const radius = index === 0 ? 15 : 12; // Head is slightly larger

            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        });

        // Draw snake head details (eyes and smile)
        const head = this.snake.body[0];

        // Eyes
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(head.x - 5, head.y - 5, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(head.x + 5, head.y - 5, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Pupils
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(head.x - 5, head.y - 5, 1, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(head.x + 5, head.y - 5, 1, 0, Math.PI * 2);
        this.ctx.fill();

        // Smile
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(head.x, head.y + 2, 6, 0, Math.PI);
        this.ctx.stroke();
    }

    drawPath() {
        // Debug visualization of the pathfinding route
        if (this.snake.path && this.snake.path.length > 1) {
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);

            this.ctx.beginPath();
            this.ctx.moveTo(this.snake.x, this.snake.y);

            for (const point of this.snake.path) {
                this.ctx.lineTo(point.x, point.y);
            }

            this.ctx.stroke();
            this.ctx.restore();

            // Draw waypoints
            this.snake.path.forEach((point, index) => {
                this.ctx.save();
                this.ctx.fillStyle = index === 0 ? 'red' : 'orange';
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawConfetti() {
        this.confetti.forEach(piece => {
            this.ctx.save();
            this.ctx.globalAlpha = piece.life;
            this.ctx.fillStyle = piece.color;

            // Move to position and rotate
            this.ctx.translate(piece.x, piece.y);
            this.ctx.rotate(piece.rotation);

            // Draw different shapes
            if (piece.shape === 'rectangle') {
                this.ctx.fillRect(-piece.width/2, -piece.height/2, piece.width, piece.height);
            } else if (piece.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, piece.width/2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (piece.shape === 'star') {
                this.drawStar(0, 0, 5, piece.width/2, piece.width/4);
                this.ctx.fill();
            }

            this.ctx.restore();
        });
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }

        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
    }

    // Main game loop
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update game state
        this.moveSnake();
        this.checkCollisions();
        this.updateParticles();
        this.updateConfetti();
        this.updateHint(deltaTime);
        this.updateGameTimer();

        // Render everything
        this.render();

        // Continue the loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Enable audio context on first user interaction
    const enableAudio = () => {
        if (window.game && window.game.audioContext && window.game.audioContext.state === 'suspended') {
            window.game.audioContext.resume();
        }
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });

    // Start the game
    window.game = new SnakeLettersGame();
});
