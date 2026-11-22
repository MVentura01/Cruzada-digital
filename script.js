const palavras = [
    {
        palavra: "MICROCONTROLADOR",
        direcao: "vertical",
        linha: 0,
        coluna: 1,
        pista: "Chip que reúne processamento, memória e interfaces para controlar dispositivos e sistemas."
    },
    {
        palavra: "FLASH",
        direcao: "vertical",
        linha: 1,
        coluna: 8,
        pista: "Tipo de memória não volátil que permite apagar e regravar informações."
    },
    {
        palavra: "UC",
        direcao: "horizontal",
        linha: 2,
        coluna: 0,
        pista: "Unidade que interpreta instruções e coordena o funcionamento dos demais componentes."
    },
    {
        palavra: "REGISTRADORES",
        direcao: "horizontal",
        linha: 3,
        coluna: 1,
        pista: "Pequenas áreas de armazenamento interno utilizadas pelo processador durante a execução."
    },
    {
        palavra: "EEPROM",
        direcao: "vertical",
        linha: 3,
        coluna: 2,
        pista: "Memória que permite alterar informações armazenadas eletricamente e preservá-las após desligamento."
    },
    {
        palavra: "ROM",
        direcao: "vertical",
        linha: 3,
        coluna: 7,
        pista: "Memória que mantém seu conteúdo mesmo sem alimentação elétrica, utilizada tradicionalmente para armazenar instruções permanentes."
    },
    {
        palavra: "DATABUS",
        direcao: "vertical",
        linha: 3,
        coluna: 9,
        pista: "Conjunto de linhas responsáveis pelo transporte de dados e instruções entre componentes."
    },
    {
        palavra: "CPU",
        direcao: "horizontal",
        linha: 5,
        coluna: 1,
        pista: "Componente responsável por interpretar e executar instruções dos programas."
    },
    {
        palavra: "DMA",
        direcao: "vertical",
        linha: 8,
        coluna: 3,
        pista: "Mecanismo que permite transferir dados entre dispositivos e memória sem a participação constante do processador."
    },
    {
        palavra: "RAM",
        direcao: "horizontal",
        linha: 9,
        coluna: 1,
        pista: "Memória temporária utilizada durante o funcionamento dos programas, que perde seus dados sem energia."
    },
    {
        palavra: "ULA",
        direcao: "horizontal",
        linha: 11,
        coluna: 0,
        pista: "Parte do processador responsável pelas operações matemáticas e comparações lógicas."
    },
    {
        palavra: "CACHE",
        direcao: "horizontal",
        linha: 12,
        coluna: 0,
        pista: "Memória rápida que mantém cópias de informações recentemente utilizadas para agilizar acessos."
    }
];

const board = document.getElementById("board");
const acrossClues = document.getElementById("across-clues");
const downClues = document.getElementById("down-clues");
const score = document.getElementById("score");
const message = document.getElementById("message");

const linhas = 16;
const colunas = 14;
const deslocamentoColuna = 11;

const casas = new Map();
const posicoes = new Map();

function obterCoordenadas(palavra, indice) {
    let linha = palavra.linha;
    let coluna = palavra.coluna;

    if (palavra.direcao === "horizontal") {
        coluna += indice;
    } else {
        linha += indice;
    }

    return {
        linha: linha,
        coluna: coluna
    };
}

function prepararCasas() {
    palavras.forEach(palavra => {
        for (let i = 0; i < palavra.palavra.length; i++) {
            const coordenada = obterCoordenadas(palavra, i);
            const chave = `${coordenada.linha}-${coordenada.coluna}`;
            const letra = palavra.palavra[i];

            if (!casas.has(chave)) {
                casas.set(chave, letra);
            }

            if (!posicoes.has(chave)) {
                posicoes.set(chave, []);
            }

            posicoes.get(chave).push(palavra);
        }
    });
}

