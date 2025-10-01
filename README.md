# Vocabulary Fun! — Kids' Vocabulary Learning Web App


A **child-friendly, colorful web app** for learning vocabulary with flashcards and quizzes, featuring **IPA transcription** and **audio pronunciation**. Designed for children and easy local use.

---

## Features

- **Vocabulary Input**: Paste vocabulary as `word:wordtype:meaning[:example sentence]` (one per line).  
  Example:  
  ```
  cat:noun:a small animal:The cat is sleeping.
  run:verb:to move quickly
  blue:adjective:the color of the sky
  ```
- **Flashcards**:  
  - Bright, animated flashcards.  
  - Front: word, IPA, type, and pronunciation button.  
  - Back: meaning and optional example.  
  - Flip with click or Enter.  
  - Shuffle, next/prev, and "Got it!" to mark as reviewed.
- **Fill-in-the-Blank Quiz**:  
  - Try to fill the missing word in generated or example sentences.  
  - Instant feedback and fun confetti for correct answers.  
  - Progress bar, stars, and badges.
- **Progress Tracking**:  
  - See how many words you've reviewed and your quiz scores.  
  - Earn badges for milestones.  
  - Reset progress or all data anytime.
- **UX/UI**:  
  - Large fonts, big buttons, minimal clutter.  
  - Responsive (desktop/tablet), with dark/light mode toggle.  
  - Colorful, smooth animations and icons.
- **Audio Pronunciation**:  
  - Uses [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for word pronunciation.

---

## Getting Started

### 1. Download or Clone

```
git clone https://github.com/cattillallnight/vocab-fun-app.git
cd vocab-fun-app
```
Or simply download the three files: `index.html`, `style.css`, `script.js`.

### 2. Run Locally

Just open `index.html` in your favorite browser.  
No server required!

### 3. Paste Vocabulary

- Go to **Input**.
- Paste vocabulary lines in the format:  
  `word:wordtype:meaning[:example sentence]`
- Example:
  ```
  apple:noun:a fruit:She eats an apple.
  jump:verb:to move upwards:Can you jump high?
  happy:adjective:feeling good
  ```
- Click **Save Vocabulary**.

### 4. Flashcards

- Go to **Flashcards**.
- Click card to flip, or press Enter.
- Click the 🔊 button to hear pronunciation.
- Use arrows to navigate, and **Shuffle** for random order.
- Click **Got it!** to mark a word as reviewed.

### 5. Quiz

- Go to **Quiz**.
- Fill in the blank with the correct word.
- Get instant feedback and fun confetti for correct answers!
- Earn badges for getting many right or perfect scores.

### 6. Progress

- Go to **Progress** to see words reviewed, quiz stars, and badges.
- Reset progress or all data if you want to start over.

---

## Technologies Used

- **HTML5, CSS3** (responsive, colorful, animated)
- **JavaScript (ES6)**, modular and commented
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for pronunciation
- [Google Fonts: Fredoka, Quicksand](https://fonts.google.com/)
- No frameworks, no build step, no dependencies!

---

## Contributing

Pull requests and suggestions welcome!
- Fork, improve, and submit PRs.
- Please keep code comments and structure kid-friendly.
- Add more IPA mappings or icons for more words if you like.

## License

MIT License.  
© 2025 [cattillallnight](https://github.com/cattillallnight)

---

## Screenshots
<img width="1524" height="1386" alt="image" src="https://github.com/user-attachments/assets/5c2af857-6e28-447c-9876-2d58c0289d76" />

