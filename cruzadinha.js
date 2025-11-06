/**
 * ⚔️ CRUZADINHA MESTRA - VERSÃO APRIMORADA
 * ✅ Teclado virtual
 * ✅ Mensagens sem revelar palavras
 * ✅ Animação estilo TERMÔ
 * ✅ Botão reset
 * ✅ Foco inteligente
 */

// ================================================================
// 1. DADOS DA CRUZADINHA
// ================================================================

const CRUZADINHA_DATA = {
    mapa: [
        [1, 1, 1, 1, 1, 1, 0, 0], 
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0]
    ],
    palavras: [
        { id: 1, palavra: "LANCAS", dica: "Usadas pelo Goblin.", direcao: "across", top: 0, left: 0 },
        { id: 6, palavra: "VALQUIRIA", dica: "Guerreira de machado.", direcao: "down", top: 0, left: 1 },
        { id: 5, palavra: "GOLEM", dica: "Tank gigante de pedra.", direcao: "down", top: 0, left: 2 },
        { id: 7, palavra: "TORRE", dica: "Defesa principal.", direcao: "down", top: 2, left: 5 },
        { id: 2, palavra: "ELIXIR", dica: "Recurso roxo para cartas.", direcao: "across", top: 2, left: 1 },
        { id: 8, palavra: "PEKKA", dica: "Cavaleiro pesado.", direcao: "down", top: 3, left: 3 },
        { id: 3, palavra: "ARQUEIRA", dica: "Unidade à distância.", direcao: "across", top: 4, left: 0 },
        { id: 4, palavra: "OURO", dica: "Moeda para upgrades.", direcao: "down", top: 3, left: 7 }
    ]
};

let solutionGrid;
let userGrid;
let gridElements;
let currentWordData;
let currentCell;

// ================================================================
// 2. INICIAR CRUZADINHA
// ================================================================

function iniciarCruzadinha() {
    const gridContainer = document.querySelector('#cruzadinha-game .cruzadinha-grid-container');
    const cluesAcross = document.getElementById('clues-across');
    const cluesDown = document.getElementById('clues-down');
    const keyboard = document.getElementById('cruzadinha-keyboard');
    const resetBtn = document.getElementById('cruz-reset');

    gridContainer.innerHTML = '';
    cluesAcross.innerHTML = '';
    cluesDown.innerHTML = '';
    keyboard.innerHTML = '';
    
    currentCell = null;
    currentWordData = null;

    const rows = CRUZADINHA_DATA.mapa.length;
    const cols = CRUZADINHA_DATA.mapa[0].length;

    solutionGrid = createGrid(rows, cols, '');
    userGrid = createGrid(rows, cols, '');
    gridElements = createGrid(rows, cols, null);

    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    buildGrid(gridContainer, rows, cols);
    addClues(cluesAcross, cluesDown);
    buildVirtualKeyboard(keyboard);

    resetBtn.onclick = () => iniciarCruzadinha();

    document.removeEventListener('keydown', handleKeyPressCruzadinha);
    document.addEventListener('keydown', handleKeyPressCruzadinha);

    const first = document.querySelector('.cruzadinha-tile:not(.blank)');
    if (first) handleTileClick({ target: first });
    
    showMessage("Cruzadinha iniciada!", "gold");
}

function createGrid(r, c, value) {
    return Array.from({ length: r }, () => Array(c).fill(value));
}

// ================================================================
// 3. MONTAR GRID E DICAS
// ================================================================

function buildGrid(container, rows, cols) {
    CRUZADINHA_DATA.palavras.forEach(p => {
        for (let i = 0; i < p.palavra.length; i++) {
            let r = p.top + (p.direcao === 'down' ? i : 0);
            let c = p.left + (p.direcao === 'across' ? i : 0);
            solutionGrid[r][c] = p.palavra[i];
        }
    });

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const isTile = CRUZADINHA_DATA.mapa[r][c] === 1;

            let tile = document.createElement('div');
            tile.classList.add('cruzadinha-tile');
            tile.dataset.row = r;
            tile.dataset.col = c;

            if (!isTile) {
                tile.classList.add('blank');
            } else {
                tile.addEventListener('click', handleTileClick);
            }

            gridElements[r][c] = tile;
            container.appendChild(tile);
        }
    }

    CRUZADINHA_DATA.palavras.forEach(p => {
        const marker = document.createElement('span');
        marker.classList.add('cruzadinha-tile-number');
        marker.textContent = p.id;
        gridElements[p.top][p.left].appendChild(marker);
    });
}

function addClues(across, down) {
    CRUZADINHA_DATA.palavras.forEach(p => {
        let li = document.createElement('li');
        li.textContent = `${p.id}. ${p.dica}`;
        li.addEventListener('click', () => selectWord(p.id));

        if (p.direcao === 'across') across.appendChild(li);
        else down.appendChild(li);
    });
}

// ================================================================
// 4. SELEÇÃO / MOVIMENTO
// ================================================================

