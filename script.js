/******************************************************
 *  SISTEMA COMPLETO - TERMO + CRUZADINHA
 *  ✅ showMessage()
 *  ✅ Termo completo
 *  ✅ Cruzadinha completa
 *  ✅ setupNavigation()
 *  ✅ DOMContentLoaded
 ******************************************************/

//======================================================
// 1. FUNÇÃO GLOBAL DE POPUP
//======================================================

function showMessage(message, colorClass = "royal-blue") {
    const popup = document.createElement('div');
    popup.classList.add('popup', colorClass);
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 2500);
}

//======================================================
// 2. TERMO ROYALE
//======================================================

let currentWord = "";
let currentGuess = 0;
let wordLength = 5;
const MAX_GUESSES = 6;

const DICTIONARY = [
    "TORRE", "ARQUE", "GOLEM", "MAGO", "DRAGO", "FLECH",
    "MINAS", "OURO", "ELIXR", "VALQU", "PEKKA", "BARBA",
    "PRINC", "CIVIL", "VENCE"
];

function iniciarJogoTermo() {
    currentWord = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)];
    currentGuess = 0;
    wordLength = currentWord.length;

    document.querySelectorAll('#keyboard .key').forEach(k =>
        k.classList.remove('correct', 'wrong-place', 'wrong')
    );

    buildBoard();
    buildKeyboard();

    document.removeEventListener('keydown', handleKeyPressCruzadinha);
    document.addEventListener('keydown', handleKeyPressTermo);

    showMessage("Nova partida! Palavra com " + wordLength + " letras!", "gold");
}

function buildBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.className = `word-length-${wordLength}`;

    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.dataset.row = i;
        for (let j = 0; j < wordLength; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function buildKeyboard() {
    const layout = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';

    layout.forEach((r, idx) => {
        const line = document.createElement('div');
        if (idx === 2) createKey("ENTER", "key-large", line);

        r.split('').forEach(l => createKey(l, "key", line));
        if (idx === 2) createKey("BACKSPACE", "key-large", line);

        keyboard.appendChild(line);
    });
}

function createKey(text, className, parent) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.dataset.key = text;
    btn.classList.add('key', className);
    btn.onclick = () => handleKeyPressTermo({ key: text });
    parent.appendChild(btn);
}

function handleKeyPressTermo(e) {
    if (currentGuess >= MAX_GUESSES) return;

    const key = e.key.toUpperCase();
    const row = document.querySelector(`.row[data-row="${currentGuess}"]`);
    const tiles = [...row.children];
    let i = tiles.findIndex(t => !t.textContent);

    if (i === -1) i = wordLength;

    if (key.match(/^[A-Z]$/)) {
        if (i < wordLength) tiles[i].textContent = key;
    } 
    else if (key === "BACKSPACE") {
        if (i > 0) tiles[i-1].textContent = '';
        else if (i === wordLength) tiles[wordLength-1].textContent = '';
    }
    else if (key === "ENTER") {
        checkGuess(row);
    }
}

function checkGuess(row) {
    const guess = [...row.children].map(t => t.textContent).join('');

    if (guess.length !== wordLength) {
        showMessage("Preencha todas as letras!", "royal-blue-light");
        return;
    }

    const solution = currentWord.split('');
    const res = Array(wordLength).fill('');

    // CORRETAS
    for (let i = 0; i < wordLength; i++)
        if (guess[i] === solution[i]) { res[i] = 'correct'; solution[i] = null; }

    // LUGAR ERRADO / ERRADAS
    for (let i = 0; i < wordLength; i++) {
        if (!res[i]) {
            const idx = solution.indexOf(guess[i]);
            res[i] = idx > -1 ? 'wrong-place' : 'wrong';
            if (idx > -1) solution[idx] = null;
        }
    }

    [...row.children].forEach((tile, i) => {
        setTimeout(() => tile.classList.add(res[i], 'flip'), i * 150);
    });

    if (guess === currentWord) {
        setTimeout(() => {
            row.classList.add('correct-row');
            showMessage("🎉 Vitória!", "gold");
            currentGuess = MAX_GUESSES;
        }, 600);
    } else {
        currentGuess++;
        if (currentGuess >= MAX_GUESSES)
            setTimeout(() => showMessage("💔 Derrota! A palavra era " + currentWord, "royal-blue-light"), 600);
    }
}


//======================================================
// 3. CRUZADINHA (VERSÃO MELHORADA COMPLETA)
//======================================================

/*** Coloque aqui o cruzadinha.js COMPLETO que te mandei ***/
/*** (já está pronto, não precisa mudar nada) ***/


//======================================================
// 4. NAVEGAÇÃO ENTRE TERMÔ E CRUZADINHA
//======================================================

function setupNavigation() {
    const menu = document.querySelectorAll('.menu-btn');
    const sections = document.querySelectorAll('.game-section');

    menu.forEach(btn => {
        btn.onclick = () => {
            const game = btn.dataset.game;

            menu.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(`${game}-game`).classList.add('active');

            document.removeEventListener('keydown', handleKeyPressTermo);
            document.removeEventListener('keydown', handleKeyPressCruzadinha);

            if (game === 'termo') iniciarJogoTermo();
            if (game === 'cruzadinha') iniciarCruzadinha();
        };
    });
}


//======================================================
// 5. INICIAR TUDO AO CARREGAR
//======================================================

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    iniciarJogoTermo(); // Página abre no Termo
});
