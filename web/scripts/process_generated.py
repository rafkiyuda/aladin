"""Olah gambar hasil Gemini (Assets/generated/) menjadi aset web (web/public/images/).

- Foto: crop ke rasio target + resize, simpan JPG.
- Ilustrasi & ikon: hapus latar "kotak-kotak transparan palsu" / putih, simpan PNG transparan.
- Lembar ikon: dipotong per ikon (label teks dibuang).

Jalankan: python3 web/scripts/process_generated.py
Edit dict MAPPING kalau ada gambar baru.
"""
import os
from collections import deque

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'Assets', 'generated')
OUT = os.path.join(ROOT, 'web', 'public', 'images')

# file sumber -> (tujuan, jenis, ukuran)
MAPPING = {
    # promo 2:1
    'Gemini_Generated_Image_3b0k4q3b0k4q3b0k (1).jpeg': ('promo/promo-1-minimarket.jpg', 'photo', (1200, 600)),
    'Gemini_Generated_Image_3b0k4q3b0k4q3b0k.jpeg': ('promo/promo-2-taksi.jpg', 'photo', (1200, 600)),
    'Gemini_Generated_Image_3b0k4q3b0k4q3b0k (2).jpeg': ('promo/promo-3-jajan.jpg', 'photo', (1200, 600)),
    'f5caf475-1160-4f4f-8e76-1fae8c8d3202.jpeg': ('promo/promo-4-kecantikan.jpg', 'photo', (1200, 600)),
    # kampanye 2:1
    'ed6d2b69-d0f2-4cd3-813b-9d99efdb2c5a.jpeg': ('campaign/kalimantan-kebakaran.jpg', 'photo', (1200, 600)),
    'dedcdc22-b65e-4518-98b3-1f2ccb0dc038.jpeg': ('campaign/ntt-gempa.jpg', 'photo', (1200, 600)),
    '057985d3-04c9-44ba-bd8e-003d3948f6ec.jpeg': ('campaign/gaza-bantuan.jpg', 'photo', (1200, 600)),
    'deeffac7-971e-4003-aa74-0361a7618c73.jpeg': ('campaign/sumatera-banjir.jpg', 'photo', (1200, 600)),
    # berbagi 4:3
    'ccf92b77-89cc-4a22-8a74-21e27ce2fd35.jpeg': ('berbagi/zakat.jpg', 'photo', (1000, 750)),
    'f86e124b-e103-4953-8a5e-f474648645af.jpeg': ('berbagi/infaq.jpg', 'photo', (1000, 750)),
    '5c2fb4b6-3559-4904-88b0-e33190ae3b4f.jpeg': ('berbagi/wakaf.jpg', 'photo', (1000, 750)),
    # ilustrasi (latar kotak-kotak palsu)
    'a2972866-231e-4c3a-bf3b-84bd75dc0fce.jpeg': ('ilustrasi/aladin-gen.png', 'cutout', 800),
    '47239283-bd0f-438d-a5c1-dec9545592b5.jpeg': ('ilustrasi/kuota-gratis.png', 'cutout', 800),
    'e64ca388-f9e7-46b6-a8ba-6a97c0fce9b1.jpeg': ('ilustrasi/ajak-teman.png', 'cutout', 800),
    # ikon produk
    '7cd7cc9e-4bdf-4388-8be5-b823f13f879e.jpeg': ('icons/produk-ala-deposito.png', 'icon', 512),
    'e01cfc25-16f7-4a42-85a5-435186525a91.jpeg': ('icons/produk-ala-impian.png', 'icon', 512),
}

ICON_SHEET = 'b3d27ff4-edf6-4ca4-868b-c1f4d5295fd8.jpeg'
SHEET_TILES = [  # baris 1 & 2: tile shortcut (urut kiri -> kanan)
    'shortcut-ala-deposito', 'shortcut-ala-impian', 'shortcut-donasi', 'shortcut-ewallet',
    'shortcut-pulsa', 'shortcut-paket-data', 'shortcut-token-listrik',
    'shortcut-tabungan-anak', 'shortcut-kuota-gratis',
]
SHEET_GOALS = ['goal-hemat', 'goal-masa-depan', 'goal-investasi', 'goal-berbagi', 'goal-syariah', 'goal-atur']


def save(im, rel):
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if rel.endswith('.jpg'):
        im.convert('RGB').save(path, quality=84, optimize=True, progressive=True)
    else:
        im.save(path, optimize=True)
    print('->', rel, im.size)


def crop_to_ratio(im, w, h):
    r = w / h
    iw, ih = im.size
    if iw / ih > r:  # terlalu lebar: potong kiri-kanan sama rata
        nw = round(ih * r)
        x = (iw - nw) // 2
        im = im.crop((x, 0, x + nw, ih))
    else:  # terlalu tinggi: potong atas-bawah
        nh = round(iw / r)
        y = (ih - nh) // 2
        im = im.crop((0, y, iw, y + nh))
    return im.resize((w, h), Image.LANCZOS)


