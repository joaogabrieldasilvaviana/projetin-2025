/* ===============================
   ⚔️ ClashTermo Royale Arcade - Estilo Azul e Dourado
   =============================== */

/* ===== FONTES E CORES (VARS) ===== */
:root {
  --royal-blue: #0040ff;
  --royal-blue-dark: #0a1c4b;
  --royal-blue-light: #1e4fff;
  --gold: #ffcc00;
  --gold-dark: #b38b00;
  --silver: #cfcfcf;
  --dark-bg: #0d0f1c;
  --tile-empty: #2b2f3b;
  --text-light: #f4f4f4;
  --green-glow: #4cff79; /* Correto / Acerto */
  --yellow-glow: #ffcc00; /* Posição Errada / Par */
  --transition: 0.25s ease;
  font-family: 'Rajdhani', sans-serif;
}

/* ===== RESET E BASE ===== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  /* Gradiente de fundo temático */
  background: radial-gradient(circle at top, #1a2c6f, #0b0e1d);
  color: var(--text-light);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
}

.game-container {
  width: 100%;
  max-width: 600px; /* Aumentado ligeiramente para acomodar grids maiores */
  padding: 1.5rem;
  text-align: center;
  /* Estilo de placa Royale */
  background: linear-gradient(180deg, #0f1a3a 0%, #0a0e1d 100%);
  border: 3px solid var(--gold);
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7), inset 0 0 15px #1a1f3d;
  position: relative;
}

/* ===== COROAS (Decoração) ===== */
.game-container::before,
.game-container::after {
  content: "👑";
  position: absolute;
  font-size: 2rem;
  color: var(--gold);
  top: -20px;
  text-shadow: 0 0 10px var(--gold-dark);
}
.game-container::before { left: 20px; }
.game-container::after { right: 20px; }

/* ===== CABEÇALHO E TÍTULOS ===== */
header h1 {
  color: var(--gold);
  text-shadow: 0 0 15px var(--gold-dark), 0 0 5px rgba(255, 255, 255, 0.25);
  font-size: 2.8rem;
  margin-bottom: 0.3rem;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--silver);
  text-shadow: 0 0 5px #000;
}

.section-title {
    color: var(--royal-blue-light);
    margin: 1rem 0;
    font-size: 2rem;
    text-shadow: 0 0 8px #000;
}

/* ===== NAVEGAÇÃO / MENU DE JOGOS ===== */
.royale-menu {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 1.5rem 0 2rem 0;
}

.menu-btn {
    background: linear-gradient(180deg, #1a2a60, #101633);
    border: 2px solid #2d3a6b;
    color: var(--silver);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: var(--transition);
    flex-grow: 1;
    max-width: 180px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.6), 0 3px 8px rgba(0, 0, 0, 0.4);
}

.menu-btn:hover {
    background: linear-gradient(180deg, var(--royal-blue), var(--royal-blue-dark));
    color: #fff;
    transform: translateY(-2px);
}

.menu-btn.active {
    /* Estilo do botão selecionado: Dourado e em destaque */
    background: linear-gradient(180deg, var(--gold), var(--gold-dark));
    color: var(--royal-blue-dark);
    border-color: var(--gold);
    box-shadow: 0 0 15px var(--gold-dark);
    transform: scale(1.03);
}

/* Esconder e Mostrar Seções */
.game-section {
    display: none;
    padding-top: 1rem;
}

.game-section.active {
    display: block;
}

/* =============================================
   1. TERMO ROYALE (SEÇÃO EXISTENTE)
   ============================================= */

.board {
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* Reduzido o gap ligeiramente */
  margin: 2rem auto;
  justify-content: center;
  align-items: center;
}

.row {
  display: grid;
  gap: 0.5rem;
  position: relative;
  transition: 0.3s;
  margin: 0 auto;
  width: 100%;
  justify-content: center;
}

