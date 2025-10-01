// --- IPA Lexicon (Updated with Cambridge standards) ---
const IPA_LEXICON = {
  "cat": "kæt",
  "dog": "dɒɡ",
  "run": "rʌn",
  "apple": "ˈæpəl",
  "fish": "fɪʃ",
  "blue": "bluː",
  "happy": "ˈhæpi",
  "bird": "bɜːd",
  "jump": "dʒʌmp",
  "play": "pleɪ",
  "book": "bʊk",
  "tree": "triː",
  "sun": "sʌn",
  "friend": "frend",
  "school": "skuːl",
  "house": "haʊs",
  "water": "ˈwɔːtər",
  "flower": "ˈflaʊər",
  "music": "ˈmjuːzɪk",
  "computer": "kəmˈpjuːtər",
  "beautiful": "ˈbjuːtɪfl",
  "chocolate": "ˈtʃɒklət",
  "elephant": "ˈelɪfənt",
  "guitar": "ɡɪˈtɑː",
  "holiday": "ˈhɒlədeɪ",
  "ice cream": "ˌaɪs ˈkriːm",
  "jungle": "ˈdʒʌŋɡl",
  "kitchen": "ˈkɪtʃɪn",
  "lemon": "ˈlemən",
  "mountain": "ˈmaʊntɪn",
  "notebook": "ˈnəʊtbʊk",
  "orange": "ˈɒrɪndʒ",
  "pencil": "ˈpensl",
  "queen": "kwiːn",
  "rabbit": "ˈræbɪt",
  "strawberry": "ˈstrɔːbəri",
  "teacher": "ˈtiːtʃər",
  "umbrella": "ʌmˈbrelə",
  "vegetable": "ˈvedʒtəbl",
  "window": "ˈwɪndəʊ",
  "yellow": "ˈjeləʊ",
  "zebra": "ˈzebrə"
};
const WORD_ICONS = {
  "cat": "🐱", "dog": "🐶", "fish": "🐟", "apple": "🍎",
  "tree": "🌳", "book": "📚", "sun": "☀️", "bird": "🐦",
  "friend": "👫", "school": "🏫", "happy": "😊", "blue": "🔵",
  "jump": "🤸", "run": "🏃", "play": "🎲"
};

// --- Storage Keys ---
const STORAGE_KEYS = {
  vocab: "vocabData",
  reviewed: "reviewedWords",
  quiz: "quizProgress",
  badges: "earnedBadges"
};

// --- Utility Functions ---
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v !== null ? v : fallback;
  } catch { return fallback; }
}

// --- IPA Generation ---
function getIPA(word) {
  // Try lexicon first
  if (IPA_LEXICON[word.toLowerCase()]) return IPA_LEXICON[word.toLowerCase()];
  // Naive fallback: replace some patterns
  let w = word.toLowerCase();
  w = w.replace(/tion$/, "ʃən").replace(/ph/, "f").replace(/ough/, "ɔː");
  w = w.replace(/^c([eiy])/, "s$1").replace(/^c/, "k");
  w = w.replace(/a$/, "ə");
  // ... (could be improved for more words)
  return "/" + w.split("").join(".") + "/";
}

// --- Vocabulary Parsing ---
function parseVocabInput(raw) {
  // Format: word:wordtype:meaning[:example]
  let lines = raw.split("\n");
  const vocab = [];
  for (let l of lines) {
    l = l.trim();
    if (!l || l.startsWith('#')) continue;
    // Allow both : and ： (fullwidth)
    let parts = l.replace(/：/g, ":").split(":");
    if (parts.length < 3) continue;
    let [word, type, meaning, ...rest] = parts;
    word = word.trim();
    type = type.trim();
    meaning = meaning.trim();
    let example = rest.length ? rest.join(":").trim() : "";
    if (!word || !meaning) continue;
    vocab.push({word, type, meaning, example});
  }
  return vocab;
}

// --- UI Navigation ---
function showView(view) {
  $$('.view').forEach(s => s.classList.add('hidden'));
  $(`#${view}-view`).classList.remove('hidden');
  $$('.nav-btn').forEach(btn => btn.classList.remove('active'));
  $(`.nav-btn[data-view="${view}"]`).classList.add('active');
}

