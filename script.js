// ⚔️ ClashTermo Royale - Script Principal (Modo Múltiplas Palavras - Direta Temática)

document.addEventListener("DOMContentLoaded", () => {
  // Lista de Palavras Secretas (O jogo tentará acertar as palavras em ordem)
  const allWords = [
    { word: "PEKKA", hint: "Tanque lendário com armadura pesada" },
    { word: "GOBLIN", hint: "Verde e rápido" },
    { word: "MINION", hint: "Ataque aéreo barato" },
    { word: "GIANT", hint: "Vai direto nas construções" },
    { word: "VINHA", hint: "Prende os inimigos" },
    { word: "BOWLER", hint: "Lança pedras grandes" },
    { word: "PRINCE", hint: "Corre e dá carga com a lança" },
    { word: "WIZARD", hint: "Lança bolas de fogo" },
    { word: "GOLEM", hint: "Gigante de Pedra" },
    { word: "FURIA", hint: "Feitiço que aumenta o dano" }
  ];

  // Definimos as palavras secretas do jogo. Usaremos as 6 primeiras para 6 linhas.
  const secretWords = allWords.slice(0, 6).map(w => ({
    word: w.word.toUpperCase(),
    hint: w.hint
  }));

  const maxAttempts = secretWords.length; // O número de linhas é o número de palavras a serem acertadas
  let currentRow = 0; // Linha (Palavra) atual
  let currentCol = 0; // Coluna (Letra) atual
  let isGameOver = false;

  const board = document.getElementById("board");
  const keyboard = document.getElementById("keyboard");

  // Função para obter o objeto da palavra secreta atual
  const getCurrentSecretObj = () => secretWords[currentRow];

  // ===== CRIAR TABULEIRO (AJUSTADO PARA TAMANHOS VARIÁVEIS) =====
  for (let r = 0; r < maxAttempts; r++) {
    const currentWord = secretWords[r].word;
    const currentWordLength = currentWord.length;

    const row = document.createElement("div");
    row.classList.add("row");
    row.dataset.index = r;
    // Adiciona classe para estilização de largura (necessita de CSS)
    row.classList.add(`word-length-${currentWordLength}`);

    for (let c = 0; c < currentWordLength; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }

    const hintText = document.createElement("div");
    hintText.classList.add("hint");
    row.appendChild(hintText);

    board.appendChild(row);
  }

  // ===== CRIAR TECLADO (Sem alteração na funcionalidade) =====
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

  // ===== CAPTURAR TECLADO FÍSICO (Sem alteração) =====
  document.addEventListener("keydown", (e) => {
    if (isGameOver) return;
    const key = e.key.toUpperCase();
    if (key === "ENTER") handleKeyPress("ENTER");
    else if (key === "BACKSPACE" || key === "DELETE") handleKeyPress("DEL");
    else if (/^[A-Z]$/.test(key)) handleKeyPress(key);
  });

  // ===== LÓGICA DE TECLAS (AJUSTADA) =====
  function handleKeyPress(key) {
    if (isGameOver) return;
    
    // Se a linha atual for a última e já tiver sido jogada, não permite mais entrada
    if (currentRow >= maxAttempts) return;

    const row = board.children[currentRow];
    const tiles = row.querySelectorAll(".tile");
    const currentSecretObj = getCurrentSecretObj();
    const currentWordLength = currentSecretObj.word.length;

    if (key === "DEL") {
      if (currentCol > 0) {
        currentCol--;
        tiles[currentCol].textContent = "";
      }
      return;
    }

    if (key === "ENTER") {
      if (currentCol === currentWordLength) {
        checkAttempt();
      } else {
        showPopup(`Palavra incompleta! (Tamanho ${currentWordLength})`);
      }
      return;
    }

    if (/^[A-Z]$/.test(key) && currentCol < currentWordLength) {
      tiles[currentCol].textContent = key;
      currentCol++;
    }
  }

  // ===== VERIFICA TENTATIVA (PRINCIPAL LÓGICA DE JOGO) =====
  function checkAttempt() {
    const row = board.children[currentRow];
    const tiles = row.querySelectorAll(".tile");
    const currentSecretObj = getCurrentSecretObj();
    const currentSecretWord = currentSecretObj.word;
    const currentWordLength = currentSecretWord.length;

    let guess = "";
    tiles.forEach(tile => (guess += tile.textContent));
    guess = guess.toUpperCase();

    const hintText = row.querySelector(".hint");
    
    // Aplica as cores na linha atual (mesmo se estiver errada)
    for (let i = 0; i < currentWordLength; i++) {
      const tile = tiles[i];
      const letter = guess[i];
      
      // Limpa as classes antes de aplicar as novas (importante para tentar de novo na mesma linha)
      tile.classList.remove("correct", "wrong-place", "wrong");

      if (letter === currentSecretWord[i]) {
        tile.classList.add("correct");
      } else if (currentSecretWord.includes(letter)) {
        tile.classList.add("wrong-place");
      } else {
        tile.classList.add("wrong");
      }
    }
    
    // Lógica de Avanço (Só avança ao acertar)
    if (guess === currentSecretWord) {
      row.classList.add("correct-row"); // Estiliza a linha completa
      
      // Revela a dica permanentemente
      hintText.textContent = currentSecretObj.hint;
      hintText.classList.add("show-hint");

      showPopup("✅ Palavra acertada! Próximo Desafio!");

      // **AVANÇA PARA A PRÓXIMA LINHA/PALAVRA**
      currentRow++;
      currentCol = 0;

      if (currentRow === maxAttempts) {
        showPopup("👑 Parabéns! Você acertou todas as palavras!");
        isGameOver = true;
      }
      
      // Se não for o fim, a próxima entrada será na nova linha
      return;
    }

    // Se errou, mostra mensagem e reinicia o cursor na mesma linha
    showPopup("❌ Tente novamente nesta linha!");
    currentCol = 0;
    
    // Opcional: Limpar as tiles para a próxima tentativa. 
    // No Wordle, as letras ficam, mas se quiser limpar:
    tiles.forEach(tile => (tile.textContent = ""));
  }

  // ===== POPUP (Sem alteração) =====
  function showPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
  }
});