/* Configuração de Largura do Grid */
.row.word-length-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); max-width: 355px; }
.row.word-length-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); max-width: 425px; }
.row.word-length-7 { grid-template-columns: repeat(7, minmax(0, 1fr)); max-width: 495px; }

.tile {
  width: 65px;
  height: 65px; 
  aspect-ratio: 1 / 1; 
  background: linear-gradient(180deg, #1a2a60, #101633);
  border: 2px solid #2d3a6b;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-light);
  transition: var(--transition);
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4);
}

/* Estados das Letras */
.tile.correct, .key.correct {
  background: linear-gradient(180deg, #38b14a, #1d722a);
  border-color: #49e65c;
  box-shadow: 0 0 15px rgba(73, 230, 92, 0.53);
}

.tile.wrong-place, .key.wrong-place {
  background: linear-gradient(180deg, #c9a00a, #7d6103);
  border-color: var(--gold);
  box-shadow: 0 0 15px rgba(255, 204, 0, 0.53);
}

.tile.wrong, .key.wrong {
  background: linear-gradient(180deg, #30344c, #1c1f30);
  border-color: #444;
  opacity: 0.6;
}

/* Animação de Flip */
.tile.flip {
    animation: flip 0.3s forwards;
}

@keyframes flip {
    0% { transform: rotateX(0deg); }
    50% { 
        transform: rotateX(90deg);
        color: transparent; 
        background-color: var(--tile-empty);
    }
    100% { 
        transform: rotateX(0deg); 
        color: var(--text-light);
    }
}

/* Animação de Linha Correta */
.correct-row {
  animation: glowGreen 1.5s ease forwards;
}

@keyframes glowGreen {
  0% { transform: scale(1); box-shadow: 0 0 0px var(--green-glow); }
  50% { transform: scale(1.03); box-shadow: 0 0 20px var(--green-glow); }
  100% { transform: scale(1); box-shadow: 0 0 25px var(--green-glow); }
}

/* Teclado (Base) */
.keyboard {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1rem;
}

.key {
  background: linear-gradient(180deg, #24337a, #0f1943);
  color: var(--text-light);
  border: 2px solid #3b4b9a;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.6), 0 3px 8px rgba(0, 0, 0, 0.4);
}

.key-large {
    padding: 0.6rem 1.2rem;
}
.key-spacer {
    width: 0.5rem;
}

/* ===== POPUP DE MENSAGEM (Sem Alteração) ===== */
.popup {
  position: fixed;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, var(--royal-blue), var(--royal-blue-light));
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5), 0 0 10px var(--gold-dark);
  border: 2px solid var(--gold);
  animation: fadeOut 2s forwards;
  z-index: 1000;
}

@keyframes fadeOut {
  0% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -20px); }
}

/* =============================================
   2. CRUZADINHA MESTRA (NOVOS ESTILOS)
   ============================================= */

.cruzadinha-info {
    color: var(--silver);
    margin-bottom: 1.5rem;
    font-size: 1rem;
}

.cruzadinha-grid-container {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
}

/* Estilo para a célula (Tile) da cruzadinha */
.cruzadinha-tile {
    width: 35px; /* Tamanho menor para caber um grid maior */
    height: 35px;
    border: 1px solid var(--royal-blue-dark);
    background-color: var(--tile-empty);
    color: var(--text-light);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    transition: background-color 0.1s;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
}

.cruzadinha-tile.blank {
    background-color: var(--dark-bg); /* Célula vazia (preta) */
    border: 1px solid var(--dark-bg);
    cursor: default;
}

.cruzadinha-tile.active-word {
    background-color: var(--royal-blue); /* Letras da palavra selecionada */
}

.cruzadinha-tile.selected {
    background-color: var(--gold); /* Célula atualmente selecionada para digitar */
    color: var(--royal-blue-dark);
}

.cruzadinha-tile-number {
    position: absolute;
    top: 1px;
    left: 1px;
    font-size: 0.6rem;
    font-weight: normal;
    color: var(--gold);
}