// --- Vocabulary Storage ---
function saveVocab(vocab) { save(STORAGE_KEYS.vocab, vocab); }
function loadVocab() { return load(STORAGE_KEYS.vocab, []); }

// --- Flashcard Logic ---
let flashcardOrder = [];
let flashcardIdx = 0;

function renderFlashcard() {
  const vocab = loadVocab();
  if (!vocab.length) {
    $('#flashcard-container').innerHTML = "<div style='text-align:center;padding:2em;'>No vocabulary found!<br>Go to <b>Input</b> to add words.</div>";
    return;
  }
  const idx = flashcardOrder[flashcardIdx];
  const v = vocab[idx];
  // Word icon if available
  const icon = WORD_ICONS[v.word.toLowerCase()] || "";
  // IPA
  const ipa = getIPA(v.word);
  // Progress
  let reviewed = load(STORAGE_KEYS.reviewed, []);
  const isReviewed = reviewed.includes(v.word);

  $('#flashcard-container').innerHTML = `
    <div class="flashcard${isReviewed ? " reviewed" : ""}" tabindex="0" id="flashcard">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="word">${icon} ${v.word}</div>
          <div class="ipa">/${ipa}/</div>
          <div class="word-type">${v.type || ""}</div>
          <button class="speaker-btn" id="speak-word" title="Hear pronunciation">🔊</button>
          <div style="font-size:0.9em;color:#b2ab7c;margin-top:1em;">(Click or press Enter to flip)</div>
        </div>
        <div class="flashcard-back">
          <div class="meaning">${v.meaning}</div>
          ${v.example ? `<div class="example">${v.example}</div>` : ""}
          <div style="margin-top:1.3em;">
            <button class="main-btn" id="mark-reviewed">Got it!</button>
          </div>
        </div>
      </div>
    </div>
  `;
  // Events
  const card = $('#flashcard');
  card.onclick = () => card.classList.toggle('flipped');
  card.onkeypress = (e) => { if (e.key === "Enter" || e.key === " ") card.classList.toggle('flipped'); };
  $('#speak-word').onclick = (e) => { e.stopPropagation(); speakWord(v.word); };
  $('#mark-reviewed').onclick = (e) => {
    e.stopPropagation();
    let reviewed = load(STORAGE_KEYS.reviewed, []);
    if (!reviewed.includes(v.word)) reviewed.push(v.word);
    save(STORAGE_KEYS.reviewed, reviewed);
    showBadge("flashcard-badges", "⭐ Word reviewed!");
    nextFlashcard();
    renderProgress();
  };
}

function nextFlashcard() {
  if (flashcardOrder.length === 0) return;
  flashcardIdx = (flashcardIdx + 1) % flashcardOrder.length;
  renderFlashcard();
}
function prevFlashcard() {
  if (flashcardOrder.length === 0) return;
  flashcardIdx = (flashcardIdx - 1 + flashcardOrder.length) % flashcardOrder.length;
  renderFlashcard();
}
function shuffleFlashcards() {
  const vocab = loadVocab();
  flashcardOrder = shuffle(Array.from(vocab.keys ? vocab.keys() : vocab.map((_,i)=>i)));
  flashcardIdx = 0;
  renderFlashcard();
}

function initFlashcards() {
  const vocab = loadVocab();
  flashcardOrder = Array.from(vocab.keys ? vocab.keys() : vocab.map((_,i)=>i));
  flashcardIdx = 0;
  renderFlashcard();
}

$('#shuffle-flashcards').onclick = shuffleFlashcards;
$('#next-flashcard').onclick = nextFlashcard;
$('#prev-flashcard').onclick = prevFlashcard;

// --- Vocabulary Input ---
$('#save-vocab').onclick = function() {
  const raw = $('#vocab-input').value;
  const vocab = parseVocabInput(raw);
  if (!vocab.length) {
    $('#input-feedback').textContent = "No valid lines found! Please follow the format.";
    return;
  }
  saveVocab(vocab);
  $('#input-feedback').textContent = `Saved ${vocab.length} words!`;
  initFlashcards();
  setTimeout(() => $('#input-feedback').textContent = "", 2000);
};

// --- Navigation Events ---
$$('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    showView(btn.dataset.view);
    if (btn.dataset.view === "flashcards") initFlashcards();
    if (btn.dataset.view === "quiz") startQuiz();
    if (btn.dataset.view === "progress") renderProgress();
  };
});
showView("input"); // Default

