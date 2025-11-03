/**
 * ⚔️ CRUZADINHA MESTRA
 * Este arquivo gerencia a lógica de montagem, seleção e verificação da cruzadinha.
 * Depende da função showMessage definida em termo.js.
 */

// =================================================================
// Definição da Cruzadinha (Maior e Mais Complexa)
// =================================================================

const CRUZADINHA_DATA = {
    // 8x8 Grid
    mapa: [
        [1, 1, 1, 1, 1, 0, 0, 0], // 1. LANÇAS
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1], // 2. ELIXIR
        [0, 1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 0, 0, 1], // 3. ARQUEIRA / 4. OURO
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0]
    ],
    // Dicionário de palavras e suas posições (top, left)
    palavras: [
        { id: 1, palavra: "LANCAS", dica: "Usadas pelo Goblin, são afiadas.", direcao: "across", top: 0, left: 0 },
        { id: 2, palavra: "GOLEM", dica: "Tank gigante de pedra que explode.", direcao: "down", top: 0, left: 2 },
        { id: 3, palavra: "ELIXIR", dica: "Recurso roxo necessário para jogar cartas.", direcao: "across", top: 2, left: 1 },
        { id: 4, palavra: "ARQUEIRA", dica: "Unidade de longa distância (Horizontal).", direcao: "across", top: 4, left: 0 },
        { id: 5, palavra: "VALQUIRIA", dica: "Guerreira de cabelo laranja com machado.", direcao: "down", top: 0, left: 1 },
        { id: 6, palavra: "OURO", dica: "Moeda para upgrades (Vertical).", direcao: "down", top: 3, left: 7 },
        { id: 7, palavra: "MINAS", dica: "Cria elixir (Vertical).", direcao: "down", top: 2, left: 3 }
    ]
};

let solutionGrid; // O grid com a solução correta
let userGrid;     // O grid com o palpite do usuário
let currentWordData; // A palavra atualmente selecionada
let currentCell;     // A célula (tile) atualmente focada
let gridElements;    // O array 2D de elementos DOM

// =================================================================
// LÓGICA DE INICIALIZAÇÃO
// =================================================================

function iniciarCruzadinha() {
    const gridContainer = document.querySelector('#cruzadinha-game .cruzadinha-grid-container');
    const cluesAcross = document.getElementById('clues-across');
    const cluesDown = document.getElementById('clues-down');
    
    // Limpa conteúdo e reinicia estados
    gridContainer.innerHTML = '';
    cluesAcross.innerHTML = '';
    cluesDown.innerHTML = '';
    currentCell = null;
    currentWordData = null;

    const numRows = CRUZADINHA_DATA.mapa.length;
    const numCols = CRUZADINHA_DATA.mapa[0].length;
    
    // Inicializa grids
    solutionGrid = initializeGrid(numRows, numCols, ''); // Caracteres da solução
    userGrid = initializeGrid(numRows, numCols, '');     // Letras digitadas pelo usuário
    gridElements = initializeGrid(numRows, numCols, null); // Elementos DOM

    // Configura o Grid CSS
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    gridContainer.style.maxWidth = `${numCols * 35}px`;

    // 1. Monta o Grid DOM e a Solução
    buildGridAndSolution(gridContainer, numRows, numCols);

    // 2. Adiciona Dicas
    addClues(cluesAcross, cluesDown);

    // 3. Configura o Input
    document.removeEventListener('keydown', handleKeyPressCruzadinha);
    document.addEventListener('keydown', handleKeyPressCruzadinha);
}

function initializeGrid(rows, cols, initialValue) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill(initialValue);
    }
    return grid;
}

