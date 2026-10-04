import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Gift, House, ScanLine, Wallet, X } from 'lucide-react'
import { formatRp, savingsProducts } from '../data'
import { img } from '../images'
import SmartImg from './SmartImg'

/* ---------- Layout ---------- */

/** Halaman dengan header putih + tombol kembali. */
export function Page({
  title,
  children,
  right,
  onBack,
  className = '',
  headerClass = 'bg-white',
}: {
  title?: ReactNode
  children: ReactNode
  right?: ReactNode
  onBack?: () => void
  className?: string
  headerClass?: string
}) {
  const navigate = useNavigate()
  return (
    <div className={`min-h-dvh flex flex-col ${className}`}>
      <header className={`sticky top-0 z-20 flex items-center gap-2 px-4 h-14 ${headerClass}`}>
        <button
          aria-label="Kembali"
          onClick={onBack ?? (() => navigate(-1))}
          className="-ml-2 p-2 rounded-full hover:bg-black/5"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="flex-1 text-[17px] font-semibold truncate">{title}</h1>
        {right}
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}

/** Tombol utama. */
export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'navy' | 'mint' | 'ghost' | 'outline'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const styles = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    navy: 'bg-navy text-white hover:bg-navy-dark',
    mint: 'bg-[#13b38a] text-white hover:bg-[#0f9a76]',
    ghost: 'text-brand hover:bg-brand-soft',
    outline: 'border border-brand text-brand hover:bg-brand-soft',
  }[variant]
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`h-12 px-5 rounded-full font-semibold text-[15px] transition disabled:opacity-40 disabled:pointer-events-none ${styles} ${className}`}
    >
      {children}
    </button>
  )
}

/** Overlay modal di tengah, terkunci di lebar mobile. */
export function Modal({ open, onClose, children }: { open: boolean; onClose?: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-center animate-fade-in">
      <div className="relative w-full max-w-[430px] h-full bg-black/55 flex items-center justify-center p-5" onClick={onClose}>
        <div className="relative w-full animate-pop-in" onClick={(e) => e.stopPropagation()}>
          {onClose && (
            <button
              aria-label="Tutup"
              onClick={onClose}
              className="absolute -top-3 -right-1 z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
            >
              <X size={18} />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

/** Bottom sheet. */
export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-center animate-fade-in">
      <div className="relative w-full max-w-[430px] h-full bg-black/50 flex items-end" onClick={onClose}>
        <div className="w-full bg-white rounded-t-3xl p-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" />
          {children}
        </div>
      </div>
    </div>
  )
}

/* ---------- Navigasi bawah ---------- */

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const item = (path: string, label: string, Icon: typeof House) => {
    const active = pathname === path
    return (
      <button onClick={() => navigate(path)} className={`flex-1 flex flex-col items-center gap-1 pt-2 ${active ? 'text-brand' : 'text-muted'}`}>
        <Icon size={24} strokeWidth={active ? 2.4 : 2} />
        <span className="text-xs">{label}</span>
      </button>
    )
  }
  return (
    <>
      <div className="h-24" />
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-start h-20 pb-[env(safe-area-inset-bottom)]">
        {item('/', 'Beranda', House)}
        <button
          onClick={() => navigate('/qris')}
          aria-label="Scan QRIS"
          className="-mt-0 mx-2 mt-3 h-12 w-28 rounded-full bg-brand text-white flex flex-col items-center justify-center shadow-lg shadow-brand/30"
        >
          <ScanLine size={22} />
          <span className="text-[10px] font-bold tracking-widest -mt-0.5">QRIS</span>
        </button>
        {item('/keuangan', 'Keuangan', Wallet)}
      </nav>
    </>
  )
}

/* ---------- Carousel ---------- */

export function Carousel<T>({
  items,
  render,
  itemClass = 'w-[86%]',
  dotStyle = 'dot',
}: {
  items: T[]
  render: (item: T, i: number) => ReactNode
  itemClass?: string
  dotStyle?: 'dot' | 'bar'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const child = el.children[0] as HTMLElement | undefined
    if (!child) return
    setIndex(Math.round(el.scrollLeft / (child.offsetWidth + 12)))
  }

  return (
    <div>
      <div ref={ref} onScroll={onScroll} className="no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 scroll-px-5">
        {items.map((it, i) => (
          <div key={i} className={`snap-start shrink-0 ${itemClass}`}>
            {render(it, i)}
          </div>
        ))}
      </div>
      <div className={`flex gap-2 mt-3 ${dotStyle === 'bar' ? 'justify-center' : 'px-6'}`}>
        {items.map((_, i) =>
          dotStyle === 'bar' ? (
            <span key={i} className={`h-1.5 w-12 rounded-full ${i === index ? 'bg-brand/60' : 'bg-brand-soft'}`} />
          ) : (
            <span key={i} className={`h-3 w-3 rounded ${i === index ? 'bg-mint' : 'bg-mint-soft'}`} />
          ),
        )}
      </div>
    </div>
  )
}

/* ---------- Kartu & elemen kecil ---------- */

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 mb-3">
      <h2 className="text-lg font-bold">{title}</h2>
      {action && (
        <button onClick={onAction} className="text-brand font-bold text-[15px]">
          {action}
        </button>
      )}
    </div>
  )
}

