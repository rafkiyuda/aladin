"""Potong sprite sheet maskot (folder Maskot/) menjadi PNG transparan per pose.

Jalankan: python3 web/scripts/crop_mascot.py
"""
import os
from PIL import Image, ImageDraw
import numpy as np
from collections import deque

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

src = Image.open(os.path.join(ROOT, 'Maskot', 'WhatsApp Image 2026-10-04 at 16.21.35.jpeg')).convert('RGB')
out = os.path.join(ROOT, 'web', 'public', 'mascot') + os.sep

boxes = {
  'gift':    (12, 58, 478, 358),
  'hello':   (498, 62, 978, 358),
  'point':   (992, 82, 1220, 358),
  'trophy':  (22, 372, 425, 680),
  'idea':    (498, 362, 805, 680),
  'shield':  (828, 400, 1135, 680),
  'think':   (1200, 380, 1495, 680),
  'pray':    (14, 726, 228, 1004),
  'book':    (232, 706, 466, 1004),
  'insight': (468, 716, 756, 1004),
  'love':    (774, 736, 986, 1004),
  'phone':   (984, 736, 1188, 1004),
  'thumbs':  (1188, 742, 1448, 1004),
}

def shift_or(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out

def remove_bg(im, tol=28):
    a = np.array(im.convert('RGBA'))
    h, w = a.shape[:2]
    rgb = a[:, :, :3].astype(int)
    bright = (rgb.min(axis=2) > 255 - tol)
    dark = rgb.max(axis=2) < 150
    # tebalkan garis gelap supaya flood fill tidak bocor lewat celah outline
    passable = bright & ~shift_or(dark, 3)
    seen = np.zeros((h, w), bool)
    q = deque()
    for y in range(h):
        for x in range(w):
            if (y in (0, h - 1) or x in (0, w - 1)) and passable[y, x] and not seen[y, x]:
                seen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and passable[ny, nx]:
                seen[ny, nx] = True; q.append((ny, nx))
    # kembalikan piksel terang di dekat area yg sudah dihapus
    seen = seen | (shift_or(seen, 4) & bright)
    a[seen, 3] = 0
    return Image.fromarray(a)

for name, box in boxes.items():
    im = src.crop(box)
    if name == 'thumbs':
        # hapus gelembung teks di kanan atas
        a = np.array(im)
        y2, x1 = 832 - box[1], 1296 - box[0]
        region = a[:y2, x1:]
        ri = region.astype(int)
        region[(ri.min(axis=2) > 140) & (ri[:, :, 2] >= ri[:, :, 0])] = 255
        im = Image.fromarray(a)
        d = ImageDraw.Draw(im)
        d.rectangle((1338 - box[0], 0, im.width, 822 - box[1]), fill='white')
    if name == 'insight':
        d = ImageDraw.Draw(im)
        d.rectangle((0, 0, 500 - box[0], 822 - box[1]), fill='white')
    im = remove_bg(im)
    bb = im.getbbox()
    im = im.crop(bb)
    im.save(out + name + '.png', optimize=True)
    print(name, im.size)
