import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye, EyeOff, FileText, TrendingDown, Wallet } from 'lucide-react'
import { BottomNav, ProductCard } from '../components/ui'
import Mascot from '../components/Mascot'
import { categoryColors, formatRp, type Category } from '../data'
import { useApp } from '../state/AppState'

const tabs = [
  { id: 'simpanan', label: 'Simpanan' },
  { id: 'pengeluaran', label: 'Pengeluaran' },
  { id: 'pembiayaan', label: 'Pembiayaan' },
] as const

export default function Keuangan() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as (typeof tabs)[number]['id']) || 'simpanan'

  return (
    <div className="min-h-dvh bg-[#e8e9fb]">
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold">Keuangan Saya</h1>
        <FileText size={24} />
      </header>
      <div className="min-h-[calc(100dvh-72px)] rounded-t-3xl bg-white">
        <div className="flex px-3 border-b border-line">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setParams({ tab: t.id }, { replace: true })}
              className={`flex-1 py-4 font-semibold text-[15px] border-b-[3px] -mb-px transition ${
                tab === t.id ? 'border-brand text-ink' : 'border-transparent text-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'simpanan' && <Simpanan />}
        {tab === 'pengeluaran' && <Pengeluaran />}
        {tab === 'pembiayaan' && (
          <div className="px-5 py-12 text-center">
            <Mascot pose="think" size={140} className="mx-auto" />
            <p className="font-semibold mt-4">Belum ada pembiayaan</p>
            <p className="text-sm text-muted">Pembiayaan syariah dari Aladin akan tampil di sini.</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

function Simpanan() {
  const navigate = useNavigate()
  const { state, update } = useApp()
  const hide = state.hideBalance
  return (
    <div className="px-5 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Total Simpanan</h2>
        <button
          aria-label={hide ? 'Tampilkan saldo' : 'Sembunyikan saldo'}
          onClick={() => update((s) => ({ hideBalance: !s.hideBalance }))}
          className="w-9 h-9 rounded-full bg-surface flex items-center justify-center"
        >
          {hide ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <div className="mt-3 rounded-2xl border border-line px-4 py-4 flex justify-between">
        <span className="text-muted">Total saldo (IDR)</span>
        <span className="font-bold">{hide ? 'Rp•••••••' : formatRp(state.balance)}</span>
      </div>

      <h2 className="text-lg font-bold mt-5">Ala Dompet</h2>
      <div className="mt-3 rounded-2xl border border-line p-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
            <Wallet size={22} />
          </span>
          <span className="font-semibold">Ala Dompet</span>
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-muted">Saldo aktif</span>
          <span className="font-bold">{hide ? 'Rp•••••••' : formatRp(state.balance)}</span>
        </div>
      </div>

      <h2 className="text-lg font-bold mt-5">Yuk, tingkatkan bagi hasilmu!</h2>
      <div className="space-y-3 mt-3">
        <ProductCard id="impian" onClick={() => navigate('/kembangkan')} />
        <ProductCard id="deposito" onClick={() => navigate('/kembangkan')} />
      </div>
    </div>
  )
}

function Pengeluaran() {
  const { state } = useApp()
  const [mode, setMode] = useState<'out' | 'in'>('out')
  const txs = state.transactions.filter((t) => (mode === 'out' ? t.amount < 0 : t.amount > 0))
  const total = txs.reduce((s, t) => s + Math.abs(t.amount), 0)

  const byCat = txs.reduce<Partial<Record<Category, number>>>((acc, t) => {
    if (t.category === 'Income') return acc
    acc[t.category] = (acc[t.category] ?? 0) + Math.abs(t.amount)
    return acc
  }, {})
  const slices = (Object.entries(byCat) as [Category, number][]).sort((a, b) => b[1] - a[1])
  const makan = byCat.Makanan ?? 0
  const makanBudget = state.budgets.Makanan

  return (
    <div className="px-5 pt-5 pb-4">
      <div className="flex rounded-full bg-surface p-1">
        {(
          [
            ['out', 'Pengeluaran'],
            ['in', 'Income'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold ${mode === id ? 'bg-white shadow-sm' : 'text-muted'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <ChevronLeft size={18} className="text-muted" />
        <span className="font-semibold">Oktober 2026</span>
        <ChevronRight size={18} className="text-muted" />
      </div>

      <p className="text-sm text-muted mt-3">Total {mode === 'out' ? 'Pengeluaran' : 'Pemasukan'}</p>
      <p className="text-3xl font-bold">{formatRp(total)}</p>
      {mode === 'out' && (
        <p className="text-xs text-[#13b38a] flex items-center gap-1 mt-1">
          <TrendingDown size={14} /> 12% lebih rendah dari bulan lalu
        </p>
      )}

      {mode === 'out' && slices.length > 0 && (
        <div className="flex items-center gap-5 mt-5">
          <Donut slices={slices} total={total} />
          <ul className="flex-1 space-y-1.5">
            {slices.map(([c, v]) => (
              <li key={c} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: categoryColors[c] }} />
                <span className="flex-1">{c}</span>
                <span className="font-semibold">{Math.round((v / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mode === 'out' && makanBudget && (
        <div className="mt-5 rounded-2xl border border-line p-4">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Budget Makanan</span>
            <span className="text-muted">
              {formatRp(makan)} / {formatRp(makanBudget)}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-surface">
            <div
              className={`h-full rounded-full ${makan > makanBudget * 0.8 ? 'bg-[#e5484d]' : 'bg-[#13b38a]'}`}
              style={{ width: `${Math.min(100, (makan / makanBudget) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <h3 className="font-semibold mt-6">Detail Transaksi</h3>
      <ul className="mt-2 divide-y divide-line">
        {txs.map((t) => (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: t.category === 'Income' ? '#13b38a' : categoryColors[t.category] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{t.title}</p>
              <p className="text-xs text-muted">
                {t.category} · {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <span className={`text-sm font-semibold ${t.amount > 0 ? 'text-[#13b38a]' : ''}`}>
              {t.amount > 0 ? '+' : '-'}
              {formatRp(Math.abs(t.amount))}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-2xl bg-brand-soft p-4 flex items-end gap-2">
        <Mascot pose="idea" size={90} className="shrink-0 -mb-4" />
        <div>
          <p className="font-semibold">Tips dari Aladin</p>
          <p className="text-xs text-muted mt-1">
            Coba kategori pengeluaran {slices[0]?.[0] ?? 'terbesarmu'} turun 10% bulan ini, lalu alokasikan selisihnya ke Ala Impian.
          </p>
        </div>
      </div>
    </div>
  )
}

function Donut({ slices, total }: { slices: [Category, number][]; total: number }) {
  const r = 42
  const c = 2 * Math.PI * r
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((s, [, v]) => s + (v / total) * c, 0))
  return (
    <svg viewBox="0 0 110 110" width={130} height={130} className="-rotate-90 shrink-0" role="img" aria-label="Komposisi pengeluaran">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#f4f5fa" strokeWidth="16" />
      {slices.map(([cat, v], i) => (
        <circle
          key={cat}
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke={categoryColors[cat]}
          strokeWidth="16"
          strokeDasharray={`${Math.max((v / total) * c - 2, 0)} ${c}`}
          strokeDashoffset={-starts[i]}
        />
      ))}
    </svg>
  )
}