function buildGridAndSolution(container, numRows, numCols) {
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const isWord = CRUZADINHA_DATA.mapa[r][c] === 1;
            const tile = document.createElement('div');
            tile.classList.add('cruzadinha-tile');
            tile.dataset.row = r;
            tile.dataset.col = c;
            
            if (!isWord) {
                tile.classList.add('blank');
            } else {
                tile.addEventListener('click', handleTileClick);
            }

            gridElements[r][c] = tile;
            container.appendChild(tile);
        }
    }

    // Preenche o solutionGrid e adiciona números
    CRUZADINHA_DATA.palavras.forEach(p => {
        const { id, palavra, direcao, top, left } = p;
        
        // Adiciona número na célula inicial
        const numberSpan = document.createElement('span');
        numberSpan.classList.add('cruzadinha-tile-number');
        numberSpan.textContent = id;
        gridElements[top][left].appendChild(numberSpan);

        // Preenche a solução e o userGrid
        for (let i = 0; i < palavra.length; i++) {
            let r = top;
            let c = left;
            if (direcao === 'across') c += i;
            else r += i;
            
            solutionGrid[r][c] = palavra[i];
            
            // Se já foi preenchida em outro palpite (intersecção)
            if (userGrid[r][c] !== '') {
                gridElements[r][c].textContent = userGrid[r][c];
            }
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

        gridElements[r][c].classList.add('active-word');
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
    currentCell.focus(); // Foca (útil para acessibilidade)
}

function handleTileClick(event) {
    const tile = event.target.closest('.cruzadinha-tile');
    if (!tile || tile.classList.contains('blank')) return;

    const r = parseInt(tile.dataset.row);
    const c = parseInt(tile.dataset.col);

    // Encontra a palavra que começa na célula clicada, OU, se já houver uma palavra selecionada, tenta alternar.
    
    let wordToSelect = null;
    let preferredDirection = 'across'; // Padrão se não houver seleção

    // 1. Tenta usar a direção da palavra atual, se a célula for parte dela
    if (currentWordData) {
        const { direcao, top, left, palavra } = currentWordData;
        
        let isPartOfCurrentWord = false;
        for (let i = 0; i < palavra.length; i++) {
            let pr = top;
            let pc = left;
            if (direcao === 'across') pc += i;
            else pr += i;

            if (pr === r && pc === c) {
                isPartOfCurrentWord = true;
                break;
            }
        }

        if (isPartOfCurrentWord) {
            // Se faz parte, tenta alternar direção (Across -> Down, ou vice-versa)
            preferredDirection = (direcao === 'across') ? 'down' : 'across';
        } else {
             // Se não faz parte da atual, usa a direção da atual como preferida
             preferredDirection = direcao;
        }
    }
    
    // 2. Encontra a melhor palavra para selecionar (ou a que contém a célula)
    wordToSelect = findWordForCell(r, c, preferredDirection);

    if (wordToSelect) {
        highlightWord(wordToSelect);
        selectCell(r, c);
    }
}

function selectWord(id) {
    const wordData = CRUZADINHA_DATA.palavras.find(p => p.id === id);
    if (wordData) {
        highlightWord(wordData);
        selectCell(wordData.top, wordData.left); // Foca na primeira célula da palavra
    }
}

function findWordForCell(r, c, preferredDirection) {
    // Tenta encontrar uma palavra na direção preferida que contenha a célula (r, c)
    let selectedWord = null;

    // 1. Tenta a direção preferida
    selectedWord = CRUZADINHA_DATA.palavras.find(p => 
        p.direcao === preferredDirection && isCellInWord(p, r, c)
    );

    // 2. Se não encontrou ou a direção preferida era a de clique, tenta a oposta
    if (!selectedWord) {
        const oppositeDirection = (preferredDirection === 'across') ? 'down' : 'across';
        selectedWord = CRUZADINHA_DATA.palavras.find(p => 
            p.direcao === oppositeDirection && isCellInWord(p, r, c)
        );
    }
    
    return selectedWord;
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


// =================================================================
// LÓGICA DE INPUT E VERIFICAÇÃO
// =================================================================

function handleKeyPressCruzadinha(event) {
    if (!currentCell || !currentWordData) return;
    
    const key = event.key.toUpperCase();
    
    const r = parseInt(currentCell.dataset.row);
    const c = parseInt(currentCell.dataset.col);
    const { palavra, direcao } = currentWordData;

    if (key.length === 1 && key.match(/[A-Z]/)) {
        currentCell.textContent = key;
        userGrid[r][c] = key;
        
        // Move para a próxima célula
        moveCursor(r, c, direcao, 1);
        checkWordCompletion();

    } else if (key === 'BACKSPACE') {
        currentCell.textContent = '';
        userGrid[r][c] = '';
        
        // Move para a célula anterior
        moveCursor(r, c, direcao, -1);
    }
    // Outros: Arrow keys para navegação avançada seriam adicionadas aqui
}

function moveCursor(currentRow, currentCol, direction, step) {
    const { palavra, top, left } = currentWordData;
    const wordLength = palavra.length;
    let nextRow = currentRow;
    let nextCol = currentCol;

    // Calcula o índice atual dentro da palavra selecionada
    let currentIndex = -1;
    for (let i = 0; i < wordLength; i++) {
        let pr = top;
        let pc = left;
        if (direction === 'across') pc += i;
        else pr += i;
        
        if (pr === currentRow && pc === currentCol) {
            currentIndex = i;
            break;
        }
    }

    if (currentIndex === -1) return; // Erro, célula não faz parte da palavra

    let nextIndex = currentIndex + step;

    // Lida com limites da palavra
    if (nextIndex < 0 || nextIndex >= wordLength) {
        return; // Não sai da palavra
    }

    // Calcula a posição da próxima célula
    if (direction === 'across') {
        nextCol = left + nextIndex;
        nextRow = top;
    } else { // down
        nextRow = top + nextIndex;
        nextCol = left;
    }

    // Garante que a célula existe no grid DOM (caso tenhamos saído da palavra, o que não deveria ocorrer)
    if (gridElements[nextRow] && gridElements[nextRow][nextCol] && 
        !gridElements[nextRow][nextCol].classList.contains('blank')) {
        
        selectCell(nextRow, nextCol);
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
        
        // Coleta o palpite do grid do usuário
        palpite += userGrid[r][c];
    }
    
    if (palpite.length === palavra.length && !palpite.includes('')) {
        // Palavra completa
        if (palpite === palavra) {
            // ACERTO!
            showMessage(`✅ Palavra ${id} (${palavra}) correta!`, "green-glow");
            
            // Trava as células corretas
            lockCorrectWord(top, left, direcao, palavra.length);

            // Verifica se o jogo terminou
            checkGameEnd();
        } else {
            // ERRO!
            showMessage(`❌ Palavra ${id} incorreta. Tente novamente!`, "royal-blue-light");
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
        tile.classList.add('correct'); // Estilo de acerto
        tile.removeEventListener('click', handleTileClick);
    }
}

function checkGameEnd() {
    // Simplesmente checa se todas as palavras foram acertadas.
    let allCorrect = true;
    
    for (const p of CRUZADINHA_DATA.palavras) {
        let currentGuess = '';
        for (let i = 0; i < p.palavra.length; i++) {
            let r = p.top;
            let c = p.left;
            if (p.direcao === 'across') c += i;
            else r += i;
            currentGuess += userGrid[r][c];
        }
        
        if (currentGuess !== p.palavra) {
            allCorrect = false;
            break;
        }
    }

    if (allCorrect) {
        // Garante que a função showMessage exista (assumindo que termo.js foi carregado)
        if (typeof showMessage === 'function') {
            showMessage("🏆 CONQUISTA REAL! Cruzadinha Completa!", "gold");
        }
    }
}
