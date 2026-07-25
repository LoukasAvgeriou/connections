const groups = [
  {
    category: "ΠΤΗΝΑ",
    words: ["ΚΑΝΑΡΙΝΙ", "ΑΕΤΟΣ", "ΣΠΟΥΡΓΙΤΙ", "ΧΕΛΙΔΟΝΙ"],
    color: "yellow"
  },
  {
    category: "ΔΗΜΟΙ ΑΤΤΙΚΗΣ",
    words: ["ΜΑΡΟΥΣΙ", "ΠΕΡΙΣΤΕΡΙ", "ΗΛΙΟΥΠΟΛΗ", "ΚΟΡΥΔΑΛΛΟΣ"],
    color: "green"
  },
  {
    category: "ΑΚΛΙΤΕΣ ΛΕΞΕΙΣ",
    words: ["ΑΙΓΑΛΕΩ", "ΣΤΥΛΟ", "ΑΒΟΚΑΝΤΟ", "ΑΛΦΑ"],
    color: "blue"
  },
  {
    category: "ΟΜΟΗΧΕΣ ΜΕ ΑΛΛΕΣ ΛΕΞΕΙΣ",
    words: ["ΣΥΚΟ", "ΛΥΡΑ", "ΚΛΗΜΑ", "ΠΙΑΝΟ"],
    color: "purple"
  }
];

const gameBoard = document.querySelector("#game-board");
const solvedGroupsContainer = document.querySelector("#solved-groups");
const shuffleButton = document.querySelector("#shuffle-button");
const submitButton = document.querySelector("#submit-button");
const message = document.querySelector("#message");
const mistakeDots = document.querySelector("#mistake-dots");
const restartButton = document.querySelector("#restart-button");
const revealButton = document.querySelector("#reveal-button");

let displayedWords = groups.flatMap((group) => group.words);
let selectedWords = [];
let solvedGroups = [];
let mistakes = 0;
let gameFinished = false;
let gameLost = false;
let answersRevealed = false;

const previousAttempts = new Set();

function renderMistakes() {
  const remainingMistakes = 4 - mistakes;

  mistakeDots.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const dot = document.createElement("span");

    dot.classList.add("mistake-dot");

    if (i < remainingMistakes) {
      dot.classList.add("available");
    }

    mistakeDots.appendChild(dot);
  }

  mistakeDots.setAttribute(
    "aria-label",
    `${remainingMistakes} διαθέσιμες προσπάθειες`
  );
}

function renderBoard() {
  gameBoard.innerHTML = "";

  displayedWords.forEach((word) => {
    const card = document.createElement("button");

    card.classList.add("word-card");
    card.textContent = word;

    if (selectedWords.includes(word)) {
      card.classList.add("selected");
    }

    card.addEventListener("click", () => selectWord(word));

    gameBoard.appendChild(card);
  });

  submitButton.disabled =
    selectedWords.length !== 4 || gameFinished;

  shuffleButton.disabled = gameFinished;

  renderMistakes();

  restartButton.hidden = !gameFinished;

  revealButton.hidden = !gameLost || answersRevealed;

  restartButton.textContent = gameLost ? "Δοκίμασε ξανά" : "Παίξε ξανά";
}

function renderSolvedGroups() {
  solvedGroupsContainer.innerHTML = "";

  solvedGroups.forEach((group) => {
    const solvedGroup = document.createElement("div");

    solvedGroup.classList.add("solved-group", group.color);

    solvedGroup.innerHTML = `
      <strong>${group.category}</strong>
      <span>${group.words.join(", ")}</span>
    `;

    solvedGroupsContainer.appendChild(solvedGroup);
  });
}

function selectWord(word) {
  if (gameFinished) {
    return;
  }

  if (selectedWords.includes(word)) {
    selectedWords = selectedWords.filter(
      (selectedWord) => selectedWord !== word
    );
  } else if (selectedWords.length < 4) {
    selectedWords.push(word);
  }

  showMessage("");
  renderBoard();
}

function shuffleWords() {
  for (let i = displayedWords.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [displayedWords[i], displayedWords[randomIndex]] =
      [displayedWords[randomIndex], displayedWords[i]];
  }

  renderBoard();
}

function getSelectionKey() {
  return [...selectedWords].sort().join("|");
}

function isOneAway() {
  return groups.some((group) => {
    if (solvedGroups.includes(group)) {
      return false;
    }

    const matchingWords = selectedWords.filter((word) =>
      group.words.includes(word)
    );

    return matchingWords.length === 3;
  });
}

function revealRemainingGroups() {
  const remainingGroups = groups.filter(
    (group) => !solvedGroups.includes(group)
  );

  solvedGroups.push(...remainingGroups);
  displayedWords = [];

  renderSolvedGroups();
}

function showMessage(text) {
  message.classList.remove("message-animation");
  message.textContent = text;

  if (text === "") {
    return;
  }

  void message.offsetWidth;
  message.classList.add("message-animation");
}

function submitSelection() {
  const selectionKey = getSelectionKey();

  if (previousAttempts.has(selectionKey)) {
    showMessage("Έχεις ήδη δοκιμάσει αυτό τον συνδυασμό.");
    selectedWords = [];
    renderBoard();
    return;
  }

  const correctGroup = groups.find(
    (group) =>
      !solvedGroups.includes(group) &&
      group.words.every((word) => selectedWords.includes(word))
  );

  if (correctGroup) {
    solvedGroups.push(correctGroup);

    displayedWords = displayedWords.filter(
      (word) => !correctGroup.words.includes(word)
    );

    selectedWords = [];
    showMessage("Σωστά!");

    renderSolvedGroups();

    if (solvedGroups.length === groups.length) {
      gameFinished = true;
      showMessage("Συγχαρητήρια! Τα κατάφερες!");
    }
  } else {
    previousAttempts.add(selectionKey);
    mistakes++;

    if (isOneAway()) {
      showMessage("3 στα 4 είναι σωστά");
    } else {
      showMessage("Λάθος");
    }

    selectedWords = [];

    if (mistakes >= 4) {
      gameFinished = true;
      gameLost = true;

      showMessage("Τέλος παιχνιδιού! Τι θέλεις να κάνεις;");
    }
  }

  renderBoard();
}

function restartGame() {
  displayedWords = groups.flatMap((group) => group.words);
  selectedWords = [];
  solvedGroups = [];
  mistakes = 0;
  gameFinished = false;
  gameLost = false;
  answersRevealed = false;

  previousAttempts.clear();

  showMessage("");
  renderSolvedGroups();
  shuffleWords();
}

function showCorrectAnswers() {
  answersRevealed = true;

  revealRemainingGroups();
  showMessage("Οι σωστές ομάδες ήταν:");

  renderBoard();
}

shuffleButton.addEventListener("click", shuffleWords);
submitButton.addEventListener("click", submitSelection);
restartButton.addEventListener("click", restartGame);
revealButton.addEventListener("click", showCorrectAnswers);

shuffleWords();
renderSolvedGroups();