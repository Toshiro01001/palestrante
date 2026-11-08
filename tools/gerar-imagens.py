"""Gera as imagens provisórias do site Ponto Vermelho (hero e pôsteres do mural).

Uso: python3 tools/gerar-imagens.py
Precisa do Pillow. Todas as imagens são composições abstratas, sem texto e sem pessoas.
Cores da identidade: parede, folha, tinta, cabo, tally, ciano.
"""
import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter

PAREDE = (220, 225, 227)
FOLHA = (251, 250, 246)
TINTA = (21, 34, 43)
CABO = (30, 45, 54)
TALLY = (216, 30, 39)
CIANO = (10, 140, 160)
CIANO_CLARO = (108, 208, 223)
PRATA = (169, 183, 191)

PASTA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "img")
SS = 2  # supersampling para bordas suaves


def grao(img, forca=7, seed=1):
    rnd = random.Random(seed)
    w, h = img.size
    ruido = Image.effect_noise((w, h), 40).convert("L")
    base = img.convert("RGB")
    pix = base.load()
    rp = ruido.load()
    for y in range(h):
        for x in range(w):
            d = (rp[x, y] - 128) * forca / 128.0
            r, g, b = pix[x, y]
            pix[x, y] = (max(0, min(255, int(r + d))), max(0, min(255, int(g + d))), max(0, min(255, int(b + d))))
    return base


def tela(w, h, cor):
    return Image.new("RGB", (w * SS, h * SS), cor)


def fim(img, w, h, nome, seed):
    img = img.resize((w, h), Image.LANCZOS)
    img = grao(img, 6, seed)
    img.save(os.path.join(PASTA, nome), "WEBP", quality=80, method=6)


def cabo(d, pts, largura, cor):
    """Desenha uma linha grossa e arredondada passando pelos pontos."""
    d.line(pts, fill=cor, width=largura, joint="curve")
    r = largura // 2
    for p in (pts[0], pts[-1]):
        d.ellipse((p[0] - r, p[1] - r, p[0] + r, p[1] + r), fill=cor)


def bezier(p0, p1, p2, p3, n=120):
    pts = []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 3 * p0[0] + 3 * (1 - t) ** 2 * t * p1[0] + 3 * (1 - t) * t ** 2 * p2[0] + t ** 3 * p3[0]
        y = (1 - t) ** 3 * p0[1] + 3 * (1 - t) ** 2 * t * p1[1] + 3 * (1 - t) * t ** 2 * p2[1] + t ** 3 * p3[1]
        pts.append((x, y))
    return pts


def clipes(d, x0, y0, largura, linhas, altura, seed, cores):
    rnd = random.Random(seed)
    for i in range(linhas):
        x = x0 + rnd.randint(0, 40) * SS
        y = y0 + i * (altura + 10 * SS)
        while x < x0 + largura:
            c = rnd.randint(90, 360) * SS
            c = min(c, x0 + largura - x)
            d.rounded_rectangle((x, y, x + c, y + altura), radius=6 * SS, fill=rnd.choice(cores))
            x += c + rnd.randint(6, 14) * SS


