
const palavras = [
    {
        resposta: "MICROCONTROLADOR",
        linha: 0,
        coluna: 1,
        direcao: "vertical",
        pista: "Chip que reúne processamento, memória e interfaces para controlar dispositivos e sistemas."
    },
    {
        resposta: "FLASH",
        linha: 1,
        coluna: 8,
        direcao: "vertical",
        pista: "Tipo de memória não volátil que permite apagar e regravar informações."
    },
    {
        resposta: "UC",
        linha: 2,
        coluna: 0,
        direcao: "horizontal",
        pista: "Unidade que interpreta instruções e coordena o funcionamento dos demais componentes."
    },
    {
        resposta: "REGISTRADORES",
        linha: 3,
        coluna: 1,
        direcao: "horizontal",
        pista: "Pequenas áreas de armazenamento interno utilizadas pelo processador durante a execução."
    },
    {
        resposta: "EEPROM",
        linha: 3,
        coluna: 2,
        direcao: "vertical",
        pista: "Memória que permite alterar informações armazenadas eletricamente e preservá-las após desligamento."
    },
    {
        resposta: "ROM",
        linha: 3,
        coluna: 7,
        direcao: "vertical",
        pista: "Memória não volátil utilizada tradicionalmente para armazenar instruções permanentes."
    },
    {
        resposta: "DATABUS",
        linha: 3,
        coluna: 9,
        direcao: "vertical",
        pista: "Conjunto de linhas responsáveis pelo transporte de dados e instruções entre componentes."
    },
    {
        resposta: "CPU",
        linha: 5,
        coluna: 1,
        direcao: "horizontal",
        pista: "Componente responsável por interpretar e executar instruções dos programas."
    },
    {
        resposta: "DMA",
        linha: 8,
        coluna: 3,
        direcao: "vertical",
        pista: "Mecanismo que permite transferir dados entre dispositivos e memória sem participação constante do processador."
    },
    {
        resposta: "RAM",
        linha: 9,
        coluna: 1,
        direcao: "horizontal",
        pista: "Memória temporária utilizada durante o funcionamento dos programas, que perde seus dados sem energia."
    },
    {
        resposta: "ULA",
        linha: 11,
        coluna: 0,
        direcao: "horizontal",
        pista: "Parte do processador responsável pelas operações matemáticas e comparações lógicas."
    },
    {
        resposta: "CACHE",
        linha: 12,
        coluna: 0,
        direcao: "horizontal",
        pista: "Memória rápida que mantém cópias de informações recentemente utilizadas para agilizar acessos."
    }
];

const board = document.getElementById("board");
const pistasHorizontais = document.getElementById("across-clues");
const pistasVerticais = document.getElementById("down-clues");
const score = document.getElementById("score");
const message = document.getElementById("message");

const casas = new Map();
const numeros = new Map();

function obterCoordenadas(palavra) {
    const coordenadas = [];

    for (let i = 0; i < palavra.resposta.length; i++) {
        let linha = palavra.linha;
        let coluna = palavra.coluna;

        if (palavra.direcao === "horizontal") {
            coluna += i;
        } else {
            linha += i;
        }

        coordenadas.push({ linha, coluna });
    }

    return coordenadas;
}

function prepararTabuleiro() {
    palavras.forEach((palavra, indice) => {
        const coordenadas = obterCoordenadas(palavra);

        coordenadas.forEach((coordenada, i) => {
            const chave = `${coordenada.linha}-${coordenada.coluna}`;

            if (!casas.has(chave)) {
                casas.set(chave, {
                    letra: palavra.resposta[i],
                    palavras: []
                });
            }

            casas.get(chave).palavras.push(indice);
        });
    });

    const inicios = palavras.map((palavra, indice) => ({
        linha: palavra.linha,
        coluna: palavra.coluna,
        indice: indice
    }));

    inicios.sort((a, b) => {
        if (a.linha !== b.linha) {
            return a.linha - b.linha;
        }

        return a.coluna - b.coluna;
    });

    inicios.forEach((inicio, indice) => {
        const chave = `${inicio.linha}-${inicio.coluna}`;
        numeros.set(chave, indice + 1);
        palavras[inicio.indice].numero = indice + 1;
    });
}

