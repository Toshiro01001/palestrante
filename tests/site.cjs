/* Testes do site Ponto Vermelho com Playwright.
   Antes de rodar, sirva a pasta do site: python3 -m http.server 8318
   Depois: node tests/site.cjs
   Variáveis opcionais: URL (padrão http://localhost:8318/), CAPTURAS (pasta para salvar PNGs). */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.env.URL || "http://localhost:8318/";
const CAPTURAS = process.env.CAPTURAS || "";

const TELAS = [
  { nome: "computador", opcoes: { viewport: { width: 1280, height: 900 } } },
  { nome: "iphone13", opcoes: { ...devices["iPhone 13"] } },
  { nome: "estreito", opcoes: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } }
];

let falhas = 0;
function ok(cond, msg) {
  if (cond) { console.log("  ok   " + msg); }
  else { falhas++; console.log("  FALHA " + msg); }
}

async function verificarLayout(page, nome) {
  const info = await page.evaluate(() => {
    const larguraJanela = document.documentElement.clientWidth;
    const rolagem = document.documentElement.scrollWidth > larguraJanela + 1;
    const cortados = [];
    const estourados = [];
    document.querySelectorAll("body *").forEach((e) => {
      if (!e.offsetParent && e.tagName !== "BODY" && getComputedStyle(e).position !== "fixed") { return; }
      if (e.closest("dialog:not([open])")) { return; }
      let r = e.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) { return; }
      // Imagem ampliada dentro de um contêiner que recorta (overflow hidden/clip): vale o retângulo do contêiner
      for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
        const ox = getComputedStyle(a).overflowX;
        if (ox === "hidden" || ox === "clip") { const ra = a.getBoundingClientRect(); if (ra.right < r.right) { r = ra; } break; }
      }
      if (e.classList.contains("so-leitor") || e.classList.contains("pular")) { return; }
      if (r.right > larguraJanela + 1 && getComputedStyle(e).position !== "fixed") {
        estourados.push(e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (typeof e.className === "string" && e.className ? "." + e.className.split(" ")[0] : ""));
      }
      const temTexto = Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!temTexto) { return; }
      const cs = getComputedStyle(e);
      if (cs.overflowX === "hidden" || cs.overflowX === "clip" || cs.textOverflow === "ellipsis") {
        if (e.scrollWidth > e.clientWidth + 1) {
          cortados.push(e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + ": " + e.textContent.trim().slice(0, 40));
        }
      }
    });
    return { rolagem, cortados, estourados: estourados.slice(0, 8) };
  });
  ok(!info.rolagem, nome + ": sem rolagem horizontal");
  ok(info.estourados.length === 0, nome + ": nenhum elemento passa da borda" + (info.estourados.length ? " (" + info.estourados.join(", ") + ")" : ""));
  ok(info.cortados.length === 0, nome + ": nenhum texto cortado" + (info.cortados.length ? " (" + info.cortados.join(" | ") + ")" : ""));
}

async function capturar(page, nome) {
  if (!CAPTURAS) { return; }
  fs.mkdirSync(CAPTURAS, { recursive: true });
  await page.screenshot({ path: path.join(CAPTURAS, nome + ".png") });
}

async function irPara(page, id) {
  await page.evaluate((i) => { document.documentElement.style.scrollBehavior = "auto"; document.getElementById(i).scrollIntoView(); }, id);
  await page.waitForTimeout(250);
}

async function texto(page, sel) { return (await page.locator(sel).innerText()).replace(/\s+/g, " ").trim(); }

