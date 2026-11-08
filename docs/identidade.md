# Identidade visual: Ponto Vermelho

Estudo curto feito antes de qualquer linha de código. Tudo aqui é fictício: o palestrante, os clientes, as datas, os preços e as imagens.

## Nome e posicionamento

**Ponto Vermelho.** Palestras e vídeos de Bruno Vilela, um palestrante e videomaker fictício de Cuiabá. O nome vem da luz vermelha de "gravando" que acende na câmera (a luz de tally): o ponto que avisa que alguém está sendo ouvido e registrado.

Frase de posicionamento: **"Falo no palco. Filmo para quem não estava na sala."**

A ideia que guia tudo: uma pessoa que faz as duas coisas, a palestra ao vivo e o vídeo que sobra dela. O site fala de duração, de plateia, de diárias de gravação e de prazo, e nunca promete "transformar a sua vida".

## Por que esta cara e não a de palco com neon

O clichê do ramo é fundo preto, letreiro neon e claquete. Fiz o contrário: o site parece **a parede cinza de um estúdio de gravação** (painel acústico, claro e frio), com as peças do dia a dia da produção como elementos de interface:

- A **folha de pauta** (papel branco com margem azul-ciano) é a superfície do orçamento e do convite.
- A **régua de tempo** de editor de vídeo marca a abertura.
- A **cabeça de leitura vermelha** da linha do tempo é o marcador do visor.
- O **cabo de microfone** e a **luz de tally** estão na imagem do hero.

Dois tons escuros aparecem em blocos (o mural e o rodapé), em azul-ardósia, nunca em preto puro.

## Paleta

| Nome | Hex | Papel |
|---|---|---|
| Parede | `#DCE1E3` | Fundo da página. Cinza claro e frio, de parede de estúdio. Variação `#CBD2D5` atrás do convite. |
| Folha | `#FBFAF6` | Superfície: folha de orçamento, calendário, caixas de detalhes. Branco de papel de pauta. |
| Tinta | `#15222B` | Texto e títulos. Azul-petróleo quase preto, nunca preto puro. Apoio: `#475761` para legendas. |
| Cabo | `#1E2D36` | Blocos escuros (mural, visor, resumo do convite, faixa de demonstração, rodapé). Apoio: `#2B3E49` e prata `#A9B7BF`. |
| Ciano de timeline | `#0A8CA0` (`#6CD0DF` sobre escuro) | Apoio: barrinha acima dos títulos, margem da folha de pauta, clipes da linha do tempo, pré-reserva do visitante (em versão mais escura, `#076B7B`). |
| Tally | `#D81E27` | Destaque. A luz vermelha. |

Regra do tally: **o vermelho marca o que está "ao vivo" e aparece em um lugar por tela**: o botão principal da abertura, o total da folha de orçamento, o filtro ativo do mural, a cabeça de leitura do visor, o dia escolhido no calendário, o botão de ver o resumo do convite. Nunca em texto corrente nem em dois botões na mesma dobra. Os outros botões são contorno em Tinta ou preenchidos em Tinta. Mensagens de erro usam um vermelho mais escuro (`#A3121A`) e sempre vêm com texto.

Contrastes verificados (WCAG 2): Tinta sobre Parede 12,3:1; Tinta apoio (`#475761`) sobre Parede 5,7:1 e sobre Folha 7,2:1; Tinta sobre Folha 15,5:1; texto claro sobre Cabo 11,9:1; prata sobre Cabo 6,9:1; ciano claro sobre Cabo 7,9:1; branco sobre Tally 5,1:1. O ciano `#0A8CA0` só aparece como forma; o dia pré-reservado usa uma versão mais escura (`#076B7B`) para o número branco passar de 4,5:1.

## Tipografia

Duas famílias, ambas locais em `fonts/` (licença SIL OFL, texto da licença ao lado de cada uma).

- **Bricolage Grotesque** (variável, peso 200 a 800): títulos, botões e texto corrente. Grotesca com um pouco de personalidade nos fechamentos das letras, feita para texto e cartaz. Em peso 800 e entrelinha apertada o título lembra uma legenda de vídeo de TV bem desenhada.
- **Courier Prime** (400 e 700): tempos, rótulos, legendas, itens da folha de orçamento e avisos. É a fonte do roteiro: o formato clássico de pauta e de roteiro de cinema usa o espaçamento fixo da máquina de escrever. Aqui ela aparece pequena, como anotação na margem.

Escala tipográfica (fluida, com `clamp`):

