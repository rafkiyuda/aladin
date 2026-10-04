/**
 * Daftar semua gambar opsional. Taruh file dengan nama persis seperti di bawah
 * ke web/public/images/. Kalau file belum ada, UI otomatis memakai tampilan
 * cadangan (gradien / SVG / emoji). Brief pembuatan gambar: docs/asset-brief.md
 */
const p = (path: string) => `/images/${path}`

export const img = {
  promo: {
    p1: p('promo/promo-1-minimarket.jpg'),
    p2: p('promo/promo-2-taksi.jpg'),
    p3: p('promo/promo-3-jajan.jpg'),
    p4: p('promo/promo-4-kecantikan.jpg'),
  } as Record<string, string>,
  campaign: {
    c1: p('campaign/kalimantan-kebakaran.jpg'),
    c2: p('campaign/ntt-gempa.jpg'),
    c3: p('campaign/gaza-bantuan.jpg'),
    c4: p('campaign/sumatera-banjir.jpg'),
  } as Record<string, string>,
  berbagi: {
    zakat: p('berbagi/zakat.jpg'),
    infaq: p('berbagi/infaq.jpg'),
    wakaf: p('berbagi/wakaf.jpg'),
  } as Record<string, string>,
  illus: {
    aladinGen: p('ilustrasi/aladin-gen.png'),
    kuotaGratis: p('ilustrasi/kuota-gratis.png'),
    ajakTeman: p('ilustrasi/ajak-teman.png'),
  },
  product: {
    deposito: p('icons/produk-ala-deposito.png'),
    impian: p('icons/produk-ala-impian.png'),
  },
  shortcut: {
    'Ala Deposito': p('icons/shortcut-ala-deposito.png'),
    'Ala Impian': p('icons/shortcut-ala-impian.png'),
    Donasi: p('icons/shortcut-donasi.png'),
    'E-Wallet': p('icons/shortcut-ewallet.png'),
    Pulsa: p('icons/shortcut-pulsa.png'),
    'Paket Data': p('icons/shortcut-paket-data.png'),
    'Token Listrik': p('icons/shortcut-token-listrik.png'),
    'Tabungan Anak': p('icons/shortcut-tabungan-anak.png'),
    'Kuota Gratis': p('icons/shortcut-kuota-gratis.png'),
  } as Record<string, string>,
  goal: {
    hemat: p('icons/goal-hemat.png'),
    'masa-depan': p('icons/goal-masa-depan.png'),
    investasi: p('icons/goal-investasi.png'),
    berbagi: p('icons/goal-berbagi.png'),
    syariah: p('icons/goal-syariah.png'),
    atur: p('icons/goal-atur.png'),
  } as Record<string, string>,
  missionIcon: (id: number) => p(`icons/misi-${id}.png`),
  badge: (id: number) => p(`badges/badge-misi-${id}.png`),
  reward: {
    r1: p('icons/reward-pulsa.png'),
    r2: p('icons/reward-ewallet.png'),
    r3: p('icons/reward-voucher.png'),
    r4: p('icons/reward-donasi.png'),
  } as Record<string, string>,
  hadiahPopup: p('icons/hadiah-popup.png'),
  scene360: p('scene/warung-360.jpg'),
}