def hero():
    w, h = 1600, 1067
    img = tela(w, h, PAREDE)
    d = ImageDraw.Draw(img)
    # painel acústico: faixas verticais suaves na parede
    for i in range(0, w * SS, 120 * SS):
        d.rectangle((i, 0, i + 6 * SS, h * SS), fill=(210, 216, 219))
    # mancha de luz suave
    luz = Image.new("RGB", img.size, (0, 0, 0))
    ld = ImageDraw.Draw(luz)
    ld.ellipse((w * SS * 0.05, -h * SS * 0.3, w * SS * 0.75, h * SS * 0.7), fill=(255, 255, 255))
    luz = luz.filter(ImageFilter.GaussianBlur(160 * SS))
    img = Image.blend(img, Image.composite(Image.new("RGB", img.size, FOLHA), img, luz.convert("L")), 0.7)
    d = ImageDraw.Draw(img)
    # tira de timeline na base
    d.rectangle((0, 770 * SS, w * SS, h * SS), fill=CABO)
    clipes(d, 40 * SS, 800 * SS, 1520 * SS, 3, 62 * SS, 7, [CIANO, (14, 110, 128), CIANO_CLARO, (60, 82, 94)])
    # régua de tempo
    for i in range(0, 1600, 16):
        alto = 18 if i % 80 == 0 else 9
        d.line((i * SS, 775 * SS, i * SS, (775 + alto) * SS), fill=PRATA, width=2)
    # cabo de microfone em laço
    p = bezier((-40, 560), (320, 140), (520, 980), (760, 600))
    p += bezier((760, 600), (940, 300), (1180, 120), (1060, 420))[1:]
    p += bezier((1060, 420), (980, 640), (1300, 760), (1660, 560))[1:]
    cabo(d, [(x * SS, y * SS) for x, y in p], 22 * SS, TINTA)
    # capsula de microfone
    cx, cy = 1060, 300
    d.rounded_rectangle((cx - 70 * SS, (cy - 190) * SS, cx + 70 * SS, (cy + 40) * SS), radius=70 * SS, fill=TINTA)
    for k in range(7):
        yy = (cy - 160 + k * 28) * SS
        d.line((cx - 62 * SS, yy, cx + 62 * SS, yy), fill=(52, 70, 82), width=4 * SS)
    d.rectangle((cx - 16 * SS, (cy + 36) * SS, cx + 16 * SS, (cy + 130) * SS), fill=TINTA)
    # luz de tally
    tx, ty = 330, 250
    halo = Image.new("RGB", img.size, (0, 0, 0))
    hd = ImageDraw.Draw(halo)
    hd.ellipse(((tx - 110) * SS, (ty - 110) * SS, (tx + 110) * SS, (ty + 110) * SS), fill=(255, 255, 255))
    halo = halo.filter(ImageFilter.GaussianBlur(50 * SS)).convert("L")
    img = Image.composite(Image.new("RGB", img.size, (236, 120, 118)), img, halo.point(lambda v: int(v * 0.55)))
    d = ImageDraw.Draw(img)
    d.ellipse(((tx - 44) * SS, (ty - 44) * SS, (tx + 44) * SS, (ty + 44) * SS), fill=TALLY)
    d.ellipse(((tx - 44) * SS, (ty - 44) * SS, (tx + 44) * SS, (ty + 44) * SS), outline=TINTA, width=6 * SS)
    d.ellipse(((tx - 20) * SS, (ty - 26) * SS, (tx - 4) * SS, (ty - 12) * SS), fill=(240, 140, 140))
    fim(img, w, h, "hero.webp", 1)


