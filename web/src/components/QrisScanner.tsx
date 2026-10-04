import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import QRCode from 'qrcode'
import { ChevronLeft, ChevronRight, Compass, Minus, Move, Plus } from 'lucide-react'
import { buildQrisPayload } from '../lib/qris'
import { img } from '../images'
import { useImageOk } from './SmartImg'

/* ------------------------------------------------------------------
 * Simulasi kamera QRIS 360°.
 * Tidak membuka kamera: user menggeser (drag / gerak HP) & zoom sebuah
 * panorama warung sampai standee QRIS pas di dalam kotak pemindai.
 * ------------------------------------------------------------------ */

// Ukuran panorama (koordinat scene). Lebar W = 360°.
const W = 1800
const H = 700
const Z_MIN = 0.65
const Z_MAX = 2.2
const START_Z = 0.8

// Posisi QR di dalam scene
const QR = { x: 1305, y: 350, size: 120 }

/* ---------- komponen ---------- */

type Props = {
  merchant: string
  city?: string
  onScanned: (payload: string) => void
}

type View = { ox: number; oy: number; z: number }

const mod = (n: number, m: number) => ((n % m) + m) % m
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))

export default function QrisScanner({ merchant, city = 'Jakarta', onScanned }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [vp, setVp] = useState({ w: 360, h: 440 })
  const [view, setView] = useState<View>({ ox: 120 * START_Z, oy: (H * START_Z - 440) / 2, z: START_Z })
  const [qrSvg, setQrSvg] = useState('')
  const canGyro = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window && 'ontouchstart' in window
  // sebagian browser (Safari iOS, Chrome baru) mewajibkan izin sensor gerak lewat sentuhan user
  const needsGyroPermission =
    canGyro && typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function'
  // gerak HP aktif secara default; gyroLive = data sensor benar-benar sudah masuk
  const [gyroOn, setGyroOn] = useState(canGyro)
  const [gyroLive, setGyroLive] = useState(false)
  const [gyroAsked, setGyroAsked] = useState(false)
  const [scanned, setScanned] = useState(false)
  const sceneBg = useImageOk(img.scene360) ? img.scene360 : undefined
  const payload = useMemo(() => buildQrisPayload(merchant, city), [merchant, city])

  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ d: number; z: number } | null>(null)
  const gyro = useRef<{ a: number; b: number; ox: number; oy: number } | null>(null)

  useEffect(() => {
    QRCode.toString(payload, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#111111', light: '#ffffff' } }).then(setQrSvg)
  }, [payload])

  // ukur viewport
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setVp({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const normalize = useCallback(
    (v: View): View => {
      const z = clamp(v.z, Z_MIN, Z_MAX)
      const maxOy = Math.max(0, H * z - vp.h)
      return { z, ox: mod(v.ox, W * z), oy: clamp(v.oy, 0, maxOy) }
    },
    [vp.h],
  )

  // zoom dengan titik pusat tetap
  const zoomTo = useCallback(
    (nz: number, cx = vp.w / 2, cy = vp.h / 2) =>
      setView((v) => {
        const z = clamp(nz, Z_MIN, Z_MAX)
        const sx = (v.ox + cx) / v.z
        const sy = (v.oy + cy) / v.z
        return normalize({ z, ox: sx * z - cx, oy: sy * z - cy })
      }),
    [normalize, vp.w, vp.h],
  )

  // wheel zoom (perlu listener non-passive)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      setView((v) => {
        const z = clamp(v.z * (e.deltaY < 0 ? 1.08 : 1 / 1.08), Z_MIN, Z_MAX)
        const cx = e.clientX - r.left
        const cy = e.clientY - r.top
        return normalize({ z, ox: ((v.ox + cx) / v.z) * z - cx, oy: ((v.oy + cy) / v.z) * z - cy })
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [normalize])

  /* --- drag & pinch --- */
  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), z: view.z }
    }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()]
      zoomTo((pinch.current.z * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.d)
      return
    }
    const dx = e.clientX - prev.x
    const dy = e.clientY - prev.y
    if (gyro.current) {
      gyro.current.ox -= dx
      gyro.current.oy -= dy
    }
    setView((v) => normalize({ ...v, ox: v.ox - dx, oy: v.oy - dy }))
  }
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    // iOS: sentuhan pertama dipakai untuk meminta izin sensor gerak, lalu langsung aktif
    if (gyroOn && !gyroLive && needsGyroPermission && !gyroAsked) {
      setGyroAsked(true)
      requestGyro()
    }
  }

  /* --- gerak HP (giroskop) --- */
  useEffect(() => {
    if (!gyroOn) return
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.alpha == null || e.beta == null) return
      setGyroLive(true)
      setView((v) => {
        if (!gyro.current) {
          gyro.current = { a: e.alpha!, b: e.beta!, ox: v.ox, oy: v.oy }
          return v
        }
        const g = gyro.current
        const dA = ((e.alpha! - g.a + 540) % 360) - 180
        const dB = e.beta! - g.b
        const pxPerDeg = (W * v.z) / 360
        return normalize({ ...v, ox: g.ox - dA * pxPerDeg, oy: g.oy - dB * pxPerDeg })
      })
    }
    window.addEventListener('deviceorientation', onOrient)
    return () => {
      window.removeEventListener('deviceorientation', onOrient)
      gyro.current = null
      setGyroLive(false)
    }
  }, [gyroOn, normalize])

  const requestGyro = async () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
    try {
      if (DOE?.requestPermission && (await DOE.requestPermission()) !== 'granted') return
      setGyroOn(true)
    } catch {
      // izin ditolak / tidak didukung
    }
  }
  const toggleGyro = () => {
    setGyroAsked(true)
    if (gyroOn) setGyroOn(false)
    else requestGyro()
  }

  /* --- deteksi QR di dalam kotak --- */
  const F = Math.min(220, vp.w * 0.62)
  const frame = { x: (vp.w - F) / 2, y: (vp.h - F) / 2 - 10 }
  const span = W * view.z
  // posisi QR di layar, pilih salinan panorama terdekat dengan tengah layar
  let qx = QR.x * view.z - view.ox
  qx = qx - Math.round((qx + (QR.size * view.z) / 2 - vp.w / 2) / span) * span
  const qy = QR.y * view.z - view.oy
  const qs = QR.size * view.z
  const tol = 10
  const inside = qx >= frame.x - tol && qy >= frame.y - tol && qx + qs <= frame.x + F + tol && qy + qs <= frame.y + F + tol
  const bigEnough = qs >= F * 0.6
  const aligned = inside && bigEnough && !scanned

  const qcx = qx + qs / 2 - vp.w / 2
  const qcy = qy + qs / 2 - (frame.y + F / 2)
  const visible = qx + qs > 0 && qx < vp.w && qy + qs > 0 && qy < vp.h

  let hint: { text: string; dir?: 'left' | 'right' } = { text: '' }
  if (scanned) hint = { text: 'QRIS terbaca ✓' }
  else if (!visible) hint = { text: `QRIS ada di sebelah ${qcx > 0 ? 'kanan' : 'kiri'}, geser pandanganmu`, dir: qcx > 0 ? 'right' : 'left' }
  else if (qs > F + tol * 2) hint = { text: 'Terlalu dekat, perkecil (zoom out)' }
  else if (!inside && Math.abs(qcx) > 20) hint = { text: `Geser sedikit ke ${qcx > 0 ? 'kanan' : 'kiri'}`, dir: qcx > 0 ? 'right' : 'left' }
  else if (!inside) hint = { text: `Geser sedikit ke ${qcy > 0 ? 'bawah' : 'atas'}` }
  else if (!bigEnough) hint = { text: 'Dekatkan lagi (zoom in) sampai pas di kotak' }
  else hint = { text: 'Tahan… sedang memindai' }

  // tahan sebentar saat sudah pas, lalu anggap terbaca
  useEffect(() => {
    if (!aligned) return
    const t = setTimeout(() => {
      setScanned(true)
      navigator.vibrate?.(60)
      setTimeout(() => onScanned(payload), 450)
    }, 900)
    return () => clearTimeout(t)
  }, [aligned, onScanned, payload])

  const heading = Math.round(mod(((view.ox + vp.w / 2) / span) * 360, 360))
  const cornerColor = scanned || aligned ? 'border-mint' : 'border-white'

  return (
    <div className="select-none">
      <div
        ref={boxRef}
        className="relative h-[440px] overflow-hidden rounded-3xl bg-ink touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Simulasi kamera QRIS. Geser untuk melihat sekeliling, zoom untuk mendekat."
        role="application"
      >
        {/* panorama (2 salinan untuk efek 360° tanpa ujung) */}
        <div className="absolute left-0 top-0 will-change-transform" style={{ transform: `translate(${-view.ox}px, ${-view.oy}px)` }}>
          {[0, 1].map((k) => (
            <div key={k} className="absolute top-0" style={{ left: k * span, width: W, height: H, transform: `scale(${view.z})`, transformOrigin: '0 0' }}>
              <Scene qrSvg={qrSvg} merchant={merchant} bg={sceneBg} />
            </div>
          ))}
        </div>

        {/* efek kamera: vignette + gelap di luar kotak */}
        <div
          className="pointer-events-none absolute transition-[box-shadow]"
          style={{
            boxShadow: `0 0 0 9999px rgba(8,10,30,${aligned || scanned ? 0.35 : 0.6})`,
            left: frame.x,
            top: frame.y,
            width: F,
            height: F,
            borderRadius: 18,
          }}
        />
        <div className="pointer-events-none absolute" style={{ left: frame.x, top: frame.y, width: F, height: F }}>
          {[
            'top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl',
            'top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl',
            'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl',
            'bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl',
          ].map((c) => (
            <span key={c} className={`absolute w-10 h-10 transition-colors ${cornerColor} ${c}`} />
          ))}
          {!scanned && (
            <span
              className={`absolute left-2 right-2 h-0.5 ${aligned ? 'bg-mint shadow-[0_0_12px_#2ee6b0]' : 'bg-white/50'}`}
              style={{ animation: 'scan-line 1.6s ease-in-out infinite' }}
            />
          )}
          {aligned && <ScanProgress />}
        </div>

        {/* kompas 360° */}
        <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white">
          <Compass size={13} /> {heading}°
        </div>

        {/* panah arah */}
        {hint.dir && !scanned && (
          <div
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${hint.dir === 'right' ? 'right-2' : 'left-2'} w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center animate-pulse`}
          >
            {hint.dir === 'right' ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </div>
        )}

        {/* petunjuk */}
        <div className="pointer-events-none absolute bottom-16 inset-x-4 text-center">
          <span className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${aligned || scanned ? 'bg-mint text-navy' : 'bg-black/60 text-white'}`}>
            {hint.text}
          </span>
        </div>

        {/* kontrol zoom */}
        <div className="absolute bottom-3 inset-x-3 flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <button aria-label="Perkecil" onClick={() => zoomTo(view.z / 1.15)} className="w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center">
            <Minus size={18} />
          </button>
          <input
            type="range"
            min={Z_MIN}
            max={Z_MAX}
            step={0.01}
            value={view.z}
            onChange={(e) => zoomTo(Number(e.target.value))}
            aria-label="Zoom"
            className="flex-1 accent-mint"
          />
          <button aria-label="Perbesar" onClick={() => zoomTo(view.z * 1.15)} className="w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] opacity-70">
        <Move size={12} /> Geser untuk melihat 360° · scroll / pinch / slider untuk zoom
      </p>
      {canGyro && (
        <button onClick={toggleGyro} className={`mt-2 mx-auto block rounded-full px-4 py-1.5 text-xs font-semibold ${gyroOn ? 'bg-mint text-navy' : 'bg-white/15 border border-current/20'}`}>
          {!gyroOn
            ? 'Gunakan gerak HP (360°)'
            : gyroLive || !needsGyroPermission
              ? 'Gerak HP aktif · ketuk untuk matikan'
              : 'Sentuh layar untuk aktifkan gerak HP'}
        </button>
      )}
    </div>
  )
}

