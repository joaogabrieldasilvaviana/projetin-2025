/**
 * ⚔️ CRUZADINHA MESTRA - CÓDIGO FINAL E FUNCIONAL
 * Gerencia a lógica de montagem, seleção de palavras, input e verificação.
 * DEPENDÊNCIA: Depende da função showMessage() definida em termo.js.
 */

// =================================================================
// Definição da Cruzadinha (Dados do Jogo)
// =================================================================

const CRUZADINHA_DATA = {
    // 8x8 Grid. 1 = letra, 0 = espaço vazio.
    mapa: [
        [1, 1, 1, 1, 1, 1, 0, 0], // 1. LANCAS
        [0, 0, 1, 0, 0, 1, 0, 0], // 6. VALQUIRIA
        [0, 1, 1, 1, 1, 1, 1, 1], // 2. ELIXIR, 7. TORRE
        [0, 1, 0, 1, 0, 0, 0, 1], // 5. GOLEM, 8. PEKKA, 4. OURO
        [1, 1, 1, 1, 0, 0, 0, 1], // 3. ARQUEIRA
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0]
    ],
    palavras: [
        { id: 1, palavra: "LANCAS", dica: "Usadas pelo Goblin, são afiadas.", direcao: "across", top: 0, left: 0 },
        { id: 6, palavra: "VALQUIRIA", dica: "Guerreira de cabelo laranja com machado.", direcao: "down", top: 0, left: 1 },
        { id: 5, palavra: "GOLEM", dica: "Tank gigante de pedra que explode.", direcao: "down", top: 0, left: 2 },
        { id: 7, palavra: "TORRE", dica: "Defesa Principal.", direcao: "down", top: 2, left: 5 },
        { id: 2, palavra: "ELIXIR", dica: "Recurso roxo necessário para jogar cartas.", direcao: "across", top: 2, left: 1 },
        { id: 8, palavra: "PEKKA", dica: "Cavaleiro pesado de armadura.", direcao: "down", top: 3, left: 3 },
        { id: 3, palavra: "ARQUEIRA", dica: "Unidade de longa distância (Horizontal).", direcao: "across", top: 4, left: 0 },
        { id: 4, palavra: "OURO", dica: "Moeda para upgrades (Vertical).", direcao: "down", top: 3, left: 7 }
    ]
};

let solutionGrid;    // Mapa de letras corretas
let userGrid;        // Mapa de letras digitadas pelo usuário
let gridElements;    // Referência aos elementos DOM (tiles)
let currentWordData; // Dados da palavra atualmente focada
let currentCell;     // Elemento DOM da célula atualmente focada

// =================================================================
// LÓGICA DE INICIALIZAÇÃO
// =================================================================

function iniciarCruzadinha() {
    console.log("Iniciando Cruzadinha Mestra...");
    const gridContainer = document.querySelector('#cruzadinha-game .cruzadinha-grid-container');
    const cluesAcross = document.getElementById('clues-across');
    const cluesDown = document.getElementById('clues-down');
    
    // Limpa a tela e reinicia estados
    gridContainer.innerHTML = '';
    cluesAcross.innerHTML = '';
    cluesDown.innerHTML = '';
    currentCell = null;
    currentWordData = null;

    const numRows = CRUZADINHA_DATA.mapa.length;
    const numCols = CRUZADINHA_DATA.mapa[0].length;
    
    solutionGrid = initializeGrid(numRows, numCols, '');
    userGrid = initializeGrid(numRows, numCols, '');
    gridElements = initializeGrid(numRows, numCols, null);

    // Configura o Grid CSS
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    // (O style.css cuida do max-width)

    // 1. Monta o Grid, Solução e Números
    buildGridAndSolution(gridContainer, numRows, numCols);

    // 2. Adiciona Dicas
    addClues(cluesAcross, cluesDown);

    // 3. Configura o Input e remove listeners do Termo
    document.removeEventListener('keydown', handleKeyPressCruzadinha);
    document.addEventListener('keydown', handleKeyPressCruzadinha);
    
    // Foco inicial
    const firstTile = document.querySelector('.cruzadinha-tile:not(.blank)');
    if (firstTile) {
        handleTileClick({ target: firstTile });
    }
}

function initializeGrid(rows, cols, initialValue) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill(initialValue);
    }
    return grid;
}