def grow(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out


def remove_bg(im, min_bright=205, max_sat=14, barrier=2):
    """Hapus latar terang & netral (putih / kotak-kotak abu) yang terhubung ke tepi."""
    a = np.array(im.convert('RGBA'))
    h, w = a.shape[:2]
    rgb = a[:, :, :3].astype(int)
    bright = (rgb.min(axis=2) >= min_bright) & ((rgb.max(axis=2) - rgb.min(axis=2)) <= max_sat)
    dark = rgb.max(axis=2) < 120
    passable = bright & ~grow(dark, barrier)
    seen = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if passable[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if passable[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and passable[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    seen |= grow(seen, barrier + 1) & bright
    a[seen, 3] = 0
    # haluskan tepi: piksel di batas dibuat semi transparan
    edge = grow(seen, 1) & ~seen
    a[edge, 3] = 170
    return Image.fromarray(a)


def trim(im, pad=6):
    bb = im.getbbox()
    if not bb:
        return im
    x0, y0, x1, y1 = bb
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


def square(im, size):
    s = max(im.size)
    canvas = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    canvas.paste(im, ((s - im.width) // 2, (s - im.height) // 2), im)
    return canvas.resize((size, size), Image.LANCZOS)


def fit_width(im, w):
    if im.width <= w:
        return im
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def segments(mask_1d, min_len):
    segs, start = [], None
    for i, v in enumerate(list(mask_1d) + [False]):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= min_len:
                segs.append((start, i))
            start = None
    return segs


def process_icon_sheet():
    im = Image.open(os.path.join(SRC, ICON_SHEET)).convert('RGB')
    a = np.array(im).astype(int)
    ink = a.min(axis=2) < 232  # bukan putih
    # baris-baris konten (tile & ikon) dipisah oleh baris putih
    rows = segments(ink.any(axis=1), 60)  # label teks pendek (<60px) otomatis terbuang
    boxes = []
    for y0, y1 in rows:
        for x0, x1 in segments(ink[y0:y1].any(axis=0), 40):
            # ambil blok vertikal tertinggi (ikon), abaikan label teks di bawahnya
            vs = segments(ink[y0:y1, x0:x1].any(axis=1), 1)
            vy0, vy1 = max(vs, key=lambda v: v[1] - v[0])
            sub = ink[y0 + vy0:y0 + vy1, x0:x1]
            xs = np.where(sub.any(axis=0))[0]
            boxes.append((x0 + xs[0], y0 + vy0, x0 + xs[-1] + 1, y0 + vy1))
    boxes.sort(key=lambda b: (round(b[1] / 80), b[0]))
    tiles, goals = boxes[:len(SHEET_TILES)], boxes[len(SHEET_TILES):]
    print('tiles', len(tiles), 'goals', len(goals))

    for name, (x0, y0, x1, y1) in zip(SHEET_TILES, tiles):
        # tile: potong kotak lalu beri sudut membulat (bayangan luar dibuang)
        tile = im.crop((x0 + 2, y0 + 2, x1 - 4, y1 - 6)).convert('RGBA')
        s = min(tile.size)
        # rata atas: tile selalu di atas, sisa label (kalau ada) ada di bawah
        tile = tile.crop(((tile.width - s) // 2, 0, (tile.width - s) // 2 + s, s))
        mask = Image.new('L', (s * 4, s * 4), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, s * 4 - 1, s * 4 - 1), radius=int(s * 4 * 0.2), fill=255)
        tile.putalpha(mask.resize((s, s), Image.LANCZOS))
        save(tile.resize((256, 256), Image.LANCZOS), f'icons/{name}.png')

    for name, (x0, y0, x1, y1) in zip(SHEET_GOALS, goals):
        icon = im.crop((max(0, x0 - 8), max(0, y0 - 8), x1 + 8, y1 + 8))
        save(square(trim(remove_bg(icon, min_bright=236, max_sat=10)), 256), f'icons/{name}.png')


def main():
    for src, (dst, kind, size) in MAPPING.items():
        path = os.path.join(SRC, src)
        if not os.path.exists(path):
            print('!! tidak ada:', src)
            continue
        im = Image.open(path)
        if kind == 'photo':
            save(crop_to_ratio(im.convert('RGB'), *size), dst)
        elif kind == 'cutout':
            save(fit_width(trim(remove_bg(im)), size), dst)
        elif kind == 'icon':
            save(square(trim(remove_bg(im)), size), dst)
    process_icon_sheet()


if __name__ == '__main__':
    main()