function numerarPalavras() {
    const inicios = [];

    palavras.forEach(palavra => {
        inicios.push({
            linha: palavra.linha,
            coluna: palavra.coluna,
            palavra: palavra
        });
    });

    inicios.sort((a, b) => {
        if (a.linha !== b.linha) {
            return a.linha - b.linha;
        }

        return a.coluna - b.coluna;
    });

    inicios.forEach((inicio, indice) => {
        inicio.palavra.numero = indice + 1;
    });
}

function montarTabuleiro() {
    prepararCasas();
    numerarPalavras();

    for (let linha = 0; linha < linhas; linha++) {
        for (let coluna = 0; coluna < colunas; coluna++) {
            const colunaOriginal = coluna + deslocamentoColuna;
            const chave = `${linha}-${colunaOriginal}`;

            const casa = document.createElement("div");
            casa.classList.add("cell");

            if (casas.has(chave)) {
                casa.classList.add("input-cell");

                const inicio = palavras.find(palavra =>
                    palavra.linha === linha &&
                    palavra.coluna === colunaOriginal
                );

                if (inicio) {
                    const numero = document.createElement("span");
                    numero.classList.add("cell-number");
                    numero.textContent = inicio.numero;
                    casa.appendChild(numero);
                }

                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1;
                input.autocomplete = "off";
                input.dataset.row = linha;
                input.dataset.col = colunaOriginal;
                input.setAttribute("aria-label", `Linha ${linha + 1}, coluna ${colunaOriginal + 1}`);

                input.addEventListener("input", tratarEntrada);

                casa.appendChild(input);
            } else {
                casa.classList.add("block");
            }

            board.appendChild(casa);
        }
    }

    montarPistas();
}

function montarPistas() {
    palavras.forEach(palavra => {
        const item = document.createElement("li");

        item.textContent = `${palavra.numero}. ${palavra.pista}`;

        if (palavra.direcao === "horizontal") {
            acrossClues.appendChild(item);
        } else {
            downClues.appendChild(item);
        }
    });
}

function tratarEntrada(evento) {
    const input = evento.target;

    input.value = input.value
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 1);

    input.parentElement.classList.remove("correct", "wrong");

    if (input.value !== "") {
        const atual = Number(input.dataset.row);
        const coluna = Number(input.dataset.col);

        const proximo = document.querySelector(
            `input[data-row="${atual}"][data-col="${coluna + 1}"]`
        );

        if (proximo) {
            proximo.focus();
        }
    }
}

function conferir() {
    let acertos = 0;

    document.querySelectorAll(".input-cell").forEach(casa => {
        casa.classList.remove("correct", "wrong");
    });

    palavras.forEach(palavra => {
        let resposta = "";

        for (let i = 0; i < palavra.palavra.length; i++) {
            const coordenada = obterCoordenadas(palavra, i);

            const input = document.querySelector(
                `input[data-row="${coordenada.linha}"][data-col="${coordenada.coluna}"]`
            );

            resposta += input ? input.value : "";
        }

        const correta = resposta === palavra.palavra;

        if (correta) {
            acertos++;
        }

        for (let i = 0; i < palavra.palavra.length; i++) {
            const coordenada = obterCoordenadas(palavra, i);

            const input = document.querySelector(
                `input[data-row="${coordenada.linha}"][data-col="${coordenada.coluna}"]`
            );

            if (input) {
                const casa = input.parentElement;

                if (!correta) {
                    casa.classList.remove("correct");
                    casa.classList.add("wrong");
                } else if (!casa.classList.contains("wrong")) {
                    casa.classList.add("correct");
                }
            }
        }
    });

    score.textContent = `${acertos} de ${palavras.length} palavras`;

    if (acertos === palavras.length) {
        message.textContent = "Parabéns! Você completou a cruzadinha!";
    } else {
        message.textContent = "Confira as palavras destacadas e tente novamente.";
    }
}

function reiniciar() {
    document.querySelectorAll("#board input").forEach(input => {
        input.value = "";
        input.parentElement.classList.remove("correct", "wrong");
    });

    score.textContent = `0 de ${palavras.length} palavras`;
    message.textContent = "";
}

document.getElementById("check-btn").addEventListener("click", conferir);
document.getElementById("reset-btn").addEventListener("click", reiniciar);

montarTabuleiro();