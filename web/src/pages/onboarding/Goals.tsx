import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button, Page } from '../../components/ui'
import Mascot from '../../components/Mascot'
import { goals, type GoalId } from '../../data'
import { useApp } from '../../state/AppState'
import SmartImg from '../../components/SmartImg'
import { img } from '../../images'

export default function Goals() {
  const navigate = useNavigate()
  const { state, update } = useApp()
  const [picked, setPicked] = useState<GoalId[]>(state.goals)

  const toggle = (id: GoalId) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  return (
    <Page title="" headerClass="bg-navy text-white" className="bg-white">
      <div className="bg-navy text-white px-5 pb-0 relative overflow-hidden">
        <div className="flex justify-center">
          <Mascot pose="point" size={170} />
        </div>
      </div>
      <div className="flex-1 -mt-5 rounded-t-3xl bg-white relative px-5 pt-6 pb-6 flex flex-col">
        <h1 className="text-xl font-bold text-center">Apa tujuan keuanganmu?</h1>
        <p className="text-sm text-muted text-center mt-1">
          Pilih mana yang paling cocok buat kamu
          <br />
          (bisa pilih lebih dari 1)
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {goals.map((g) => {
            const on = picked.includes(g.id)
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                aria-pressed={on}
                className={`relative rounded-2xl border-2 p-4 text-left transition ${
                  on ? 'border-brand bg-brand-soft' : 'border-line bg-white hover:border-brand/40'
                }`}
              >
                <SmartImg src={img.goal[g.id]} className="w-12 h-12 object-contain" fallback={<span className="text-3xl">{g.emoji}</span>} />
                <p className="text-sm font-semibold mt-2 leading-tight">{g.label}</p>
                {on && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex-1" />
        <Button
          variant="navy"
          className="w-full mt-6"
          disabled={!picked.length}
          onClick={() => {
            update({ goals: picked, onboardingStarted: true, invitationDismissed: true })
            navigate('/journey')
          }}
        >
          Lanjut
        </Button>
      </div>
    </Page>
  )
}
