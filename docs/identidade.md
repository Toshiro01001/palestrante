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
| Ciano de timeline | `#0A8CA0` (`#6CD0DF` sobre escuro) | Apoio: traço do sobretítulo das seções, margem da folha de pauta, clipes da linha do tempo, pré-reserva do visitante (em versão mais escura, `#076B7B`). |
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

Regra de peso: títulos em 700 ou 800; texto corrente sempre em 400; Courier em 400 (o 700 aparece só no número da etapa do convite). A segunda frase do título principal vai em 400 de propósito: a frase de impacto é pesada, a explicação é leve. Letras maiúsculas só em siglas, com uma exceção desde a leva final: os rótulos pequenos em Courier (sobretítulo das seções, tipo do trabalho no mural e etapas do convite) vão em caixa alta com espaçamento de 0,08em, como anotação de roteiro.

## Layout

- Largura máxima de 1200px, margens laterais de 20px no celular e 40px no computador.
- Ritmo em múltiplos de 8px. Seções com respiro vertical de 96px no celular e 128px no computador.
- Texto sempre alinhado à esquerda. Nada centralizado, exceto o nome do mês no calendário.
- Cantos de 3px nas caixas (papel e câmera têm quina). Pílulas só em peças de interface: botões, filtros do mural, selos sobre a foto e pílulas de status. A partir de 1200px a página inteira fica em um cartão de cantos de 2rem (ver "Design systems aplicados").
- Sem linhas divisórias entre seções: a troca de assunto é feita pela cor do fundo (parede, ardósia, parede) e pelo respiro.
- Orçamento e convite usam a **folha de pauta**: papel com uma linha vertical ciano à esquerda, recuo de 52px (celular) ou 72px (computador) antes do texto e linhas tracejadas entre os itens. O mural usa fundo ardósia e grade de 3 colunas (2 no tablet, 1 no celular).

## Imagem

- **Imagem do hero**: foto gerada por IA no Canva (`img/hero.webp`, 1620x1080), em contêiner 3:2 (ver seção abaixo).
- **Fotos da leva final**: seis fotos geradas por IA no Canva, ilustrativas, todas com o mesmo tratamento (tons dessaturados de azul-ardósia, grão fino, um ponto vermelho de tally): quatro pôsteres 16:9 do mural (palestra, institucional, evento e aula; o segundo trabalho de cada tipo usa a mesma foto com outro recorte), o palestrante no palco em 4:5 sobre a folha de orçamento e a mesa de edição em 3:2 atrás do resumo vazio do convite. Lista completa no README.
- **Ícones**: o sinal da marca é um microfone de estúdio em SVG inline. O favicon é o mesmo microfone com o ponto vermelho.
- **Grão**: aplicado dentro das imagens, não no fundo da página.

## Movimento

Um único momento orquestrado: na abertura, os quatro blocos de texto entram em sequência (subida de 12px com fade, 80ms entre um e outro) e a moldura da imagem se revela de cima para baixo (clip-path, 900ms). Ambiente: no computador, cinco formas brancas flutuam devagar sobre a foto do hero e o ponto da pílula "Gravando" pulsa. Fora disso, só respostas a ações: troca de cor dos botões e filtros em 150ms, o visor abre com fade de 200ms e a cabeça de leitura vermelha anda quando o visitante aperta Reproduzir. Com `prefers-reduced-motion: reduce` a abertura fica parada, as formas somem, o ponto não pulsa, as transições são desligadas e o visor avança em passos de um segundo em vez de deslizar.

## Foto do hero

Proporção esperada: **3:2** (1600x1067px ou maior, na horizontal). Cantos retos (3px). A imagem será cortada ao centro pelo `object-fit: cover`, então o assunto deve ficar no meio e nada importante nas bordas.

Prompt para gerar no Canva (em português):