function ScanProgress() {
  return (
    <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        rx="10"
        fill="none"
        stroke="#2ee6b0"
        strokeWidth="1.5"
        pathLength={100}
        strokeDasharray="100"
        style={{ animation: 'scan-progress .9s linear forwards' } as CSSProperties}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* ---------- panorama warung (koordinat W x H) ---------- */

function Scene({ qrSvg, merchant, bg }: { qrSvg: string; merchant: string; bg?: string }) {
  return (
    <div
      className="relative"
      style={{ width: W, height: H, background: bg ? `url(${bg}) 0 0 / 100% 100%` : 'linear-gradient(#f6eee3, #eadfce 75%)' }}
    >
      {!bg && <CssDecor />}

      {/* standee QRIS */}
      <div
        style={box({
          left: QR.x - 22,
          top: QR.y - 74,
          width: QR.size + 44,
          height: QR.size + 136,
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 10px 24px rgba(0,0,0,.25)',
          border: '1px solid #ddd',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
        })}
      >
        <div style={{ background: '#d71920', color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: 1, borderRadius: '10px 10px 0 0', padding: '4px 0' }}>QRIS</div>
        <div style={{ fontSize: 7.5, color: '#555', marginTop: 3, whiteSpace: 'nowrap' }}>QR Code Standar Pembayaran Nasional</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#111', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 4px' }}>{merchant.toUpperCase()}</div>
        <div className="[&>svg]:block [&>svg]:w-full [&>svg]:h-full" style={box({ left: 22, top: 74, width: QR.size, height: QR.size })} dangerouslySetInnerHTML={{ __html: qrSvg }} />
        <div style={box({ left: 0, right: 0, bottom: 8, fontSize: 8, color: '#666' })}>NMID: ID0000DEMO0001 · DEMO</div>
      </div>
      {/* kaki standee */}
      <div style={box({ left: QR.x + QR.size / 2 - 30, top: QR.y + QR.size + 62, width: 60, height: 14, background: '#d4d4d8', borderRadius: 4 })} />
    </div>
  )
}

const box = (s: CSSProperties) => ({ position: 'absolute' as const, ...s })
const products = ['#e5484d', '#f5a524', '#2323c9', '#13b38a', '#7c3aed', '#0ea5e9', '#f97316']

/** Dekorasi warung dari CSS, dipakai kalau gambar panorama belum tersedia. */
function CssDecor() {
  return (
    <>
      {/* lantai */}
      <div style={box({ left: 0, right: 0, top: 560, bottom: 0, background: 'repeating-linear-gradient(90deg,#b98d67 0 120px,#ad8160 120px 240px)' })} />

      {/* jendela */}
      <div style={box({ left: 90, top: 90, width: 300, height: 250, background: 'linear-gradient(#9fd3ff,#d8f0ff)', border: '12px solid #8a5a3b', borderRadius: 6 })}>
        <div style={box({ left: '50%', top: 0, bottom: 0, width: 10, marginLeft: -5, background: '#8a5a3b' })} />
        <div style={box({ top: '50%', left: 0, right: 0, height: 10, marginTop: -5, background: '#8a5a3b' })} />
        <div style={box({ left: 30, top: 30, width: 60, height: 24, borderRadius: 20, background: '#fff', opacity: 0.9 })} />
      </div>
      <div style={box({ left: 80, top: 340, width: 320, height: 18, background: '#7a4d31', borderRadius: 4 })} />

      {/* pintu */}
      <div style={box({ left: 520, top: 130, width: 190, height: 430, background: '#7a4d31', borderRadius: '8px 8px 0 0', border: '8px solid #5e3a24' })}>
        <div style={box({ left: 20, top: 20, right: 20, height: 160, background: '#a9d8f5', opacity: 0.7 })} />
        <div style={box({ right: 18, top: 220, width: 14, height: 14, borderRadius: 10, background: '#f5c24c' })} />
        <div style={box({ left: 34, top: 64, padding: '6px 10px', background: '#fff', borderRadius: 4, fontSize: 18, fontWeight: 700, color: '#13b38a' })}>BUKA</div>
      </div>

      {/* rak produk */}
      {[0, 1, 2].map((r) => (
        <div key={r}>
          <div style={box({ left: 790, top: 160 + r * 110, width: 330, height: 12, background: '#8a5a3b' })} />
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={box({
                left: 800 + i * 35,
                top: 160 + r * 110 - (50 + ((i + r) % 3) * 12),
                width: 28,
                height: 50 + ((i + r) % 3) * 12,
                background: products[(i + r * 2) % products.length],
                borderRadius: 4,
              })}
            />
          ))}
        </div>
      ))}

      {/* papan menu */}
      <div style={box({ left: 1180, top: 60, width: 330, height: 190, background: '#1f3b2c', border: '10px solid #6b4226', borderRadius: 8, color: '#f6eee3', padding: 16, fontFamily: 'Poppins, sans-serif' })}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 2 }}>MENU</div>
        {['Kopi Susu ........ 18rb', 'Teh Tarik ........ 15rb', 'Roti Bakar ....... 20rb', 'Nasi Uduk ........ 22rb'].map((t) => (
          <div key={t} style={{ fontSize: 15, marginTop: 4, opacity: 0.9 }}>
            {t}
          </div>
        ))}
      </div>

      {/* poster */}
      <div style={box({ left: 1560, top: 90, width: 150, height: 200, background: '#2323c9', borderRadius: 10, color: '#fff', padding: 14, fontSize: 18, fontWeight: 700, lineHeight: 1.2 })}>
        Bayar pakai
        <div style={{ color: '#2ee6b0', fontSize: 30 }}>QRIS</div>
        lebih praktis!
      </div>

      {/* meja kasir */}
      <div style={box({ left: 1100, top: 540, width: 640, height: 160, background: 'linear-gradient(#a0704b,#7a4d31)', borderTop: '14px solid #c4935f' })} />
      {/* mesin kasir */}
      <div style={box({ left: 1530, top: 440, width: 130, height: 100, background: '#3f3f46', borderRadius: 10 })}>
        <div style={box({ left: 14, top: 12, width: 102, height: 34, background: '#a7f3d0', borderRadius: 4 })} />
      </div>
      {/* tanaman */}
      <div style={box({ left: 1745, top: 430, width: 46, height: 110, background: '#c2410c', borderRadius: '6px 6px 14px 14px' })} />
      <div style={box({ left: 1720, top: 330, width: 96, height: 120, background: '#16a34a', borderRadius: '50% 50% 40% 40%' })} />
      <div style={box({ left: 0, top: 430, width: 40, height: 110, background: '#c2410c', borderRadius: '6px 6px 14px 14px' })} />
    </>
  )
}
