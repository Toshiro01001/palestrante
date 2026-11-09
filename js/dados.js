/* Dados fictícios do site Ponto Vermelho: tabela de preços, prazos e trabalhos do mural.
   Tudo aqui é inventado. Para mudar um preço, basta editar este arquivo. */
const DADOS = {
  palestra: {
    temas: [
      { id: "voz", nome: "Falar em público sem medo", base: 1800 },
      { id: "lideranca", nome: "Liderança e conversa difícil", base: 2400 },
      { id: "vendas", nome: "Atendimento e vendas que convencem", base: 2200 },
      { id: "criatividade", nome: "Criatividade no trabalho de todo dia", base: 2000 },
      { id: "video", nome: "Vídeo para quem não é do ramo", base: 2000 }
    ],
    duracoes: [
      { min: 30, nome: "30 minutos", fator: 0.7 },
      { min: 60, nome: "1 hora", fator: 1 },
      { min: 90, nome: "1 hora e meia", fator: 1.3 },
      { min: 120, nome: "2 horas", fator: 1.6 }
    ],
    formatos: [
      { id: "presencial", nome: "Presencial", fator: 1 },
      { id: "online", nome: "Online, ao vivo", fator: 0.8 }
    ],
    plateias: [
      { id: "p1", nome: "Até 30 pessoas", extra: 0, antecedencia: 0 },
      { id: "p2", nome: "De 31 a 100 pessoas", extra: 300, antecedencia: 0 },
      { id: "p3", nome: "De 101 a 300 pessoas", extra: 700, antecedencia: 14 },
      { id: "p4", nome: "Mais de 300 pessoas", extra: 1400, antecedencia: 21 }
    ],
    deslocamentos: [
      { id: "d1", nome: "Cuiabá e Várzea Grande", extra: 0, antecedencia: 0 },
      { id: "d2", nome: "Até 150 km de Cuiabá", extra: 450, antecedencia: 0 },
      { id: "d3", nome: "Outra cidade de Mato Grosso", extra: 1200, antecedencia: 14 },
      { id: "d4", nome: "Outro estado", extra: 2400, antecedencia: 21 }
    ],
    gravacaoExtra: 900,
    antecedenciaBase: 10,
    antecedenciaOnline: 5
  },
  video: {
    tipos: [
      { id: "institucional", nome: "Institucional (a empresa por dentro)", porMin: 1200 },
      { id: "depoimento", nome: "Depoimento de cliente ou equipe", porMin: 900 },
      { id: "evento", nome: "Cobertura de evento", porMin: 700 },
      { id: "aula", nome: "Aula ou curso gravado", porMin: 800 },
      { id: "redes", nome: "Vídeo curto para redes sociais", porMin: 650 }
    ],
    diaria: 1800,
    drone: 650,
    legendaPorMin: 18,
    diasBase: 5,
    diasPorMin: 1.5,
    diasPorDiaria: 2,
    diasLegenda: 2,
    diasDrone: 1
  },
  tipos: [
    { id: "palestra", nome: "Palestras", singular: "Palestra" },
    { id: "institucional", nome: "Institucionais", singular: "Institucional" },
    { id: "evento", nome: "Eventos", singular: "Evento" },
    { id: "depoimento", nome: "Depoimentos", singular: "Depoimento" },
    { id: "aula", nome: "Aulas", singular: "Aula" }
  ],
  trabalhos: [
    { id: "t1", tipo: "palestra", titulo: "Abertura do encontro de varejo", cliente: "Rede Três Pontes Atacado", duracao: 2712, poster: "img/mural-palestra.webp", alt: "Palestrante visto de costas em um palco com luz branca de recorte, diante de uma plateia em silhueta, com um ponto vermelho de câmera ao fundo.", nota: "Palestra de abertura para 280 pessoas, gravada com duas câmeras e áudio direto da mesa." },
    { id: "t2", tipo: "institucional", titulo: "Um dia na cooperativa", cliente: "Cooperativa Água Funda", duracao: 276, poster: "img/mural-institucional.webp", alt: "Bastidor de gravação de vídeo institucional em um galpão de cooperativa: câmera em slider em primeiro plano, operador de costas e sacas empilhadas ao fundo em luz difusa.", nota: "Vídeo institucional de quatro minutos e meio, gravado em dois dias, com legendas." },
    { id: "t3", tipo: "evento", titulo: "Feira de negócios, três dias em dois minutos", cliente: "Feira Mato Grosso Conecta", duracao: 128, poster: "img/mural-evento.webp", alt: "Pavilhão de feira de negócios visto de cima com estandes iluminados, pontos de luz desfocados e corredores com pessoas em silhueta.", nota: "Resumo da feira para as redes, com imagens de drone do pavilhão." },
    { id: "t4", tipo: "depoimento", titulo: "Quem comprou fala sobre a obra", cliente: "Construtora Vale do Manso", duracao: 94, poster: "img/mural-aula.webp", recorte: "b", alt: "Estúdio de gravação de depoimento com fundo cinza liso e uma banqueta vazia sob luz suave, pronta para quem vai falar.", nota: "Depoimento de uma cliente sobre a entrega da obra, em uma tomada só." },
    { id: "t5", tipo: "palestra", titulo: "Conversa difícil também se treina", cliente: "Instituto Nascente", duracao: 3480, poster: "img/mural-palestra.webp", recorte: "b", alt: "Palestrante visto de costas em um palco com luz branca de recorte, diante de uma plateia em silhueta, com um ponto vermelho de câmera ao fundo.", nota: "Palestra de uma hora para 90 líderes, com dinâmica em grupos e versão online." },
    { id: "t6", tipo: "aula", titulo: "Curso de atendimento, módulo 1", cliente: "Faculdade Horizonte Central", duracao: 1260, poster: "img/mural-aula.webp", alt: "Estúdio de gravação de aula com fundo cinza liso, teleprompter, softbox e uma banqueta vazia iluminada, com a luz vermelha da câmera acesa.", nota: "Aula gravada em estúdio com slides ao lado do professor e legendas." },
    { id: "t7", tipo: "evento", titulo: "Jantar de 20 anos da empresa", cliente: "Hotel Beira-Rio Plaza", duracao: 212, poster: "img/mural-evento.webp", recorte: "b", alt: "Pavilhão de feira de negócios visto de cima com estandes iluminados, pontos de luz desfocados e corredores com pessoas em silhueta.", nota: "Cobertura de uma noite de festa, com entrevistas rápidas e discursos." },
    { id: "t8", tipo: "institucional", titulo: "Como fazemos a ração", cliente: "Cerealista Três Pontes", duracao: 183, poster: "img/mural-institucional.webp", recorte: "b", alt: "Bastidor de gravação de vídeo institucional em um galpão de cooperativa: câmera em slider em primeiro plano, operador de costas e sacas empilhadas ao fundo em luz difusa.", nota: "Vídeo de fábrica para novos clientes, com legendas e uma tomada de drone." }
  ]
};
