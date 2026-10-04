import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ShieldAlert, Store, X } from 'lucide-react'
import { Button } from '../components/ui'
import Mascot from '../components/Mascot'
import CameraScanner from '../components/CameraScanner'
import ReceiveQris from '../components/ReceiveQris'
import { formatRp } from '../data'
import { parseQris, type QrisInfo } from '../lib/qris'
import { useApp } from '../state/AppState'

const title = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

export default function Qris() {
  const navigate = useNavigate()
  const { state, addTransaction } = useApp()
  const [info, setInfo] = useState<QrisInfo | null>(null)
  const [notQris, setNotQris] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)
  const [done, setDone] = useState(false)
  const [mode, setMode] = useState<'bayar' | 'terima'>('bayar')

  const onResult = useCallback((text: string) => {
    const parsed = parseQris(text)
    if (!parsed) return setNotQris(text)
    setInfo(parsed)
    setAmount(parsed.amount ?? 0)
  }, [])

  const rescan = () => {
    setInfo(null)
    setNotQris(null)
    setAmount(0)
  }

  if (done && info) {
    return (
      <div className="min-h-dvh flex flex-col items-center bg-white px-5 pt-16 pb-6 text-center">
        <span className="w-20 h-20 rounded-full bg-[#13b38a] text-white flex items-center justify-center animate-pop-in">
          <Check size={44} strokeWidth={3} />
        </span>
        <p className="text-xl font-bold text-[#13b38a] mt-4">Pembayaran Berhasil!</p>
        <p className="text-3xl font-bold mt-1">{formatRp(amount)}</p>
        <p className="text-muted">ke {title(info.merchant)}</p>
        <Mascot pose="pray" size={150} className="mt-8" />
        <p className="text-xs text-muted mt-2">Ini simulasi prototipe, tidak ada dana yang benar-benar terkirim.</p>
        <div className="flex-1" />
        <Button variant="mint" className="w-full" onClick={() => navigate('/', { replace: true })}>
          Selesai
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col bg-ink text-white">
      <header className="flex items-center justify-between px-5 h-14">
        <button aria-label="Tutup" onClick={() => navigate(-1)}>
          <X size={22} />
        </button>
        <span className="font-semibold">Pindai QRIS</span>
        <span className="w-[22px]" />
      </header>
      <div role="tablist" aria-label="Mode QRIS" className="mx-auto mt-1 w-52 rounded-full bg-white/10 p-1 flex text-sm">
        {(['bayar', 'terima'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-1.5 capitalize transition ${mode === m ? 'bg-[#13b38a] text-white' : 'text-white/70 hover:text-white'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="px-4 mt-4 pb-6">
        {/* kamera hanya menyala di mode Bayar (komponen dilepas = stream dimatikan) */}
        {mode === 'bayar' ? <CameraScanner onResult={onResult} paused={!!info || !!notQris} /> : <ReceiveQris name={state.userName} />}
      </div>

      {(info || notQris) && (
        <div className="fixed inset-0 z-40 flex justify-center animate-fade-in">
          <div className="w-full max-w-[430px] h-full bg-black/50 flex items-end">
            <div className="w-full bg-white text-ink rounded-t-3xl p-5 animate-slide-up">
              {notQris ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-xl bg-[#fdecec] text-[#e5484d] flex items-center justify-center">
                      <ShieldAlert size={24} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold">Ini bukan kode QRIS</p>
                      <p className="text-xs text-muted truncate">Isi QR: {notQris}</p>
                    </div>
                  </div>
                  <Button className="w-full mt-5" onClick={rescan}>
                    Scan Lagi
                  </Button>
                </>
              ) : (
                info && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                        <Store size={24} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{title(info.merchant)}</p>
                        <p className="text-xs text-muted truncate">
                          {[info.city && title(info.city), info.nmid && `NMID ${info.nmid}`].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>
                    {!info.validCrc && (
                      <p className="mt-3 text-xs rounded-xl bg-[#fff6e0] text-[#9a6200] px-3 py-2">
                        Checksum QRIS tidak valid. Pastikan kode tidak rusak / dimodifikasi.
                      </p>
                    )}
                    <label htmlFor="qris-amount" className="block text-sm text-muted mt-4">
                      Nominal {info.amount !== null && '(sudah ditentukan merchant)'}
                    </label>
                    <div className="flex items-center border-b-2 border-brand py-1">
                      <span className="text-2xl font-bold mr-1">Rp</span>
                      <input
                        id="qris-amount"
                        inputMode="numeric"
                        autoFocus={info.amount === null}
                        readOnly={info.amount !== null}
                        placeholder="0"
                        value={amount ? amount.toLocaleString('id-ID') : ''}
                        onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
                        className="flex-1 min-w-0 text-2xl font-bold outline-none"
                      />
                    </div>
                    <p className={`text-xs mt-2 ${amount > state.balance ? 'text-[#e5484d]' : 'text-muted'}`}>Saldo: {formatRp(state.balance)}</p>
                    <p className="text-[11px] text-muted mt-1">Pembayaran di prototipe ini hanya simulasi.</p>
                    <Button
                      className="w-full mt-4"
                      disabled={!amount || amount > state.balance}
                      onClick={() => {
                        addTransaction({ title: `${title(info.merchant)} (QRIS)`, amount: -amount, category: 'Lainnya' })
                        setDone(true)
                      }}
                    >
                      Bayar {amount ? formatRp(amount) : ''}
                    </Button>
                    <button className="w-full mt-2 py-2 text-brand font-semibold" onClick={rescan}>
                      Scan ulang
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
