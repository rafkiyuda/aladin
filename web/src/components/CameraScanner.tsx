import { useCallback, useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Camera, CameraOff, Flashlight, Image as ImageIcon } from 'lucide-react'
import { Button } from './ui'
import Mascot from './Mascot'

type Status = 'idle' | 'starting' | 'live' | 'denied' | 'unsupported' | 'error'

/** Pemindai QR memakai kamera sungguhan (getUserMedia + jsQR), dengan opsi upload dari galeri. */
export default function CameraScanner({ onResult, paused = false }: { onResult: (text: string) => void; paused?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [torch, setTorch] = useState<boolean | null>(null) // null = tidak didukung
  const [note, setNote] = useState('')

  const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && window.isSecureContext
  const [status, setStatus] = useState<Status>(supported ? 'idle' : 'unsupported')

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const start = useCallback(async () => {
    if (!supported) return setStatus('unsupported')
    setStatus('starting')
    setNote('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current!
      video.srcObject = stream
      await video.play()
      const caps = stream.getVideoTracks()[0]?.getCapabilities?.() as { torch?: boolean } | undefined
      setTorch(caps?.torch ? false : null)
      setStatus('live')
    } catch (e) {
      const name = (e as DOMException)?.name
      setStatus(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'error')
      if (name === 'NotFoundError') setNote('Kamera tidak ditemukan di perangkat ini.')
    }
  }, [supported])

  // langsung nyalakan kamera kalau izin sudah pernah diberikan
  useEffect(() => {
    if (!supported) return
    navigator.permissions
      ?.query({ name: 'camera' as PermissionName })
      .then((p) => {
        if (p.state === 'granted') start()
      })
      .catch(() => {})
    return stop
  }, [supported, start, stop])

  // loop pemindaian
  useEffect(() => {
    if (status !== 'live' || paused) return
    let raf = 0
    let last = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (now - last < 120) return
      last = now
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) return
      // pindai area tengah saja (lebih cepat & sesuai kotak pemindai)
      const vw = video.videoWidth
      const vh = video.videoHeight
      const side = Math.min(vw, vh) * 0.8
      const sx = (vw - side) / 2
      const sy = (vh - side) / 2
      const size = Math.min(640, Math.round(side))
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!
      ctx.drawImage(video, sx, sy, side, side, 0, 0, size, size)
      const code = jsQR(ctx.getImageData(0, 0, size, size).data, size, size, { inversionAttempts: 'dontInvert' })
      if (code?.data) {
        navigator.vibrate?.(60)
        onResult(code.data)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [status, paused, onResult])

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track || torch === null) return
    try {
      await track.applyConstraints({ advanced: [{ torch: !torch } as MediaTrackConstraintSet] })
      setTorch(!torch)
    } catch {
      setTorch(null)
    }
  }

  const fromGallery = async (file: File) => {
    setNote('')
    const url = URL.createObjectURL(file)
    try {
      const im = new Image()
      im.src = url
      await im.decode()
      const scale = Math.min(1, 1200 / Math.max(im.width, im.height))
      const w = Math.round(im.width * scale)
      const h = Math.round(im.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(im, 0, 0, w, h)
      const code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'attemptBoth' })
      if (code?.data) onResult(code.data)
      else setNote('Kode QR tidak ditemukan di gambar itu. Coba gambar yang lebih jelas.')
    } catch {
      setNote('Gambar tidak bisa dibaca.')
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  const live = status === 'live'

  return (
    <div>
      <div className="relative h-[440px] overflow-hidden rounded-3xl bg-black">
        <video ref={videoRef} playsInline muted className={`absolute inset-0 w-full h-full object-cover ${live ? '' : 'opacity-0'}`} />
        <canvas ref={canvasRef} className="hidden" />

        {live ? (
          <>
            {/* kotak pemindai */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[62%] aspect-square rounded-2xl shadow-[0_0_0_9999px_rgba(8,10,30,0.55)]">
              {[
                'top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl',
                'top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl',
                'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl',
                'bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl',
              ].map((c) => (
                <span key={c} className={`absolute w-10 h-10 border-white ${c}`} />
              ))}
              {!paused && (
                <span className="absolute left-2 right-2 h-0.5 bg-mint shadow-[0_0_12px_#2ee6b0]" style={{ animation: 'scan-line 1.6s ease-in-out infinite' }} />
              )}
            </div>
            <p className="absolute bottom-4 inset-x-0 text-center text-xs text-white/80">Arahkan kamera ke kode QRIS</p>
            {torch !== null && (
              <button
                aria-label={torch ? 'Matikan senter' : 'Nyalakan senter'}
                onClick={toggleTorch}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center ${torch ? 'bg-gold text-navy' : 'bg-black/50 text-white'}`}
              >
                <Flashlight size={18} />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 text-white">
            {status === 'idle' || status === 'starting' ? (
              <>
                <Mascot pose="phone" size={130} />
                <p className="font-semibold mt-3">Izinkan akses kamera</p>
                <p className="text-sm text-white/70 mt-1">Aladin butuh kamera untuk memindai kode QRIS. Gambar kamera tidak disimpan.</p>
                <Button variant="mint" className="mt-5 px-6 flex items-center gap-2" onClick={start} disabled={status === 'starting'}>
                  <Camera size={18} /> {status === 'starting' ? 'Menyalakan kamera…' : 'Izinkan Akses Kamera'}
                </Button>
              </>
            ) : (
              <>
                <CameraOff size={44} className="text-white/70" />
                <p className="font-semibold mt-3">
                  {status === 'denied' ? 'Akses kamera ditolak' : status === 'unsupported' ? 'Kamera tidak tersedia' : 'Kamera gagal dibuka'}
                </p>
                <p className="text-sm text-white/70 mt-1">
                  {status === 'denied'
                    ? 'Izinkan kamera lewat ikon gembok / pengaturan situs di browser, lalu coba lagi.'
                    : status === 'unsupported'
                      ? 'Kamera hanya bisa dipakai lewat HTTPS atau localhost. Kamu tetap bisa upload gambar QRIS.'
                      : note || 'Coba lagi, atau upload gambar QRIS dari galeri.'}
                </p>
                {status !== 'unsupported' && (
                  <Button variant="mint" className="mt-5 px-6" onClick={start}>
                    Coba Lagi
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) fromGallery(f)
          e.target.value = ''
        }}
      />
      <button onClick={() => fileRef.current?.click()} className="mt-4 mx-auto flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
        <ImageIcon size={16} /> Upload dari galeri
      </button>
      {note && status !== 'error' && <p className="mt-2 text-center text-xs text-[#ffb4b4]">{note}</p>}
    </div>
  )
}
