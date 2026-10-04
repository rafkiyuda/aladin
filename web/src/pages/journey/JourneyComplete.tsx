import { Navigate, useNavigate } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import { Button, Confetti, RewardIcon } from '../../components/ui'
import Mascot from '../../components/Mascot'
import { formatRp } from '../../data'
import { useApp } from '../../state/AppState'

export default function JourneyComplete() {
  const navigate = useNavigate()
  const { state, onboardingDone } = useApp()
  if (!onboardingDone) return <Navigate to="/journey" replace />

  return (
    <div className="min-h-dvh flex flex-col bg-white relative overflow-hidden">
      <Confetti />
      <div className="bg-gradient-to-b from-navy to-[#14306e] pt-10 flex justify-center">
        <Mascot pose="trophy" size={200} />
      </div>
      <div className="flex-1 flex flex-col px-5 pt-6 pb-6 -mt-4 rounded-t-3xl bg-white relative">
        <h1 className="text-2xl font-bold text-center text-navy">Aladin Journey Completed!</h1>
        <p className="text-muted text-center mt-1">Kamu sudah menyelesaikan semua misi!</p>
        <ul className="mt-5 space-y-2.5">
          {['Fitur utama dikuasai', 'Keuangan lebih terarah', 'Paham prinsip syariah', 'Siap mulai perjalananmu!'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <CircleCheck size={20} className="text-[#13b38a]" /> {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl bg-[#fff6e0] p-4 flex items-center gap-3">
          <RewardIcon size={76} />
          <div>
            <p className="text-sm font-semibold">Total Reward</p>
            <p className="text-3xl font-bold text-navy">{formatRp(state.rewardEarned)}</p>
            <p className="text-xs text-muted">sudah masuk ke saldo kamu!</p>
          </div>
        </div>
        <div className="flex-1" />
        <Button variant="navy" className="w-full mt-8" onClick={() => navigate('/', { replace: true })}>
          Mulai Pakai Aladin
        </Button>
      </div>
    </div>
  )
}