function handleTileClick(event) {
    const tile = event.target.closest('.cruzadinha-tile');
    if (!tile || tile.classList.contains('blank')) return;

    const r = +tile.dataset.row, c = +tile.dataset.col;
    let preferred = 'across';

    if (currentWordData && isInsideWord(currentWordData, r, c))
        preferred = currentWordData.direcao === 'across' ? 'down' : 'across';

    const chosen = findWord(r, c, preferred) || findWord(r, c, preferred === 'across' ? 'down' : 'across');

    if (chosen) {
        highlightWord(chosen);
        selectCell(r, c);
    }
}

function isInsideWord(word, r, c) {
    for (let i = 0; i < word.palavra.length; i++) {
        let rr = word.top + (word.direcao === 'down' ? i : 0);
        let cc = word.left + (word.direcao === 'across' ? i : 0);
        if (rr === r && cc === c) return true;
    }
    return false;
}

function findWord(r, c, dir) {
    return CRUZADINHA_DATA.palavras.find(p => p.direcao === dir && isInsideWord(p, r, c));
}

function highlightWord(word) {
    document.querySelectorAll('.cruzadinha-tile').forEach(t => {
        t.classList.remove('active-word', 'selected');
    });

    for (let i = 0; i < word.palavra.length; i++) {
        let r = word.top + (word.direcao === 'down' ? i : 0);
        let c = word.left + (word.direcao === 'across' ? i : 0);
        gridElements[r][c].classList.add('active-word');
    }

    currentWordData = word;
}

function selectCell(r, c) {
    if (currentCell) currentCell.classList.remove('selected');
    currentCell = gridElements[r][c];
    currentCell.classList.add('selected');
    currentCell.focus();
}

// ================================================================
// 5. INPUT (DIGITANDO E TECLADO VIRTUAL)
// ================================================================

function handleKeyPressCruzadinha(event) {
    if (!currentCell || !currentWordData) return;

    const key = event.key.toUpperCase();
    processInput(key);
}

function buildVirtualKeyboard(container) {
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

    rows.forEach(r => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('cruz-key-row');

        r.split('').forEach(letter => {
            const key = document.createElement('button');
            key.classList.add('cruz-key');
            key.textContent = letter;
            key.onclick = () => processInput(letter);
            rowDiv.appendChild(key);
        });
        container.appendChild(rowDiv);
    });

    // BACKSPACE
    const back = document.createElement('button');
    back.classList.add('cruz-key', 'big');
    back.textContent = '⌫';
    back.onclick = () => processInput('BACKSPACE');
    container.appendChild(back);

    // ENTER
    const enter = document.createElement('button');
    enter.classList.add('cruz-key', 'big');
    enter.textContent = 'ENTER';
    enter.onclick = () => processInput('ENTER');
    container.appendChild(enter);
}

function processInput(key) {
    if (!currentCell || !currentWordData) return;

    const r = +currentCell.dataset.row;
    const c = +currentCell.dataset.col;
    const { direcao } = currentWordData;

    // LETRA
    if (key.length === 1 && key.match(/[A-Z]/)) {
        currentCell.textContent = key;
        userGrid[r][c] = key;
        moveCursor(r, c, direcao, 1);
        animateTile(currentCell);
        return;
    }

    // BACKSPACE
    if (key === 'BACKSPACE') {
        if (currentCell.textContent !== '') {
            currentCell.textContent = '';
            userGrid[r][c] = '';
        } else {
            moveCursor(r, c, direcao, -1);
            currentCell.textContent = '';
        }
        return;
    }

    // ENTER
    if (key === 'ENTER') checkWordCompletion();
}

// ================================================================
// 6. VERIFICAÇÃO
// ================================================================

function checkWordCompletion() {
    const { palavra, top, left, direcao } = currentWordData;

    let guess = '';
    for (let i = 0; i < palavra.length; i++) {
        let r = top + (direcao === 'down' ? i : 0);
        let c = left + (direcao === 'across' ? i : 0);
        guess += userGrid[r][c];
    }

    if (guess.length !== palavra.length || guess.includes('')) {
        showMessage("Preencha a palavra inteira!", "royal-blue");
        return;
    }

    if (guess === palavra) {
        lockCorrectWord(top, left, direcao, palavra.length);
        showMessage("✅ Palavra correta!", "green-glow");
        checkEndGame();
    } else {
        showMessage("❌ Palavra incorreta!", "royal-blue-light");
    }
}

function lockCorrectWord(top, left, direcao, length) {
    for (let i = 0; i < length; i++) {
        let r = top + (direcao === 'down' ? i : 0);
        let c = left + (direcao === 'across' ? i : 0);

        const tile = gridElements[r][c];
        tile.classList.add('correct');
        tile.classList.remove('active-word', 'selected');
        tile.removeEventListener('click', handleTileClick);
        tile.tabIndex = -1;
    }
    currentCell = null;
    currentWordData = null;
}

function checkEndGame() {
    const total = document.querySelectorAll('.cruzadinha-tile:not(.blank)').length;
    const correct = document.querySelectorAll('.cruzadinha-tile.correct').length;

    if (total === correct) {
        showMessage("🏆 CRUZADINHA COMPLETA!", "gold");
        document.removeEventListener('keydown', handleKeyPressCruzadinha);
    }
}

// ================================================================
// 7. ANIMAÇÃO
// ================================================================

function animateTile(tile) {
    tile.style.animation = 'flip 0.25s';
    setTimeout(() => tile.style.animation = '', 250);
}