function buildGridAndSolution(container, numRows, numCols) {
    // Popula o solutionGrid
    CRUZADINHA_DATA.palavras.forEach(p => {
        const { palavra, direcao, top, left } = p;
        for (let i = 0; i < palavra.length; i++) {
            let r = top;
            let c = left;
            if (direcao === 'across') c += i;
            else r += i;
            solutionGrid[r][c] = palavra[i];
        }
    });

    // Cria os Tiles DOM
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const isWord = CRUZADINHA_DATA.mapa[r][c] === 1;
            const tile = document.createElement('div');
            tile.classList.add('cruzadinha-tile');
            tile.dataset.row = r;
            tile.dataset.col = c;
            tile.tabIndex = isWord ? 0 : -1; // Torna células de palavras focáveis

            if (!isWord) {
                tile.classList.add('blank');
            } else {
                tile.addEventListener('click', handleTileClick);
                // Preenche o tile se for uma interseção já preenchida (opcional, mas bom)
                if (userGrid[r][c] !== '') {
                    tile.textContent = userGrid[r][c];
                }
            }
            gridElements[r][c] = tile;
            container.appendChild(tile);
        }
    }

    // Adiciona números após a criação de todos os tiles
    CRUZADINHA_DATA.palavras.forEach(p => {
        const { id, top, left } = p;
        const numberSpan = document.createElement('span');
        numberSpan.classList.add('cruzadinha-tile-number');
        numberSpan.textContent = id;
        
        if (gridElements[top] && gridElements[top][left] && !gridElements[top][left].classList.contains('blank')) {
            gridElements[top][left].appendChild(numberSpan);
        }
    });
}