// --- Theme Toggle ---
const themeToggle = $('#theme-toggle');
themeToggle.onclick = function() {
  if (document.body.getAttribute('data-theme') === 'dark') {
    document.body.removeAttribute('data-theme');
    $('#theme-icon').textContent = "🌞";
    localStorage.setItem("theme", "light");
  } else {
    document.body.setAttribute('data-theme', 'dark');
    $('#theme-icon').textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
};
(function initTheme() {
  const userTheme = localStorage.getItem("theme");
  if (userTheme === "dark") {
    document.body.setAttribute('data-theme', 'dark');
    $('#theme-icon').textContent = "🌙";
  }
})();

// --- Web Speech API Pronunciation ---
function speakWord(word) {
  if (!window.speechSynthesis) return alert("Speech not supported!");
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = "en-US";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

// --- Quiz Logic ---
let quizState = {
  order: [],
  idx: 0,
  correct: 0,
  total: 0,
  answered: []
};

function pickQuizSentence(vocabEntry) {
  // Use example sentence if available, else make a simple one
  if (vocabEntry.example && vocabEntry.example.includes(vocabEntry.word)) {
    // Replace word in example with blank
    const regex = new RegExp(`\\b${vocabEntry.word}\\b`, "gi");
    return vocabEntry.example.replace(regex, '<span class="quiz-blank"><input class="quiz-input" maxlength="18" autocomplete="off"></span>');
  }
  // Otherwise, make a generic sentence
  let type = vocabEntry.type.toLowerCase();
  switch (type) {
    case "noun":
      return `A <span class="quiz-blank"><input class="quiz-input" maxlength="18" autocomplete="off"></span> is ${vocabEntry.meaning}.`;
    case "verb":
      return `To <span class="quiz-blank"><input class="quiz-input" maxlength="18" autocomplete="off"></span> means to ${vocabEntry.meaning}.`;
    case "adjective":
      return `Something that is <span class="quiz-blank"><input class="quiz-input" maxlength="18" autocomplete="off"></span> is ${vocabEntry.meaning}.`;
    default:
      return `${vocabEntry.meaning} = <span class="quiz-blank"><input class="quiz-input" maxlength="18" autocomplete="off"></span>`;
  }
}

function startQuiz() {
  const vocab = loadVocab();
  if (!vocab.length) {
    $('#quiz-container').innerHTML = "<div>No vocabulary found! Please add words first.</div>";
    return;
  }
  
  // Filter out already reviewed words
  const reviewed = load(STORAGE_KEYS.reviewed, []);
  const availableVocab = vocab.filter(entry => !reviewed.includes(entry.word));
  
  if (!availableVocab.length) {
    $('#quiz-container').innerHTML = `<div style="font-size:1.3em;color:var(--accent2);margin:1em;text-align:center;">
        🎉 Bạn đã ôn tập tất cả các từ! <br>Giỏi lắm!
      </div>`;
    $('#quiz-feedback').textContent = "";
    return;
  }
  
  quizState = {
    order: shuffle(Array.from(availableVocab.keys ? availableVocab.keys() : availableVocab.map((_,i)=>i))),
    idx: 0,
    correct: 0,
    total: availableVocab.length,
    answered: []
  };
  renderQuizQuestion();
  updateQuizProgress();
}

function renderQuizQuestion() {
  const vocab = loadVocab();
  if (quizState.idx >= quizState.order.length) {
    // Quiz finished
    $('#quiz-container').innerHTML = `<div style="font-size:1.3em;color:var(--accent2);margin:1em;">
        🎉 Quiz complete! <br>Your score: <b>${quizState.correct} / ${quizState.total}</b>
      </div>`;
    $('#quiz-feedback').textContent = "";
    earnBadge("quiz", quizState.correct);
    confetti();
    return;
  }
  const idx = quizState.order[quizState.idx];
  const v = vocab[idx];
  const sentence = pickQuizSentence(v);

  $('#quiz-container').innerHTML = `
    <div class="quiz-sentence">${sentence}</div>
    <button class="quiz-btn" id="quiz-submit">Check</button>
    <button class="speaker-btn" id="quiz-speak" title="Hear word">🔊</button>
  `;
  $('#quiz-feedback').textContent = "";
  $('#quiz-speak').onclick = () => speakWord(v.word);

  // Focus on input
  const input = $('#quiz-container .quiz-input');
  input.focus();

  $('#quiz-submit').onclick = () => {
    const val = input.value.trim();
    if (!val) return;
    if (val.toLowerCase() === v.word.toLowerCase()) {
      $('#quiz-feedback').textContent = "✅ Correct!";
      quizState.correct += 1;
      showBadge("quiz-badges", "🎉 Correct!");
      confetti();
    } else {
      $('#quiz-feedback').textContent = `❌ Oops! It was "${v.word}".`;
      showBadge("quiz-badges", "👀 Try next!");
    }
    quizState.idx += 1;
    setTimeout(() => {
      renderQuizQuestion();
      updateQuizProgress();
    }, 1000);
  };
  input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") $('#quiz-submit').click();
  });
}