/* Dicas (Clues) */
.cruzadinha-clues {
    text-align: left;
    margin-top: 2rem;
    display: flex;
    justify-content: space-around;
    gap: 1.5rem;
}

.cruzadinha-clues h3 {
    color: var(--gold);
    border-bottom: 1px solid var(--gold-dark);
    padding-bottom: 0.3rem;
    margin-bottom: 0.8rem;
    font-size: 1.2rem;
}

.cruzadinha-clues ul {
    list-style: none;
    padding: 0;
}

.cruzadinha-clues li {
    margin-bottom: 0.5rem;
    color: var(--silver);
    font-size: 0.9rem;
    cursor: pointer;
    transition: color 0.2s;
}

.cruzadinha-clues li:hover {
    color: var(--gold);
}


/* =============================================
   3. MEMÓRIA DE BATALHA (NOVOS ESTILOS)
   ============================================= */

.memory-info {
    color: var(--silver);
    margin-bottom: 1.5rem;
    font-size: 1rem;
}

.memory-grid {
    display: grid;
    /* Grid 4x4 padrão para 8 pares (16 cartas) */
    grid-template-columns: repeat(4, 1fr); 
    gap: 10px;
    max-width: 450px;
    margin: 0 auto;
    padding: 10px;
    border: 2px dashed var(--royal-blue-dark);
    border-radius: 15px;
}

.memory-card {
    aspect-ratio: 1 / 1;
    perspective: 1000px; /* Para o efeito 3D flip */
    cursor: pointer;
    height: 100px; /* Tamanho padrão */
    max-height: 100px;
}

.memory-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    border-radius: 8px;
}

.memory-card.flipped .memory-card-inner {
    transform: rotateY(180deg);
}

.card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Oculta o verso durante o flip */
    backface-visibility: hidden;
    border-radius: 8px;
    border: 3px solid var(--gold);
}

.card-back {
    /* Verso: Estilo de Carta Clash Royale */
    background: linear-gradient(180deg, var(--royal-blue), var(--royal-blue-dark));
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: var(--gold);
    text-shadow: 0 0 10px var(--gold-dark);
}

.card-front {
    /* Frente: Onde vai a imagem da Carta (será JS ou CSS bg-image) */
    background-color: var(--text-light); /* Fundo claro para a imagem */
    transform: rotateY(180deg);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
.card-front img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.memory-card.matched .memory-card-inner {
    /* Efeito para cartas que já foram encontradas */
    opacity: 0.6;
    pointer-events: none; /* Não podem mais ser clicadas */
    box-shadow: 0 0 10px var(--yellow-glow);
}

/* Estatísticas */
.memory-stats {
    margin-top: 1.5rem;
    color: var(--silver);
    font-size: 1.1rem;
}

.memory-stats span {
    color: var(--gold);
    font-weight: bold;
}

#reset-memory-btn {
    margin-top: 10px;
}

/* ===== RESPONSIVIDADE GERAL ===== */

/* Telas menores que 480px */
@media (max-width: 480px) {
    /* Ajustes do Menu */
    .royale-menu {
        flex-direction: column;
        gap: 8px;
    }
    .menu-btn {
        max-width: 100%;
    }

    /* Ajustes do Termo (Mantidos do código anterior) */
    .tile { width: 50px; height: 50px; font-size: 1.5rem; }
    .row.word-length-5 { max-width: 270px; }
    .row.word-length-6 { max-width: 325px; }
    .row.word-length-7 { max-width: 380px; }

    /* Ajustes da Cruzadinha */
    .cruzadinha-tile {
        width: 30px; 
        height: 30px;
        font-size: 1rem;
    }
    .cruzadinha-clues {
        flex-direction: column; /* Dicas empilhadas */
        align-items: center;
    }

    /* Ajustes da Memória */
    .memory-grid {
        grid-template-columns: repeat(4, 1fr);
        max-width: 350px; 
    }
    .memory-card {
        height: 70px; /* Reduz o tamanho do card */
    }
    .card-back {
        font-size: 2rem;
    }
}
