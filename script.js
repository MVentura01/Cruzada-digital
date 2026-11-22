// Cruzada Digital - Commit 5a: modelo de palavras e bindings iniciais
// Este arquivo será completado no Commit 5b com a lógica de conferência e reinício.

const WORDS = [
  { id: 1, word: 'CPU', orientation: 'across', row: 5, col: 12 },
  { id: 2, word: 'ULA', orientation: 'across', row: 11, col: 11 },
  { id: 3, word: 'UC', orientation: 'across', row: 2, col: 11 },
  { id: 4, word: 'REGISTRADORES', orientation: 'across', row: 3, col: 12 },
  { id: 5, word: 'RAM', orientation: 'across', row: 9, col: 12 },
  { id: 6, word: 'CACHE', orientation: 'across', row: 12, col: 11 },
  { id: 7, word: 'DMA', orientation: 'down', row: 8, col: 14 },
  { id: 8, word: 'MICROCONTROLADOR', orientation: 'down', row: 0, col: 12 },
  { id: 9, word: 'ROM', orientation: 'down', row: 3, col: 18 },
  { id: 10, word: 'EEPROM', orientation: 'down', row: 3, col: 13 },
  { id: 11, word: 'FLASH', orientation: 'down', row: 1, col: 19 },
  { id: 12, word: 'DATABUS', orientation: 'down', row: 3, col: 20 }
];

// Helper: retorna o input correspondente a uma coordenada (row,col)
function getInputAt(row, col) {
  return document.querySelector(`input[data-row='${row}'][data-col='${col}']`);
}

// Retorna a lista de inputs (em ordem) que compõem a palavra
function getInputsForWord(def) {
  const inputs = [];
  const len = def.word.length;
  for (let i = 0; i < len; i++) {
    const r = def.orientation === 'across' ? def.row : def.row + i;
    const c = def.orientation === 'across' ? def.col + i : def.col;
    const inp = getInputAt(r, c);
    if (inp) inputs.push(inp);
  }
  return inputs;
}

// Força que o input aceite apenas uma letra maiúscula
function setupInputFiltering(input) {
  input.addEventListener('input', (e) => {
    let v = input.value || '';
    v = v.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.length > 1) v = v.slice(0, 1);
    input.value = v;
  });
  // Impede colar de strings maiores
  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (text.length) input.value = text[0];
  });
}

// Inicialização: liga os inputs e prepara o mapa de palavras
function initBoardBindings() {
  // setup inputs
  const allInputs = Array.from(document.querySelectorAll('#board input'));
  allInputs.forEach(inp => setupInputFiltering(inp));

  // expose a map of word -> inputs for debugging and later use
  const wordMap = new Map();
  WORDS.forEach(w => {
    wordMap.set(w.id, { def: w, inputs: getInputsForWord(w) });
  });

  // show initial status
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = `0 de ${WORDS.length} palavras`;

  // guarda no window para inspeção rápida durante desenvolvimento
  window.cruzada = { WORDS, wordMap };
}

document.addEventListener('DOMContentLoaded', () => {
  initBoardBindings();
});
