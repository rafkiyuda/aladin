# Brief Aset Gambar: Aladin Clone

Dokumen ini berisi daftar semua gambar yang bisa dibuat dengan AI image generator (Gemini, dll.) untuk menggantikan tampilan sementara di web.

**Cara pakai:**
1. Tempel **Style Guide** di bawah ke Gemini terlebih dulu (sekali per sesi), lalu tempel prompt per gambar.
2. Simpan hasilnya dengan **nama & folder persis** seperti kolom *File*, di dalam `web/public/images/`.
3. Refresh browser. Gambar langsung terpakai. Kalau file belum ada, web otomatis memakai tampilan cadangan, jadi bisa dicicil.

> Hasil Gemini di `Assets/generated/` diolah dengan `python3 web/scripts/process_generated.py` (crop, hapus latar kotak-kotak, potong lembar ikon). Tambahkan file baru ke dict `MAPPING` di skrip itu.
>
> Ukuran tidak harus persis. Yang penting **rasio** sama (boleh di-crop/resize). Kalau repot, taruh saja hasil mentahnya di `Assets/generated/` dan minta Claude untuk crop + rename.
>
> Daftar path di sini sama dengan `web/src/images.ts`. Kalau mengubah nama file, ubah juga di sana.

---

## 0. Style Guide (tempel duluan ke Gemini)

```
You are generating image assets for a mobile Islamic (sharia) digital banking app called "Aladin".
Brand palette: deep navy #0B1A5E, royal blue #2323C9, mint green #2EE6B0, warm gold #F5A524, soft lavender #ECEEFC, white.
Mood: friendly, warm, trustworthy, modern Indonesian, subtle Islamic touches (crescent moon, mosque silhouettes, stars) only where it fits.
Rules for every image:
- NO text, NO letters, NO numbers, NO logos, NO watermarks (the app overlays its own text).
- No real brand logos or trademarks.
- People: Indonesian, modest clothing; women wear hijab. Avoid recognizable real persons.
- Clean composition with negative space where text will be overlaid (I will specify where).
```

