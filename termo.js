/**
 * 👑 CLASHTERMO ROYALE - TERMO.JS
 * Principal Script de Lógica e Navegação.
 * Contém a função de navegação, a lógica do Termo, e a função global showMessage.
 */

// =================================================================
// VARIÁVEIS DO JOGO E DICIONÁRIO
// =================================================================

let currentWord = "";
let currentGuess = 0;
let wordLength = 5;
const MAX_GUESSES = 6;
// Dicionário com 5 letras para simplificar a montagem inicial
const DICTIONARY = [
    "TORRE", "ARQUE", "GOLEM", "MAGO", "DRAGO", "FLECH", "MINAS", "OURO", "ELIXR", 
    "VALQU", "PEKKA", "BARBA", "PRINC", "CIVIL", "VENCE"
];

// =================================================================
// FUNÇÃO GLOBAL DE MENSAGENS (Usada por todos os jogos)
// =================================================================

function showMessage(message, colorClass = "royal-blue") {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    
    // Aplica a classe de cor para o CSS customizar
    popup.classList.add(colorClass); 
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2500); 
}

// =================================================================
// LÓGICA DE NAVEGAÇÃO (GARANTIA DO FUNCIONAMENTO DOS BOTÕES)
// =================================================================

function setupNavigation() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const gameSections = document.querySelectorAll('.game-section');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedGame = button.dataset.game; 

            // 1. Atualiza o estado visual dos botões
            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Esconde todas as seções de jogo
            gameSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // 3. Mostra a seção de jogo correta (Usando ID: data-game + '-game')
            const targetSection = document.getElementById(`${selectedGame}-game`); 
            
            if (targetSection) {
                targetSection.classList.add('active'); 
            } else {
                 console.error(`Seção HTML não encontrada: ${selectedGame}-game`);
            }
            
            // 4. Inicializa o jogo específico, garantindo a desativação de listeners anteriores
            
            // Limpa todos os listeners de teclado para evitar conflito entre Termo e Cruzadinha
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
                    } else {
                         console.error("Função 'iniciarCruzadinha' não encontrada. Verifique o cruzadinha.js.");
                    }
                    break;
                case 'memoria':
                    if (typeof iniciarJogoMemoria === 'function') {
                        iniciarJogoMemoria(); 
                    } else {
                         console.error("Função 'iniciarJogoMemoria' não encontrada. Verifique o memoria.js.");
                    }
                    break;
            }
        });
    });
}

// =================================================================
// LÓGICA DO JOGO TERMO ROYALE (O Foco Principal)
// =================================================================

function iniciarJogoTermo() {
    console.log("Iniciando Jogo Termo...");
    // Sorteia a palavra
    currentWord = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]; 
    currentGuess = 0;
    wordLength = currentWord.length; 
    
    buildBoard();
    buildKeyboard();
    
    // Adiciona o listener do Termo
    document.addEventListener('keydown', handleKeyPressTermo);
    
    showMessage("Nova partida! Palavra de " + wordLength + " letras.", "gold");
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
    // Simula o evento do teclado físico para consistência
    const event = {
        key: key,
        preventDefault: () => {}
    };
    handleKeyPressTermo(event);
}

function handleKeyPressTermo(event) {
    const key = event.key.toUpperCase();
    const currentRow = document.querySelector(`.row[data-row="${currentGuess}"]`);
    if (!currentRow) return;

    let tiles = Array.from(currentRow.querySelectorAll('.tile'));
    let nextTileIndex = tiles.findIndex(t => t.textContent === '');
    
    // Se a linha estiver cheia, define o índice para a última posição
    if (nextTileIndex === -1) nextTileIndex = wordLength;

    // Lógica para digitar uma letra
    if (key.length === 1 && key.match(/[A-Z]/)) {
        if (nextTileIndex < wordLength) {
            let tileToFill = tiles[nextTileIndex];
            tileToFill.textContent = key;
            tileToFill.dataset.letter = key;
        }
    } 
    // Lógica para BACKSPACE
    else if (key === 'BACKSPACE') {
        event.preventDefault(); 
        
        // Se a linha não está cheia, o tile a apagar é o anterior ao nextTileIndex
        let tileToEraseIndex = (nextTileIndex === wordLength) ? wordLength - 1 : nextTileIndex - 1;

        if (tileToEraseIndex >= 0) {
            let tileToErase = tiles[tileToEraseIndex];
            tileToErase.textContent = '';
            delete tileToErase.dataset.letter;
        }
    } 
    // Lógica para ENTER
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

    // 1. Passada: Correto (verde)
    for (let i = 0; i < wordLength; i++) {
        if (guessArray[i] === solution[i]) {
            results[i] = 'correct';
            solution[i] = null; 
        }
    }

    // 2. Passada: Lugar Errado (amarelo) e Incorreto (cinza)
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
        
        // Atualiza o estado do teclado (Verde tem prioridade, depois Amarelo, por fim Cinza)
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

    // Aplica classes visuais (com animação flip)
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add(results[index], 'flip');
        }, index * 150); 
    });

    // Atualiza o teclado visualmente
    Object.keys(keyboardUpdates).forEach(key => {
        const keyElement = document.querySelector(`.key[data-key="${key}"]`);
        if (keyElement) {
            // Remove classes existentes antes de adicionar a nova
            keyElement.classList.remove('wrong', 'wrong-place', 'correct');
            keyElement.classList.add(keyboardUpdates[key]);
        }
    });

    // Verifica o resultado final
    if (guess === currentWord) {
        setTimeout(() => {
            rowElement.classList.add('correct-row');
            showMessage("🎉 Vitória Real! A palavra era " + currentWord + "!", "gold");
            currentGuess = MAX_GUESSES; // Trava o jogo
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
// INICIALIZAÇÃO
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    // Inicia o Termo por padrão
    iniciarJogoTermo(); 
});
