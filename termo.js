/**
 * ⚔️ TERMO ROYALE (Wordle-like) & NAVEGAÇÃO PRINCIPAL
 * Este arquivo gerencia:
 * 1. A lógica do Termo (adicionar letras, verificar palpite, cores).
 * 2. O dicionário de palavras.
 * 3. A navegação entre as seções de jogo.
 */

// =================================================================
// Dicionário de Palavras Temáticas (Clash Royale/Batalha)
// =================================================================
const PALAVRAS = {
    5: ["TERMO", "NOBRE", "TORRE", "FEITI", "LANCE", "MAGIA", "FESTA", "REINO", "VALOR", "COROA"],
    6: ["COROA", "ESPADAS", "DRAGAO", "CAVALO", "CLASSE", "REALIZ", "DEFESA", "GOBLIN", "FLECHA"],
    7: ["BATALHA", "IMPÉRIO", "CORAGEM", "VITORIA", "DEFESA", "CONQUISTA", "ARMADURA", "SOLDADO", "PRINCIPE"]
};

const MAX_TENTATIVAS = 6;
const TILE_TRANSITION_DELAY = 300; // Tempo de delay para o flip (ms)

let palavraSecreta;
let palavraComprimento;
let linhaAtual = 0;
let colunaAtual = 0;
let jogoTerminado = false;

// =================================================================
// I. NAVEGAÇÃO (Comum a todos os jogos)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Jogo do Termo na primeira carga
    iniciarJogoTermo(); 
    
    // 2. Configura a navegação
    setupNavigation();
});