> Fotografia editorial de estúdio de gravação, estilo site premium de palestrante e videomaker. Um microfone de estúdio profissional de condensador em um pedestal, em primeiro plano, e ao fundo uma câmera de cinema pequena em um tripé com a luz vermelha de "gravando" acesa. Um cabo de microfone preto ondulando sobre o chão cinza claro. Parede de painel acústico em cinza azulado claro (cor #DCE1E3), liso, com leve degradê e luz suave vinda da esquerda. Um pequeno brilho vermelho (cor #D81E27) apenas na luz da câmera. Profundidade de campo rasa, foco no microfone, fundo desfocado. Cores dessaturadas, grão fino, aspecto de revista. Sem texto, sem pessoas, sem logotipos legíveis. Proporção 3:2, horizontal.

Alternativa, se o microfone sair com cara de banco de imagens: um teleprompter e uma cadeira vazia em um estúdio cinza claro, com a luz vermelha de "gravando" ao fundo e o mesmo fundo #DCE1E3.

## Design systems aplicados (leva final)

Dupla: **Future UI** (claro) e **Fluxora** (escuro), dos design systems da Mil e Uma Linhas!. A paleta não mudou: o laranja do Future UI e o azul do Fluxora viraram o ciano de timeline, e o Tally continua sendo o único "ao vivo" de cada tela.

**Como misturei.** As seções em Parede e Folha (abertura, orçamento, agenda, convite, como funciona) seguem o Future UI: moldura de cantos grandes, formas geométricas sobre a foto, tiles que invertem para Tinta, gráfico de barras e calendário com estados por dia. Os blocos em Cabo (mural, visor, resumo preenchido, rodapé) seguem o Fluxora: grade de 64px quase invisível com brilhos ciano nos cantos, vidro com borda em degradê a 225 graus, rótulo de etapa preso na borda e janela de showcase.

| Componente | De | Onde |
|---|---|---|
| Main card: página em cartão Parede de cantos de 2rem, brilho branco no topo, margem `#CBD2D5` (só a partir de 1200px) | Future UI | `body`, `.topo`, `main`, `.rodape` |
| Floating shapes: cinco formas brancas em `mix-blend-mode: overlay`, loops de 5 a 12s (só a partir de 1024px e com movimento) | Future UI | `.formas` dentro de `figure.hero-moldura` |
| Floating badges: "Palestras de 30 a 120 min" (Folha) e "Vídeo em 4K" (Cabo), escalam 1,05 no hover (só a partir de 1024px) | Future UI | `.selo` sobre a foto do hero |
| Feature tiles: índice em Courier, título e descrição; o escolhido inverte para Tinta em 300ms | Future UI | `#orc-tipo .escolha-item`, `#bloco-palestra`, `#bloco-video` |
| Bar chart: uma barra arredondada por semana do prazo, em Cabo a 20%, 40% e 60%; a semana final em Folha com borda ciano | Future UI | `#orc-barras`, abaixo do prazo na folha |
| Calendar grid: dias redondos (livre, ocupado, pré-reserva, escolhido) e legenda com pontos de 10px; área de toque de 44px | Future UI | `#cal-grade`, `.cal-legenda` |
| Eyebrow pair: rótulo + traço ciano de 16px + frase, em Courier caixa alta (substitui a barrinha ciano) | Future UI | `.sobretitulo` em cada `header.cabeca` e no 404 |
| Primary button: pílula em degradê de Tinta, sombras internas e véu branco que sobe no hover | Future UI | `.botao-tinta` e `.botao-contorno` nas seções claras |
| Page grid: grade SVG de 64px e dois brilhos radiais ciano | Fluxora | `#trabalhos`, `.resumo.resumo-cheio`, `.rodape` |
| Glass card: vidro a 225 graus e borda de 1px em degradê via máscara; borda ciano no hover | Fluxora | cartões do mural (`.cartao`) e rodapé (`.vidro`) |
| Step label: tipo do trabalho e "Etapa N" presos na borda do cartão | Fluxora | `.cartao-rotulo` no mural, `fieldset.etapa` no convite |
| Showcase window: moldura Cabo apoio com três pontos, tela em Tinta e linha do tempo dentro da moldura, sombra 0 20px 60px | Fluxora | `.visor-tela`, `.visor-janela` |
| Status pill: ponto pulsando + rótulo em Courier | Fluxora | "Gravando" (ponto Tally) no hero; "Agenda simulada" (ponto ciano) no calendário |
| Footer: cartão de vidro em quatro colunas | Fluxora | `footer.rodape` |

Decisões que diferem do plano, para respeitar esta identidade:

- O plano pedia um ponto Tally em uma das formas flutuantes. Ficou de fora: a dobra do hero já tem o botão principal e o ponto da pílula "Gravando", e a regra é um vermelho por tela.
- O selo do hero dizia "Palestras de 45 a 90 min", mas a tabela de preços oferece de 30 minutos a 2 horas. O selo diz "Palestras de 30 a 120 min".
- Os cartões de vidro mantêm cantos de 3px (quina de papel e câmera), como o plano já previa; as pílulas ficaram só nas peças de interface.

Contrastes novos verificados (WCAG 2): sobretítulo `#475761` sobre Parede 5,7:1 e sobre `#CBD2D5` 4,9:1; texto do tile escolhido `#C9D3D8` sobre Tinta 10,7:1; Folha sobre o botão em degradê 7,3:1 no pior ponto (com o véu); número do dia ocupado `#4B5862` sobre Cabo a 15% 5,3:1; prata sobre o vidro do rodapé 5,2:1; ciano claro sobre o vidro do mural 6,4:1; texto do resumo vazio sobre a foto com véu de Cabo a 70% acima de 6:1.
