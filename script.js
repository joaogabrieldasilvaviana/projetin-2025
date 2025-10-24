// ⚔️ ClashTermo Royale - Script Principal (Modo Múltiplas Palavras)

document.addEventListener("DOMContentLoaded", () => {
  const words = [
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

  // O jogo agora tem múltiplas palavras secretas (uma para cada linha)
  // Vou pegar as primeiras 6 palavras para usar nas 6 tentativas
  const secretWords = words.slice(0, 6).map(w => ({
    word: w.word.toUpperCase(),
    hint: w.hint
  }));

  const maxAttempts = secretWords.length; // O número de linhas agora é o número de palavras
  let currentRow = 0;
  let currentCol = 0;
  // A palavra secreta atual é determinada pela currentRow
  let secret = secretWords[currentRow].word;
  let wordLength = secret.length;
  let isGameOver = false;

  const board = document.getElementById("board");
  const keyboard = document.getElementById("keyboard");

  // ===== CRIAR TABULEIRO (AJUSTADO) =====
  // Agora, a largura de cada linha é o tamanho da palavra daquela linha.
  for (let r = 0; r < maxAttempts; r++) {
    const currentWord = secretWords[r].word;
    const currentWordLength = currentWord.length;

    const row = document.createElement("div");
    row.classList.add("row");
    row.dataset.index = r;
    // Adiciona uma classe para controlar a largura da grade
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

  // AVISO: Você precisará de CSS para fazer as linhas com tamanhos diferentes
  // se ajustarem corretamente (ex: display: grid; grid-template-columns: repeat(N, 1fr);)
  // Por ora, vamos garantir que a primeira linha (PEKKA - 5 letras) funcione
  // e você pode estender o CSS para as outras.

  // O resto da criação do teclado (keyboard) e a captura de teclado físico
  // permanecem iguais, pois manipulam apenas a entrada de texto.

  // ===== LÓGICA DE TECLAS (AJUSTADO) =====
  function handleKeyPress(key) {
    if (isGameOver) return;

    const row = board.children[currentRow];
    const tiles = row.querySelectorAll(".tile");

    // A palavra secreta atual e seu tamanho são determinados pela currentRow
    const currentSecretWord = secretWords[currentRow].word;
    const currentWordLength = currentSecretWord.length;

    if (key === "DEL") {
      if (currentCol > 0) {
        currentCol--;
        tiles[currentCol].textContent = "";
      }
      return;
    }

    if (key === "ENTER") {
      // Verifica se a tentativa é do tamanho da palavra secreta ATUAL
      if (currentCol === currentWordLength) {
        checkAttempt(currentSecretWord); // Passa a palavra secreta para a função
      } else {
        showPopup(`Palavra incompleta! (Tamanho ${currentWordLength})`);
      }
      return;
    }

    // Apenas adiciona a letra se não ultrapassar o tamanho da palavra ATUAL
    if (/^[A-Z]$/.test(key) && currentCol < currentWordLength) {
      tiles[currentCol].textContent = key;
      currentCol++;
    }
  }

  // ===== VERIFICA TENTATIVA (PRINCIPAL MUDANÇA) =====
  function checkAttempt(currentSecretWord) {
    const row = board.children[currentRow];
    const tiles = row.querySelectorAll(".tile");
    let guess = "";

    tiles.forEach(tile => (guess += tile.textContent));
    guess = guess.toUpperCase();

    const hintText = row.querySelector(".hint");
    const currentHint = secretWords[currentRow].hint;
    const currentWordLength = currentSecretWord.length;

    // 1. PALAVRA ACERTADA!
    if (guess === currentSecretWord) {
      // Marca todas as letras como 'correct'
      tiles.forEach(t => t.classList.add("correct"));
      row.classList.add("correct-row");
      
      // Exibe a dica
      hintText.textContent = currentHint;
      hintText.classList.add("show-hint");

      showPopup("✅ Palavra acertada!");

      // Passa para a PRÓXIMA palavra secreta
      currentRow++;
      currentCol = 0;

      // 2. VERIFICA SE O JOGO TERMINOU
      if (currentRow === maxAttempts) {
        showPopup("👑 Parabéns! Você acertou todas as palavras!");
        isGameOver = true;
      } else {
        // Se ainda houver palavras, atualiza a palavra secreta para a próxima linha
        secret = secretWords[currentRow].word;
        wordLength = secret.length; // Atualiza o wordLength (embora não seja mais usado no board)
        // O tabuleiro automaticamente move o cursor para a nova linha.
      }
      
      return;
    }

    // 3. PALAVRA ERRADA
    // Se a palavra estiver errada, a linha ATUAL é marcada, mas não avançamos!
    // Você tem que tentar a mesma palavra de novo (modelo Termo tradicional)
    
    // Compara letras (A lógica de cores permanece)
    for (let i = 0; i < currentWordLength; i++) {
      const tile = tiles[i];
      const letter = guess[i];

      if (letter === currentSecretWord[i]) {
        tile.classList.add("correct");
      } else if (currentSecretWord.includes(letter)) {
        tile.classList.add("wrong-place");
      } else {
        tile.classList.add("wrong");
      }
    }
    
    // Se não for a palavra, exibe uma mensagem
    showPopup("❌ Tente novamente nesta linha!");

    // No modo múltiplo, só avançamos o `currentRow` se a palavra for acertada.
    // Aqui, a linha é colorida, mas você continua tentando na mesma linha
    // até acertar.

    // Apenas para forçar uma nova tentativa *na mesma linha*
    // Resetar a coluna para o início, mas não o texto (para que o usuário veja as cores)
    currentCol = 0;
  }

  // ===== POPUP (Não alterado) =====
  function showPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
  }
  
  // Exibe a primeira dica na inicialização, se desejar (opcional)
  // showPopup(`Dica para a primeira palavra: ${secretWords[0].hint}`);
});
