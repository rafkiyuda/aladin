import { useNavigate } from 'react-router-dom'
import { Check, Lock } from 'lucide-react'
import { Button, Page } from '../../components/ui'
import Mascot from '../../components/Mascot'
import { formatRp, missions, ONBOARDING_TOTAL_REWARD } from '../../data'
import { useApp } from '../../state/AppState'
import { missionIcons } from './missionIcons'

export default function JourneyOverview() {
  const navigate = useNavigate()
  const { state, onboardingDone } = useApp()
  const done = state.completedMissions
  const next = missions.find((m) => !done.includes(m.id))

  return (
    <Page title="" onBack={() => navigate('/')} className="bg-white">
      <div className="px-5 text-center">
        <h1 className="text-2xl font-bold text-navy">Aladin Journey</h1>
        <p className="text-sm text-muted mt-1">
          {missions.length} misi seru untuk kamu jadi lebih <i>financially aware!</i>
        </p>
        <div className="mt-4 rounded-2xl bg-brand-soft p-3 flex items-center gap-3 text-left">
          <div className="flex-1">
            <p className="text-xs text-muted">Progres kamu</p>
            <p className="font-bold">
              {done.length}/{missions.length} misi selesai
            </p>
            <div className="mt-1.5 h-2 rounded-full bg-white">
              <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${(done.length / missions.length) * 100}%` }} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Reward</p>
            <p className="font-bold text-[#e5484d]">
              {formatRp(state.rewardEarned)}
              <span className="text-muted font-normal text-xs"> / {formatRp(ONBOARDING_TOTAL_REWARD)}</span>
            </p>
          </div>
        </div>
      </div>

      <ol className="relative px-5 mt-5 space-y-3">
        <span className="absolute left-[49px] top-6 bottom-6 w-0.5 bg-line" aria-hidden />
        {missions.map((m, i) => {
          const Icon = missionIcons[i]
          const isDone = done.includes(m.id)
          const isNext = next?.id === m.id
          const locked = !isDone && !isNext
          return (
            <li key={m.id}>
              <button
                disabled={locked}
                onClick={() => navigate(`/journey/misi/${m.id}`)}
                className={`relative w-full flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  isNext ? 'border-brand bg-white shadow-md' : 'border-line bg-white'
                } ${locked ? 'opacity-60' : ''}`}
              >
                <span
                  className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white"
                  style={{ background: isDone ? '#13b38a' : m.color }}
                >
                  {isDone ? <Check size={24} strokeWidth={3} /> : <Icon size={22} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted">Misi {m.id}</p>
                  <p className="font-semibold leading-tight">{m.title}</p>
                  <p className="text-xs text-muted truncate">{m.desc}</p>
                </div>
                {locked ? (
                  <Lock size={18} className="text-muted" />
                ) : isDone ? (
                  <span className="text-xs font-semibold text-[#13b38a]">Selesai</span>
                ) : (
                  <span className="text-xs font-semibold text-brand">+{formatRp(m.reward)}</span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      <div className="flex-1" />
      <div className="sticky bottom-0 bg-white px-5 py-4 flex items-center gap-3 border-t border-line">
        <Mascot pose={onboardingDone ? 'trophy' : 'idea'} size={64} />
        {onboardingDone ? (
          <Button variant="navy" className="flex-1" onClick={() => navigate('/journey/selesai')}>
            Lihat Hadiahmu
          </Button>
        ) : (
          <Button variant="navy" className="flex-1" onClick={() => next && navigate(`/journey/misi/${next.id}`)}>
            {done.length === 0 ? 'Mulai Misi Pertama' : `Lanjut Misi ${next?.id}`}
          </Button>
        )}
      </div>
    </Page>
  )
}
