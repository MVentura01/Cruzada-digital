# GRID_PLAN — Plano do Tabuleiro

Este documento descreve o planejamento detalhado do tabuleiro para o jogo "Cruzada Digital".

Objetivos do plano
- Definir a grade com posições e orientações das 12 palavras fornecidas.
- Garantir que todas as palavras se cruzem ao menos uma vez, e que todos os cruzamentos sejam em letras idênticas.
- Fornecer a numeração das pistas conforme a lista (1..12) e validar que as posições iniciais são válidas.

Resumo da estratégia
- Palavra vertical central (coluna 12): MICROCONTROLADOR (16 letras). Ela funciona como "espinha dorsal" para maximizar cruzamentos.
- Palavras restantes são posicionadas principalmente na orientação horizontal e cruzam a palavra vertical e/ou entre si.
- Grade proposta: 16 linhas × 25 colunas (linhas 0..15, colunas 0..24).

Legenda
- Letras maiúsculas: células ocupadas com letras (solução).
- "." (ponto): célula bloqueada / não usada.
- Coordenadas indicadas no documento usam index 0-based para referência interna; para documentação ao usuário/painel mostrarei 1-based quando necessário.

Matriz da grade (linhas 0..15, cada linha tem 25 colunas)
Para leitura rápida, cada linha abaixo mostra 25 caracteres; pontos = células bloqueadas.

Row  0: ............M..............
Row  1: ............I.....F........
Row  2: ........U C...C.....L.......
Row  3: ............R E G I S T R A D O R E S
Row  4: ............O E....O S A.....
Row  5: ............C P U..M H T.....
Row  6: ............O R......A.......
Row  7: ............N O......B.......
Row  8: ............T M D....U.......
Row  9: ............R A M....S.......
Row 10: ............O..A..........
Row 11: .....U L A....
Row 12: .....C A C H E....
Row 13: ............D..............
Row 14: ............O..............
Row 15: ............R..............

Observação: a visualização acima é compacta; no HTML/CSS a grade será renderizada usando células (inputs) e células bloqueadas estilizadas.

Lista completa de palavras e posições (0-based)

1 — CPU — Horizontal — start (5,12) — length 3
  - cells: (5,12) C, (5,13) P, (5,14) U

2 — ULA — Horizontal — start (11,11) — length 3
  - cells: (11,11) U, (11,12) L, (11,13) A

3 — UC — Horizontal — start (2,11) — length 2
  - cells: (2,11) U, (2,12) C

4 — REGISTRADORES — Horizontal — start (3,12) — length 13
  - cells: (3,12) R, (3,13) E, (3,14) G, (3,15) I, (3,16) S, (3,17) T, (3,18) R, (3,19) A, (3,20) D, (3,21) O, (3,22) R, (3,23) E, (3,24) S

5 — RAM — Horizontal — start (9,12) — length 3
  - cells: (9,12) R, (9,13) A, (9,14) M

6 — CACHE — Horizontal — start (12,11) — length 5
  - cells: (12,11) C, (12,12) A, (12,13) C, (12,14) H, (12,15) E

7 — DMA — Vertical — start (8,14) — length 3
  - cells: (8,14) D, (9,14) M, (10,14) A

8 — MICROCONTROLADOR — Vertical — start (0,12) — length 16
  - cells (0..15,12): (0,12) M, (1,12) I, (2,12) C, (3,12) R, (4,12) O, (5,12) C, (6,12) O, (7,12) N, (8,12) T, (9,12) R, (10,12) O, (11,12) L, (12,12) A, (13,12) D, (14,12) O, (15,12) R

9 — ROM — Vertical — start (3,18) — length 3
  - cells: (3,18) R, (4,18) O, (5,18) M

10 — EEPROM — Vertical — start (3,13) — length 6
  - cells: (3,13) E, (4,13) E, (5,13) P, (6,13) R, (7,13) O, (8,13) M

11 — FLASH — Vertical — start (1,19) — length 5
  - cells: (1,19) F, (2,19) L, (3,19) A, (4,19) S, (5,19) H

12 — DATABUS — Vertical — start (3,20) — length 7
  - cells: (3,20) D, (4,20) A, (5,20) T, (6,20) A, (7,20) B, (8,20) U, (9,20) S

Verificação de cruzamentos
- Cada cruzamento horizontal×vertical foi verificado para garantir a mesma letra em ambas as palavras.
- Exemplos de cruzamentos validados:
  - CPU (5,12:C) ↔ MICROCONTROLADOR (5,12:C)
  - UC (2,12:C) ↔ MICRO (2,12:C)
  - REGISTRADORES (3,13:E) ↔ EEPROM (3,13:E)
  - REGISTRADORES (3,18:R) ↔ ROM (3,18:R)
  - REGISTRADORES (3,19:A) ↔ FLASH (3,19:A)
  - REGISTRADORES (3,20:D) ↔ DATABUS (3,20:D)
  - RAM (9,14:M) ↔ DMA (9,14:M)
  - ULA (11,12:L) ↔ MICRO (11,12:L)
  - CACHE (12,12:A) ↔ MICRO (12,12:A)

- Resultado: todas as interseções usam a mesma letra; não existem sobreposições conflitantes.

Numeração e correspondência com as pistas
- A numeração proposta segue o mapeamento fornecido originalmente (1..12) e foi aplicada às palavras conforme a lista. Na implementação o número aparecerá na célula inicial de cada palavra.

Notas de implementação (observações para o desenvolvimento)
- Renderização do tabuleiro: usar CSS Grid para dispor 16×25 células. Cada célula usada será um input[type="text"] com maxlength=1; células bloqueadas serão divs estilizadas.
- Cada célula utilizada terá atributos data-row e data-col; células que são início de palavra terão também data-clue="<id>" para exibir numeração.
- As pistas horizontais (across) e verticais (down) devem corresponder exatamente aos números 1..12 e ao texto das pistas fornecidas.
- Verificação (CONFERIR): iterar sobre cada palavra definida, ler as células correspondentes, montar a string e comparar com a palavra alvo. Marcar a palavra correta ou incorreta (mudando classes nas células) — sem revelar letras.

Se desejar, posso também incluir uma versão desta tabela com coordenadas 1-based para colagem direta no README final.

---
Gerado como parte do Commit 2 (docs/plano do tabuleiro). Após sua aprovação deste plano, seguirei para Commit 3 (HTML estático do tabuleiro).
