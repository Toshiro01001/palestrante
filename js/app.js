/* Ponto Vermelho: toda a lógica do site. Roda no navegador, não envia nada para a internet.
   Os preços e os trabalhos vêm de js/dados.js (variável DADOS). */
(function () {
  "use strict";

  var D = DADOS;
  var $ = function (id) { return document.getElementById(id); };
  var reduzMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- utilidades ---------- */
  var moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  function brl(n) { return moeda.format(n).replace(/ /g, " "); }

  function dataLonga(d) {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
  }
  function dataCurta(d) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  }
  function chave(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + dia;
  }
  function daChave(k) {
    var p = k.split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]), 12, 0, 0);
  }
  function hoje() { var d = new Date(); d.setHours(12, 0, 0, 0); return d; }
  function somaDias(d, n) { var r = new Date(d.getTime()); r.setDate(r.getDate() + n); return r; }
  function somaDiasUteis(d, n) {
    var r = new Date(d.getTime());
    while (n > 0) {
      r.setDate(r.getDate() + 1);
      if (r.getDay() !== 0 && r.getDay() !== 6) { n--; }
    }
    return r;
  }
  function preencher(sel, itens, rotulo) {
    sel.innerHTML = "";
    itens.forEach(function (it) {
      var o = document.createElement("option");
      o.value = it.id !== undefined ? it.id : String(it);
      o.textContent = rotulo ? rotulo(it) : it.nome;
      sel.appendChild(o);
    });
  }
  function porId(lista, id) { return lista.filter(function (x) { return x.id === id; })[0]; }
  function guardar(chaveLS, valor) { try { localStorage.setItem(chaveLS, JSON.stringify(valor)); } catch (e) { /* sem armazenamento: segue sem guardar */ } }
  function ler(chaveLS) { try { return JSON.parse(localStorage.getItem(chaveLS)) || null; } catch (e) { return null; } }

  /* ---------- menu do celular ---------- */
  var menuBotao = $("menu-botao");
  var menu = $("menu");
  menuBotao.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    menuBotao.setAttribute("aria-expanded", aberto ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("aberto");
      menuBotao.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- orçamento ---------- */
  var ultimoOrc = null; // guarda o último resultado para levar ao convite

  function calcularPalestra(e) {
    var P = D.palestra;
    var tema = porId(P.temas, e.tema);
    var dur = P.duracoes.filter(function (x) { return String(x.min) === String(e.duracao); })[0];
    var fmt = porId(P.formatos, e.formato);
    var pl = porId(P.plateias, e.plateia);
    var ds = porId(P.deslocamentos, e.deslocamento);
    var base = Math.round((tema.base * dur.fator * fmt.fator) / 10) * 10;
    var linhas = [{ r: "Palestra, " + dur.nome + ", " + fmt.nome.toLowerCase(), v: base }];
    var total = base;
    if (pl.extra > 0) { linhas.push({ r: pl.nome, v: pl.extra }); total += pl.extra; }
    var presencial = e.formato === "presencial";
    if (presencial && ds.extra > 0) { linhas.push({ r: "Deslocamento: " + ds.nome, v: ds.extra }); total += ds.extra; }
    if (e.gravar) { linhas.push({ r: "Gravação em vídeo", v: P.gravacaoExtra }); total += P.gravacaoExtra; }
    var ant = presencial ? P.antecedenciaBase : P.antecedenciaOnline;
    ant = Math.max(ant, pl.antecedencia, presencial ? ds.antecedencia : 0);
    var primeira = somaDias(hoje(), ant);
    return {
      servico: "palestra", total: total, linhas: linhas,
      prazo: "Preciso de " + ant + " dias de antecedência. Primeira data possível: " + dataCurta(primeira) + ".",
      resumo: "Palestra \"" + tema.nome + "\", " + dur.nome + ", " + fmt.nome.toLowerCase() + ", " + pl.nome.toLowerCase() + (presencial ? ", " + ds.nome : "") + (e.gravar ? ", com gravação em vídeo" : "") + ". Total estimado: " + brl(total) + ". " + "Antecedência mínima: " + ant + " dias."
    };
  }

  function calcularVideo(e) {
    var V = D.video;
    var tipo = porId(V.tipos, e.vtipo);
    var min = Number(e.vmin);
    if (!(e.vmin !== "" && isFinite(min) && min >= 1 && min <= 30 && Math.floor(min) === min)) { return null; }
    var diarias = Number(e.vdiarias);
    var linhas = [{ r: tipo.nome.split(" (")[0] + ", " + min + " min", v: tipo.porMin * min }];
    var total = tipo.porMin * min;
    linhas.push({ r: diarias + (diarias === 1 ? " diária" : " diárias") + " de gravação", v: V.diaria * diarias });
    total += V.diaria * diarias;
    var dias = V.diasBase + Math.ceil(min * V.diasPorMin) + diarias * V.diasPorDiaria;
    if (e.vdrone) { linhas.push({ r: "Drone, " + diarias + (diarias === 1 ? " diária" : " diárias"), v: V.drone * diarias }); total += V.drone * diarias; dias += V.diasDrone; }
    if (e.vlegenda) { linhas.push({ r: "Legendas, " + min + " min", v: V.legendaPorMin * min }); total += V.legendaPorMin * min; dias += V.diasLegenda; }
    var entrega = somaDiasUteis(hoje(), dias);
    return {
      servico: "video", total: total, linhas: linhas,
      prazo: "Entrega em " + dias + " dias úteis depois da gravação. Se gravarmos hoje: " + dataCurta(entrega) + ".",
      resumo: "Vídeo \"" + tipo.nome.split(" (")[0].toLowerCase() + "\" de " + min + " min, " + diarias + (diarias === 1 ? " diária" : " diárias") + " de gravação" + (e.vdrone ? ", com drone" : "") + (e.vlegenda ? ", com legendas" : "") + ". Total estimado: " + brl(total) + ". Entrega em " + dias + " dias úteis."
    };
  }

  function lerEstado() {
    var f = $("orc-form");
    return {
      servico: f.elements.servico.value,
      tema: $("p-tema").value, duracao: $("p-duracao").value, formato: f.elements.formato.value,
      plateia: $("p-plateia").value, deslocamento: $("p-desloc").value, gravar: $("p-gravar").checked,
      vtipo: $("v-tipo").value, vmin: $("v-min").value.trim(), vdiarias: $("v-diarias").value,
      vdrone: $("v-drone").checked, vlegenda: $("v-legenda").checked
    };
  }

  function atualizarOrcamento() {
    var e = lerEstado();
    var ehPalestra = e.servico === "palestra";
    $("bloco-palestra").hidden = !ehPalestra;
    $("bloco-video").hidden = ehPalestra;
    $("p-desloc").disabled = e.formato === "online";
    $("p-desloc-nota").textContent = e.formato === "online" ? "Palestra online não tem deslocamento." : "Só conta quando a palestra é presencial.";

    var r = ehPalestra ? calcularPalestra(e) : calcularVideo(e);
    var lista = $("orc-linhas");
    var minInput = $("v-min");
    var nota = $("v-min-nota");
    if (!ehPalestra) {
      var invalido = r === null;
      minInput.setAttribute("aria-invalid", invalido ? "true" : "false");
      nota.textContent = invalido ? "Digite um número inteiro de 1 a 30." : "De 1 a 30 minutos.";
      nota.classList.toggle("erro", invalido);
    }
    lista.innerHTML = "";
    if (!r) {
      ultimoOrc = null;
      $("orc-total").textContent = "R$ 0";
      $("orc-prazo").textContent = "Digite de 1 a 30 minutos para ver o preço e o prazo.";
      $("orc-levar").disabled = true;
      return;
    }
    $("orc-levar").disabled = false;
    ultimoOrc = r;
    r.linhas.forEach(function (l) {
      var li = document.createElement("li");
      var a = document.createElement("span"); a.textContent = l.r;
      var b = document.createElement("span"); b.textContent = brl(l.v);
      li.appendChild(a); li.appendChild(b); lista.appendChild(li);
    });
    $("orc-total").textContent = brl(r.total);
    $("orc-prazo").textContent = r.prazo;
  }

  function iniciarOrcamento() {
    var P = D.palestra, V = D.video;
    preencher($("p-tema"), P.temas, function (t) { return t.nome; });
    preencher($("p-duracao"), P.duracoes.map(function (x) { return { id: String(x.min), nome: x.nome }; }));
    $("p-duracao").value = "60";
    preencher($("p-plateia"), P.plateias);
    $("p-plateia").value = "p2";
    preencher($("p-desloc"), P.deslocamentos);
    preencher($("v-tipo"), V.tipos);
    preencher($("v-diarias"), [1, 2, 3, 4, 5].map(function (n) { return { id: String(n), nome: n === 1 ? "1 dia" : n + " dias" }; }));
    $("orc-form").addEventListener("input", atualizarOrcamento);
    $("orc-form").addEventListener("change", atualizarOrcamento);
    $("orc-form").addEventListener("submit", function (ev) { ev.preventDefault(); });
    $("orc-levar").addEventListener("click", function () {
      if (!ultimoOrc) { return; }
      $("c-assunto").value = ultimoOrc.servico === "palestra" ? "uma palestra" : "um vídeo";
      $("c-mensagem").value = "Orçamento simulado: " + ultimoOrc.resumo;
      limparErro("c-assunto"); limparErro("c-mensagem");
      $("convite").scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth" });
      $("c-nome").focus({ preventScroll: true });
    });
    atualizarOrcamento();
  }

  /* ---------- mural de trabalhos ---------- */
  var filtroAtual = "todos";
  function fmtTempo(seg) {
    seg = Math.round(seg);
    var h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
    var mm = String(m).padStart(2, "0"), ss = String(s).padStart(2, "0");
    return h > 0 ? h + ":" + mm + ":" + ss : mm + ":" + ss;
  }
  function nomeTipo(id) { return porId(D.tipos, id).nome; }

  function iniciarMural() {
    var filtros = $("filtros");
    var mural = $("mural");
    var opcoes = [{ id: "todos", nome: "Todos" }].concat(D.tipos);
    opcoes.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.dataset.tipo = t.id; b.textContent = t.nome;
      b.setAttribute("aria-pressed", t.id === "todos" ? "true" : "false");
      filtros.appendChild(b);
    });
    D.trabalhos.forEach(function (t) {
      var li = document.createElement("li");
      li.dataset.tipo = t.tipo;
      var b = document.createElement("button");
      b.type = "button"; b.className = "cartao"; b.dataset.id = t.id;
      b.setAttribute("aria-haspopup", "dialog");
      var poster = document.createElement("span"); poster.className = "cartao-poster";
      var img = document.createElement("img");
      img.src = t.poster; img.alt = t.alt; img.width = 1280; img.height = 720; img.loading = "lazy";
      poster.appendChild(img);
      var meta = document.createElement("span"); meta.className = "cartao-meta"; meta.textContent = porId(D.tipos, t.tipo).singular + " · " + fmtTempo(t.duracao);
      var tit = document.createElement("span"); tit.className = "cartao-titulo"; tit.textContent = t.titulo;
      var cli = document.createElement("span"); cli.className = "cartao-cliente"; cli.textContent = t.cliente + " (fictício)";
      b.appendChild(poster); b.appendChild(meta); b.appendChild(tit); b.appendChild(cli);
      li.appendChild(b); mural.appendChild(li);
    });
    filtros.addEventListener("click", function (ev) {
      var b = ev.target.closest(".chip");
      if (!b) { return; }
      filtroAtual = b.dataset.tipo;
      Array.prototype.forEach.call(filtros.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
      aplicarFiltro();
    });
    mural.addEventListener("click", function (ev) {
      var b = ev.target.closest(".cartao");
      if (b) { abrirVisor(b.dataset.id); }
    });
    aplicarFiltro();
  }
  function aplicarFiltro() {
    var itens = $("mural").children, n = 0;
    Array.prototype.forEach.call(itens, function (li) {
      var mostra = filtroAtual === "todos" || li.dataset.tipo === filtroAtual;
      li.hidden = !mostra;
      if (mostra) { n++; }
    });
    $("filtro-contagem").textContent = "Mostrando " + n + " de " + itens.length + " trabalhos" + (filtroAtual === "todos" ? "." : ": " + nomeTipo(filtroAtual).toLowerCase() + ".");
  }

  /* ---------- visor simulado ---------- */
  var visor = $("visor");
  var vTrab = null, vPos = 0, vTocando = false, vTimer = null, vUltimo = 0, vDuracaoSim = 12;

  function pintarVisor() {
    var pct = vPos / 1000;
    $("visor-cabeca").style.left = "calc(" + (pct * 100) + "% - " + (pct * 3) + "px)";
    $("visor-pos").value = String(Math.round(vPos));
    $("visor-tempo").textContent = fmtTempo(pct * vTrab.duracao) + " / " + fmtTempo(vTrab.duracao);
    $("visor-pos").setAttribute("aria-valuetext", fmtTempo(pct * vTrab.duracao) + " de " + fmtTempo(vTrab.duracao));
  }
  function parar() {
    vTocando = false;
    if (vTimer) { if (reduzMovimento) { clearInterval(vTimer); } else { cancelAnimationFrame(vTimer); } vTimer = null; }
    var b = $("visor-play");
    b.textContent = "Reproduzir"; b.dataset.tocando = "false";
  }
  function passo(agora) {
    if (!vTocando) { return; }
    var dt = reduzMovimento ? 1000 : agora - vUltimo;
    vUltimo = agora;
    vPos += (dt / (vDuracaoSim * 1000)) * 1000;
    if (vPos >= 1000) { vPos = 1000; pintarVisor(); parar(); return; }
    pintarVisor();
    if (!reduzMovimento) { vTimer = requestAnimationFrame(passo); }
  }
  function tocar() {
    if (vPos >= 1000) { vPos = 0; }
    vTocando = true;
    var b = $("visor-play");
    b.textContent = "Pausar"; b.dataset.tocando = "true";
    if (reduzMovimento) { vTimer = setInterval(function () { passo(0); }, 1000); }
    else { vUltimo = performance.now(); vTimer = requestAnimationFrame(passo); }
  }
  function abrirVisor(id) {
    vTrab = porId(D.trabalhos, id);
    vDuracaoSim = Math.max(10, Math.min(24, Math.round(vTrab.duracao / 20)));
    $("visor-titulo").textContent = vTrab.titulo;
    $("visor-meta").textContent = porId(D.tipos, vTrab.tipo).singular + " · " + vTrab.cliente + " (fictício)";
    var img = $("visor-img"); img.src = vTrab.poster; img.alt = vTrab.alt;
    $("visor-nota").textContent = vTrab.nota;
    parar(); vPos = 0; pintarVisor();
    if (typeof visor.showModal === "function") { visor.showModal(); } else { visor.setAttribute("open", ""); }
    $("visor-play").focus();
  }
  function iniciarVisor() {
    $("visor-play").addEventListener("click", function () { if (vTocando) { parar(); } else { tocar(); } });
    $("visor-reiniciar").addEventListener("click", function () { var t = vTocando; parar(); vPos = 0; pintarVisor(); if (t) { tocar(); } });
    $("visor-pos").addEventListener("input", function (e) { vPos = Number(e.target.value); pintarVisor(); });
    $("visor-fechar").addEventListener("click", function () { visor.close(); });
    visor.addEventListener("close", parar);
    visor.addEventListener("click", function (e) { if (e.target === visor) { visor.close(); } });
  }

  /* ---------- agenda ---------- */
  var CHAVE_RESERVAS = "pv-prereservas";
  var reservas = []; // {data, periodo, codigo}
  var mesVista = null; // {ano, mes}
  var diaSel = null; // chave AAAA-MM-DD

  function ocupado(d) {
    var dia = d.getDate(), mes = d.getMonth() + 1, ano = d.getFullYear();
    var h = (dia * 7 + mes * 13 + ano) % 10;
    var sem = d.getDay();
    if (sem === 0) { return true; }
    if (sem === 6) { return h < 7; }
    return h < 3;
  }
  function estado(d) {
    var h = hoje();
    if (d <= h) { return "passado"; }
    return ocupado(d) ? "cheia" : "livre";
  }
  function carregarReservas() {
    var v = ler(CHAVE_RESERVAS);
    reservas = Array.isArray(v) ? v.filter(function (r) { return r && typeof r.data === "string" && typeof r.periodo === "string" && typeof r.codigo === "string"; }) : [];
  }
  function reservaDe(k) { return reservas.filter(function (r) { return r.data === k; })[0]; }

  function desenharCalendario() {
    var grade = $("cal-grade");
    grade.innerHTML = "";
    var nomeMes = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(mesVista.ano, mesVista.mes, 1));
    $("cal-mes").textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1).replace(" de ", " de ");
    ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].forEach(function (n) {
      var s = document.createElement("span"); s.className = "cal-dia-semana"; s.setAttribute("aria-hidden", "true"); s.textContent = n; grade.appendChild(s);
    });
    var primeiro = new Date(mesVista.ano, mesVista.mes, 1, 12);
    for (var i = 0; i < primeiro.getDay(); i++) { var v = document.createElement("span"); v.className = "cal-vazio"; grade.appendChild(v); }
    var ultimo = new Date(mesVista.ano, mesVista.mes + 1, 0).getDate();
    for (var dia = 1; dia <= ultimo; dia++) {
      var d = new Date(mesVista.ano, mesVista.mes, dia, 12);
      var k = chave(d), est = estado(d), minha = reservaDe(k);
      var b = document.createElement("button");
      b.type = "button"; b.className = "dia"; b.textContent = String(dia); b.dataset.data = k;
      var desc = dataLonga(d);
      if (chave(d) === chave(hoje())) { b.classList.add("hoje"); desc += ", hoje"; }
      if (est === "livre") {
        b.setAttribute("aria-pressed", diaSel === k ? "true" : "false");
        desc += minha ? ", sua pré-reserva de " + minha.periodo : ", livre";
        if (minha) { b.classList.add("minha"); }
      } else {
        b.disabled = true;
        if (est === "cheia") { b.classList.add("cheia"); desc += ", ocupada"; } else { desc += ", indisponível"; }
      }
      b.setAttribute("aria-label", desc);
      grade.appendChild(b);
    }
    var hj = hoje();
    $("cal-ant").disabled = mesVista.ano === hj.getFullYear() && mesVista.mes === hj.getMonth();
    var limite = new Date(hj.getFullYear(), hj.getMonth() + 5, 1);
    $("cal-prox").disabled = mesVista.ano === limite.getFullYear() && mesVista.mes === limite.getMonth();
  }

  function desenharReservas() {
    var bloco = $("reserva-lista-bloco"), ul = $("reserva-lista");
    ul.innerHTML = "";
    bloco.hidden = reservas.length === 0;
    reservas.slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; }).forEach(function (r) {
      var li = document.createElement("li");
      var t = document.createElement("span"); t.textContent = dataCurta(daChave(r.data)) + ", " + r.periodo + " (" + r.codigo + ")";
      var x = document.createElement("button"); x.type = "button"; x.textContent = "Cancelar"; x.dataset.data = r.data;
      x.setAttribute("aria-label", "Cancelar a pré-reserva de " + dataCurta(daChave(r.data)));
      li.appendChild(t); li.appendChild(x); ul.appendChild(li);
    });
  }

  function mostrarSelecao() {
    var form = $("reserva-form");
    form.hidden = diaSel === null;
    $("reserva-vazio").hidden = diaSel !== null;
    if (diaSel) {
      $("reserva-data").textContent = dataLonga(daChave(diaSel));
      var r = reservaDe(diaSel);
      if (r) { form.elements.periodo.value = r.periodo; }
    }
  }

  function iniciarAgenda() {
    carregarReservas();
    var h = hoje();
    mesVista = { ano: h.getFullYear(), mes: h.getMonth() };
    $("cal-ant").addEventListener("click", function () { mesVista = { ano: new Date(mesVista.ano, mesVista.mes - 1, 1).getFullYear(), mes: new Date(mesVista.ano, mesVista.mes - 1, 1).getMonth() }; desenharCalendario(); });
    $("cal-prox").addEventListener("click", function () { var n = new Date(mesVista.ano, mesVista.mes + 1, 1); mesVista = { ano: n.getFullYear(), mes: n.getMonth() }; desenharCalendario(); });
    $("cal-grade").addEventListener("click", function (ev) {
      var b = ev.target.closest(".dia");
      if (!b || b.disabled) { return; }
      diaSel = b.dataset.data;
      $("reserva-ok").hidden = true;
      desenharCalendario(); mostrarSelecao();
      var novo = $("cal-grade").querySelector('[data-data="' + diaSel + '"]');
      if (novo) { novo.focus(); }
    });
    $("reserva-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!diaSel) { return; }
      var periodo = $("reserva-form").elements.periodo.value;
      var codigo = "PV-" + diaSel.replace(/-/g, "") + "-" + periodo.charAt(0).toUpperCase();
      reservas = reservas.filter(function (r) { return r.data !== diaSel; });
      reservas.push({ data: diaSel, periodo: periodo, codigo: codigo });
      guardar(CHAVE_RESERVAS, reservas);
      var ok = $("reserva-ok");
      ok.textContent = "Pré-reserva simulada para " + dataLonga(daChave(diaSel)) + ", de " + periodo + ". Código " + codigo + ". Ninguém recebeu este pedido: é só uma demonstração.";
      ok.hidden = false;
      diaSel = null;
      desenharCalendario(); desenharReservas(); mostrarSelecao();
    });
    $("reserva-lista").addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b) { return; }
      reservas = reservas.filter(function (r) { return r.data !== b.dataset.data; });
      guardar(CHAVE_RESERVAS, reservas);
      $("reserva-ok").hidden = true;
      desenharCalendario(); desenharReservas();
    });
    $("reserva-limpar").addEventListener("click", function () {
      reservas = []; guardar(CHAVE_RESERVAS, reservas);
      $("reserva-ok").hidden = true;
      desenharCalendario(); desenharReservas();
    });
    desenharCalendario(); desenharReservas(); mostrarSelecao();
  }

  /* ---------- convite ---------- */
  function mostrarErro(id, msg) {
    var campo = $(id.replace("e-", "c-"));
    var p = $(id);
    p.textContent = msg; p.hidden = false;
    if (campo) { campo.setAttribute("aria-invalid", "true"); }
  }
  function limparErro(campoId) {
    var campo = $(campoId), p = $(campoId.replace("c-", "e-"));
    if (campo) { campo.removeAttribute("aria-invalid"); }
    if (p) { p.hidden = true; p.textContent = ""; }
  }
  function validarConvite() {
    var f = $("convite-form");
    var v = {
      nome: f.elements.nome.value.trim(), email: f.elements.email.value.trim(), tel: f.elements.tel.value.trim(),
      empresa: f.elements.empresa.value.trim(), assunto: f.elements.assunto.value, mensagem: f.elements.mensagem.value.trim(),
      aceite: f.elements.aceite.checked
    };
    var erros = [];
    if (v.nome.length < 3 || !/[A-Za-zÀ-ÿ]{2}/.test(v.nome)) { erros.push(["e-nome", "Digite seu nome com pelo menos 3 letras."]); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) { erros.push(["e-email", "Digite um e-mail no formato nome@exemplo.com."]); }
    if (v.tel !== "") {
      var digitos = v.tel.replace(/\D/g, "");
      if (!/^[\d\s()+-]+$/.test(v.tel) || digitos.length < 10 || digitos.length > 13) { erros.push(["e-tel", "Digite o telefone com DDD, por exemplo (65) 90000-0000, ou deixe em branco."]); }
    }
    if (v.empresa.length < 2) { erros.push(["e-empresa", "Digite o nome da empresa ou do evento."]); }
    if (v.assunto === "") { erros.push(["e-assunto", "Escolha do que você precisa."]); }
    if (v.mensagem.length < 20) { erros.push(["e-mensagem", "Conte um pouco mais: use pelo menos 20 letras (você usou " + v.mensagem.length + ")."]); }
    if (!v.aceite) { erros.push(["e-aceite", "Marque a caixa para continuar."]); }
    return { v: v, erros: erros };
  }
  function iniciarConvite() {
    var f = $("convite-form");
    f.addEventListener("input", function (ev) { if (ev.target.id) { limparErro(ev.target.id); } });
    f.addEventListener("change", function (ev) { if (ev.target.id) { limparErro(ev.target.id); } });
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      ["c-nome", "c-email", "c-tel", "c-empresa", "c-assunto", "c-mensagem", "c-aceite"].forEach(limparErro);
      var r = validarConvite();
      if (r.erros.length) {
        r.erros.forEach(function (e) { mostrarErro(e[0], e[1]); });
        $(r.erros[0][0].replace("e-", "c-")).focus();
        return;
      }
      var lista = $("resumo-lista");
      lista.innerHTML = "";
      [["Nome", r.v.nome], ["E-mail", r.v.email], ["Telefone", r.v.tel || "Não informado"], ["Empresa ou evento", r.v.empresa], ["Precisa de", r.v.assunto], ["Mensagem", r.v.mensagem]].forEach(function (par) {
        var dt = document.createElement("dt"); dt.textContent = par[0];
        var dd = document.createElement("dd"); dd.textContent = par[1];
        lista.appendChild(dt); lista.appendChild(dd);
      });
      $("resumo-vazio").hidden = true;
      $("resumo-corpo").hidden = false;
      var res = $("resumo");
      res.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "nearest" });
      res.focus({ preventScroll: true });
    });
    $("resumo-novo").addEventListener("click", function () {
      f.reset();
      $("resumo-corpo").hidden = true; $("resumo-vazio").hidden = false;
      $("c-nome").focus();
    });
  }

  /* ---------- partida ---------- */
  iniciarOrcamento();
  iniciarMural();
  iniciarVisor();
  iniciarAgenda();
  iniciarConvite();
})();