async function testarTela(browser, tela) {
  console.log("\n== " + tela.nome + " ==");
  const context = await browser.newContext({ ...tela.opcoes, reducedMotion: "no-preference" });
  const page = await context.newPage();
  const erros = [];
  const externos = [];
  page.on("console", (m) => { if (m.type() === "error") { erros.push(m.text()); } });
  page.on("pageerror", (e) => erros.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => erros.push("request: " + r.url()));
  page.on("response", (r) => { if (r.status() >= 400) { erros.push("http " + r.status() + " " + r.url()); } });
  page.on("request", (r) => { if (!r.url().startsWith(URL.replace(/\/$/, "")) && !r.url().startsWith("data:")) { externos.push(r.url()); } });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1300);
  await capturar(page, "capa-" + tela.nome);
  await verificarLayout(page, "abertura");
  ok(await page.evaluate(() => { const i = document.querySelector(".hero-foto"); return i && i.complete && i.naturalWidth === 1620; }), "hero: foto carregada com 1620px de largura");
  ok((await page.locator(".faixa-demo a[href='https://mileumalinhas.com.br']").count()) === 1, "faixa de demonstração com link da Mil e Uma Linhas!");
  const fonteOk = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check("700 20px Bricolage") && document.fonts.check("400 16px 'Courier Prime'"); });
  ok(fonteOk, "fontes locais carregadas");

  // Menu no celular
  if (tela.nome !== "computador") {
    await page.click("#menu-botao");
    ok(await page.locator("#menu").isVisible(), "menu: abre no celular");
    await page.click("#menu a[href='#orcamento']");
    ok(!(await page.locator("#menu").isVisible()), "menu: fecha ao escolher uma seção");
  }

  // Função 1: orçamento
  await irPara(page, "orcamento");
  ok((await texto(page, "#orc-total")) === "R$ 2.100", "orçamento: palestra padrão = R$ 2.100 (obtido: " + (await texto(page, "#orc-total")) + ")");
  await page.selectOption("#p-duracao", "90");
  ok((await texto(page, "#orc-total")) === "R$ 2.640", "orçamento: 90 min = R$ 2.640");
  await page.locator("input[name=formato][value=online]").check({ force: true });
  const totalOnline = await texto(page, "#orc-total");
  ok(totalOnline === "R$ 2.170", "orçamento: 90 min online = R$ 2.170 (obtido: " + totalOnline + ")");
  ok(await page.locator("#p-desloc").isDisabled(), "orçamento: deslocamento desligado no online");
  await page.check("#p-gravar");
  ok((await texto(page, "#orc-total")) === "R$ 3.070", "orçamento: com gravação = R$ 3.070");
  ok(/dias de antecedência/.test(await texto(page, "#orc-prazo")), "orçamento: mostra o prazo de antecedência");
  await capturar(page, "orcamento-palestra-" + tela.nome);
  await page.locator("input[name=servico][value=video]").check({ force: true });
  ok(await page.locator("#bloco-video").isVisible() && !(await page.locator("#bloco-palestra").isVisible()), "orçamento: troca para o bloco de vídeo");
  ok((await texto(page, "#orc-total")) === "R$ 5.454", "orçamento: vídeo padrão = R$ 5.454 (obtido: " + (await texto(page, "#orc-total")) + ")");
  ok(/14 dias úteis/.test(await texto(page, "#orc-prazo")), "orçamento: prazo do vídeo padrão = 14 dias úteis");
  await page.check("#v-drone");
  ok((await texto(page, "#orc-total")) === "R$ 6.104", "orçamento: com drone = R$ 6.104");
  await page.fill("#v-min", "0");
  ok(await page.locator("#orc-levar").isDisabled() && (await page.getAttribute("#v-min", "aria-invalid")) === "true", "orçamento: minutos inválidos bloqueiam o resultado");
  await page.fill("#v-min", "10");
  ok((await texto(page, "#orc-total")) === "R$ 14.630", "orçamento: 10 min com drone = R$ 14.630 (obtido: " + (await texto(page, "#orc-total")) + ")");
  await page.selectOption("#v-diarias", "2");
  ok((await texto(page, "#orc-total")) === "R$ 17.080", "orçamento: 2 diárias = R$ 17.080 (obtido: " + (await texto(page, "#orc-total")) + ")");
  await capturar(page, "orcamento-video-" + tela.nome);
  await verificarLayout(page, "orçamento");

  // Função 2: mural e visor
  await irPara(page, "trabalhos");
  ok((await page.locator("#mural li:not([hidden])").count()) === 8, "mural: 8 trabalhos no início");
  await page.locator("#filtros .chip[data-tipo=palestra]").click();
  ok((await page.locator("#mural li:not([hidden])").count()) === 2, "mural: filtro Palestras mostra 2");
  ok((await page.getAttribute("#filtros .chip[data-tipo=palestra]", "aria-pressed")) === "true", "mural: filtro ativo marcado");
  await page.locator("#filtros .chip[data-tipo=todos]").click();
  await page.locator("#filtros .chip[data-tipo=evento]").click();
  ok((await page.locator("#mural li:not([hidden])").count()) === 2, "mural: filtro Eventos mostra 2");
  await page.locator("#filtros .chip[data-tipo=todos]").click();
  await capturar(page, "mural-" + tela.nome);
  await page.locator("#mural .cartao").first().click();
  await page.waitForTimeout(300);
  ok(await page.locator("#visor").evaluate((d) => d.open), "visor: abre ao tocar no trabalho");
  await verificarLayout(page, "visor");
  await page.click("#visor-play");
  await page.waitForTimeout(1600);
  const pos1 = Number(await page.inputValue("#visor-pos"));
  ok(pos1 > 20, "visor: a barra anda ao reproduzir (posição " + pos1 + ")");
  ok((await texto(page, "#visor-play")) === "Pausar", "visor: botão vira Pausar");
  await capturar(page, "visor-" + tela.nome);
  await page.click("#visor-play");
  const p2 = Number(await page.inputValue("#visor-pos"));
  await page.waitForTimeout(700);
  ok(Number(await page.inputValue("#visor-pos")) === p2, "visor: pausar para a barra");
  await page.locator("#visor-pos").fill("500");
  ok(/^\d\d:\d\d \/ \d/.test(await texto(page, "#visor-tempo")), "visor: relógio mostra posição e duração (" + (await texto(page, "#visor-tempo")) + ")");
  await page.click("#visor-reiniciar");
  ok(Number(await page.inputValue("#visor-pos")) === 0, "visor: voltar ao início");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  ok(!(await page.locator("#visor").evaluate((d) => d.open)), "visor: Esc fecha");

  // Função 3: agenda
  await irPara(page, "agenda");
  await page.evaluate(() => localStorage.removeItem("pv-prereservas"));
  const livre = page.locator("#cal-grade .dia:not([disabled])").first();
  ok((await livre.count()) === 1, "agenda: há dia livre no mês");
  await livre.click();
  ok(await page.locator("#reserva-form").isVisible(), "agenda: escolher dia abre o formulário de pré-reserva");
  await page.locator("input[name=periodo][value=tarde]").check({ force: true });
  await capturar(page, "agenda-" + tela.nome);
  await page.click("#reserva-form button[type=submit]");
  ok(/Código PV-\d{8}-T/.test(await texto(page, "#reserva-ok")), "agenda: pré-reserva confirmada com código");
  ok((await page.locator("#reserva-lista li").count()) === 1, "agenda: pré-reserva aparece na lista");
  ok((await page.locator("#cal-grade .dia.minha").count()) === 1, "agenda: dia marcado no calendário");
  ok(await page.evaluate(() => JSON.parse(localStorage.getItem("pv-prereservas")).length === 1), "agenda: guardada no localStorage");
  await page.click("#cal-prox");
  ok((await texto(page, "#cal-mes")).length > 5, "agenda: avança o mês");
  await page.click("#cal-ant");
  ok(await page.locator("#cal-ant").isDisabled(), "agenda: não deixa voltar ao passado");
  await page.click("#reserva-lista button");
  ok((await page.locator("#reserva-lista li").count()) === 0 && (await page.locator("#cal-grade .dia.minha").count()) === 0, "agenda: cancelar remove a pré-reserva");
  await verificarLayout(page, "agenda");

  // Função 4: convite
  await irPara(page, "convite");
  await page.click("#convite-form button[type=submit]");
  const nErros = await page.locator("#convite-form .erro:not([hidden])").count();
  ok(nErros === 6, "convite: formulário vazio mostra 6 erros (obtido " + nErros + ")");
  ok(await page.evaluate(() => document.activeElement.id === "c-nome"), "convite: foco vai para o primeiro erro");
  await page.fill("#c-nome", "Marina Teste");
  await page.fill("#c-email", "marina@exemplo");
  await page.fill("#c-tel", "123");
  await page.fill("#c-empresa", "Empresa Fictícia");
  await page.selectOption("#c-assunto", "uma palestra");
  await page.fill("#c-mensagem", "curta");
  await page.click("#convite-form button[type=submit]");
  ok((await page.locator("#convite-form .erro:not([hidden])").count()) === 4, "convite: e-mail, telefone, mensagem e aceite continuam com erro");
  await page.fill("#c-email", "marina@exemplo.com");
  await page.fill("#c-tel", "(65) 90000-0000");
  await page.fill("#c-mensagem", "Quero uma palestra para a equipe de vendas no mês que vem.");
  await page.check("#c-aceite");
  await page.click("#convite-form button[type=submit]");
  await page.waitForTimeout(500);
  ok(await page.locator("#resumo-corpo").isVisible(), "convite: resumo aparece na tela");
  ok(/Marina Teste/.test(await texto(page, "#resumo-lista")) && /Nada foi enviado|nada foi enviado/.test(await texto(page, "#resumo")), "convite: resumo traz os dados e o aviso de simulação");
  await capturar(page, "convite-" + tela.nome);
  await verificarLayout(page, "convite");
  await page.click("#resumo-novo");
  ok(!(await page.locator("#resumo-corpo").isVisible()) && (await page.inputValue("#c-nome")) === "", "convite: fazer outro limpa o formulário");

  // Levar orçamento para o convite
  await irPara(page, "orcamento");
  await page.locator("input[name=servico][value=palestra]").check({ force: true });
  await page.click("#orc-levar");
  await page.waitForTimeout(400);
  ok((await page.inputValue("#c-assunto")) === "uma palestra" && /Orçamento simulado/.test(await page.inputValue("#c-mensagem")), "orçamento: levar para o convite preenche assunto e mensagem");

  // Rodapé e como funciona
  await irPara(page, "como-funciona");
  await page.click(".tecnico summary");
  ok(await page.locator(".tecnico li").first().isVisible(), "como funciona: detalhes técnicos abrem");
  await verificarLayout(page, "página inteira");

  ok(erros.length === 0, "console: nenhum erro" + (erros.length ? " (" + erros.join(" | ") + ")" : ""));
  ok(externos.length === 0, "rede: nenhum pedido para fora do site" + (externos.length ? " (" + externos.join(", ") + ")" : ""));
  await context.close();
}

(async () => {
  const browser = await chromium.launch();
  for (const tela of TELAS) { await testarTela(browser, tela); }
  await browser.close();
  console.log("\n" + (falhas === 0 ? "TUDO CERTO" : falhas + " FALHA(S)"));
  process.exit(falhas === 0 ? 0 : 1);
})();
