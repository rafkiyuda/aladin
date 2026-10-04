import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Pencil, Share2, X } from 'lucide-react'
import { Button, Sheet, useToast } from './ui'
import { formatRp } from '../data'
import { buildQrisPayload } from '../lib/qris'

/** Mode "Terima": tampilkan QRIS milik user (demo) untuk dipindai orang lain. */
export default function ReceiveQris({ name }: { name: string }) {
  const [amount, setAmount] = useState(0)
  const [draft, setDraft] = useState(0)
  const [editing, setEditing] = useState(false)
  const [qr, setQr] = useState('')
  const { toast, toastNode } = useToast()

  const merchant = (name || 'Pengguna Aladin').toUpperCase()
  const payload = useMemo(() => buildQrisPayload(merchant, 'Jakarta', amount || undefined), [merchant, amount])

  useEffect(() => {
    QRCode.toDataURL(payload, { margin: 1, width: 640, errorCorrectionLevel: 'M' }).then(setQr)
  }, [payload])

  const fileName = `qris-${merchant.toLowerCase().replace(/\s+/g, '-')}${amount ? `-${amount}` : ''}.png`

  const download = () => {
    const a = document.createElement('a')
    a.href = qr
    a.download = fileName
    a.click()
  }

  const share = async () => {
    try {
      const blob = await (await fetch(qr)).blob()
      const file = new File([blob], fileName, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'QRIS Aladin', text: `Bayar ke ${merchant} pakai QRIS` })
        return
      }
      await navigator.clipboard.writeText(payload)
      toast('Kode QRIS disalin ke clipboard')
    } catch (e) {
      if ((e as DOMException)?.name !== 'AbortError') toast('Gagal membagikan, coba Simpan saja')
    }
  }

  return (
    <div className="px-1">
      <div className="mx-auto max-w-[320px] rounded-3xl bg-white text-ink overflow-hidden shadow-xl">
        <div className="bg-[#d71920] text-white text-center py-2">
          <p className="text-2xl font-extrabold tracking-wide">QRIS</p>
          <p className="text-[10px] -mt-1 opacity-90">QR Code Standar Pembayaran Nasional</p>
        </div>
        <div className="px-6 pt-4 pb-5 text-center">
          <p className="font-bold">{merchant}</p>
          <p className="text-[11px] text-muted">NMID: ID0000DEMO0001</p>
          <div className="mt-3 aspect-square rounded-xl border border-line p-2">
            {qr ? <img src={qr} alt={`QRIS ${merchant}`} className="w-full h-full" /> : <div className="w-full h-full animate-pulse bg-surface rounded-lg" />}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            {amount ? (
              <>
                <span className="text-xl font-bold">{formatRp(amount)}</span>
                <button aria-label="Hapus nominal" onClick={() => setAmount(0)} className="w-6 h-6 rounded-full bg-surface flex items-center justify-center">
                  <X size={14} />
                </button>
              </>
            ) : (
              <span className="text-sm text-muted">Nominal diisi oleh pembayar</span>
            )}
          </div>
          <p className="text-[10px] text-muted mt-2">QRIS demo prototipe, tidak bisa menerima dana sungguhan.</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: amount ? 'Ubah Nominal' : 'Atur Nominal', Icon: Pencil, onClick: () => (setDraft(amount), setEditing(true)) },
          { label: 'Simpan', Icon: Download, onClick: download },
          { label: 'Bagikan', Icon: Share2, onClick: share },
        ].map(({ label, Icon, onClick }) => (
          <button key={label} onClick={onClick} disabled={!qr} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 py-3 text-xs hover:bg-white/15">
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>

      <Sheet open={editing} onClose={() => setEditing(false)}>
        <div className="text-ink">
          <p className="font-bold text-lg">Atur nominal</p>
          <p className="text-sm text-muted">Pembayar tidak perlu mengetik nominal lagi.</p>
          <div className="flex items-center border-b-2 border-brand py-1 mt-4">
            <span className="text-2xl font-bold mr-1">Rp</span>
            <input
              inputMode="numeric"
              autoFocus
              placeholder="0"
              aria-label="Nominal"
              value={draft ? draft.toLocaleString('id-ID') : ''}
              onChange={(e) => setDraft(Number(e.target.value.replace(/\D/g, '')) || 0)}
              className="flex-1 min-w-0 text-2xl font-bold outline-none"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {[10_000, 25_000, 50_000, 100_000].map((v) => (
              <button key={v} onClick={() => setDraft(v)} className="flex-1 rounded-full border border-line py-2 text-xs font-semibold hover:border-brand">
                {v / 1000}rb
              </button>
            ))}
          </div>
          <Button
            className="w-full mt-5"
            disabled={!draft}
            onClick={() => {
              setAmount(draft)
              setEditing(false)
            }}
          >
            Buat QRIS {draft ? formatRp(draft) : ''}
          </Button>
        </div>
      </Sheet>
      {toastNode}
    </div>
  )
}
