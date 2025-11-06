/**
 * 👑 CLASHTERMO ROYALE - TERMO.JS
 * Lógica FINAL e Corrigida para a Navegação, showMessage e Jogo Termo.
 */

// =================================================================
// 1. VARIÁVEIS DO JOGO E DICIONÁRIO
// =================================================================

let currentWord = "";
let currentGuess = 0;
let wordLength = 5;
const MAX_GUESSES = 6;
const DICTIONARY = [
    "TORRE", "ARQUE", "GOLEM", "MAGO", "DRAGO", "FLECH", "MINAS", "OURO", "ELIXR", 
    "VALQU", "PEKKA", "BARBA", "PRINC", "CIVIL", "VENCE"
];

// =================================================================
// 2. FUNÇÃO GLOBAL DE MENSAGENS
// =================================================================

function showMessage(message, colorClass = "royal-blue") {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    
    popup.classList.add(colorClass); 
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2500); 
}

// =================================================================
// 3. LÓGICA DE NAVEGAÇÃO (BOTÕES)
// =================================================================

function setupNavigation() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const gameSections = document.querySelectorAll('.game-section');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedGame = button.dataset.game; 

            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            gameSections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(`${selectedGame}-game`); 
            if (targetSection) {
                targetSection.classList.add('active'); 
            }
            
            document.removeEventListener('keydown', handleKeyPressTermo);
            if (typeof handleKeyPressCruzadinha === 'function') {
                document.removeEventListener('keydown', handleKeyPressCruzadinha);
            }
            
            switch (selectedGame) {
                case 'termo':
                    iniciarJogoTermo(); 
                    break;
                case 'cruzadinha':
                    if (typeof iniciarCruzadinha === 'function') {
                        iniciarCruzadinha(); 
                    }
                    break;
                case 'memoria':
                    if (typeof iniciarJogoMemoria === 'function') {
                        iniciarJogoMemoria(); 
                    }
                    break;
            }
        });
    });
}

// =================================================================
// 4. LÓGICA DO JOGO TERMO ROYALE
// =================================================================

function iniciarJogoTermo() {
    console.log("Iniciando Jogo Termo...");
    currentWord = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]; 
    currentGuess = 0;
    wordLength = currentWord.length; 
    
    document.querySelectorAll('#keyboard .key').forEach(key => {
        key.classList.remove('correct', 'wrong-place', 'wrong');
    });

    buildBoard();
    buildKeyboard();
    
    document.addEventListener('keydown', handleKeyPressTermo);

    // ✅ Agora só avisa quantidade de letras, sem revelar a palavra
    showMessage("Nova partida! Palavra com " + wordLength + " letras!", "gold");
}

function buildBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; 
    board.classList.remove('word-length-5', 'word-length-6', 'word-length-7');
    board.classList.add('word-length-' + wordLength);

    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.dataset.row = i;
        for (let j = 0; j < wordLength; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.col = j;
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function buildKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    const layout = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];
    
    layout.forEach((row, rowIndex) => {
        const keyRow = document.createElement('div');
        keyRow.style.display = 'flex';
        keyRow.style.justifyContent = 'center';

        if (rowIndex === 1) { 
            const spacer = document.createElement('div');
            spacer.classList.add('key-spacer');
            keyRow.appendChild(spacer);
        }
        
        if (rowIndex === 2) { 
            createKey('ENTER', 'key-large', keyRow);
        }

        row.split('').forEach(letter => {
            createKey(letter, 'key', keyRow);
        });

        if (rowIndex === 2) { 
            createKey('BACKSPACE', 'key-large', keyRow);
        }

        keyboard.appendChild(keyRow);
    });
}

function createKey(text, className, container) {
    const key = document.createElement('button');
    key.classList.add('key', className);
    key.textContent = text;
    key.dataset.key = text;
    key.addEventListener('click', () => handleVirtualKeyPress(text));
    container.appendChild(key);
}

