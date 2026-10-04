# Aladin Clone (web, tampilan mobile)

Prototipe website Aladin dengan tampilan mobile: lebar dikunci 430px dan berada di tengah saat dibuka di desktop.
Dibangun dengan React + Vite + TypeScript + Tailwind v4. Data dummy disimpan di `localStorage`.

```bash
npm install
npm run dev
```

## Alur

**Onboarding (pengguna baru):** Beranda → pop-up undangan AI → pilih tujuan → Aladin Journey → Misi 1–5 → badge per misi → Journey Completed (total reward Rp25.000, Rp5.000 per misi).

**Daily usage (setelah onboarding):** beranda personal, insight proaktif, Transfer dengan edukasi mikro, Transfer Berhasil dengan opsi pencatatan kategori, dashboard Keuangan (tab Pengeluaran), Kembangkan Uangmu, dan Aladin Challenge (poin & tukar reward).

Untuk mengulang dari awal sebagai pengguna baru: **Profil → Reset Demo**.

## Struktur

- `src/data.ts`: semua data dummy (misi, promo, produk, transaksi, challenge)
- `src/state/AppState.tsx`: state global + persist ke localStorage
- `src/components/`: komponen bersama (Mascot, Carousel, BottomNav, Modal, dll.)
- `src/pages/`: halaman
- `public/mascot/`: pose maskot hasil potongan sprite `../Maskot/` lewat `scripts/crop_mascot.py`
