import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Flashlight, Store, X } from 'lucide-react'
import { Button } from '../components/ui'
import Mascot from '../components/Mascot'
import QrisScanner from '../components/QrisScanner'
import { formatRp } from '../data'
import { useApp } from '../state/AppState'

export default function Qris() {
  const navigate = useNavigate()
  const { state, addTransaction } = useApp()
  const [step, setStep] = useState<'scan' | 'pay' | 'done'>('scan')
  const [amount, setAmount] = useState(25_000)
  const [scanKey, setScanKey] = useState(0)
  const onScanned = useCallback(() => setStep('pay'), [])

  if (step === 'done') {
    return (
      <div className="min-h-dvh flex flex-col items-center bg-white px-5 pt-16 pb-6 text-center">
        <span className="w-20 h-20 rounded-full bg-[#13b38a] text-white flex items-center justify-center animate-pop-in">
          <Check size={44} strokeWidth={3} />
        </span>
        <p className="text-xl font-bold text-[#13b38a] mt-4">Pembayaran Berhasil!</p>
        <p className="text-3xl font-bold mt-1">{formatRp(amount)}</p>
        <p className="text-muted">ke Lawson Sudirman</p>
        <Mascot pose="pray" size={150} className="mt-8" />
        <p className="text-sm text-muted mt-2">Transaksi otomatis dicatat ke kategori Makanan.</p>
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
        <Flashlight size={20} />
      </header>
      <div className="mx-auto mt-1 w-52 rounded-full bg-white/10 p-1 flex text-sm">
        <span className="flex-1 rounded-full bg-[#13b38a] text-center py-1.5">Bayar</span>
        <span className="flex-1 text-center py-1.5 text-white/70">Terima</span>
      </div>

      <div className="px-4 mt-4">
        <QrisScanner key={scanKey} merchant="Lawson Sudirman" onScanned={onScanned} />
      </div>

      <div className="flex-1" />
      {step === 'pay' && (
        <div className="fixed inset-0 z-40 flex justify-center animate-fade-in">
          <div className="w-full max-w-[430px] h-full bg-black/50 flex items-end">
            <div className="w-full bg-white text-ink rounded-t-3xl p-5 animate-slide-up">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                  <Store size={24} />
                </span>
                <div>
                  <p className="font-semibold">Lawson Sudirman</p>
                  <p className="text-xs text-muted">NMID ID0000DEMO0001 · Promo potongan Rp10.000</p>
                </div>
              </div>
              <label htmlFor="qris-amount" className="block text-sm text-muted mt-4">
                Nominal
              </label>
              <div className="flex items-center border-b-2 border-brand py-1">
                <span className="text-2xl font-bold mr-1">Rp</span>
                <input
                  id="qris-amount"
                  inputMode="numeric"
                  value={amount ? amount.toLocaleString('id-ID') : ''}
                  onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
                  className="flex-1 text-2xl font-bold outline-none"
                />
              </div>
              <p className={`text-xs mt-2 ${amount > state.balance ? 'text-[#e5484d]' : 'text-muted'}`}>Saldo: {formatRp(state.balance)}</p>
              <Button
                className="w-full mt-4"
                disabled={!amount || amount > state.balance}
                onClick={() => {
                  addTransaction({ title: 'Lawson Sudirman (QRIS)', amount: -amount, category: 'Makanan' })
                  setStep('done')
                }}
              >
                Bayar {formatRp(amount)}
              </Button>
              <button className="w-full mt-2 py-2 text-brand font-semibold" onClick={() => {
                  setStep('scan')
                  setScanKey((k) => k + 1)
                }}>
                Scan ulang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
