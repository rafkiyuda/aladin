// Data dummy untuk prototipe. Semua angka & nama hanya contoh.

export const formatRp = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID')

export type GoalId = 'hemat' | 'investasi' | 'berbagi' | 'atur' | 'syariah' | 'masa-depan'

export const goals: { id: GoalId; label: string; emoji: string }[] = [
  { id: 'hemat', label: 'Lebih hemat', emoji: '🐷' },
  { id: 'masa-depan', label: 'Menabung untuk masa depan', emoji: '🫙' },
  { id: 'investasi', label: 'Mengembangkan uang', emoji: '📈' },
  { id: 'berbagi', label: 'Berbagi lebih banyak', emoji: '❤️' },
  { id: 'syariah', label: 'Paham keuangan syariah', emoji: '🕌' },
  { id: 'atur', label: 'Atur pengeluaran', emoji: '🧾' },
]

export type Mission = {
  id: number
  title: string
  subtitle: string
  desc: string
  reward: number
  color: string
}

export const MISSION_REWARD = 5000

export const missions: Mission[] = [
  { id: 1, title: 'Kenalan dengan Fitur Utama', subtitle: 'Scan. Bayar. Beres.', desc: 'Coba bayar pakai QRIS Aladin', reward: MISSION_REWARD, color: '#2323c9' },
  { id: 2, title: 'Atur Pengeluaranmu', subtitle: 'Kategorikan & buat budget', desc: 'Kategorikan transaksi & buat budget', reward: MISSION_REWARD, color: '#16a34a' },
  { id: 3, title: 'Kembangkan Uangmu', subtitle: 'Kenali produk simpanan', desc: 'Kenalan dengan produk simpanan & investasi syariah', reward: MISSION_REWARD, color: '#f5a524' },
  { id: 4, title: 'Berbagi Lebih Bermakna', subtitle: 'Zakat, infak, sedekah', desc: 'Kenalan dengan produk zakat, infak, sedekah', reward: MISSION_REWARD, color: '#e11d48' },
  { id: 5, title: 'Syariah in 30 Seconds', subtitle: 'Bedanya bank konvensional & syariah', desc: 'Bedanya bank konvensional & syariah', reward: MISSION_REWARD, color: '#7c3aed' },
]

export const ONBOARDING_TOTAL_REWARD = missions.reduce((s, m) => s + m.reward, 0)

export const promos = [
  { id: 'p1', brand: 'Alfagift', tag: 'Promo Eksklusif Pengguna Baru', title: 'Hadiah langsung Saldo', amount: 'Rp50.000!', period: '1 Okt – 30 Nov 2026', from: '#0b1a5e', to: '#0f766e' },
  { id: 'p2', brand: 'Bluebird', tag: 'Bluebird Hemat Pakai Aladin', title: 'Dapatkan rezeki saldo', amount: 'Rp10.000', period: '1 Sep – 31 Okt 2026', from: '#0f766e', to: '#0b1a5e' },
  { id: 'p3', brand: 'Lawson', tag: 'Promo Jajan Lawson', title: 'Dapatkan Potongan', amount: 'Rp10.000', period: '1 Okt – 30 Nov 2026', from: '#0b1a5e', to: '#115e59' },
  { id: 'p4', brand: 'Dan Dan', tag: 'Cantik Hemat', title: 'Cashback belanja', amount: '20%', period: '1 Okt – 31 Okt 2026', from: '#065f46', to: '#0b1a5e' },
]

export const savingsProducts = [
  { id: 'deposito', name: 'Ala Deposito', rate: '8,5%p.a.*', tagline: 'Maksimalkan bagi hasil', cta: 'Buka Deposito', note: '*Sesuai realisasi pendapatan Bank berdasarkan nisbah nasabah:bank 85%:15%, sebelum dipotong pajak.', min: 'Mulai dari Rp1.000.000', kind: 'Deposito' },
  { id: 'impian', name: 'Ala Impian', rate: '8%p.a.*', tagline: 'Nabung fleksibel, capai impianmu', cta: 'Buka Impian', note: '*Berdasarkan realisasi 3 bulan terakhir dengan nisbah nasabah:bank 80%:20%. Sebelum dipotong pajak.', min: 'Mulai dari Rp10.000', kind: 'Tabungan' },
]

export const campaigns = [
  { id: 'c1', title: 'Bantu Kalimantan Pulih', partner: 'Rumah Zakat', from: '#7c2d12', to: '#1c1917', raised: 62 },
  { id: 'c2', title: 'Bantu NTT Pulih', partner: 'Baznas', from: '#44403c', to: '#1c1917', raised: 48 },
  { id: 'c3', title: 'Bantu Bangun Gaza Lagi', partner: 'Rumah Yatim', from: '#57534e', to: '#292524', raised: 81 },
  { id: 'c4', title: 'Bantu Bangun Sumatera', partner: 'Dompet Dhuafa', from: '#365314', to: '#1c1917', raised: 35 },
]

