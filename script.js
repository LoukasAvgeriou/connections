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
    category: "ΛΕΞΕΙΣ ΠΟΥ ΓΡΑΦΟΝΤΑΙ ΔΙΑΦΟΡΕΤΙΚΑ ΚΑΙ ΕΧΟΥΝ ΑΛΛΗ ΣΗΜΑΣΙΑ",
    words: ["ΣΥΚΟ", "ΛΥΡΑ", "ΚΛΗΜΑ", "ΠΙΑΝΟ"],
    color: "purple"
  }
];

const gameBoard = document.querySelector("#game-board");
const solvedGroupsContainer = document.querySelector("#solved-groups");
const shuffleButton = document.querySelector("#shuffle-button");
const submitButton = document.querySelector("#submit-button");
const message = document.querySelector("#message");
const mistakesElement = document.querySelector("#mistakes");

let displayedWords = groups.flatMap((group) => group.words);
let selectedWords = [];
let solvedGroups = [];
let mistakes = 0;
let gameFinished = false;
const previousAttempts = new Set();

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

  mistakesElement.textContent = mistakes;
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

  message.textContent = "";
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

function submitSelection() {
  const selectionKey = getSelectionKey();

  if (previousAttempts.has(selectionKey)) {
    message.textContent = "Έχεις ήδη δοκιμάσει αυτή την ομάδα.";
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
    message.textContent = "Σωστή ομάδα!";

    renderSolvedGroups();

    if (solvedGroups.length === groups.length) {
      gameFinished = true;
      message.textContent = "Συγχαρητήρια! Έλυσες το παιχνίδι!";
    }
  } else {
    previousAttempts.add(selectionKey);
    mistakes++;

    if (isOneAway()) {
      message.textContent = "Απέχεις μία λέξη!";
    } else {
      message.textContent = "Δεν είναι σωστή ομάδα.";
    }

    selectedWords = [];

    if (mistakes >= 4) {
      gameFinished = true;
      message.textContent = "Τέλος παιχνιδιού! Οι σωστές ομάδες ήταν:";
      revealRemainingGroups();
    }
  }

  renderBoard();
}

shuffleButton.addEventListener("click", shuffleWords);
submitButton.addEventListener("click", submitSelection);

shuffleWords();
renderSolvedGroups();