export function DepositoIcon({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <rect x="4" y="4" width="56" height="54" rx="12" fill="#0b1a5e" />
      <rect x="11" y="11" width="42" height="40" rx="8" fill="none" stroke="#f5a524" strokeWidth="3.5" />
      <path d="M24 24l16 16M40 24L24 40" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="4" fill="#0b1a5e" />
    </svg>
  )
}

export function ImpianIcon({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <rect x="8" y="14" width="48" height="46" rx="14" fill="#0b1a5e" />
      <rect x="14" y="6" width="36" height="10" rx="5" fill="#f5a524" />
      <path d="M32 22l5 10 11 1.5-8 7.5 2 11-10-5.5-10 5.5 2-11-8-7.5L27 32z" fill="#f5a524" />
    </svg>
  )
}

/** Ikon kado 3D untuk kartu reward/hadiah (cadangan: ikon datar). */
export function RewardIcon({ size = 64 }: { size?: number }) {
  return (
    <SmartImg
      src={img.hadiahPopup}
      alt=""
      className="shrink-0 object-contain drop-shadow-md"
      style={{ width: size, height: size }}
      fallback={
        <span className="shrink-0 rounded-xl bg-[#e5484d] text-white flex items-center justify-center" style={{ width: size * 0.8, height: size * 0.8 }}>
          <Gift size={size * 0.4} />
        </span>
      }
    />
  )
}

export function ProductIcon({ id, size = 64 }: { id: 'deposito' | 'impian'; size?: number }) {
  return (
    <SmartImg
      src={img.product[id]}
      className={`shrink-0 object-contain ${size > 56 ? 'w-16 h-16' : 'w-13 h-13'}`}
      fallback={id === 'deposito' ? <DepositoIcon size={size} /> : <ImpianIcon size={size} />}
    />
  )
}

export function ProductCard({ id, onClick, compact }: { id: 'deposito' | 'impian'; onClick?: () => void; compact?: boolean }) {
  const p = savingsProducts.find((x) => x.id === id)!
  return (
    <div className="rounded-3xl bg-brand-soft p-5 h-full">
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-[17px]">{p.name}</h3>
          <div className="flex gap-3 mt-2">
            <p className="shrink-0 whitespace-nowrap text-gold font-bold text-[13px] leading-tight pr-3 border-r border-dashed border-muted/40">
              Bagi Hasil
              <br />
              {p.rate}
            </p>
            <p className="text-[13px] leading-tight text-ink">{p.tagline}</p>
          </div>
        </div>
        <ProductIcon id={id} size={compact ? 52 : 64} />
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button onClick={onClick} className="shrink-0 h-9 px-5 rounded-full bg-brand text-white text-sm font-bold">
          {p.cta}
        </button>
        <p className="text-[8px] leading-tight text-muted">{p.note}</p>
      </div>
    </div>
  )
}

export function Money({ value, hidden, className = '' }: { value: number; hidden?: boolean; className?: string }) {
  return <span className={className}>{hidden ? 'Rp•••••••' : formatRp(value)}</span>
}

/** Toast singkat di bawah layar. */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 2200)
    return () => clearTimeout(t)
  }, [msg])
  const node = msg ? (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] max-w-[380px] w-[calc(100%-40px)] bg-ink text-white text-sm rounded-2xl px-4 py-3 shadow-lg animate-pop-in text-center">
      {msg}
    </div>
  ) : null
  return { toast: setMsg, toastNode: node }
}

/** Efek confetti sederhana. */
export function Confetti() {
  const colors = ['#2ee6b0', '#f5a524', '#2323c9', '#e11d48', '#7c3aed']
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-96 overflow-hidden" aria-hidden>
      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          className="absolute block w-2 h-3 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animation: `confetti-fall ${2 + (i % 5) * 0.4}s ${(i % 7) * 0.15}s ease-in both`,
          }}
        />
      ))}
    </div>
  )
}