def posters():
    W, H = 1280, 720

    def base(cor):
        im = tela(W, H, cor)
        return im, ImageDraw.Draw(im)

    # palestra-1: palco com cone de luz e pódio
    def palestra(nome, cor, seed, giro):
        im, d = base(cor)
        luz = Image.new("L", im.size, 0)
        ld = ImageDraw.Draw(luz)
        topo = 640 + giro
        ld.polygon([(topo * SS - 40 * SS, 0), (topo * SS + 40 * SS, 0), (topo * SS + 420 * SS, 720 * SS), (topo * SS - 420 * SS, 720 * SS)], fill=255)
        luz = luz.filter(ImageFilter.GaussianBlur(36 * SS))
        im = Image.composite(Image.new("RGB", im.size, (240, 244, 245)), im, luz.point(lambda v: int(v * 0.5)))
        d = ImageDraw.Draw(im)
        d.rectangle((0, 600 * SS, W * SS, H * SS), fill=TINTA)
        d.rounded_rectangle(((topo - 110) * SS, 470 * SS, (topo + 110) * SS, 612 * SS), radius=8 * SS, fill=FOLHA)
        d.rectangle(((topo - 6) * SS, 330 * SS, (topo + 6) * SS, 470 * SS), fill=PRATA)
        d.rounded_rectangle(((topo - 26) * SS, 250 * SS, (topo + 26) * SS, 336 * SS), radius=26 * SS, fill=TINTA)
        random.Random(seed).shuffle([])
        for i in range(14):  # silhuetas de plateia como formas
            x = (60 + i * 90 + (seed * 13 + i * 7) % 30) * SS
            r = (30 + (i * 11 + seed) % 14) * SS
            d.ellipse((x - r, 640 * SS, x + r, 640 * SS + 2 * r), fill=CABO)
        d.ellipse(((100) * SS, 90 * SS, (140) * SS, 130 * SS), fill=TALLY)
        fim(im, W, H, nome, seed)

    palestra("palestra-1.webp", CABO, 11, -60)
    palestra("palestra-2.webp", CIANO, 12, 80)

    # institucional: timeline com muitos clipes e um quadro de vídeo
    def institucional(nome, cor, seed):
        im, d = base(cor)
        d.rounded_rectangle((150 * SS, 70 * SS, 1130 * SS, 440 * SS), radius=10 * SS, fill=FOLHA)
        d.rectangle((150 * SS, 70 * SS, 1130 * SS, 440 * SS), outline=TINTA, width=4 * SS)
        d.polygon([(560 * SS, 170 * SS), (560 * SS, 340 * SS), (710 * SS, 255 * SS)], fill=TINTA)
        clipes(d, 60 * SS, 480 * SS, 1160 * SS, 3, 52 * SS, seed, [CIANO, TINTA, CIANO_CLARO, PRATA])
        d.rectangle((760 * SS, 465 * SS, 766 * SS, 690 * SS), fill=TALLY)
        fim(im, W, H, nome, seed)

    institucional("institucional-1.webp", PAREDE, 21)
    institucional("institucional-2.webp", (205, 226, 231), 22)

    # evento: círculos de luz (bokeh) e arcos de plateia
    def evento(nome, cor, seed):
        im, d = base(cor)
        rnd = random.Random(seed)
        bok = Image.new("RGB", im.size, cor)
        bd = ImageDraw.Draw(bok)
        for _ in range(34):
            r = rnd.randint(26, 90) * SS
            x, y = rnd.randint(0, W) * SS, rnd.randint(0, 460) * SS
            bd.ellipse((x - r, y - r, x + r, y + r), fill=rnd.choice([CIANO_CLARO, FOLHA, PRATA, CIANO]))
        bok = bok.filter(ImageFilter.GaussianBlur(10 * SS))
        im = Image.blend(im, bok, 0.75)
        d = ImageDraw.Draw(im)
        for i in range(5):
            r = (900 - i * 130) * SS
            d.ellipse((640 * SS - r, 1000 * SS - r, 640 * SS + r, 1000 * SS + r), outline=(14, 26, 33), width=26 * SS)
        d.ellipse((1100 * SS, 70 * SS, 1160 * SS, 130 * SS), fill=TALLY)
        fim(im, W, H, nome, seed)

    evento("evento-1.webp", CABO, 31)
    evento("evento-2.webp", (60, 82, 94), 32)

    # depoimento: quadro com guias de terços e uma forma de busto abstrata
    im, d = base(PAREDE)
    d.rectangle((300 * SS, 40 * SS, 980 * SS, 680 * SS), fill=FOLHA)
    for k in (1, 2):
        d.line(((300 + k * 680 / 3) * SS, 40 * SS, (300 + k * 680 / 3) * SS, 680 * SS), fill=(190, 198, 202), width=2 * SS)
        d.line((300 * SS, (40 + k * 640 / 3) * SS, 980 * SS, (40 + k * 640 / 3) * SS), fill=(190, 198, 202), width=2 * SS)
    d.ellipse((560 * SS, 190 * SS, 720 * SS, 350 * SS), fill=CIANO)
    d.pieslice((470 * SS, 370 * SS, 810 * SS, 800 * SS), 180, 360, fill=CIANO)
    d.rounded_rectangle((300 * SS, 40 * SS, 980 * SS, 680 * SS), radius=0, outline=TINTA, width=5 * SS)
    d.ellipse((930 * SS, 60 * SS, 960 * SS, 90 * SS), fill=TALLY)
    fim(im, W, H, "depoimento-1.webp", 41)

    # aula: três "slides" empilhados e uma barra de progresso
    im, d = base(CABO)
    for i, (x, y, c) in enumerate([(120, 150, PRATA), (220, 110, CIANO_CLARO), (320, 70, FOLHA)]):
        d.rounded_rectangle((x * SS, y * SS, (x + 640) * SS, (y + 380) * SS), radius=10 * SS, fill=c)
    d.rectangle((380 * SS, 140 * SS, 640 * SS, 160 * SS), fill=TINTA)
    for k in range(4):
        d.rectangle((380 * SS, (200 + k * 44) * SS, (900 - k * 90) * SS, (218 + k * 44) * SS), fill=(190, 198, 202))
    d.rectangle((120 * SS, 620 * SS, 1160 * SS, 640 * SS), fill=(60, 82, 94))
    d.rectangle((120 * SS, 620 * SS, 700 * SS, 640 * SS), fill=CIANO_CLARO)
    d.ellipse((690 * SS, 612 * SS, 714 * SS, 648 * SS), fill=TALLY)
    fim(im, W, H, "aula-1.webp", 51)


if __name__ == "__main__":
    os.makedirs(PASTA, exist_ok=True)
    # hero() desativado: img/hero.webp agora é a foto do Canva e não deve ser recriada
    posters()
    print("imagens geradas em", os.path.abspath(PASTA))