| Papel | Família | Tamanho | Entrelinha | Peso |
|---|---|---|---|---|
| Título da página (h1) | Bricolage | 2,5rem a 5,25rem | 0,98 | 800 |
| Segunda frase do h1 | Bricolage | 0,62 do h1 | 1,08 | 400 |
| Título de seção (h2) | Bricolage | 2rem a 3,375rem | 1,02 | 800 |
| Subtítulo (h3) e título de cartão | Bricolage | 1,375rem a 1,5rem | 1,2 | 700 |
| Número grande (total) | Bricolage | 2,5rem a 3,75rem | 1 | 800 |
| Corpo | Bricolage | 1,0625rem (17px) | 1,6 | 400 |
| Interface (botões, rótulos de campo) | Bricolage | 0,9375rem | 1,2 | 600 |
| Legenda e tempo | Courier Prime | 0,8125rem a 0,9375rem | 1,4 | 400 |

Regra de peso: títulos em 700 ou 800; texto corrente sempre em 400; Courier só em 400 (700 fica carregado para destaques futuros). A segunda frase do título principal vai em 400 de propósito: a frase de impacto é pesada, a explicação é leve. Letras maiúsculas só em siglas; nenhum rótulo em caixa alta sobre título.

## Layout

- Largura máxima de 1200px, margens laterais de 20px no celular e 40px no computador.
- Ritmo em múltiplos de 8px. Seções com respiro vertical de 96px no celular e 128px no computador.
- Texto sempre alinhado à esquerda. Nada centralizado, exceto o nome do mês no calendário.
- Cantos de 3px nas caixas (papel e câmera têm quina); só os filtros do mural são pílulas, como botões de editor.
- Sem linhas divisórias entre seções: a troca de assunto é feita pela cor do fundo (parede, ardósia, parede) e pelo respiro.
- Orçamento e convite usam a **folha de pauta**: papel com uma linha vertical ciano à esquerda, recuo de 52px (celular) ou 72px (computador) antes do texto e linhas tracejadas entre os itens. O mural usa fundo ardósia e grade de 3 colunas (2 no tablet, 1 no celular).

## Imagem

- **Imagem do hero**: foto em contêiner 3:2 (ver seção abaixo). Enquanto a foto não chega, `img/hero.webp` é uma composição gerada com Pillow: parede cinza com painel acústico, um microfone, o cabo ondulando, a luz de tally acesa com halo e, na base, uma linha do tempo de vídeo com blocos em tons de ciano. Sem texto.
- **Pôsteres do mural**: 8 composições abstratas em 16:9 geradas com Pillow (`tools/gerar-imagens.py`), uma família visual por tipo: palestra (cone de luz sobre o púlpito), institucional (quadro de vídeo com linha do tempo), evento (pontos de luz e arcos de plateia), depoimento (quadro com guias dos terços) e aula (slides empilhados com barra de progresso). Todas com grão fino e um ponto vermelho de tally.
- **Ícones**: o sinal da marca é um microfone de estúdio em SVG inline. O favicon é o mesmo microfone com o ponto vermelho.
- **Grão**: aplicado dentro das imagens, não no fundo da página.

## Movimento

Um único momento orquestrado: na abertura, os quatro blocos de texto entram em sequência (subida de 12px com fade, 80ms entre um e outro) e a moldura da imagem se revela de cima para baixo (clip-path, 900ms). Fora disso, só respostas a ações: troca de cor dos botões e filtros em 150ms, o visor abre com fade de 200ms e a cabeça de leitura vermelha anda quando o visitante aperta Reproduzir. Com `prefers-reduced-motion: reduce` a abertura fica parada, as transições são desligadas e o visor avança em passos de um segundo em vez de deslizar.

## Foto do hero

Proporção esperada: **3:2** (1600x1067px ou maior, na horizontal). Cantos retos (3px). A imagem será cortada ao centro pelo `object-fit: cover`, então o assunto deve ficar no meio e nada importante nas bordas.

Prompt para gerar no Canva (em português):

> Fotografia editorial de estúdio de gravação, estilo site premium de palestrante e videomaker. Um microfone de estúdio profissional de condensador em um pedestal, em primeiro plano, e ao fundo uma câmera de cinema pequena em um tripé com a luz vermelha de "gravando" acesa. Um cabo de microfone preto ondulando sobre o chão cinza claro. Parede de painel acústico em cinza azulado claro (cor #DCE1E3), liso, com leve degradê e luz suave vinda da esquerda. Um pequeno brilho vermelho (cor #D81E27) apenas na luz da câmera. Profundidade de campo rasa, foco no microfone, fundo desfocado. Cores dessaturadas, grão fino, aspecto de revista. Sem texto, sem pessoas, sem logotipos legíveis. Proporção 3:2, horizontal.

Alternativa, se o microfone sair com cara de banco de imagens: um teleprompter e uma cadeira vazia em um estúdio cinza claro, com a luz vermelha de "gravando" ao fundo e o mesmo fundo #DCE1E3.