export const berbagi = [
  { id: 'zakat', tag: 'Zakat', headline: 'Hasil keringatmu menjadi berkah untuk semua', sub: 'Segera tunaikan kewajibanmu', title: 'Zakat', desc: 'Jangan tunda kewajiban zakatmu', cta: 'Ayo Berbagi' },
  { id: 'infaq', tag: 'Infaq', headline: 'Bantuanmu adalah masa depan mereka', sub: 'Mulai dari Rp10.000', title: 'Infaq', desc: 'Jadikan hidup mereka lebih baik', cta: 'Ayo Beramal' },
  { id: 'wakaf', tag: 'Wakaf', headline: 'Tinggalkan jejak kebaikan yang penuh berkah', sub: 'Mulai dari Rp50.000', title: 'Wakaf', desc: 'Jangan biarkan niat baikmu berhenti di sini', cta: 'Ayo Berbagi' },
]

export type Category = 'Makanan' | 'Transportasi' | 'Shopping' | 'Hiburan' | 'Keluarga' | 'Lainnya'

export const categoryColors: Record<Category, string> = {
  Makanan: '#f5a524',
  Transportasi: '#2ee6b0',
  Shopping: '#2323c9',
  Hiburan: '#e11d48',
  Keluarga: '#7c3aed',
  Lainnya: '#94a3b8',
}

export type Tx = {
  id: string
  title: string
  amount: number // negatif = keluar
  category: Category | 'Income'
  date: string
}

export const initialTransactions: Tx[] = [
  { id: 't1', title: 'Gaji Bulanan', amount: 8500000, category: 'Income', date: '2026-10-01' },
  { id: 't2', title: 'Kopi Kenangan', amount: -38000, category: 'Makanan', date: '2026-10-03' },
  { id: 't3', title: 'GoRide', amount: -24000, category: 'Transportasi', date: '2026-10-03' },
  { id: 't4', title: 'Makan siang', amount: -47000, category: 'Makanan', date: '2026-10-02' },
  { id: 't5', title: 'Tokopedia', amount: -225000, category: 'Shopping', date: '2026-10-02' },
  { id: 't6', title: 'Bioskop', amount: -100000, category: 'Hiburan', date: '2026-10-01' },
  { id: 't7', title: 'Bensin', amount: -150000, category: 'Transportasi', date: '2026-09-30' },
  { id: 't8', title: 'Groceries', amount: -305000, category: 'Makanan', date: '2026-09-29' },
  { id: 't9', title: 'Transfer ke Mama', amount: -200000, category: 'Keluarga', date: '2026-09-28' },
  { id: 't10', title: 'Pulsa', amount: -50000, category: 'Lainnya', date: '2026-09-27' },
]

export const contacts = [
  { id: 'mama', name: 'Mama', bank: 'Aladin', acc: '7012 3344 55' },
  { id: 'kakak', name: 'Kakak', bank: 'BSI', acc: '1234 5678 90' },
  { id: 'teman', name: 'Rizky', bank: 'BCA', acc: '8800 1122 33' },
]

export type Challenge = { id: string; title: string; points: number; period: 'Harian' | 'Mingguan' | 'Spesial' }

export const challenges: Challenge[] = [
  { id: 'h1', title: 'Transaksi tanpa cash hari ini', points: 500, period: 'Harian' },
  { id: 'h2', title: 'Catat semua pengeluaran hari ini', points: 500, period: 'Harian' },
  { id: 'h3', title: 'Sisihkan untuk sedekah', points: 1000, period: 'Harian' },
  { id: 'm1', title: 'Bayar 5x pakai QRIS minggu ini', points: 2000, period: 'Mingguan' },
  { id: 'm2', title: 'Pengeluaran makan di bawah budget', points: 2500, period: 'Mingguan' },
  { id: 'm3', title: 'Setor ke Ala Impian minimal Rp50.000', points: 3000, period: 'Mingguan' },
  { id: 's1', title: 'Ajak 1 teman pakai Aladin', points: 5000, period: 'Spesial' },
  { id: 's2', title: 'Buka Ala Deposito pertamamu', points: 10000, period: 'Spesial' },
]

export const rewards = [
  { id: 'r1', name: 'Pulsa', cost: 5000, emoji: '📱' },
  { id: 'r2', name: 'E-Wallet', cost: 10000, emoji: '💳' },
  { id: 'r3', name: 'Voucher Belanja', cost: 15000, emoji: '🛍️' },
  { id: 'r4', name: 'Donasi Ganda', cost: 3000, emoji: '🤲' },
]
