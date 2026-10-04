import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Page } from '../components/ui'
import Mascot, { type MascotPose } from '../components/Mascot'
import { useApp } from '../state/AppState'

export default function Notifikasi() {
  const navigate = useNavigate()
  const { onboardingDone } = useApp()

  const items: { pose: MascotPose; title: string; text: string; time: string; to: string }[] = onboardingDone
    ? [
        { pose: 'think', title: 'Lagi sering jajan nih? 😋', text: 'Mau coba atur budget F&B biar lebih terkontrol?', time: 'Sekarang', to: '/keuangan?tab=pengeluaran' },
        { pose: 'insight', title: 'Punya Rp1.000.000?', text: 'Kembangkan dengan Ala Deposito, bagi hasil hingga 8,5% p.a.', time: '1 jam lalu', to: '/kembangkan' },
        { pose: 'trophy', title: 'Challenge harian baru!', text: 'Selesaikan 3 misi hari ini & kumpulkan poin.', time: 'Hari ini', to: '/challenge' },
        { pose: 'love', title: 'Jumat berkah', text: 'Sisihkan sedikit untuk sedekah hari ini, yuk.', time: 'Kemarin', to: '/berbagi' },
      ]
    : [{ pose: 'gift', title: 'Hadiah Rp25.000 menunggumu!', text: 'Ikuti Aladin Journey dan selesaikan 5 misi seru.', time: 'Sekarang', to: '/journey' }]

  return (
    <Page title="Notifikasi">
      <ul className="px-5 space-y-3">
        {items.map((n) => (
          <li key={n.title}>
            <button onClick={() => navigate(n.to)} className="w-full rounded-2xl border border-line p-3 flex items-center gap-3 text-left hover:border-brand/40">
              <span className="w-14 h-14 rounded-xl bg-brand-soft overflow-hidden flex items-end justify-center shrink-0">
                <Mascot pose={n.pose} size={56} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted">Aladin · {n.time}</p>
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted">{n.text}</p>
              </div>
              <ChevronRight size={18} className="text-muted shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </Page>
  )
}
