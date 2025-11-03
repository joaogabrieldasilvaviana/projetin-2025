/**
 * ⚔️ CLASH TERMO ROYALE - SCRIPT FUNCIONAL (AZUL E DOURADO)
 * * Este script implementa a lógica central de um jogo Wordle/Termo
 * com suporte a palavras de 5, 6 e 7 letras.
 */

// =================================================================
// 1. CONFIGURAÇÃO E PALAVRAS
// =================================================================

const PALAVRAS = {
    5: ["TERMO", "NOBRE", "SAGAZ", "EXITO", "HONRA", "LANCE", "MAGIA", "FESTA"],
    6: ["COROA", "ESPADAS", "DRAGAO", "CAVALO", "FEITICO", "CLASSE", "REALIZ"],
    7: ["BATALHA", "IMPÉRIO", "CORAGEM", "VITORIA", "DEFESA", "CONQUISTA", "ARMADURA"]
};

const MAX_TENTATIVAS = 6;
const TILE_TRANSITION_DELAY = 300; // Tempo de delay para o flip animado (ms)

let palavraSecreta;
let palavraComprimento;
let linhaAtual = 0;
let colunaAtual = 0;
let jogoTerminado = false;

// =================================================================
// 2. INICIALIZAÇÃO DO JOGO
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    iniciarJogo();
    document.addEventListener('keydown', handleKeyPress);
    
    // Adicionar eventos ao teclado virtual
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            const letra = key.dataset.key;
            if (letra === 'ENTER') {
                checkGuess();
            } else if (letra === 'BACKSPACE') {
                deleteLetter();
            } else {
                addLetter(letra);
            }
        });
    });

    // Exibir o cabeçalho do jogo
    document.querySelector('header h1').textContent = "CLASH TERMO";
    document.querySelector('.subtitle').textContent = `Descubra a palavra de ${palavraComprimento} letras!`;
});

function iniciarJogo() {
    // Escolhe um comprimento aleatório (ex: 5, 6 ou 7) para esta sessão
    const comprimentos = Object.keys(PALAVRAS);
    palavraComprimento = parseInt(comprimentos[Math.floor(Math.random() * comprimentos.length)]);
    
    // Escolhe uma palavra aleatória desse comprimento
    const lista = PALAVRAS[palavraComprimento];
    palavraSecreta = lista[Math.floor(Math.random() * lista.length)];
    
    // 🚩 IMPORTANTE: Constrói o tabuleiro dinamicamente baseado no comprimento
    buildBoard();
}

function buildBoard() {
    const board = document.querySelector('.board');
    board.innerHTML = ''; // Limpa qualquer tabuleiro anterior

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


// =================================================================
// 3. ENTRADA DO USUÁRIO
// =================================================================

function getCurrentRow() {
    return document.querySelector(`.row[data-row="${linhaAtual}"]`);
}

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

function handleKeyPress(event) {
    if (jogoTerminado) return;
    
    const key = event.key.toUpperCase();
    
    if (key === 'ENTER') {
        checkGuess();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
        addLetter(key);
    }
}

// =================================================================
// 4. LÓGICA DE VERIFICAÇÃO
// =================================================================

function checkGuess() {
    if (colunaAtual !== palavraComprimento || jogoTerminado) {
        showMessage("🚫 Palavra incompleta!", "royal-blue");
        return;
    }

    const row = getCurrentRow();
    const tiles = Array.from(row.children);
    
    let palpite = tiles.map(tile => tile.textContent).join('');

    // **NOTA**: Em um jogo completo, você precisaria verificar
    // se o 'palpite' está em um dicionário válido.
    
    const resultado = checkWord(palpite, palavraSecreta);
    
    // Aplica o estilo de flip animado e cores
    animateTiles(tiles, resultado, palpite);
}

function checkWord(guess, secret) {
    const secretMap = {};
    const result = new Array(palavraComprimento).fill('wrong');

    // Mapeia letras da palavra secreta
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

// =================================================================
// 5. ANIMAÇÕES E INTERFACE
// =================================================================

function animateTiles(tiles, result, palpite) {
    let tilesCorrectCount = 0;
    
    tiles.forEach((tile, index) => {
        const className = result[index];
        const keyElement = document.querySelector(`.key[data-key="${palpite[index]}"]`);

        // Efeito de Flip: Adiciona classe temporária para a animação
        setTimeout(() => {
            tile.classList.add('flip');
            
            // Após o flip (metade da animação), aplica a cor
            setTimeout(() => {
                tile.classList.add(className);
                keyElement.classList.add(className);
                
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
    row.classList.add('correct-row'); // Chama a animação glowGreen do CSS
}

function handleLoss() {
    jogoTerminado = true;
    showMessage(`❌ DERROTA. A palavra era: ${palavraSecreta}`, "royal-blue-light");
}

function showMessage(message, colorClass) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    // Adiciona uma classe temporária para a cor (opcional, já que o CSS já tem estilo)
    // popup.style.backgroundColor = `var(--${colorClass})`; 
    popup.textContent = message;
    
    document.body.appendChild(popup);
    
    // Remove o popup após a animação de fadeOut (2s no CSS)
    setTimeout(() => {
        popup.remove();
    }, 2000);
}
