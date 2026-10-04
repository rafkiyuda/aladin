import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button, Page } from '../components/ui'
import Mascot from '../components/Mascot'
import { berbagi, campaigns, formatRp } from '../data'
import { useApp } from '../state/AppState'

export default function Berbagi() {
  const navigate = useNavigate()
  const { state, addTransaction } = useApp()
  const [type, setType] = useState(berbagi[1].id)
  const [target, setTarget] = useState(campaigns[0].id)
  const [amount, setAmount] = useState(10_000)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center px-5 pt-16 pb-6 text-center">
        <span className="w-20 h-20 rounded-full bg-[#13b38a] text-white flex items-center justify-center animate-pop-in">
          <Check size={44} strokeWidth={3} />
        </span>
        <p className="text-xl font-bold mt-4">Jazakallah khairan!</p>
        <p className="text-muted">
          {formatRp(amount)} untuk {campaigns.find((c) => c.id === target)?.title}
        </p>
        <Mascot pose="love" size={160} className="mt-8" />
        <div className="flex-1" />
        <Button variant="mint" className="w-full" onClick={() => navigate('/', { replace: true })}>
          Kembali ke Beranda
        </Button>
      </div>
    )
  }

  return (
    <Page title="Ala Berbagi">
      <div className="px-5">
        <div className="flex gap-2">
          {berbagi.map((b) => (
            <button
              key={b.id}
              onClick={() => setType(b.id)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold ${type === b.id ? 'bg-brand text-white' : 'bg-surface text-muted'}`}
            >
              {b.tag}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted mt-3">{berbagi.find((b) => b.id === type)?.headline}</p>

        <h2 className="font-semibold mt-5">Pilih program</h2>
        <div className="space-y-2 mt-2">
          {campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => setTarget(c.id)}
              className={`w-full rounded-2xl border-2 p-3 text-left ${target === c.id ? 'border-brand bg-brand-soft' : 'border-line'}`}
            >
              <p className="font-semibold text-sm">{c.title}</p>
              <p className="text-xs text-muted">Bersama {c.partner}</p>
              <div className="mt-2 h-1.5 rounded-full bg-white">
                <div className="h-full rounded-full bg-mint" style={{ width: `${c.raised}%` }} />
              </div>
            </button>
          ))}
        </div>

        <h2 className="font-semibold mt-5">Nominal</h2>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[10_000, 25_000, 50_000, 100_000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`rounded-xl border-2 py-2 text-sm font-semibold ${amount === v ? 'border-brand text-brand' : 'border-line'}`}
            >
              {v / 1000}rb
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1" />
      <div className="px-5 py-4">
        <Button
          className="w-full"
          disabled={amount > state.balance}
          onClick={() => {
            addTransaction({ title: `${berbagi.find((b) => b.id === type)?.tag} – ${campaigns.find((c) => c.id === target)?.partner}`, amount: -amount, category: 'Lainnya' })
            setDone(true)
          }}
        >
          Berbagi {formatRp(amount)}
        </Button>
      </div>
    </Page>
  )
}