function handleVirtualKeyPress(key) {
    const event = {
        key: key,
        preventDefault: () => {}
    };
    handleKeyPressTermo(event);
}

function handleKeyPressTermo(event) {
    if (currentGuess >= MAX_GUESSES) return;

    const key = event.key.toUpperCase();
    const currentRow = document.querySelector(`.row[data-row="${currentGuess}"]`);
    if (!currentRow) return;

    const tiles = Array.from(currentRow.querySelectorAll('.tile'));
    let nextTileIndex = tiles.findIndex(t => t.textContent === '');
    if (nextTileIndex === -1) nextTileIndex = wordLength; 

    if (key.length === 1 && key.match(/[A-Z]/)) {
        if (nextTileIndex < wordLength) {
            event.preventDefault();
            let tileToFill = tiles[nextTileIndex];
            tileToFill.textContent = key;
            tileToFill.dataset.letter = key;
        }
    } 
    else if (key === 'BACKSPACE') {
        event.preventDefault(); 
        
        let tileToEraseIndex;
        
        if (nextTileIndex < wordLength) {
            tileToEraseIndex = nextTileIndex - 1;
        } else {
            tileToEraseIndex = wordLength - 1;
        }

        if (tileToEraseIndex >= 0) {
            let tileToErase = tiles[tileToEraseIndex];
            tileToErase.textContent = '';
            delete tileToErase.dataset.letter;
        }
    } 
    else if (key === 'ENTER') {
        event.preventDefault();
        checkGuess(currentRow);
    }
}

function checkGuess(rowElement) {
    const tiles = Array.from(rowElement.querySelectorAll('.tile'));
    const guess = tiles.map(t => t.textContent).join('');

    if (guess.length !== wordLength) {
        showMessage("A palavra deve ter " + wordLength + " letras!", "royal-blue-light");
        return;
    }

    if (currentGuess >= MAX_GUESSES) return;

    const solution = currentWord.split('');
    const guessArray = guess.split('');
    const results = Array(wordLength).fill(''); 
    const keyboardUpdates = {};

    for (let i = 0; i < wordLength; i++) {
        if (guessArray[i] === solution[i]) {
            results[i] = 'correct';
            solution[i] = null; 
        }
    }

    for (let i = 0; i < wordLength; i++) {
        if (results[i] === '') {
            const index = solution.indexOf(guessArray[i]);
            if (index !== -1) {
                results[i] = 'wrong-place';
                solution[index] = null; 
            } else {
                results[i] = 'wrong';
            }
        }
        
        const key = guessArray[i];
        if (keyboardUpdates[key] !== 'correct') { 
            if (results[i] === 'correct') {
                keyboardUpdates[key] = 'correct';
            } else if (results[i] === 'wrong-place' && keyboardUpdates[key] !== 'correct') {
                keyboardUpdates[key] = 'wrong-place';
            } else if (keyboardUpdates[key] === undefined) {
                keyboardUpdates[key] = 'wrong';
            }
        }
    }

    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add(results[index], 'flip');
        }, index * 150); 
    });

    Object.keys(keyboardUpdates).forEach(key => {
        const keyElement = document.querySelector(`.key[data-key="${key}"]`);
        if (keyElement) {
            keyElement.classList.remove('wrong', 'wrong-place', 'correct');
            keyElement.classList.add(keyboardUpdates[key]);
        }
    });

    if (guess === currentWord) {
        setTimeout(() => {
            rowElement.classList.add('correct-row');
            showMessage("🎉 Vitória Real!", "gold");
            currentGuess = MAX_GUESSES; 
        }, (wordLength * 150) + 300);
        return;
    }

    currentGuess++;
    if (currentGuess >= MAX_GUESSES) {
        setTimeout(() => {
            showMessage("💔 Derrota! A palavra era " + currentWord + ".", "royal-blue-light");
        }, (wordLength * 150) + 300);
        return;
    }
}

// =================================================================
// 5. INICIALIZAÇÃO
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    iniciarJogoTermo(); 
});