**Dua gaya yang dipakai:**
- **[FOTO]**: fotografi realistis, cahaya natural, sedikit warm, kontras sedang.
- **[ILUSTRASI]**: flat illustration dengan outline navy tebal (#1E1B4B), warna solid putih / mint / royal blue, gaya sama dengan maskot hijab Aladin (lihat folder `Maskot/`). Tambahkan ke prompt: *"Match the style of the attached mascot image"* dan lampirkan sprite maskot.
- **[3D ICON]**: ikon 3D clay/soft, sudut membulat, bayangan lembut, palet brand, background transparan.

---

## 1. Banner Promo: "Temukan Berkah" (Beranda)

Rasio **2:1** (1200×600), JPG. Teks (nama brand, nominal, periode) ditimpa oleh web di **sisi kiri 40%**, jadi subjek harus di **kanan**, sisi kiri gelap/polos (navy ke teal).

| File | Prompt |
|---|---|
| `promo/promo-1-minimarket.jpg` | [FOTO] A shopping basket overflowing with Indonesian groceries (instant noodles, cooking oil, snacks, gallon water) and a smartphone showing a payment success screen, placed on the right side. Left 40% is a smooth dark navy-to-teal gradient with a subtle crescent moon and tiny stars. Festive but clean. |
| `promo/promo-2-taksi.jpg` | [FOTO] A young Indonesian woman in hijab and a man in batik shirt smiling next to a light-blue sedan taxi on a Jakarta street, on the right side. Left 40% fades into deep teal-navy gradient. No logos or plate numbers readable. |
| `promo/promo-3-jajan.jpg` | [FOTO] Convenience-store snacks on a green podium: fried chicken, onigiri, iced drinks, bento, on the right side. Left 40% dark navy with soft green glow and a small crescent moon. Product shot, appetizing. |
| `promo/promo-4-kecantikan.jpg` | [FOTO] A cheerful hijab woman holding a smartphone next to a shopping basket of skincare products on a mint podium, on the right side. Left 40% dark emerald-navy gradient. |

## 2. Kampanye Donasi: "Bantu Bangun Sesama" (Beranda)

Rasio **2:1** (1200×600), JPG. Judul ditimpa di **bawah-kiri**, jadi sepertiga bawah boleh lebih gelap. Hormati martabat korban: tidak ada luka, tidak sensasional, wajah tidak jelas.

| File | Prompt |
|---|---|
| `campaign/kalimantan-kebakaran.jpg` | [FOTO] A tropical peat forest in Kalimantan burning at dusk, thick orange smoke rising over tall trees, documentary style, wide shot, no people. Lower third darker. |
| `campaign/ntt-gempa.jpg` | [FOTO] Aftermath of an earthquake in a hilly East Nusa Tenggara village: collapsed concrete houses, cracked road, mountains in the background, overcast sky, documentary style, no people. |
| `campaign/gaza-bantuan.jpg` | [FOTO] Close-up of a volunteer's gloved hands handing a loaf of bread to another hand, humanitarian aid distribution, blurred tents in the background, hopeful, faces not visible. |
| `campaign/sumatera-banjir.jpg` | [FOTO] Flooded village in Sumatra, brown water up to house windows, a rescue boat with volunteers in orange vests seen from behind, documentary style. |

## 3. Ala Berbagi: Zakat / Infaq / Wakaf (Beranda)

Rasio **4:3** (1000×750), JPG. Kartu berlatar **royal blue #2323C9**, teks di kiri, jadi subjek di **kanan**, sisi kiri menyatu ke biru.

| File | Prompt |
|---|---|
| `berbagi/zakat.jpg` | [FOTO] Portrait of an elderly Indonesian laborer with a weathered face and white cap, looking down humbly, warm light, on the right; left side blends into solid royal blue #2323C9. |
| `berbagi/infaq.jpg` | [FOTO] Two Indonesian children hugging and laughing, warm natural light, on the right; left side blends into solid royal blue #2323C9. |
| `berbagi/wakaf.jpg` | [FOTO] Open cupped hands raised in prayer (doa), soft green blurred background of a mosque courtyard, on the right; left side blends into royal blue #2323C9. |

## 4. Ilustrasi "Menarik dari Aladin" & "Ajak Teman" (Beranda)

Rasio **4:3** (800×600), PNG **transparan**. Ditaruh di **kanan-bawah** kartu (lebar ±45%).

| File | Prompt |
|---|---|
| `ilustrasi/aladin-gen.png` | [ILUSTRASI] A cheerful boy in a blue bucket hat putting coins into a glass jar, next to the hijab mascot waving, small sparkles, green ground patch. Transparent background. |
| `ilustrasi/kuota-gratis.png` | [ILUSTRASI] Two hands (one in royal-blue sleeve) holding out a big mint-green gift box with a black-outlined ribbon bow. Transparent background. |
| `ilustrasi/ajak-teman.png` | [ILUSTRASI] A group of four diverse Indonesian friends (one woman in hijab) cheering and raising hands, confetti doodles. Transparent background. |

## 5. Ikon Produk Tabungan

**1:1** (512×512), PNG transparan. [3D ICON].

| File | Prompt |
|---|---|
| `icons/produk-ala-deposito.png` | [3D ICON] A rounded navy-blue safe/vault seen from the front with a gold square door frame and a white X-shaped handle in the middle. |
| `icons/produk-ala-impian.png` | [3D ICON] A rounded navy-blue savings jar with a gold lid and a big gold star on the front. |

## 6. Ikon Shortcut Beranda

**1:1** (256×256), PNG. Tiap ikon **sudah termasuk tile**: rounded square putih, border abu-abu tipis, bayangan halus, ikon 3D kecil di tengah. Kecuali yang disebut lain.

| File | Isi ikon |
|---|---|
| `icons/shortcut-ala-deposito.png` | Tile **navy** (bukan putih), ikon vault emas kecil |
| `icons/shortcut-ala-impian.png` | Jar navy dengan bintang emas |
| `icons/shortcut-donasi.png` | Dua tangan hijau mint menangkup hati |
| `icons/shortcut-ewallet.png` | Dompet biru dengan kartu |
| `icons/shortcut-pulsa.png` | Smartphone biru dengan koin oranye "Rp" (simbol saja, tanpa teks lain) |
| `icons/shortcut-paket-data.png` | Smartphone biru dengan simbol wifi oranye |
| `icons/shortcut-token-listrik.png` | Petir biru dengan koin oranye |
| `icons/shortcut-tabungan-anak.png` | Tile **hijau muda**, celengan/jar kecil dengan bintang |
| `icons/shortcut-kuota-gratis.png` | Kado oranye dengan pita |

Prompt template: `[3D ICON] App shortcut icon: {isi ikon}, centered on a white rounded-square tile with a thin light-grey border and soft drop shadow, 256x256.`

## 7. Ikon Tujuan Keuangan (layar "Apa tujuan keuanganmu?")

**1:1** (256×256), PNG transparan, [3D ICON], tanpa tile.

| File | Isi ikon |
|---|---|
| `icons/goal-hemat.png` | Celengan babi pink |
| `icons/goal-masa-depan.png` | Toples tabungan kaca berisi koin emas |
| `icons/goal-investasi.png` | Grafik batang naik hijau-mint dengan panah |
| `icons/goal-berbagi.png` | Hati merah dengan tangan |
| `icons/goal-syariah.png` | Masjid kecil dengan kubah emas & bulan sabit |
| `icons/goal-atur.png` | Struk/nota dengan pensil |

## 7b. Ikon Misi (daftar "Aladin Journey")

**1:1** (512×512), PNG. Ditampilkan kecil (48 px) di daftar misi, jadi bentuknya harus **sederhana & tebal**, terbaca di ukuran kecil. Tiap ikon **sudah termasuk tile**: rounded square berwarna (radius ±22%) dengan ikon 3D putih/terang di tengah. Centang "selesai" ditambahkan otomatis oleh web, jadi **jangan** gambar centang.

Satu seri, gaya & pencahayaan harus sama untuk kelima ikon. Generate berurutan dalam satu sesi, atau minta kelimanya dalam **satu gambar grid 5 kolom** lalu biarkan Claude memotongnya.

| File | Warna tile | Isi ikon |
|---|---|---|
| `icons/misi-1.png` | royal blue #2323C9 | Roket putih kecil meluncur keluar dari bingkai scan QR (4 sudut), jejak api oranye |
| `icons/misi-2.png` | hijau #16A34A | Grafik batang putih naik + nota/struk kecil di belakangnya |
| `icons/misi-3.png` | emas #F5A524 | Tunas tanaman hijau muda tumbuh dari tumpukan koin putih/emas |
| `icons/misi-4.png` | merah-pink #E11D48 | Dua tangan putih menangkup hati kecil |
| `icons/misi-5.png` | ungu #7C3AED | Buku terbuka putih dengan siluet kubah masjid & bulan sabit kecil |

Prompt template:
```
[3D ICON] Mobile app mission icon, 512x512. A {warna tile} rounded-square tile (corner radius about 22%, soft inner glow, subtle top highlight) with a chunky glossy 3D {isi ikon} in white and soft accent colors centered on it. Simple bold shapes that stay readable at 48px. Soft drop shadow under the symbol. Plain white background outside the tile. No text, no numbers, no checkmark.
```

Prompt sekaligus 5 (satu gambar):
```
[3D ICON] A set of 5 matching mobile app mission icons arranged in one row on a plain white background, equal size and spacing, same lighting and style. Each is a colored rounded-square tile (corner radius about 22%) with a chunky glossy 3D white symbol in the middle:
1) royal blue #2323C9 tile: a small rocket launching out of a QR-scan frame (four corner brackets), orange flame;
2) green #16A34A tile: rising bar chart with a small receipt behind it;
3) gold #F5A524 tile: a light-green sprout growing from a stack of coins;
4) pink-red #E11D48 tile: two hands cupping a small heart;
5) purple #7C3AED tile: an open book with a small mosque dome and crescent silhouette.
Simple bold shapes readable at 48px. No text, no numbers, no checkmarks.
```

## 8. Badge Misi (layar "Misi X Selesai!")

**1:1** (512×512), PNG transparan. Satu seri yang konsisten: **hexagon navy dengan bingkai emas, dua pita merah di bawah**, simbol berbeda di tengah, warna glow sesuai misi.

| File | Simbol tengah | Warna aksen |
|---|---|---|
| `badges/badge-misi-1.png` | Bingkai scan QR + roket kecil | royal blue #2323C9 |
| `badges/badge-misi-2.png` | Grafik batang + nota | hijau #16A34A |
| `badges/badge-misi-3.png` | Tunas tanaman tumbuh dari koin | emas #F5A524 |
| `badges/badge-misi-4.png` | Dua tangan menangkup hati | merah #E11D48 |
| `badges/badge-misi-5.png` | Buku terbuka dengan kubah masjid | ungu #7C3AED |

Prompt template: `[3D ICON] Achievement badge: navy hexagon with a thick gold border and two red ribbons hanging below, centered symbol: {simbol}, glowing {warna} accent, game-like but premium.`

## 9. Ikon Reward (Aladin Challenge)

**1:1** (256×256), PNG transparan, [3D ICON].

| File | Isi |
|---|---|
| `icons/reward-pulsa.png` | Smartphone dengan sinyal |
| `icons/reward-ewallet.png` | Kartu & dompet digital |
| `icons/reward-voucher.png` | Tas belanja pink dengan tiket voucher |
| `icons/reward-donasi.png` | Dua tangan berdoa dengan kilau |

## 10. Panorama 360° Warung (simulasi Scan QRIS)

File: `scene/warung-360.jpg`, rasio **18:7** (3600×1400), JPG.

Ini background yang digeser user saat "Coba Scan QRIS". Standee QRIS & kode QR **dirender oleh web di atasnya**, jadi **jangan** gambar QR/standee.

Syarat penting:
- **Seamless horizontal:** tepi kiri & kanan harus menyambung (diputar 360°).
- **Meja kasir kayu** membentang horizontal dari **±60% sampai ±97%** lebar gambar, dengan **permukaan atas meja di ±77% tinggi**.
- Area **71%–81% lebar × 39%–76% tinggi** harus **kosong** (dinding polos di belakang), karena standee QRIS ditaruh di situ.
- Sisa ruangan: jendela, pintu kaca bertulisan tanpa teks, rak produk warna-warni, papan menu (tanpa tulisan terbaca), tanaman.

Prompt:
```
[FOTO] A seamless 360-degree horizontal panorama (equirectangular-style, but keep straight vertical lines) of the interior of a cozy, clean Indonesian coffee shop / warung, eye-level, warm daylight. From left to right: a wooden-frame window, a glass door, colorful product shelves, a blank chalk menu board, a long wooden cashier counter spanning from 60% to 97% of the width with the counter top at 77% of the image height, a small cash register at around 88% width, a potted plant near the right edge. Keep the wall area between 71% and 81% of the width empty (plain wall above the counter). Left and right edges must connect seamlessly. No people, no text, no QR codes, no logos. 3600x1400.
```

> Kalau hasilnya tidak pas dengan posisi standee, kirim saja gambarnya. Posisi QR bisa disesuaikan di `QR = { x, y, size }` di `web/src/components/QrisScanner.tsx`.

## 11. (Opsional) Maskot

Pose `thumbs` hasil crop masih menyisakan garis tipis bekas gelembung teks. Kalau mau lebih bersih, generate ulang tiap pose sebagai **PNG transparan terpisah** (± 600 px tinggi), lalu simpan langsung ke `web/public/mascot/<nama-pose>.png`:

`gift, hello, point, trophy, idea, shield, think, pray, book, insight, love, phone, thumbs`

Prompt template (lampirkan sprite `Maskot/`): `[ILUSTRASI] The same hijab mascot character from the attached sheet, pose: {deskripsi pose}, half body, transparent background, no speech bubble.`

---

## Checklist

- [x] 4 banner promo
- [x] 4 foto kampanye donasi
- [x] 3 foto Ala Berbagi
- [x] 3 ilustrasi (Aladin Gen, Kuota Gratis, Ajak Teman)
- [x] 2 ikon produk
- [x] 9 ikon shortcut
- [x] 6 ikon tujuan
- [x] 5 ikon misi (daftar journey)
- [ ] 5 badge misi
- [ ] 4 ikon reward
- [ ] 1 panorama warung 360°
- [ ] (opsional) 13 pose maskot
