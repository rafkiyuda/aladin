import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Check, Share2, X } from 'lucide-react'
import { Button } from '../components/ui'
import Mascot from '../components/Mascot'
import { contacts, formatRp, type Category } from '../data'
import { useApp } from '../state/AppState'
import { Avatar } from './Transfer'

type NavState = { txId: string; name: string; amount: number }

export default function TransferSuccess() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: NavState | null }
  const { setTxCategory } = useApp()
  const [track, setTrack] = useState(true)
  const [category, setCategory] = useState<Category>('Keluarga')
  const [now] = useState(() => new Date())
  if (!state) return <Navigate to="/" replace />

  const finish = () => {
    if (track) setTxCategory(state.txId, category)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <header className="flex justify-between px-5 pt-4">
        <button aria-label="Tutup" onClick={finish} className="p-1 -ml-1">
          <X size={22} />
        </button>
        <button aria-label="Bagikan" className="p-1 -mr-1 text-brand">
          <Share2 size={20} />
        </button>
      </header>

      <div className="px-5 text-center">
        <span className="mx-auto w-16 h-16 rounded-full bg-[#13b38a] text-white flex items-center justify-center animate-pop-in">
          <Check size={36} strokeWidth={3} />
        </span>
        <p className="text-lg font-bold text-[#13b38a] mt-3">Transfer Berhasil!</p>
        <p className="text-3xl font-bold mt-1">{formatRp(state.amount)}</p>
        <p className="font-semibold">ke {state.name}</p>
        <p className="text-xs text-muted mt-1">
          {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} ·{' '}
          {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="px-5 mt-4 flex items-end gap-2">
        <Mascot pose="thumbs" size={100} className="shrink-0" />
        <div className="mb-5 rounded-2xl rounded-bl-sm border border-brand/20 shadow-sm p-3">
          <p className="font-bold text-navy">Alhamdulillah! 💙</p>
          <p className="text-xs text-muted">Kamu sudah melakukan transaksi dengan aman.</p>
        </div>
      </div>

      <div className="px-5 mt-2">
        <p className="font-semibold">Mau lakukan lagi?</p>
        <div className="flex gap-5 mt-3">
          {contacts.map((c) => (
            <button key={c.id} onClick={() => navigate('/transfer', { replace: true })} className="flex flex-col items-center gap-1">
              <Avatar name={c.name} />
              <span className="text-xs">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-5 rounded-2xl bg-[#fff6e0] p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold text-sm">Satu langkah lagi!</p>
            <p className="text-xs text-muted">Mau catat transaksi ini ke kategori pengeluaran?</p>
          </div>
          <button
            role="switch"
            aria-checked={track}
            aria-label="Catat ke kategori"
            onClick={() => setTrack(!track)}
            className={`w-12 h-7 rounded-full p-1 transition ${track ? 'bg-[#13b38a]' : 'bg-line'}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white transition ${track ? 'translate-x-5' : ''}`} />
          </button>
        </div>
        {track && (
          <label className="block mt-3">
            <span className="text-xs text-muted">Pilih Kategori</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none"
            >
              {(['Keluarga', 'Makanan', 'Transportasi', 'Shopping', 'Hiburan', 'Lainnya'] as Category[]).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex-1" />
      <div className="px-5 py-4">
        <Button variant="mint" className="w-full" onClick={finish}>
          Selesai
        </Button>
      </div>
    </div>
  )
}