function addClues(cluesAcross, cluesDown) {
    CRUZADINHA_DATA.palavras.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.id}. ${p.dica}`;
        li.dataset.wordId = p.id;
        li.addEventListener('click', () => selectWord(p.id));

        if (p.direcao === 'across') {
            cluesAcross.appendChild(li);
        } else {
            cluesDown.appendChild(li);
        }
    });
}

// =================================================================
// LÓGICA DE SELEÇÃO E FOCO
// =================================================================

function highlightWord(wordData) {
    // 1. Limpa destaques anteriores (active-word e selected)
    document.querySelectorAll('.cruzadinha-tile').forEach(tile => {
        tile.classList.remove('active-word', 'selected');
    });

    // 2. Destaca a nova palavra
    const { palavra, direcao, top, left } = wordData;

    for (let i = 0; i < palavra.length; i++) {
        let r = top;
        let c = left;
        if (direcao === 'across') c += i;
        else r += i;

        if (gridElements[r] && gridElements[r][c]) {
            gridElements[r][c].classList.add('active-word');
        }
    }

    currentWordData = wordData;
}

function selectCell(row, col) {
    // Desfoca a célula anterior
    if (currentCell) {
        currentCell.classList.remove('selected');
    }

    currentCell = gridElements[row][col];
    currentCell.classList.add('selected');
    // Chama o foco para aceitar o input de teclado
    currentCell.focus(); 
}

function isCellInWord(wordData, r, c) {
    const { direcao, top, left, palavra } = wordData;
    for (let i = 0; i < palavra.length; i++) {
        let pr = top;
        let pc = left;
        if (direcao === 'across') pc += i;
        else pr += i;

        if (pr === r && pc === c) {
            return true;
        }
    }
    return false;
}

function findWordForCell(r, c, preferredDirection) {
    // Busca todas as palavras que passam por (r, c)
    const candidates = CRUZADINHA_DATA.palavras.filter(p => isCellInWord(p, r, c));
    
    // Tenta a direção preferida, senão pega a primeira
    let selectedWord = candidates.find(p => p.direcao === preferredDirection);
    
    if (!selectedWord && candidates.length > 0) {
        // Fallback para a primeira candidata se a direção preferida não estiver lá
        selectedWord = candidates[0]; 
    }
    
    return selectedWord;
}

function handleTileClick(event) {
    const tile = event.target.closest('.cruzadinha-tile');
    if (!tile || tile.classList.contains('blank')) return;

    const r = parseInt(tile.dataset.row);
    const c = parseInt(tile.dataset.col);
    
    let preferredDirection = 'across'; // Padrão
    let wordToSelect;

    // Se já há uma palavra ativa e a célula clicada pertence a ela, tenta alternar a direção
    if (currentWordData && isCellInWord(currentWordData, r, c)) {
        preferredDirection = (currentWordData.direcao === 'across') ? 'down' : 'across';
    }

    // Tenta selecionar a palavra na direção preferida
    wordToSelect = findWordForCell(r, c, preferredDirection);

    if (!wordToSelect) {
        // Se a preferida falhou, tenta a direção oposta como último recurso
        const fallbackDirection = (preferredDirection === 'across') ? 'down' : 'across';
        wordToSelect = findWordForCell(r, c, fallbackDirection);
    }

    if (wordToSelect) {
        highlightWord(wordToSelect);
        selectCell(r, c);
    }
}

function selectWord(id) {
    const wordData = CRUZADINHA_DATA.palavras.find(p => p.id === id);
    if (wordData) {
        highlightWord(wordData);
        selectCell(wordData.top, wordData.left); 
    }
}

// =================================================================
// LÓGICA DE INPUT E VERIFICAÇÃO
// =================================================================

function moveCursor(currentRow, currentCol, direction, step) {
    if (!currentWordData) return;
    
    const { palavra, top, left } = currentWordData;
    
    // 1. Encontra o índice da célula atual dentro da palavra ativa
    let currentIndex = -1;
    for (let i = 0; i < palavra.length; i++) {
        let pr = top;
        let pc = left;
        if (direction === 'across') pc += i;
        else pr += i;
        
        if (pr === currentRow && pc === currentCol) {
            currentIndex = i;
            break;
        }
    }

    if (currentIndex === -1) return;

    // 2. Calcula o próximo índice
    let nextIndex = currentIndex + step;
    
    // 3. Verifica limites
    if (nextIndex < 0 || nextIndex >= palavra.length) {
        // Se for ENTER e estamos no final, verifica a palavra
        if (step === 1) checkWordCompletion();
        return; 
    }

    // 4. Calcula a próxima posição (r, c)
    let nextRow = top;
    let nextCol = left;

    if (direction === 'across') {
        nextCol = left + nextIndex;
    } else { // down
        nextRow = top + nextIndex;
    }

    // 5. Move o foco
    if (gridElements[nextRow] && gridElements[nextRow][nextCol] && 
        !gridElements[nextRow][nextCol].classList.contains('blank')) {
        
        selectCell(nextRow, nextCol);
    }
}

function handleKeyPressCruzadinha(event) {
    // Só processa se houver uma célula focada
    if (!currentCell || !currentWordData) return;
    
    const key = event.key.toUpperCase();
    
    const r = parseInt(currentCell.dataset.row);
    const c = parseInt(currentCell.dataset.col);
    const { direcao } = currentWordData;

    // Input de Letra
    if (key.length === 1 && key.match(/[A-Z]/)) {
        currentCell.textContent = key;
        userGrid[r][c] = key; // Armazena o valor no grid lógico
        
        moveCursor(r, c, direcao, 1); // Move para frente

    } 
    // BACKSPACE
    else if (key === 'BACKSPACE') {
        event.preventDefault(); // Evita voltar a página
        
        // Limpa a célula atual (se estiver vazia, move o cursor para trás)
        if (currentCell.textContent !== '') {
            currentCell.textContent = '';
            userGrid[r][c] = '';
        } else {
            moveCursor(r, c, direcao, -1); // Move para trás e apaga na próxima tecla
            // Tenta apagar a letra da célula anterior
            const prevR = parseInt(currentCell.dataset.row);
            const prevC = parseInt(currentCell.dataset.col);
            currentCell.textContent = '';
            userGrid[prevR][prevC] = '';
        }

    } 
    // ENTER (Força a verificação)
    else if (event.key === 'Enter') {
        checkWordCompletion();
    }
    
    // Previne o comportamento padrão (exceto Enter)
    if (key.match(/[A-Z]/) || key === 'BACKSPACE') {
        event.preventDefault();
    }
}

function checkWordCompletion() {
    const { palavra, top, left, direcao, id } = currentWordData;
    let palpite = '';

    // Monta o palpite atual
    for (let i = 0; i < palavra.length; i++) {
        let r = top;
        let c = left;
        if (direcao === 'across') c += i;
        else r += i;
        
        palpite += userGrid[r][c];
    }
    
    if (palpite.length === palavra.length && !palpite.includes('')) {
        // Palavra completa
        if (palpite === palavra) {
            
            if (typeof showMessage === 'function') {
                showMessage(`✅ Palavra ${id} (${palavra}) correta!`, "green-glow");
            }

            lockCorrectWord(top, left, direcao, palavra.length);
            checkGameEnd();
        } else {
            if (typeof showMessage === 'function') {
                showMessage(`❌ Palavra ${id} incorreta. Tente novamente!`, "royal-blue-light");
            }
        }
    }
}

function lockCorrectWord(top, left, direcao, length) {
    for (let i = 0; i < length; i++) {
        let r = top;
        let c = left;
        if (direcao === 'across') c += i;
        else r += i;
        
        const tile = gridElements[r][c];
        tile.classList.add('correct'); 
        tile.classList.remove('active-word');
        tile.removeEventListener('click', handleTileClick);
        tile.tabIndex = -1; // Desabilita o foco
    }
}

function checkGameEnd() {
    // Verifica se todos os tiles de palavras estão corretos
    const totalWordTiles = document.querySelectorAll('.cruzadinha-tile:not(.blank)').length;
    const correctTiles = document.querySelectorAll('.cruzadinha-tile.correct').length;

    if (correctTiles === totalWordTiles) {
        if (typeof showMessage === 'function') {
            showMessage("🏆 CONQUISTA REAL! Cruzadinha Completa!", "gold");
        }
    }
}
