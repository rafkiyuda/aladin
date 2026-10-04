import { useState } from 'react'
import { CircleCheck, Coins } from 'lucide-react'
import { Page, useToast } from '../components/ui'
import Mascot from '../components/Mascot'
import { challenges, rewards, type Challenge as Ch } from '../data'
import { useApp } from '../state/AppState'
import SmartImg from '../components/SmartImg'
import { img } from '../images'

const periods: Ch['period'][] = ['Harian', 'Mingguan', 'Spesial']

export default function Challenge() {
  const { state, update } = useApp()
  const { toast, toastNode } = useToast()
  const [period, setPeriod] = useState<Ch['period']>('Harian')
  const list = challenges.filter((c) => c.period === period)

  const claim = (c: Ch) => {
    if (state.completedChallenges.includes(c.id)) return
    update((s) => ({ completedChallenges: [...s.completedChallenges, c.id], points: s.points + c.points }))
    toast(`+${c.points.toLocaleString('id-ID')} poin! 🎉`)
  }

  const redeem = (r: (typeof rewards)[number]) => {
    if (state.points < r.cost) return toast(`Poin belum cukup. Butuh ${r.cost.toLocaleString('id-ID')} poin.`)
    update((s) => ({ points: s.points - r.cost, redeemed: [...s.redeemed, r.id] }))
    toast(`${r.name} berhasil ditukar!`)
  }

  return (
    <Page title="Aladin Challenge">
      <div className="px-5">
        <p className="text-sm text-muted -mt-1">Terus lanjutkan misimu!</p>
        <div className="mt-4 rounded-2xl bg-navy text-white p-4 flex items-center gap-3 overflow-hidden">
          <div className="flex-1">
            <p className="text-xs text-white/70">Poin kamu</p>
            <p className="text-3xl font-bold flex items-center gap-2">
              <Coins size={26} className="text-gold" />
              {state.points.toLocaleString('id-ID')}
            </p>
          </div>
          <Mascot pose="trophy" size={86} className="-my-4" />
        </div>

        <div className="flex rounded-full bg-surface p-1 mt-4">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold ${period === p ? 'bg-white shadow-sm text-[#0f9a76]' : 'text-muted'}`}
            >
              {p}
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {list.map((c) => {
            const done = state.completedChallenges.includes(c.id)
            return (
              <li key={c.id} className="rounded-2xl border border-line p-4 flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'bg-[#e7faf3] text-[#13b38a]' : 'bg-[#fdecec] text-[#e5484d]'}`}>
                  {done ? <CircleCheck size={20} /> : <Coins size={20} />}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-[#0f9a76]">+{c.points.toLocaleString('id-ID')} poin</p>
                </div>
                <button
                  onClick={() => claim(c)}
                  disabled={done}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 ${done ? 'bg-surface text-muted' : 'bg-brand text-white'}`}
                >
                  {done ? 'Selesai' : 'Klaim'}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="text-[11px] text-muted mt-2">*Di prototipe, tombol Klaim langsung menandai misi selesai.</p>

        <h2 className="font-bold mt-6">Kumpulkan poin & tukar reward!</h2>
        <div className="grid grid-cols-4 gap-2 mt-3">
          {rewards.map((r) => (
            <button key={r.id} onClick={() => redeem(r)} className="rounded-2xl border border-line py-3 flex flex-col items-center gap-1 hover:border-brand">
              <SmartImg src={img.reward[r.id]} className="w-10 h-10 object-contain" fallback={<span className="text-2xl">{r.emoji}</span>} />
              <span className="text-[11px] text-center leading-tight">{r.name}</span>
              <span className="text-[10px] text-muted">{r.cost.toLocaleString('id-ID')}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 mb-6 flex items-end gap-2">
          <Mascot pose="hello" size={90} className="shrink-0" />
          <p className="mb-4 rounded-2xl rounded-bl-sm bg-brand-soft p-3 text-sm">Konsisten sedikit demi sedikit, hasilnya besar. Kamu bisa! ✨</p>
        </div>
      </div>
      {toastNode}
    </Page>
  )
}
