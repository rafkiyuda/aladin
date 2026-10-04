import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { Button, Page } from '../components/ui'
import Mascot from '../components/Mascot'
import { formatRp, missions } from '../data'
import { useApp } from '../state/AppState'

export default function Profil() {
  const navigate = useNavigate()
  const { state, update, reset } = useApp()

  return (
    <Page title="Profil">
      <div className="px-5">
        <div className="flex items-center gap-4">
          <span className="w-16 h-16 rounded-full bg-brand-soft overflow-hidden flex items-end justify-center">
            <Mascot pose="hello" size={60} />
          </span>
          <div className="flex-1">
            <label className="text-xs text-muted" htmlFor="name">
              Nama panggilan
            </label>
            <input
              id="name"
              value={state.userName}
              onChange={(e) => update({ userName: e.target.value })}
              className="block w-full text-lg font-bold outline-none border-b border-line focus:border-brand"
            />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-surface p-3">
            <dt className="text-xs text-muted">Misi</dt>
            <dd className="font-bold">
              {state.completedMissions.length}/{missions.length}
            </dd>
          </div>
          <div className="rounded-2xl bg-surface p-3">
            <dt className="text-xs text-muted">Reward</dt>
            <dd className="font-bold">{formatRp(state.rewardEarned)}</dd>
          </div>
          <div className="rounded-2xl bg-surface p-3">
            <dt className="text-xs text-muted">Poin</dt>
            <dd className="font-bold">{state.points.toLocaleString('id-ID')}</dd>
          </div>
        </dl>

        <div className="mt-8 rounded-2xl border border-dashed border-line p-4">
          <p className="font-semibold">Mode demo</p>
          <p className="text-sm text-muted mt-1">Reset untuk mengulang alur sebagai pengguna baru (pop-up undangan & onboarding).</p>
          <Button
            variant="outline"
            className="w-full mt-3 flex items-center justify-center gap-2"
            onClick={() => {
              reset()
              navigate('/', { replace: true })
            }}
          >
            <RotateCcw size={16} /> Reset Demo
          </Button>
        </div>
      </div>
    </Page>
  )
}
