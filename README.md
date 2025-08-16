# 🐍 Snake — Learn Letters

**This is a video-coded game** - built from scratch during a live coding session to demonstrate modern web game development techniques.

An educational game for children aged 4-6 to learn Russian letters and simple words through interactive gameplay.

## 🎯 Game Objective

Help children learn Russian letters and words (2-9 letters) in a fun, engaging way. The child must collect letters in the correct order by controlling a friendly snake that moves smoothly toward tapped locations.

## 🎮 How to Play

1. **Target Word**: The word to collect appears at the top of the screen (e.g., КОТ)
2. **Controls**: Tap anywhere on the screen — the snake moves smoothly toward that point
3. **Letter Collection**:
   - **Correct letter** → Highlights in word, plays pleasant sound, letter is pronounced
   - **Wrong letter** → Error sound and shake animation
4. **Word Completion**: When all letters are collected correctly, the complete word is pronounced and confetti celebration plays
5. **Skip Words**: Use the "Next Word →" button to skip to the next word anytime

## ✨ Key Features

### 🎮 **Gameplay Features**
- **Tap-to-move controls** - Intuitive touch/click navigation
- **Smart pathfinding** - Snake intelligently navigates around obstacles using A* algorithm
- **Color-coded letters** - Vowels are red, consonants are blue for visual learning
- **Hint system** - Letters glow after 5 seconds of inactivity to guide children
- **Word skipping** - "Next Word" button for flexible learning pace

### 🎨 **Visual & Audio**
- **Fullscreen experience** - Maximizes screen space on all devices
- **Confetti celebrations** - Beautiful particle animations when words are completed
- **Letter pronunciation** - Each letter is spoken when collected
- **Word pronunciation** - Complete words are spoken upon completion
- **Visual feedback** - Particles, animations, and friendly snake with eyes

### 📱 **Technical Features**
- **Fully responsive** - Adapts to desktop, tablet, and mobile devices
- **Offline capable** - Works without internet connection
- **Cross-browser compatible** - Runs in all modern browsers
- **Touch optimized** - Perfect for tablets and touch devices

## 📚 Educational Content

The game includes **80+ carefully selected Russian words** organized by themes:

- **👨‍👩‍👧‍👦 Family**: МАМА, ПАПА, БРАТ, СЕСТРА
- **👤 Body Parts**: РУКА, НОГА, УХО, НОС, РОТ, ЗУБ, ГЛАЗ, ЩЕКА
- **🐾 Animals**: КОТ, ПЁС, СОВА, ЛИСА, ВОЛК, ЗАЯЦ, ТИГР, ЛЕВ, МУХА, ЖУК, РЫБА, ЁЖ, КРОТ
- **🧸 Toys**: МЯЧ, КУБ, КУКЛА, КАРТЫ, ЛЕГО, ЮЛА
- **🏠 Home Objects**: ДОМ, СТОЛ, СТУЛ, ОКНО, ДВЕРЬ, КРОВАТЬ, ЛАМПА, КНИГА, ТЕЛЕВИЗОР
- **🌿 Nature**: ЛЕС, САД, РЕКА, МОРЕ, ГОРА, НЕБО, СОЛНЦЕ, ЗВЕЗДА, ЛУНА, СНЕГ, ДОЖДЬ, ЦВЕТЫ, ТРАВА
- **🍎 Food**: ХЛЕБ, СЫР, СУП, КАША, МОЛОКО, СОК, ЧАЙ, МЯСО, РИС, ЯЙЦО, ТОРТ, ЯБЛОКО, ГРУША, СЛИВА, МОРКОВЬ
- **🚗 Transportation**: АВТО, ТАКСИ, ТРАМВАЙ, ПОЕЗД, САНИ, ЛОДКА
- **👕 Clothing**: ШУБА, ШАПКА, НОСКИ, ПАЛЬТО, САПОГИ, ПЛАТЬЕ, ЮБКА, ФУТБОЛКА
- **📝 Common Words**: МИР, СОН, СВЕТ, ШКОЛА, ПАРК, ДРУГ, ИГРА, ПЕСНЯ, СЛОВО, КАРТА

## 🚀 Getting Started

### Quick Start:
1. Download all project files
2. Open `index.html` in any modern browser
3. Start playing immediately!

### Local Server (Optional):
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

### Online:
Simply open `index.html` in any modern web browser.

## 📁 Project Structure

```
kids-games/
├── index.html      # Main game page
├── styles.css      # Game styling and responsive design
├── game.js         # Core game logic and features
└── README.md       # This documentation
```

## 🎨 Customization

The game is easily customizable in `game.js`:

- **Word Database** - Modify the `gameWords` array to add/remove words
- **Snake Speed** - Adjust `snake.speed` for faster/slower movement
- **Hint Timing** - Change `hintDelay` for hint appearance timing
- **Difficulty** - Modify distractor letter count and word complexity
- **Colors** - Customize vowel/consonant colors in `getLetterColors()`

## 🔊 Audio System

- **Web Audio API** - Generates sound effects for correct/incorrect actions
- **Speech Synthesis API** - Pronounces letters and words in Russian
- **Auto-activation** - Audio starts after first user interaction (browser requirement)

## 📱 Device Compatibility

**Tested and optimized for:**
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
- ✅ Tablets (iPad, Android tablets)
- ✅ Touch devices of all sizes
- ✅ Both portrait and landscape orientations

## 🎓 Educational Benefits

- **📖 Alphabet Recognition** - Learn Russian letters through visual and audio cues
- **🎯 Letter Sequencing** - Understand correct letter order in words
- **👆 Fine Motor Skills** - Develop precise touch/click coordination
- **🎨 Visual Learning** - Color coding helps distinguish vowels from consonants
- **🔊 Phonetic Learning** - Audio pronunciation reinforces letter sounds
- **📚 Vocabulary Building** - Themed word groups expand vocabulary
- **🧠 Problem Solving** - Navigate around obstacles to reach target letters

## 🛠️ Technical Requirements

- **Browser**: Any modern browser with HTML5 Canvas support
- **JavaScript**: ES6+ support (all browsers from 2017+)
- **Audio**: Web Audio API and Speech Synthesis API support
- **Storage**: No external dependencies, fully self-contained
- **Internet**: None required - works completely offline

## 🎮 Advanced Features

- **🧠 A* Pathfinding** - Snake intelligently navigates around letters
- **🎊 Particle Systems** - Confetti celebrations and visual effects
- **📱 Responsive Design** - Adapts to any screen size and orientation
- **🎯 Smart Hints** - Context-aware assistance system
- **🔄 Word Randomization** - Different order each time you play
- **⚡ Performance Optimized** - Smooth 60fps gameplay on all devices

## 🤝 Contributing

Contributions are welcome! Ideas for improvements:
- Adding new word themes or languages
- Enhancing animations and visual effects
- Implementing new game mechanics
- Improving accessibility features
- Adding sound customization options

## 📄 License

This project is open source and available for educational use.

---

*Created with ❤️ for young learners*