function setupNavigation() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const gameSections = document.querySelectorAll('.game-section');
    const subtitle = document.getElementById('game-subtitle');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedGame = button.dataset.game;

            // Atualiza o estado visual dos botões
            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Esconde todas as seções e mostra a selecionada
            gameSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${selectedGame}-game`).classList.add('active');
            
            // Atualiza o subtítulo
            updateSubtitle(selectedGame);
            
            // Inicializa o jogo específico ao ser selecionado
            switch (selectedGame) {
                case 'termo':
                    // Re-inicia o Termo se necessário
                    if (jogoTerminado) iniciarJogoTermo();
                    break;
                case 'cruzadinha':
                    // Verifica se a função existe (está no 'cruzadinha.js')
                    if (typeof iniciarCruzadinha === 'function') iniciarCruzadinha();
                    break;
                case 'memoria':
                    // Verifica se a função existe (está no 'memoria.js')
                    if (typeof iniciarJogoMemoria === 'function') iniciarJogoMemoria();
                    break;
            }
        });
    });
}

function updateSubtitle(gameId) {
    const subtitle = document.getElementById('game-subtitle');
    switch (gameId) {
        case 'termo':
            subtitle.textContent = `Descubra a palavra de ${palavraComprimento} letras!`;
            break;
        case 'cruzadinha':
            subtitle.textContent = "Desafio de vocabulário temático Clash Royale.";
            break;
        case 'memoria':
            subtitle.textContent = "Teste sua memória com as cartas do Reino!";
            break;
        default:
            subtitle.textContent = "Selecione seu desafio na Arena!";
    }
}

// =================================================================
// II. LÓGICA DO TERMO ROYALE
// =================================================================

function iniciarJogoTermo() {
    // 1. Resetar variáveis
    linhaAtual = 0;
    colunaAtual = 0;
    jogoTerminado = false;

    // 2. Escolher palavra secreta e comprimento
    const comprimentos = Object.keys(PALAVRAS);
    palavraComprimento = parseInt(comprimentos[Math.floor(Math.random() * comprimentos.length)]);
    
    const lista = PALAVRAS[palavraComprimento];
    palavraSecreta = lista[Math.floor(Math.random() * lista.length)];
    
    // 3. Montar o tabuleiro (Board)
    buildBoard();
    
    // 4. Resetar teclado visual
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'wrong-place', 'wrong');
    });

    // 5. Configurar inputs (Físico e Virtual)
    document.removeEventListener('keydown', handleKeyPressTermo);
    document.addEventListener('keydown', handleKeyPressTermo);
    setupVirtualKeyboardTermo();
    
    // 6. Atualizar subtítulo
    updateSubtitle('termo');
    
    console.log(`Palavra Secreta (${palavraComprimento} letras): ${palavraSecreta}`);
}

function buildBoard() {
    const board = document.querySelector('#termo-game .board');
    board.innerHTML = ''; 

    for (let i = 0; i < MAX_TENTATIVAS; i++) {
        const row = document.createElement('div');
        row.classList.add('row', `word-length-${palavraComprimento}`);
        row.dataset.row = i;

        for (let j = 0; j < palavraComprimento; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.col = j;
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function getCurrentRow() {
    return document.querySelector(`.row[data-row="${linhaAtual}"]`);
}

// Funções de Input (addLetter, deleteLetter, checkGuess, handleKeyPressTermo)
// ... (Copie e cole as funções de input e verificação do script anterior aqui) ...
function addLetter(letra) {
    if (colunaAtual < palavraComprimento && !jogoTerminado) {
        const tile = getCurrentRow().children[colunaAtual];
        tile.textContent = letra;
        colunaAtual++;
    }
}

function deleteLetter() {
    if (colunaAtual > 0 && !jogoTerminado) {
        colunaAtual--;
        const tile = getCurrentRow().children[colunaAtual];
        tile.textContent = '';
    }
}

function handleKeyPressTermo(event) {
    if (jogoTerminado) return;
    
    const key = event.key.toUpperCase();
    
    if (key === 'ENTER') {
        checkGuess();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (key.length === 1 && key.match(/[A-Z]/)) { // Verifica se é uma letra
        addLetter(key);
    }
}

function setupVirtualKeyboardTermo() {
    document.querySelectorAll('.keyboard .key').forEach(key => {
        // Remove listeners antigos para evitar duplicação
        key.removeEventListener('click', keyListener);
        key.addEventListener('click', keyListener);
    });
}

const keyListener = function() {
    const letra = this.dataset.key;
    if (letra === 'ENTER') {
        checkGuess();
    } else if (letra === 'BACKSPACE') {
        deleteLetter();
    } else {
        addLetter(letra);
    }
};

function checkGuess() {
    if (colunaAtual !== palavraComprimento || jogoTerminado) {
        showMessage("🚫 Palavra incompleta!", "royal-blue");
        return;
    }

    const row = getCurrentRow();
    const tiles = Array.from(row.children);
    let palpite = tiles.map(tile => tile.textContent).join('');

    // **NOTA**: Em um jogo completo, você precisaria verificar
    // se o 'palpite' está em um dicionário válido. (Omitido para simplificação)
    
    const resultado = checkWord(palpite, palavraSecreta);
    animateTiles(tiles, resultado, palpite);
}

function checkWord(guess, secret) {
    // Lógica de verificação do Wordle
    const secretMap = {};
    const result = new Array(palavraComprimento).fill('wrong');

    for (const char of secret) {
        secretMap[char] = (secretMap[char] || 0) + 1;
    }

    // 1. Encontra Corretas (Verde)
    for (let i = 0; i < palavraComprimento; i++) {
        if (guess[i] === secret[i]) {
            result[i] = 'correct';
            secretMap[guess[i]]--;
        }
    }

    // 2. Encontra Posição Errada (Dourado)
    for (let i = 0; i < palavraComprimento; i++) {
        if (result[i] !== 'correct' && secretMap[guess[i]] > 0) {
            result[i] = 'wrong-place';
            secretMap[guess[i]]--;
        }
    }
    
    return result;
}

// Funções de Animação e Fim de Jogo (animateTiles, finalizeRow, handleWin, handleLoss, showMessage)
// ... (Copie e cole as funções de animação do script anterior aqui) ...
function animateTiles(tiles, result, palpite) {
    let tilesCorrectCount = 0;
    
    tiles.forEach((tile, index) => {
        const className = result[index];
        const keyElement = document.querySelector(`.key[data-key="${palpite[index]}"]`);

        // Efeito de Flip: Adiciona classe temporária para a animação
        setTimeout(() => {
            tile.classList.add('flip');
            
            // Aplica a cor na metade da animação
            setTimeout(() => {
                tile.classList.add(className);
                
                // Atualiza o teclado, mas apenas se a nova classe for 'melhor' que a existente
                if (!keyElement.classList.contains('correct')) {
                    if (className === 'correct' || 
                       (className === 'wrong-place' && !keyElement.classList.contains('wrong-place'))) {
                        keyElement.classList.remove('wrong-place', 'wrong');
                        keyElement.classList.add(className);
                    } else if (className === 'wrong' && !keyElement.classList.contains('wrong-place')) {
                        keyElement.classList.add(className);
                    }
                }
                
                if (className === 'correct') tilesCorrectCount++;
                
                // Final da animação da linha
                if (index === palavraComprimento - 1) {
                    finalizeRow(tilesCorrectCount, tiles[0].parentNode);
                }
            }, TILE_TRANSITION_DELAY / 2);

        }, index * TILE_TRANSITION_DELAY);
    });
}

function finalizeRow(correctCount, row) {
    if (correctCount === palavraComprimento) {
        handleWin(row);
    } else if (linhaAtual === MAX_TENTATIVAS - 1) {
        handleLoss();
    } else {
        // Move para a próxima linha
        linhaAtual++;
        colunaAtual = 0;
    }
}

function handleWin(row) {
    jogoTerminado = true;
    showMessage("🏆 VITÓRIA REAL! ", "gold");
    row.classList.add('correct-row');
}

function handleLoss() {
    jogoTerminado = true;
    showMessage(`❌ DERROTA. A palavra era: ${palavraSecreta}`, "royal-blue-light");
}

function showMessage(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    
    document.body.appendChild(popup);
    
    // Remove o popup após a animação de fadeOut (2s no CSS)
    setTimeout(() => {
        popup.remove();
    }, 2000);
}
