const words = [
  "ΣΩΚΡΑΤΗΣ",
  "ΝΑΞΟΣ",
  "ΚΟΚΚΙΝΟ",
  "ΔΕΥΤΕΡΑ",
  "ΠΛΑΤΩΝ",
  "ΚΡΗΤΗ",
  "ΜΠΛΕ",
  "ΤΡΙΤΗ",
  "ΖΗΝΩΝ",
  "ΡΟΔΟΣ",
  "ΠΡΑΣΙΝΟ",
  "ΤΕΤΑΡΤΗ",
  "ΕΠΙΚΟΥΡΟΣ",
  "ΙΚΑΡΙΑ",
  "ΚΙΤΡΙΝΟ",
  "ΠΕΜΠΤΗ"
];

const gameBoard = document.querySelector("#game-board");
const shuffleButton = document.querySelector("#shuffle-button");
const deselectButton = document.querySelector("#deselect-button");
const submitButton = document.querySelector("#submit-button");

let selectedWords = [];
let displayedWords = [...words];

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

  submitButton.disabled = selectedWords.length !== 4;
}

function selectWord(word) {
  if (selectedWords.includes(word)) {
    selectedWords = selectedWords.filter(
      (selectedWord) => selectedWord !== word
    );
  } else if (selectedWords.length < 4) {
    selectedWords.push(word);
  }

  renderBoard();
}

function shuffleWords() {
  displayedWords.sort(() => Math.random() - 0.5);
  renderBoard();
}

function deselectAll() {
  selectedWords = [];
  renderBoard();
}

shuffleButton.addEventListener("click", shuffleWords);
deselectButton.addEventListener("click", deselectAll);

submitButton.addEventListener("click", () => {
  alert(`Επέλεξες: ${selectedWords.join(", ")}`);
});

renderBoard();