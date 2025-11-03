/**
 * ⚔️ CRUZADINHA MESTRA - CÓDIGO FINAL E FUNCIONAL
 * Este arquivo gerencia a lógica de montagem, seleção, input e verificação da cruzadinha.
 * DEPENDÊNCIA: Assume que a função showMessage(message, colorClass) está definida em termo.js.
 */

// =================================================================
// Definição da Cruzadinha
// =================================================================

const CRUZADINHA_DATA_REFATORADA = {
    // 8x8 Grid. 1 = letra, 0 = espaço vazio.
    mapa: [
        [1, 1, 1, 1, 1, 1, 0, 0], // 1. LANCAS (Across)
        [0, 0, 1, 0, 0, 1, 0, 0], // 6. VALQUIRIA (Down)
        [0, 1, 1, 1, 1, 1, 1, 1], // 2. ELIXIR (Across)
        [0, 1, 0, 1, 0, 0, 0, 1], // 5. GOLEM (Down), 8. PEKKA (Down)
        [1, 1, 1, 1, 0, 0, 0, 1], // 3. ARQUEIRA (Across), 4. OURO (Down)
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0]
    ],
    // Dicionário de palavras e suas posições (top, left). A palavra deve estar em MAIÚSCULAS.
    palavras: [
        { id: 1, palavra: "LANCAS", dica: "Usadas pelo Goblin, são afiadas.", direcao: "across", top: 0, left: 0 },
        { id: 5, palavra: "GOLEM", dica: "Tank gigante de pedra que explode.", direcao: "down", top: 0, left: 2 },
        { id: 2, palavra: "ELIXIR", dica: "Recurso roxo necessário para jogar cartas.", direcao: "across", top: 2, left: 1 },
        { id: 3, palavra: "ARQUEIRA", dica: "Unidade de longa distância (Horizontal).", direcao: "across", top: 4, left: 0 },
        { id: 6, palavra: "VALQUIRIA", dica: "Guerreira de cabelo laranja com machado.", direcao: "down", top: 0, left: 1 },
        { id: 4, palavra: "OURO", dica: "Moeda para upgrades (Vertical).", direcao: "down", top: 3, left: 7 },
        { id: 7, palavra: "TORRE", dica: "Defesa Principal (Vertical).", direcao: "down", top: 2, left: 5 },
        { id: 8, palavra: "PEKKA", dica: "Cavaleiro pesado de armadura (Vertical).", direcao: "down", top: 3, left: 3 }
    ]
};

let solutionGrid;    
let userGrid;        
let gridElements;    
let currentWordData; 
let currentCell;     

// =================================================================
// LÓGICA DE INICIALIZAÇÃO
// =================================================================

