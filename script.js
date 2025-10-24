// ===============================
// ⚔️ ClashTermo - Jogo estilo Termo
// ===============================

// Configurações principais
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const WORDS = [
  "MAGOS", "MINIO", "REISO", "GOLEM", "BOMBA", "FURIA", "TESLA", "LOGAR", "BRUXA", "MINEI"
]; // Pode adicionar mais cartas aqui!

let secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
let currentAttempt = [];
let attempts = [];
let gameOver = false;

// Seletores
const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");

// ===============================
// 🎨 Funções de interface
// ===============================

// Cria o tabuleiro (5x6)
function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < WORD_LENGTH * MAX_ATTEMPTS; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.appendChild(tile);
  }
}

// Cria o teclado virtual
function createKeyboard() {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    for (let letter of row) {
      const key = document.createElement("button");
      key.textContent = letter;
      key.classList.add("key");
      key.addEventListener("click", () => handleKey(letter));
      rowDiv.appendChild(key);
    }
    keyboard.appendChild(rowDiv);
  });

  // Botões extras
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
// 🎯 Funções principais do jogo
// ===============================

// Ao pressionar uma tecla
function handleKey(letter) {
  if (gameOver || currentAttempt.length >= WORD_LENGTH) return;
  currentAttempt.push(letter);
  updateBoard();
}

// Ao deletar
function handleDelete() {
  if (gameOver || currentAttempt.length === 0) return;
  currentAttempt.pop();
  updateBoard();
}

// Ao confirmar tentativa
function handleEnter() {
  if (gameOver || currentAttempt.length < WORD_LENGTH) return;

  const attemptWord = currentAttempt.join("");
  if (!WORDS.includes(attemptWord)) {
    showMessage("❌ Palavra inválida!");
    return;
  }

  attempts.push([...currentAttempt]);// ===============================
// ⚔️ ClashTermo - Jogo estilo Termo
// ===============================

// Configurações principais
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const WORDS = [
  "MAGOS", "MINIO", "REISO", "GOLEM", "BOMBA", "FURIA", "TESLA", "LOGAR", "BRUXA", "MINEI"
]; // Pode adicionar mais cartas aqui!

let secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
let currentAttempt = [];
let attempts = [];
let gameOver = false;

// Seletores
const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");

// ===============================
// 🎨 Funções de interface
// ===============================

// Cria o tabuleiro (5x6)
function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < WORD_LENGTH * MAX_ATTEMPTS; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.appendChild(tile);
  }
}

// Cria o teclado virtual
function createKeyboard() {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    for (let letter of row) {
      const key = document.createElement("button");
      key.textContent = letter;
      key.classList.add("key");
      key.addEventListener("click", () => handleKey(letter));
      rowDiv.appendChild(key);
    }
    keyboard.appendChild(rowDiv);
  });

  // Botões extras
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
// 🎯 Funções principais do jogo
// ===============================

// Ao pressionar uma tecla
function handleKey(letter) {
  if (gameOver || currentAttempt.length >= WORD_LENGTH) return;
  currentAttempt.push(letter);
  updateBoard();
}

// Ao deletar
function handleDelete() {
  if (gameOver || currentAttempt.length === 0) return;
  currentAttempt.pop();
  updateBoard();
}

// Ao confirmar tentativa
function handleEnter() {
  if (gameOver || currentAttempt.length < WORD_LENGTH) return;

  const attemptWord = currentAttempt.join("");
  if (!WORDS.includes(attemptWord)) {
    showMessage("❌ Palavra inválida!");
    return;
  }

  attempts.push([...currentAttempt]);
  checkAttempt(currentAttempt);
  currentAttempt = [];

  if (attemptWord === secretWord) {
    showMessage("🎉 Você acertou!");
    gameOver = true;
  } else if (attempts.length === MAX_ATTEMPTS) {
    showMessage(`💀 Fim de jogo! Era: ${secretWord}`);
    gameOver = true;
  }

  updateBoard();
}

// Verifica as letras e pinta as cores
function checkAttempt(attempt) {
  const tiles = Array.from(board.children);
  const start = (attempts.length - 1) * WORD_LENGTH;

  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = tiles[start + i];
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
}

// Atualiza o tabuleiro na tela
function updateBoard() {
  const tiles = Array.from(board.children);
  const start = attempts.length * WORD_LENGTH;
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = tiles[start + i];
    tile.textContent = currentAttempt[i] || "";
  }
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

  checkAttempt(currentAttempt);
  currentAttempt = [];

  if (attemptWord === secretWord) {
    showMessage("🎉 Você acertou!");
    gameOver = true;
  } else if (attempts.length === MAX_ATTEMPTS) {
    showMessage(`💀 Fim de jogo! Era: ${secretWord}`);
    gameOver = true;
  }

  updateBoard();
}

// Verifica as letras e pinta as cores
function checkAttempt(attempt) {
  const tiles = Array.from(board.children);
  const start = (attempts.length - 1) * WORD_LENGTH;

  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = tiles[start + i];
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
}

// Atualiza o tabuleiro na tela
function updateBoard() {
  const tiles = Array.from(board.children);
  const start = attempts.length * WORD_LENGTH;
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = tiles[start + i];
    tile.textContent = currentAttempt[i] || "";
  }
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
