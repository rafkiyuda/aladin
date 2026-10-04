import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Gift } from 'lucide-react'
import { Button, Confetti } from '../../components/ui'
import { formatRp, missions } from '../../data'
import { useApp } from '../../state/AppState'
import { missionIcons } from './missionIcons'
import SmartImg from '../../components/SmartImg'
import { img } from '../../images'

export default function MissionDone() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()
  const idx = missions.findIndex((m) => m.id === Number(id))
  const m = missions[idx]
  if (!m || !state.completedMissions.includes(m.id)) return <Navigate to="/journey" replace />

  const Icon = missionIcons[idx]
  const next = missions.find((x) => !state.completedMissions.includes(x.id))

  return (
    <div className="min-h-dvh flex flex-col items-center bg-white px-5 pt-10 pb-6 relative overflow-hidden text-center">
      <Confetti />
      <h1 className="text-2xl font-bold text-navy">Misi {m.id} Selesai!</h1>

      {/* badge */}
      <div className="relative mt-8 animate-pop-in">
        <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ background: m.color }} />
        <SmartImg
          src={img.badge(m.id)}
          alt={`Badge misi ${m.id}`}
          className="relative w-[190px] h-[190px] object-contain"
          fallback={
            <>
              <svg viewBox="0 0 120 130" width={180} height={195} className="relative" aria-hidden>
                <path d="M60 4l50 28v58l-50 28-50-28V32z" fill="#f5a524" />
                <path d="M60 14l41 23v48l-41 23-41-23V37z" fill="#0b1a5e" />
                <path d="M60 14l41 23v48l-41 23-41-23V37z" fill="url(#g)" opacity=".5" />
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={m.color} />
                    <stop offset="1" stopColor="#0b1a5e" />
                  </linearGradient>
                </defs>
                <path d="M30 108l-10 20 16-4 8 12 10-18z M90 108l10 20-16-4-8 12-10-18z" fill="#e5484d" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-mint pb-4">
                <Icon size={56} strokeWidth={2.2} />
              </span>
            </>
          }
        />
      </div>

      <p className="text-xl font-bold mt-4">{m.subtitle}</p>
      <p className="text-muted mt-1">Kamu berhasil menyelesaikan “{m.title}”.</p>

      <div className="mt-6 w-full rounded-2xl bg-[#fff6e0] p-4 flex items-center gap-3 text-left">
        <span className="w-12 h-12 rounded-xl bg-gold/25 text-gold flex items-center justify-center">
          <Gift size={26} />
        </span>
        <div>
          <p className="text-2xl font-bold text-navy">+{formatRp(m.reward)}</p>
          <p className="text-sm text-muted">Telah masuk ke saldo kamu 🎉</p>
        </div>
      </div>

      <div className="flex-1" />
      <Button variant="navy" className="w-full mt-8" onClick={() => navigate(next ? `/journey/misi/${next.id}` : '/journey/selesai', { replace: true })}>
        {next ? 'Lanjut ke Misi Berikutnya' : 'Lihat Hasil Journey'}
      </Button>
      <button className="mt-2 py-2 text-brand font-semibold" onClick={() => navigate('/journey', { replace: true })}>
        Kembali ke Journey
      </button>
    </div>
  )
}
