// ===============================
// ⚔️ ClashTermo - Com Dicas e Feedback Visual
// ===============================

// Configurações principais
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const WORDS = [
  { word: "MAGOS", hint: "Lançam bolas de fogo e gelo 🔥❄️" },
  { word: "FURIA", hint: "Feitiço que acelera tropas 💨" },
  { word: "TESLA", hint: "Defesa elétrica ⚡" },
  { word: "GOLEM", hint: "Tanque de pedra 💎" },
  { word: "BRUXA", hint: "Invoca esqueletos 💀" },
  { word: "MINEI", hint: "Lutador que surge do chão ⛏️" },
  { word: "BOMBA", hint: "Explosivo devastador 💣" },
  { word: "ARQUE", hint: "Dispara flechas à distância 🏹" },
  { word: "PEKKA", hint: "Robô de armadura pesada ⚔️" },
  { word: "REISO", hint: "Comanda os mortos 💀👑" }
];

let secret = WORDS[Math.floor(Math.random() * WORDS.length)];
let secretWord = secret.word;
let currentAttempt = [];
let attempts = [];
let gameOver = false;

// Seletores
const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");

// ===============================
// 🎨 Interface
// ===============================

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < WORD_LENGTH; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }

    // Adiciona a área de dica abaixo de cada linha
    const hint = document.createElement("div");
    hint.classList.add("hint");
    row.appendChild(hint);

    board.appendChild(row);
  }
}

function createKeyboard() {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  rows.forEach(r => {
    const rowDiv = document.createElement("div");
    for (let letter of r) {
      const key = document.createElement("button");
      key.textContent = letter;
      key.classList.add("key");
      key.addEventListener("click", () => handleKey(letter));
      rowDiv.appendChild(key);
    }
    keyboard.appendChild(rowDiv);
  });

  const enterKey = document.createElement("button");
  enterKey.textContent = "ENTER";
  enterKey.classList.add("key");
  enterKey.addEventListener("click", () => handleEnter());
  keyboard.appendChild(enterKey);

  const deleteKey = document.createElement("button");
  deleteKey.textContent = "⌫";
  deleteKey.classList.add("key");
  deleteKey.addEventListener("click", () => handleDelete());
  keyboard.appendChild(deleteKey);
}

// ===============================
// 🎯 Lógica do jogo
// ===============================

function handleKey(letter) {
  if (gameOver || currentAttempt.length >= WORD_LENGTH) return;
  currentAttempt.push(letter);
  updateBoard();
}

function handleDelete() {
  if (gameOver || currentAttempt.length === 0) return;
  currentAttempt.pop();
  updateBoard();
}

function handleEnter() {
  if (gameOver || currentAttempt.length < WORD_LENGTH) return;

  const attemptWord = currentAttempt.join("");

  if (!WORDS.some(obj => obj.word === attemptWord)) {
    showMessage("❌ Palavra inválida!");
    return;
  }

  const rowIndex = attempts.length;
  attempts.push([...currentAttempt]);
  checkAttempt(currentAttempt, rowIndex);
  currentAttempt = [];

  if (attemptWord === secretWord) {
    showMessage("🎉 Você acertou!");
    gameOver = true;
    highlightRow(rowIndex, "correct-row");
  } else if (attempts.length === MAX_ATTEMPTS) {
    showMessage(`💀 Fim de jogo! Era: ${secretWord}`);
    gameOver = true;
  }

  updateBoard();
}

// Verifica cada letra
function checkAttempt(attempt, rowIndex) {
  const row = board.children[rowIndex];
  const tiles = row.querySelectorAll(".tile");
  const hintBox = row.querySelector(".hint");

  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = tiles[i];
    const letter = attempt[i];
    tile.textContent = letter;

    if (secretWord[i] === letter) {
      tile.classList.add("correct");
    } else if (secretWord.includes(letter)) {
      tile.classList.add("wrong-place");
    } else {
      tile.classList.add("wrong");
    }
  }

  // Mostra dica na linha atual
  hintBox.textContent = `💡 Dica: ${secret.hint}`;
  hintBox.classList.add("show-hint");
}

// Atualiza o tabuleiro durante digitação
function updateBoard() {
  const rowIndex = attempts.length;
  const row = board.children[rowIndex];
  if (!row) return;

  const tiles = row.querySelectorAll(".tile");
  for (let i = 0; i < WORD_LENGTH; i++) {
    tiles[i].textContent = currentAttempt[i] || "";
  }
}

// Linha verde ao acertar
function highlightRow(index, className) {
  const row = board.children[index];
  if (!row) return;
  row.classList.add(className);
}

// Mostra mensagem temporária
function showMessage(text) {
  const msg = document.createElement("div");
  msg.classList.add("popup");
  msg.textContent = text;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2000);
}

// ===============================
// 🎹 Teclado físico
// ===============================
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  const key = e.key.toUpperCase();
  if (key === "ENTER") handleEnter();
  else if (key === "BACKSPACE") handleDelete();
  else if (/^[A-Z]$/.test(key)) handleKey(key);
});

// ===============================
// 🚀 Inicialização
// ===============================
createBoard();
createKeyboard();
console.log("🕹️ Palavra secreta:", secretWord);