function montarTabuleiro() {
    board.innerHTML = "";

    for (let linha = 0; linha < 16; linha++) {
        for (let coluna = 0; coluna < 14; coluna++) {
            const chave = `${linha}-${coluna}`;
            const celula = document.createElement("div");

            celula.classList.add("cell");

            if (casas.has(chave)) {
                const input = document.createElement("input");

                input.type = "text";
                input.maxLength = 1;
                input.autocomplete = "off";
                input.dataset.row = linha;
                input.dataset.col = coluna;

                input.addEventListener("input", tratarEntrada);

                celula.appendChild(input);

                if (numeros.has(chave)) {
                    const numero = document.createElement("span");

                    numero.classList.add("cell-number");
                    numero.textContent = numeros.get(chave);

                    celula.appendChild(numero);
                }
            } else {
                celula.classList.add("blocked");
            }

            board.appendChild(celula);
        }
    }
}

function montarPistas() {
    pistasHorizontais.innerHTML = "";
    pistasVerticais.innerHTML = "";

    palavras.forEach(palavra => {
        const item = document.createElement("li");

        item.textContent = palavra.pista;

        const numero = document.createElement("strong");
        numero.textContent = `${palavra.numero}. `;

        item.prepend(numero);

        if (palavra.direcao === "horizontal") {
            pistasHorizontais.appendChild(item);
        } else {
            pistasVerticais.appendChild(item);
        }
    });
}

function tratarEntrada(evento) {
    const input = evento.target;

    input.value = input.value
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 1);

    if (input.value !== "") {
        const linha = Number(input.dataset.row);
        const coluna = Number(input.dataset.col);

        const proximaCasa = document.querySelector(
            `input[data-row="${linha}"][data-col="${coluna + 1}"]`
        );

        if (proximaCasa) {
            proximaCasa.focus();
        }
    }
}

function conferir() {
    let acertos = 0;

    const resultados = new Map();

    palavras.forEach((palavra, indice) => {
        const coordenadas = obterCoordenadas(palavra);
        let respostaCorreta = true;

        coordenadas.forEach((coordenada, i) => {
            const input = document.querySelector(
                `input[data-row="${coordenada.linha}"][data-col="${coordenada.coluna}"]`
            );

            if (!input || input.value !== palavra.resposta[i]) {
                respostaCorreta = false;
            }
        });

        resultados.set(indice, respostaCorreta);

        if (respostaCorreta) {
            acertos++;
        }
    });

    const resultadoCasas = new Map();

    palavras.forEach((palavra, indice) => {
        const coordenadas = obterCoordenadas(palavra);

        coordenadas.forEach(coordenada => {
            const chave = `${coordenada.linha}-${coordenada.coluna}`;

            if (!resultadoCasas.has(chave)) {
                resultadoCasas.set(chave, true);
            }

            if (!resultados.get(indice)) {
                resultadoCasas.set(chave, false);
            }
        });
    });

    resultadoCasas.forEach((correta, chave) => {
        const [linha, coluna] = chave.split("-");

        const input = document.querySelector(
            `input[data-row="${linha}"][data-col="${coluna}"]`
        );

        if (input) {
            input.classList.remove("correct", "wrong");
            input.classList.add(correta ? "correct" : "wrong");
        }
    });

    score.textContent = `${acertos} de 12 palavras`;

    if (acertos === 12) {
        message.textContent = "Parabéns! Você completou a cruzadinha!";
        message.style.color = "#16803c";
    } else {
        message.textContent = "Continue tentando! Confira as casas em vermelho.";
        message.style.color = "#c0392b";
    }
}

function reiniciar() {
    const inputs = document.querySelectorAll(".cell input");

    inputs.forEach(input => {
        input.value = "";
        input.classList.remove("correct", "wrong");
    });

    score.textContent = "0 de 12 palavras";
    message.textContent = "";
}

document.getElementById("check-btn").addEventListener("click", conferir);
document.getElementById("reset-btn").addEventListener("click", reiniciar);

prepararTabuleiro();
montarTabuleiro();
montarPistas();
