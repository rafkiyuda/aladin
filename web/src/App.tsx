import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Goals from './pages/onboarding/Goals'
import JourneyOverview from './pages/journey/JourneyOverview'
import Mission from './pages/journey/Mission'
import MissionDone from './pages/journey/MissionDone'
import JourneyComplete from './pages/journey/JourneyComplete'
import Qris from './pages/Qris'
import Transfer from './pages/Transfer'
import TransferSuccess from './pages/TransferSuccess'
import Keuangan from './pages/Keuangan'
import Kembangkan from './pages/Kembangkan'
import Challenge from './pages/Challenge'
import Notifikasi from './pages/Notifikasi'
import Profil from './pages/Profil'
import Berbagi from './pages/Berbagi'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    // Tampilan selalu mobile: lebar dikunci 430px dan di tengah layar desktop
    <div className="min-h-dvh flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-dvh bg-white shadow-[0_0_40px_rgba(11,26,94,0.12)] overflow-x-clip">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding/tujuan" element={<Goals />} />
          <Route path="/journey" element={<JourneyOverview />} />
          <Route path="/journey/misi/:id" element={<Mission />} />
          <Route path="/journey/misi/:id/selesai" element={<MissionDone />} />
          <Route path="/journey/selesai" element={<JourneyComplete />} />
          <Route path="/qris" element={<Qris />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/transfer/berhasil" element={<TransferSuccess />} />
          <Route path="/keuangan" element={<Keuangan />} />
          <Route path="/kembangkan" element={<Kembangkan />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/notifikasi" element={<Notifikasi />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/berbagi" element={<Berbagi />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
