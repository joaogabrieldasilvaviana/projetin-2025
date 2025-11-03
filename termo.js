/**
 * 👑 CLASHTERMO ROYALE - TERMO.JS
 * Principal Script de Lógica e Navegação.
 * Contém a função de navegação, a lógica do Termo, e a função global showMessage.
 */

// =================================================================
// ESTRUTURA GLOBAL E NAVEGAÇÃO
// =================================================================

// Variáveis do Termo
let currentWord = "";
let currentGuess = 0;
let wordLength = 5;
const MAX_GUESSES = 6;
const DICTIONARY = [
    "TORRE", "ARQUE", "GOLEM", "MAGO", "DRAGO", "FLECH", "MINAS", "OURO", "ELIXR", 
    "VALQU", "PEKKA", "BARBA", "PRINC", "CIVIL", "VENCE"
];

// Funções de Inicialização (Definidas nos respectivos arquivos)
// Assegure-se de que os scripts sejam carregados na ordem correta no HTML: termo.js -> cruzadinha.js -> memoria.js

// Função para mostrar mensagens temporárias na tela
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

// Lógica de Navegação (A CHAVE PARA MUDAR DE JOGO)
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
            
            // 3. Mostra a seção de jogo correta
            // O ID DEVE CORRESPONDER EXATAMENTE ao 'data-game' + '-game' (ex: 'cruzadinha-game')
            const targetSection = document.getElementById(`${selectedGame}-game`); 
            
            if (targetSection) {
                targetSection.classList.add('active'); 
            } else {
                 console.error(`Seção HTML não encontrada: ${selectedGame}-game`);
            }
            
            // 4. Inicializa o jogo específico
            switch (selectedGame) {
                case 'termo':
                    iniciarJogoTermo(); 
                    break;
                case 'cruzadinha':
                    // Verifica se a função de inicialização da Cruzadinha existe
                    if (typeof iniciarCruzadinha === 'function') {
                        iniciarCruzadinha(); 
                    } else {
                         console.error("Função 'iniciarCruzadinha' não encontrada. Verifique o cruzadinha.js.");
                    }
                    break;
                case 'memoria':
                    // Verifica se a função de inicialização da Memória existe
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
// LÓGICA DO JOGO TERMO ROYALE
// =================================================================

function iniciarJogoTermo() {
    console.log("Iniciando Jogo Termo...");
    currentWord = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)];
    currentGuess = 0;
    wordLength = currentWord.length; 
    
    buildBoard();
    buildKeyboard();
    document.removeEventListener('keydown', handleKeyPressTermo);
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

        if (rowIndex === 1) { // Adiciona um espaçador na segunda linha
            const spacer = document.createElement('div');
            spacer.classList.add('key-spacer');
            keyRow.appendChild(spacer);
        }
        
        if (rowIndex === 2) { // Adiciona ENTER na terceira linha
            createKey('ENTER', 'key-large', keyRow);
        }

        row.split('').forEach(letter => {
            createKey(letter, 'key', keyRow);
        });

        if (rowIndex === 2) { // Adiciona BACKSPACE na terceira linha
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
    // Simula o evento do teclado físico
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

    let currentTile = currentRow.querySelector(`.tile:empty`) || currentRow.querySelector(`.tile[data-col="${wordLength - 1}"]`);
    let currentTileIndex = currentTile ? parseInt(currentTile.dataset.col) : -1;

    if (key.length === 1 && key.match(/[A-Z]/)) {
        if (currentTile.textContent === '' || currentTileIndex < wordLength - 1) {
            if (currentTile.textContent !== '') {
                // Move para a próxima célula vazia
                currentTile = currentRow.querySelector(`.tile[data-col="${currentTileIndex + 1}"]`);
            }
            if (currentTile) {
                currentTile.textContent = key;
                currentTile.dataset.letter = key;
            }
        }
    } else if (key === 'BACKSPACE') {
        event.preventDefault(); // Evita o scroll
        // Encontra a última célula preenchida para apagar
        let lastFilledTile = currentRow.querySelector(`.tile[data-letter]:last-of-type`);
        if (!lastFilledTile) {
            lastFilledTile = currentRow.querySelector(`.tile[data-col="0"][data-letter]`);
        }
        
        if (lastFilledTile) {
            lastFilledTile.textContent = '';
            delete lastFilledTile.dataset.letter;
        }
    } else if (key === 'ENTER') {
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
    const results = Array(wordLength).fill(''); // 'correct', 'wrong-place', 'wrong'
    const keyboardUpdates = {};

    // Primeira passada: Encontra 'correct' e marca usadas
    for (let i = 0; i < wordLength; i++) {
        if (guessArray[i] === solution[i]) {
            results[i] = 'correct';
            solution[i] = null; // Marca como usada
        }
    }

    // Segunda passada: Encontra 'wrong-place' e 'wrong'
    for (let i = 0; i < wordLength; i++) {
        if (results[i] === '') {
            const index = solution.indexOf(guessArray[i]);
            if (index !== -1) {
                results[i] = 'wrong-place';
                solution[index] = null; // Marca como usada
            } else {
                results[i] = 'wrong';
            }
        }
        
        // Atualiza o estado do teclado
        const key = guessArray[i];
        if (keyboardUpdates[key] !== 'correct') { // 'correct' tem prioridade
            if (results[i] === 'correct') {
                keyboardUpdates[key] = 'correct';
            } else if (results[i] === 'wrong-place' && keyboardUpdates[key] !== 'correct') {
                keyboardUpdates[key] = 'wrong-place';
            } else if (keyboardUpdates[key] === undefined) {
                keyboardUpdates[key] = 'wrong';
            }
        }
    }

    // Aplica classes visuais
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add(results[index], 'flip');
        }, index * 150); // Adiciona um pequeno delay de animação
    });

    // Atualiza o teclado visualmente
    Object.keys(keyboardUpdates).forEach(key => {
        const keyElement = document.querySelector(`.key[data-key="${key}"]`);
        if (keyElement) {
            keyElement.classList.remove('wrong', 'wrong-place', 'correct');
            keyElement.classList.add(keyboardUpdates[key]);
        }
    });

    // Verifica o resultado do jogo
    if (guess === currentWord) {
        setTimeout(() => {
            rowElement.classList.add('correct-row');
            showMessage("🎉 Vitória Real! A palavra era " + currentWord + "!", "gold");
            currentGuess = MAX_GUESSES; // Trava o jogo
            // Aqui você pode chamar a função para somar pontuação
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

// Inicializa a Navegação e o primeiro Jogo
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    // Inicia o Termo por padrão
    iniciarJogoTermo(); 
});
