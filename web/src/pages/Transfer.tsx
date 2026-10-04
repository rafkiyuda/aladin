import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Search, Star, House } from 'lucide-react'
import { Button, Page } from '../components/ui'
import Mascot from '../components/Mascot'
import { contacts, formatRp } from '../data'
import { useApp } from '../state/AppState'

export default function Transfer() {
  const navigate = useNavigate()
  const { state, addTransaction } = useApp()
  const [to, setTo] = useState<(typeof contacts)[number] | null>(null)
  const [amount, setAmount] = useState(0)
  const [note, setNote] = useState('')
  const [query, setQuery] = useState('')

  const filtered = contacts.filter((c) => (c.name + c.acc).toLowerCase().includes(query.toLowerCase()))
  const tooMuch = amount > state.balance

  if (to) {
    return (
      <Page title="Transfer" onBack={() => setTo(null)}>
        <div className="px-5">
          <div className="rounded-2xl bg-surface p-4 flex items-center gap-3">
            <Avatar name={to.name} />
            <div>
              <p className="font-semibold">{to.name}</p>
              <p className="text-xs text-muted">
                {to.bank} · {to.acc}
              </p>
            </div>
          </div>
          <label className="block mt-6 text-sm text-muted" htmlFor="amount">
            Nominal transfer
          </label>
          <div className="flex items-center border-b-2 border-brand py-2">
            <span className="text-2xl font-bold mr-1">Rp</span>
            <input
              id="amount"
              inputMode="numeric"
              autoFocus
              value={amount ? amount.toLocaleString('id-ID') : ''}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
              placeholder="0"
              className="flex-1 text-2xl font-bold outline-none bg-transparent"
            />
          </div>
          <p className={`text-xs mt-2 ${tooMuch ? 'text-[#e5484d]' : 'text-muted'}`}>
            Saldo Ala Dompet: {formatRp(state.balance)}
            {tooMuch && ' · saldo tidak cukup'}
          </p>
          <div className="flex gap-2 mt-4">
            {[50_000, 100_000, 200_000, 500_000].map((v) => (
              <button key={v} onClick={() => setAmount(v)} className="flex-1 rounded-full border border-line py-2 text-xs font-semibold hover:border-brand">
                {v / 1000}rb
              </button>
            ))}
          </div>
          <label className="block mt-6 text-sm text-muted" htmlFor="note">
            Catatan (opsional)
          </label>
          <input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: uang bulanan"
            className="w-full mt-1 rounded-xl border border-line px-4 py-3 outline-none focus:border-brand"
          />
        </div>
        <div className="flex-1" />
        <div className="px-5 py-4">
          <Button
            className="w-full"
            disabled={!amount || tooMuch}
            onClick={() => {
              const tx = addTransaction({ title: `Transfer ke ${to.name}`, amount: -amount, category: 'Lainnya' })
              navigate('/transfer/berhasil', { replace: true, state: { txId: tx.id, name: to.name, amount } })
            }}
          >
            Transfer {amount ? formatRp(amount) : ''}
          </Button>
        </div>
      </Page>
    )
  }

  return (
    <Page title="Transfer">
      <div className="px-5">
        <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5">
          <Search size={18} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau nomor rekening"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <h2 className="font-semibold mt-5">Rekening Tujuan</h2>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {[
            { label: 'Rekening Aladin', Icon: House },
            { label: 'Bank Lain', Icon: Building2 },
            { label: 'Daftar Favorit', Icon: Star },
          ].map(({ label, Icon }) => (
            <button key={label} onClick={() => setTo(contacts[0])} className="rounded-2xl border border-line py-3 flex flex-col items-center gap-1.5">
              <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                <Icon size={20} />
              </span>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>

        {/* Edukasi mikro */}
        <div className="mt-5 rounded-2xl bg-[#fff6e0] p-3 flex items-center gap-2">
          <Mascot pose="shield" size={78} className="shrink-0 -mb-3" />
          <div>
            <p className="text-sm font-semibold">Transfer di bank syariah tetap mengikuti prinsip & ketentuan syariah.</p>
            <p className="text-xs text-muted mt-0.5">Yuk, pastikan tujuan transaksimu sesuai.</p>
            <button className="text-xs font-semibold text-brand mt-1" onClick={() => navigate('/journey/misi/5')}>
              Pelajari lebih lanjut
            </button>
          </div>
        </div>

        <h2 className="font-semibold mt-6">Transaksi Terakhir</h2>
        <ul className="mt-2 divide-y divide-line">
          {filtered.map((c) => (
            <li key={c.id}>
              <button onClick={() => setTo(c)} className="w-full flex items-center gap-3 py-3 text-left">
                <Avatar name={c.name} />
                <div className="flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted">
                    {c.bank} · {c.acc}
                  </p>
                </div>
              </button>
            </li>
          ))}
          {!filtered.length && <li className="py-6 text-center text-sm text-muted">Tidak ditemukan</li>}
        </ul>
      </div>
    </Page>
  )
}

export function Avatar({ name }: { name: string }) {
  return <span className="w-11 h-11 rounded-full bg-[#ffe1cc] text-[#c2410c] font-bold flex items-center justify-center shrink-0">{name[0]}</span>
}