function iniciarCruzadinha() {
    console.log("Iniciando Cruzadinha Mestra...");
    const gridContainer = document.querySelector('#cruzadinha-game .cruzadinha-grid-container');
    const cluesAcross = document.getElementById('clues-across');
    const cluesDown = document.getElementById('clues-down');
    
    gridContainer.innerHTML = '';
    cluesAcross.innerHTML = '';
    cluesDown.innerHTML = '';
    currentCell = null;
    currentWordData = null;

    const numRows = CRUZADINHA_DATA_REFATORADA.mapa.length;
    const numCols = CRUZADINHA_DATA_REFATORADA.mapa[0].length;
    
    solutionGrid = initializeGrid(numRows, numCols, '');
    userGrid = initializeGrid(numRows, numCols, '');
    gridElements = initializeGrid(numRows, numCols, null);

    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    gridContainer.style.maxWidth = `${numCols * 38}px`;

    buildGridAndSolution(gridContainer, numRows, numCols);
    addClues(cluesAcross, cluesDown);

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
    // 1. Popula a solução (solutionGrid)
    CRUZADINHA_DATA_REFATORADA.palavras.forEach(p => {
        const { id, palavra, direcao, top, left } = p;
        for (let i = 0; i < palavra.length; i++) {
            let r = top;
            let c = left;
            if (direcao === 'across') c += i;
            else r += i;
            solutionGrid[r][c] = palavra[i];
        }
    });

    // 2. Cria os elementos DOM (Tiles)
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const isWord = CRUZADINHA_DATA_REFATORADA.mapa[r][c] === 1;
            const tile = document.createElement('div');
            tile.classList.add('cruzadinha-tile');
            tile.dataset.row = r;
            tile.dataset.col = c;
            tile.tabIndex = isWord ? 0 : -1;

            if (!isWord) {
                tile.classList.add('blank');
            } else {
                tile.addEventListener('click', handleTileClick);
                if (userGrid[r][c] !== '') {
                    tile.textContent = userGrid[r][c];
                }
            }
            gridElements[r][c] = tile;
            container.appendChild(tile);
        }
    }

    // 3. Adiciona números nas células iniciais
    CRUZADINHA_DATA_REFATORADA.palavras.forEach(p => {
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
    CRUZADINHA_DATA_REFATORADA.palavras.forEach(p => {
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
    document.querySelectorAll('.cruzadinha-tile').forEach(tile => {
        tile.classList.remove('active-word', 'selected');
    });

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
    if (currentCell) {
        currentCell.classList.remove('selected');
    }
    currentCell = gridElements[row][col];
    currentCell.classList.add('selected');
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
    const candidates = CRUZADINHA_DATA_REFATORADA.palavras.filter(p => isCellInWord(p, r, c));
    let selectedWord = candidates.find(p => p.direcao === preferredDirection);
    
    if (!selectedWord && candidates.length > 0) {
        // Tenta a direção oposta se a preferida não funcionar
        const oppositeDirection = (preferredDirection === 'across') ? 'down' : 'across';
        selectedWord = candidates.find(p => p.direcao === oppositeDirection);
    }
    
    if (!selectedWord && candidates.length > 0) {
        selectedWord = candidates[0]; 
    }
    return selectedWord;
}

function handleTileClick(event) {
    const tile = event.target.closest('.cruzadinha-tile');
    if (!tile || tile.classList.contains('blank')) return;

    const r = parseInt(tile.dataset.row);
    const c = parseInt(tile.dataset.col);
    
    let preferredDirection = 'across'; 

    if (currentWordData && isCellInWord(currentWordData, r, c)) {
        // Alterna direção se a célula já está na palavra ativa
        preferredDirection = (currentWordData.direcao === 'across') ? 'down' : 'across';
    }

    const wordToSelect = findWordForCell(r, c, preferredDirection);

    if (wordToSelect) {
        highlightWord(wordToSelect);
        selectCell(r, c);
    }
}

function selectWord(id) {
    const wordData = CRUZADINHA_DATA_REFATORADA.palavras.find(p => p.id === id);
    if (wordData) {
        highlightWord(wordData);
        selectCell(wordData.top, wordData.left); 
    }
}

// =================================================================
// LÓGICA DE INPUT E VERIFICAÇÃO
// =================================================================

function moveCursor(currentRow, currentCol, direction, step) {
    const { palavra, top, left } = currentWordData;
    
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

    let nextIndex = currentIndex + step;
    if (nextIndex < 0 || nextIndex >= palavra.length) {
        return; 
    }

    let nextRow = top;
    let nextCol = left;

    if (direction === 'across') {
        nextCol = left + nextIndex;
    } else { // down
        nextRow = top + nextIndex;
    }

    if (gridElements[nextRow] && gridElements[nextRow][nextCol] && 
        !gridElements[nextRow][nextCol].classList.contains('blank')) {
        
        selectCell(nextRow, nextCol);
    }
}

function handleKeyPressCruzadinha(event) {
    if (!currentCell || !currentWordData) return;
    
    const key = event.key.toUpperCase();
    
    const r = parseInt(currentCell.dataset.row);
    const c = parseInt(currentCell.dataset.col);
    const { direcao } = currentWordData;

    if (key.length === 1 && key.match(/[A-Z]/)) {
        currentCell.textContent = key;
        userGrid[r][c] = key;
        
        moveCursor(r, c, direcao, 1);
        checkWordCompletion();

    } else if (key === 'BACKSPACE') {
        // Limpa a célula atual
        currentCell.textContent = '';
        userGrid[r][c] = '';
        
        // Move para a célula anterior
        moveCursor(r, c, direcao, -1);
        
    } else if (event.key === 'Enter') {
        checkWordCompletion();
    }
    
    // Previne o comportamento padrão (ex: scroll em Backspace)
    if (key.match(/[A-Z]/) || key === 'BACKSPACE' || key === 'Enter') {
        event.preventDefault();
    }
}

function checkWordCompletion() {
    const { palavra, top, left, direcao, id } = currentWordData;
    let palpite = '';

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
            
            // Verifica se a função showMessage existe antes de usar (dependência do termo.js)
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
        tile.removeEventListener('click', handleTileClick);
        tile.tabIndex = -1; // Desabilita o foco por tab
    }
}

function checkGameEnd() {
    // Verifica se todos os tiles de palavras foram marcados como 'correct'
    const totalTiles = document.querySelectorAll('.cruzadinha-tile:not(.blank)').length;
    const correctTiles = document.querySelectorAll('.cruzadinha-tile.correct').length;

    if (correctTiles === totalTiles) {
        if (typeof showMessage === 'function') {
            showMessage("🏆 CONQUISTA REAL! Cruzadinha Completa!", "gold");
        }
    }
}
