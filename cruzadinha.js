/**
 * ⚔️ CRUZADINHA MESTRA - CÓDIGO REFATORADO E MAIS ROBUSTO
 * Este arquivo gerencia a lógica de montagem, seleção, input e verificação da cruzadinha.
 * DEPENDÊNCIA: Assume que a função showMessage(message, colorClass) está definida em termo.js.
 */

// =================================================================
// Definição da Cruzadinha (Maior e Mais Complexa)
// =================================================================

const CRUZADINHA_DATA_REFATORADA = {
    // 8x8 Grid. 1 = letra, 0 = espaço vazio.
    mapa: [
        [1, 1, 1, 1, 1, 1, 0, 0], // 1. LANÇAS
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1], // 2. ELIXIR
        [0, 1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 0, 0, 1], // 3. ARQUEIRA / 4. OURO
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
        { id: 7, palavra: "TORRE", dica: "Defesa Principal.", direcao: "down", top: 2, left: 5 },
        { id: 8, palavra: "PEKKA", dica: "Cavaleiro pesado de armadura.", direcao: "down", top: 3, left: 3 }
    ]
};

let solutionGrid;    // Solução para verificação
let userGrid;        // Input do usuário
let gridElements;    // Elementos DOM (Tiles)
let currentWordData; // A palavra atualmente ativa
let currentCell;     // A célula atualmente focada

// =================================================================
// LÓGICA DE INICIALIZAÇÃO
// =================================================================

function iniciarCruzadinha() {
    console.log("Iniciando Cruzadinha Mestra...");
    const gridContainer = document.querySelector('#cruzadinha-game .cruzadinha-grid-container');
    const cluesAcross = document.getElementById('clues-across');
    const cluesDown = document.getElementById('clues-down');
    
    // Limpa conteúdo e reinicia estados
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

    // Configura o Grid CSS
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    gridContainer.style.maxWidth = `${numCols * 38}px`; // Ajuste para o CSS

    // 1. Monta o Grid DOM, Solução e Números
    buildGridAndSolution(gridContainer, numRows, numCols);

    // 2. Adiciona Dicas
    addClues(cluesAcross, cluesDown);

    // 3. Configura o Input
    document.removeEventListener('keydown', handleKeyPressCruzadinha);
    document.addEventListener('keydown', handleKeyPressCruzadinha);
    
    // Seleciona a primeira célula válida (opcional, para dar um foco inicial)
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
    // Cria os Tiles e popula o solutionGrid
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
                // Preenche o tile se já houver interseção preenchida
                if (userGrid[r][c] !== '') {
                    tile.textContent = userGrid[r][c];
                }
            }
            gridElements[r][c] = tile;
            container.appendChild(tile);
        }
    }

    // Adiciona números após a criação de todos os tiles
    CRUZADINHA_DATA_REFATORADA.palavras.forEach(p => {
        const { id, top, left } = p;
        const numberSpan = document.createElement('span');
        numberSpan.classList.add('cruzadinha-tile-number');
        numberSpan.textContent = id;
        
        // Garante que o tile exista antes de adicionar o número
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
    // 1. Limpa destaques anteriores
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
    console.log(`Palavra Ativa: ${wordData.palavra} (${wordData.direcao})`);
}

function selectCell(row, col) {
    // Desfoca a célula anterior
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
    // Busca todas as palavras que passam por (r, c)
    const candidates = CRUZADINHA_DATA_REFATORADA.palavras.filter(p => isCellInWord(p, r, c));
    
    // 1. Tenta a direção preferida
    let selectedWord = candidates.find(p => p.direcao === preferredDirection);

    // 2. Se não encontrou, pega a primeira disponível (ou a da direção oposta)
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
    
    // Se a célula já está na palavra ativa, tenta alternar a direção (Across <-> Down)
    let preferredDirection = 'across'; // Default

    if (currentWordData && isCellInWord(currentWordData, r, c)) {
        preferredDirection = (currentWordData.direcao === 'across') ? 'down' : 'across';
    }

    let wordToSelect = findWordForCell(r, c, preferredDirection);

    if (!wordToSelect) {
        // Tenta a direção oposta como fallback (para intersecções)
        const fallbackDirection = (preferredDirection === 'across') ? 'down' : 'across';
        wordToSelect = findWordForCell(r, c, fallbackDirection);
    }

    if (wordToSelect) {
        highlightWord(wordToSelect);
        selectCell(r, c);
    }
}

function selectWord(id) {
    const wordData = CRUZADINHA_DATA_REFATORADA.