function updateQuizProgress() {
  const percent = quizState.total ? Math.round(100 * quizState.idx / quizState.total) : 0;
  $('#quiz-progress').style.width = `${percent}%`;
}

// --- Progress Tracking ---
function renderProgress() {
  const vocab = loadVocab();
  const reviewed = load(STORAGE_KEYS.reviewed, []);
  const quiz = load(STORAGE_KEYS.quiz, {correct: 0, total: 0});
  $('#progress-summary').innerHTML =
    `<div>Words reviewed: <b>${reviewed.length} / ${vocab.length}</b></div>` +
    `<div>Latest quiz: <b>${quiz.correct} / ${quiz.total}</b></div>`;
  // Stars
  let stars = "";
  let count = Math.round((reviewed.length / (vocab.length||1)) * 5);
  for (let i=0; i<5; ++i) stars += i < count ? "⭐" : "☆";
  $('#progress-stars').innerHTML = stars;
  // Badges
  showBadge("progress-badges", `🏅 ${reviewed.length} reviewed`, true);
}

function earnBadge(type, value) {
  // type: "quiz", value: correct answers
  let badges = load(STORAGE_KEYS.badges, {});
  if (!badges[type]) badges[type] = [];
  if (type === "quiz") {
    if (value >= 7 && !badges[type].includes("Quiz7")) {
      badges[type].push("Quiz7");
      showBadge("quiz-badges", "🏅 Quiz Star: 7+!");
    }
    if (value === quizState.total && quizState.total > 2 && !badges[type].includes("Perfect")) {
      badges[type].push("Perfect");
      showBadge("quiz-badges", "🌟 Perfect Score!");
    }
  }
  save(STORAGE_KEYS.badges, badges);
}

function showBadge(containerId, text, persist) {
  const container = $(`#${containerId}`);
  if (!container) return;
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = text;
  container.appendChild(badge);
  if (!persist) setTimeout(() => badge.remove(), 1800);
}

// --- Reset Actions ---
$('#reset-progress').onclick = function() {
  localStorage.removeItem(STORAGE_KEYS.reviewed);
  $('#flashcard-badges').innerHTML = "";
  initFlashcards();
  renderProgress();
  showBadge("flashcard-badges", "🔄 Progress reset!", true);
};
$('#restart-quiz').onclick = startQuiz;
$('#reset-all').onclick = function() {
  if (!confirm("Clear ALL vocabulary and progress?")) return;
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  $('#quiz-badges').innerHTML = $('#flashcard-badges').innerHTML = $('#progress-badges').innerHTML = "";
  $('#vocab-input').value = "";
  showView("input");
  $('#input-feedback').textContent = "All data cleared!";
  setTimeout(() => $('#input-feedback').textContent = "", 2000);
  initFlashcards();
};

// --- Confetti Animation ---
function confetti() {
  let c = document.createElement('div');
  c.className = "confetti";
  for (let i=0; i<18; ++i) {
    let p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = (Math.random() * 96) + "vw";
    p.style.top = (Math.random() * 15) + "vh";
    p.style.background = `hsl(${Math.random()*360},100%,60%)`;
    p.style.animationDelay = (Math.random()*0.6)+"s";
    c.appendChild(p);
  }
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 1800);
}

// --- Load on Start ---
(function() {
  // Auto-load vocab to flashcards
  if (loadVocab().length) initFlashcards();
})();