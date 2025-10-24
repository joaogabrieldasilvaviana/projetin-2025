// ⚔️ ClashTermo Royale - Script Principal

document.addEventListener("DOMContentLoaded", () => {
  const words = [
    { word: "PEKKA", hint: "Tanque lendário com armadura pesada" },
    { word: "GOBLIN", hint: "Verde e rápido" },
    { word: "MINION", hint: "Ataque aéreo barato" },
    { word: "GIANT", hint: "Vai direto nas construções" },
    { word: "ZAP", hint: "Feitiço elétrico rápido" },
    { word: "BOWLER", hint: "Lança pedras grandes" },
    { word: "PRINCE", hint: "Corre e dá carga com a lança" },
    { word: "WIZARD", hint: "Lança bolas de fogo" },
    { word: "HOG", hint: "Corre e ataca torres" },
    { word: "FIREBALL", hint: "Feitiço de dano em área" }
  ];

  const secretObj = words[Math.floor(Math.random() * words.length)];
  const secret = secretObj.word.toUpperCase();
  const hint = secretObj.hint;

  const maxAttempts = 6;
  let currentRow = 0;
  let currentCol = 0;
  const wordLength = secret.length;
  let isGameOver = false;

  const board = document.getElementById("board");
  const keyboard = document.getElementById("keyboard");

  // ===== CRIAR TABULEIRO =====
  for (let r = 0; r < maxAttempts; r++) {
    const row = document.createElement("div");
    row.classList.add("row");
    row.dataset.index = r;

    for (let c = 0; c < wordLength; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }

    const hintText = document.createElement("div");
    hintText.classList.add("hint");
    row.appendChild(hintText);

    board.appendChild(row);
  }

  // ===== CRIAR TECLADO =====
  const keys = [
    ..."QWERTYUIOP",
    ..."ASDFGHJKL",
    ..."ZXCVBNM",
    "DEL",
    "ENTER"
  ];

  keys.forEach(k => {
    const key = document.createElement("button");
    key.classList.add("key");
    key.textContent = k;
    key.addEventListener("click", () => handleKeyPress(k));
    keyboard.appendChild(key);
  });

  // ===== CAPTURAR TECLADO FÍSICO =====
  document.addEventListener("keydown", (e) => {
    if (isGameOver) return;
    const key = e.key.toUpperCase();
    if (key === "ENTER") handleKeyPress("ENTER");
    else if (key === "BACKSPACE" || key === "DELETE") handleKeyPress("DEL");
    else if (/^[A-Z]$/.test(key)) handleKeyPress(key);
  });

  // ===== LÓGICA DE TECLAS =====
  function handleKeyPress(key) {
    if (isGameOver) return;

    const row = board.children[currentRow];
    const tiles = row.querySelectorAll(".tile");

    if (key === "DEL") {
      if (currentCol > 0) {
        currentCol--;
        tiles[currentCol].textContent = "";
      }
      return;
    }

    if (key === "ENTER") {
      if (currentCol === wordLength) {
        checkAttempt();
      } else {
        showPopup("Palavra incompleta!");
      }
      return;
    }

    if (/^[A-Z]$/.test(key) && currentCol < wordLength) {
      tiles[currentCol].textContent = key;
      currentCol++;
    }
  }

  // ===== VERIFICA TENTATIVA =====
  function checkAttempt() {
    const row = board.children[currentRow];
    const tiles = row.querySelectorAll(".tile");
    let guess = "";

    tiles.forEach(tile => (guess += tile.textContent));
    guess = guess.toUpperCase();

    const hintText = row.querySelector(".hint");

    if (guess === secret) {
      tiles.forEach(t => t.classList.add("correct"));
      row.classList.add("correct-row");
      showPopup("🎉 Você acertou!");
      hintText.textContent = hint;
      hintText.classList.add("show-hint");
      isGameOver = true;
      return;
    }

    // compara letras
    for (let i = 0; i < wordLength; i++) {
      const tile = tiles[i];
      const letter = guess[i];

      if (letter === secret[i]) {
        tile.classList.add("correct");
      } else if (secret.includes(letter)) {
        tile.classList.add("wrong-place");
      } else {
        tile.classList.add("wrong");
      }
    }

    hintText.textContent = `💡 Dica: ${hint}`;
    hintText.classList.add("show-hint");

    currentRow++;
    currentCol = 0;

    if (currentRow === maxAttempts) {
      showPopup(`😢 A palavra era ${secret}`);
      isGameOver = true;
    }
  }

  // ===== POPUP =====
  function showPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
  }
});
