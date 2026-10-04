import { useCallback, useState, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Check, CircleCheck, Store, X } from 'lucide-react'
import { Button, ProductCard } from '../../components/ui'
import Mascot, { type MascotPose } from '../../components/Mascot'
import QrisScanner from '../../components/QrisScanner'
import { categoryColors, formatRp, missions, type Category } from '../../data'
import { useApp } from '../../state/AppState'

export default function Mission() {
  const { id } = useParams()
  const mission = missions.find((m) => m.id === Number(id))
  const { state } = useApp()
  if (!mission) return <Navigate to="/journey" replace />

  // Misi hanya bisa dibuka berurutan
  const firstOpen = missions.find((m) => !state.completedMissions.includes(m.id))
  if (!state.completedMissions.includes(mission.id) && firstOpen && firstOpen.id !== mission.id) {
    return <Navigate to="/journey" replace />
  }

  const Body = { 1: MissionQris, 2: MissionBudget, 3: MissionGrow, 4: MissionShare, 5: MissionSyariah }[mission.id]!
  return <Body />
}

/* ---------- kerangka bersama ---------- */

function useFinish(id: number) {
  const navigate = useNavigate()
  const { completeMission } = useApp()
  return () => {
    completeMission(id)
    navigate(`/journey/misi/${id}/selesai`, { replace: true })
  }
}

function MissionShell({ id, children, footer }: { id: number; children: ReactNode; footer?: ReactNode }) {
  const navigate = useNavigate()
  const m = missions.find((x) => x.id === id)!
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <header className="sticky top-0 z-20 bg-white px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Misi {id}/{missions.length}
          </p>
          <button aria-label="Tutup misi" onClick={() => navigate('/journey')} className="p-1 -mr-1 rounded-full hover:bg-black/5">
            <X size={20} />
          </button>
        </div>
        <h1 className="text-xl font-bold mt-0.5">{m.subtitle}</h1>
        <div className="flex gap-2 mt-3">
          {missions.map((x) => (
            <span
              key={x.id}
              className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center ${
                x.id === id ? 'bg-navy text-white' : x.id < id ? 'bg-mint text-navy' : 'bg-surface text-muted'
              }`}
            >
              {x.id < id ? <Check size={14} strokeWidth={3} /> : x.id}
            </span>
          ))}
        </div>
      </header>
      <div className="flex-1 flex flex-col px-5 pb-4">{children}</div>
      {footer && <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-line">{footer}</div>}
    </div>
  )
}

function Bubble({ pose, title, text }: { pose: MascotPose; title: string; text: string }) {
  return (
    <div className="flex items-end gap-2">
      <Mascot pose={pose} size={110} className="shrink-0" />
      <div className="relative mb-6 rounded-2xl rounded-bl-sm bg-white border border-brand/20 shadow-sm p-3">
        <p className="font-bold text-navy">{title}</p>
        <p className="text-xs text-muted mt-0.5">{text}</p>
      </div>
    </div>
  )
}

/* ---------- Misi 1: QRIS ---------- */

function MissionQris() {
  const navigate = useNavigate()
  const finish = useFinish(1)
  const [step, setStep] = useState<'intro' | 'scan' | 'pay' | 'paid'>('intro')
  const onScanned = useCallback(() => setStep('pay'), [])

  return (
    <MissionShell
      id={1}
      footer={
        step === 'intro' ? (
          <>
            <Button variant="mint" className="w-full" onClick={() => setStep('scan')}>
              Coba Scan QRIS
            </Button>
            <button className="w-full mt-2 py-2 text-ink font-semibold" onClick={() => navigate('/journey')}>
              Lewati
            </button>
          </>
        ) : step === 'pay' ? (
          <Button className="w-full" onClick={() => setStep('paid')}>
            Bayar Sekarang
          </Button>
        ) : step === 'paid' ? (
          <Button variant="navy" className="w-full" onClick={finish}>
            Klaim Badge
          </Button>
        ) : null
      }
    >
      {step === 'intro' && (
        <>
          <Bubble pose="point" title="Yuk coba QRIS!" text="Lebih praktis dan bisa dipakai di banyak tempat." />
          <div className="mt-2 rounded-3xl bg-brand-soft p-4 space-y-2 text-sm">
            {[
              'Kamu ada di sebuah warung. Cari standee QRIS di sekelilingmu (bisa diputar 360°).',
              'Geser layar (atau gerakkan HP) untuk melihat sekeliling.',
              'Zoom sampai kode QR pas di dalam kotak pemindai.',
            ].map((t, i) => (
              <p key={t} className="flex gap-2">
                <span className="w-6 h-6 shrink-0 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                {t}
              </p>
            ))}
          </div>
        </>
      )}

      {step === 'scan' && (
        <div className="rounded-3xl bg-ink text-white p-3 animate-pop-in">
          <div className="flex items-center justify-center gap-2 text-sm py-1 mb-2">
            <span className="font-semibold">Pindai QRIS</span>
          </div>
          <QrisScanner merchant="Warung Kopi Berkah" onScanned={onScanned} />
        </div>
      )}

      {step === 'pay' && (
        <div className="mt-4 animate-pop-in">
          <div className="rounded-3xl border border-line p-5">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                <Store size={24} />
              </span>
              <div>
                <p className="font-semibold">Warung Kopi Berkah</p>
                <p className="text-xs text-muted">NMID ID0000DEMO0001 · Merchant demo</p>
              </div>
            </div>
            <p className="text-sm text-muted mt-5">Nominal</p>
            <p className="text-3xl font-bold">{formatRp(15000)}</p>
            <p className="text-xs text-muted mt-1">Ini simulasi, saldo kamu tidak akan terpotong.</p>
          </div>
          <div className="mt-4">
            <Bubble pose="shield" title="Aman & sesuai syariah" text="Cek nama merchant sebelum bayar, lalu konfirmasi dengan PIN." />
          </div>
        </div>
      )}

      {step === 'paid' && (
        <div className="mt-6 text-center animate-pop-in">
          <span className="mx-auto w-20 h-20 rounded-full bg-[#13b38a] text-white flex items-center justify-center">
            <Check size={44} strokeWidth={3} />
          </span>
          <p className="text-xl font-bold mt-4">Pembayaran Berhasil!</p>
          <p className="text-muted text-sm">{formatRp(15000)} ke Warung Kopi Berkah (simulasi)</p>
          <div className="mt-6 flex justify-center">
            <Mascot pose="thumbs" size={150} />
          </div>
        </div>
      )}
    </MissionShell>
  )
}

/* ---------- Misi 2: Atur pengeluaran ---------- */

function MissionBudget() {
  const finish = useFinish(2)
  const { state, setTxCategory, update } = useApp()
  const [step, setStep] = useState<'categorize' | 'budget'>('categorize')
  const sample = state.transactions.filter((t) => t.amount < 0).slice(0, 3)
  const [answers, setAnswers] = useState<Record<string, Category>>({})
  const [budget, setBudget] = useState(state.budgets.Makanan ?? 1_000_000)
  const opts: Category[] = ['Makanan', 'Transportasi', 'Shopping', 'Hiburan', 'Keluarga', 'Lainnya']
  const allAnswered = sample.every((t) => answers[t.id])

  return (
    <MissionShell
      id={2}
      footer={
        step === 'categorize' ? (
          <Button
            className="w-full"
            disabled={!allAnswered}
            onClick={() => {
              Object.entries(answers).forEach(([id, c]) => setTxCategory(id, c))
              setStep('budget')
            }}
          >
            Lanjut
          </Button>
        ) : (
          <Button
            variant="navy"
            className="w-full"
            onClick={() => {
              update((s) => ({ budgets: { ...s.budgets, Makanan: budget } }))
              finish()
            }}
          >
            Simpan Budget
          </Button>
        )
      }
    >
      {step === 'categorize' ? (
        <>
          <Bubble pose="idea" title="Kategorikan transaksimu" text="Biar kamu tahu uangmu paling banyak ke mana." />
          <div className="space-y-3 mt-2">
            {sample.map((t) => (
              <div key={t.id} className="rounded-2xl border border-line p-4">
                <div className="flex justify-between">
                  <p className="font-semibold">{t.title}</p>
                  <p className="font-semibold">{formatRp(-t.amount)}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {opts.map((c) => {
                    const on = answers[t.id] === c
                    return (
                      <button
                        key={c}
                        onClick={() => setAnswers((a) => ({ ...a, [t.id]: c }))}
                        className={`text-xs rounded-full px-3 py-1.5 border transition ${on ? 'text-white border-transparent' : 'border-line'}`}
                        style={on ? { background: categoryColors[c] } : undefined}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-pop-in">
          <Bubble pose="insight" title="Sekarang buat budget" text="Mulai dari kategori Makanan, pengeluaran terbesarmu." />
          <div className="rounded-3xl bg-brand-soft p-5 mt-2">
            <p className="text-sm text-muted">Budget Makanan per bulan</p>
            <p className="text-3xl font-bold mt-1">{formatRp(budget)}</p>
            <input
              type="range"
              min={300_000}
              max={3_000_000}
              step={50_000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full mt-4 accent-brand"
              aria-label="Budget makanan"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>Rp300rb</span>
              <span>Rp3jt</span>
            </div>
          </div>
          <p className="text-xs text-muted mt-3 flex gap-1.5">
            <CircleCheck size={16} className="text-[#13b38a] shrink-0" /> Aladin akan mengingatkan kalau pengeluaran makan mendekati budget.
          </p>
        </div>
      )}
    </MissionShell>
  )
}

/* ---------- Misi 3: Kembangkan uang ---------- */

function MissionGrow() {
  const finish = useFinish(3)
  const [choice, setChoice] = useState<'impian' | 'deposito' | null>(null)
  const correct = choice === 'impian'

  return (
    <MissionShell
      id={3}
      footer={
        <Button variant="navy" className="w-full" disabled={!correct} onClick={finish}>
          Selesaikan Misi
        </Button>
      }
    >
      <Bubble pose="insight" title="Kenalan dengan produk simpanan" text="Uangmu bisa berkembang dengan bagi hasil, bukan bunga." />
      <div className="space-y-3 mt-2">
        <ProductCard id="impian" compact />
        <ProductCard id="deposito" compact />
      </div>
      <div className="mt-5 rounded-2xl border border-line p-4">
        <p className="font-semibold">Kuis: Untuk dana darurat yang bisa diambil kapan saja, mana yang lebih cocok?</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {(['impian', 'deposito'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setChoice(c)}
              className={`rounded-xl border-2 py-3 font-semibold ${
                choice === c ? (c === 'impian' ? 'border-[#13b38a] bg-[#e7faf3]' : 'border-[#e5484d] bg-[#fdecec]') : 'border-line'
              }`}
            >
              {c === 'impian' ? 'Ala Impian' : 'Ala Deposito'}
            </button>
          ))}
        </div>
        {choice && (
          <p className={`text-sm mt-3 ${correct ? 'text-[#0f9a76]' : 'text-[#e5484d]'}`}>
            {correct
              ? 'Tepat! Ala Impian fleksibel, bisa setor & tarik kapan saja.'
              : 'Kurang tepat. Deposito punya jangka waktu, lebih cocok untuk dana yang tidak segera dipakai.'}
          </p>
        )}
      </div>
    </MissionShell>
  )
}

/* ---------- Misi 4: Berbagi ---------- */

const shareCards = [
  { id: 'zakat', title: 'Zakat', emoji: '🕋', front: 'Wajib atau sukarela?', back: 'Wajib bagi muslim yang hartanya mencapai nisab (±85 gram emas) dan haul 1 tahun. Besarnya 2,5%.' },
  { id: 'infak', title: 'Infak', emoji: '🤲', front: 'Berapa minimalnya?', back: 'Tidak ada batas minimal. Infak adalah mengeluarkan sebagian harta untuk kebaikan, kapan saja.' },
  { id: 'sedekah', title: 'Sedekah', emoji: '❤️', front: 'Harus berupa uang?', back: 'Tidak harus! Sedekah bisa berupa harta, tenaga, bahkan senyuman.' },
]

function MissionShare() {
  const finish = useFinish(4)
  const [open, setOpen] = useState<string[]>([])
  const all = open.length === shareCards.length

  return (
    <MissionShell
      id={4}
      footer={
        <Button variant="navy" className="w-full" disabled={!all} onClick={finish}>
          {all ? 'Selesaikan Misi' : `Buka ${shareCards.length - open.length} kartu lagi`}
        </Button>
      }
    >
      <Bubble pose="love" title="Berbagi lebih bermakna" text="Ketuk tiap kartu untuk tahu bedanya zakat, infak & sedekah." />
      <div className="space-y-3 mt-2">
        {shareCards.map((c) => {
          const isOpen = open.includes(c.id)
          return (
            <button
              key={c.id}
              onClick={() => setOpen((o) => (o.includes(c.id) ? o : [...o, c.id]))}
              className={`w-full rounded-2xl p-4 text-left transition border ${isOpen ? 'bg-brand text-white border-brand' : 'bg-white border-line hover:border-brand/40'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{c.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold">{c.title}</p>
                  <p className={`text-sm ${isOpen ? 'text-white/90' : 'text-muted'}`}>{isOpen ? c.back : c.front}</p>
                </div>
                {isOpen && <CircleCheck size={20} className="text-mint shrink-0" />}
              </div>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-muted mt-4">Di Aladin, kamu bisa berbagi lewat Rumah Zakat, Baznas, Rumah Yatim & Dompet Dhuafa.</p>
    </MissionShell>
  )
}

/* ---------- Misi 5: Syariah in 30 seconds ---------- */

const facts = [
  { conv: 'Bunga (riba) yang ditetapkan di awal', syariah: 'Bagi hasil (nisbah) sesuai keuntungan nyata' },
  { conv: 'Dana bisa disalurkan ke usaha apa saja', syariah: 'Hanya ke usaha halal, diawasi Dewan Pengawas Syariah' },
  { conv: 'Hubungan nasabah: kreditur–debitur', syariah: 'Hubungan kemitraan, berbagi risiko & keuntungan' },
]

function MissionSyariah() {
  const finish = useFinish(5)
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState<string | null>(null)
  const inQuiz = i >= facts.length

  return (
    <MissionShell
      id={5}
      footer={
        inQuiz ? (
          <Button variant="navy" className="w-full" disabled={answer !== 'bagi'} onClick={finish}>
            Selesaikan Misi
          </Button>
        ) : (
          <Button className="w-full" onClick={() => setI(i + 1)}>
            {i === facts.length - 1 ? 'Ke Kuis' : 'Berikutnya'}
          </Button>
        )
      }
    >
      <Bubble pose={inQuiz ? 'think' : 'book'} title={inQuiz ? 'Kuis singkat!' : 'Syariah in 30 seconds'} text={inQuiz ? 'Jawab dengan benar untuk menyelesaikan misi.' : `Fakta ${i + 1} dari ${facts.length}`} />

      {!inQuiz ? (
        <div key={i} className="mt-2 grid grid-cols-2 gap-3 animate-pop-in">
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-xs font-semibold text-muted">Bank Konvensional</p>
            <p className="mt-2 text-sm">{facts[i].conv}</p>
          </div>
          <div className="rounded-2xl bg-brand text-white p-4">
            <p className="text-xs font-semibold text-mint">Bank Syariah</p>
            <p className="mt-2 text-sm">{facts[i].syariah}</p>
          </div>
        </div>
      ) : (
        <div className="mt-2 rounded-2xl border border-line p-4 animate-pop-in">
          <p className="font-semibold">Keuntungan yang diterima nasabah di bank syariah disebut…</p>
          <div className="space-y-2 mt-3">
            {[
              { id: 'bunga', label: 'Bunga' },
              { id: 'bagi', label: 'Bagi hasil' },
              { id: 'denda', label: 'Denda' },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setAnswer(o.id)}
                className={`w-full rounded-xl border-2 py-3 px-4 text-left font-semibold ${
                  answer === o.id ? (o.id === 'bagi' ? 'border-[#13b38a] bg-[#e7faf3]' : 'border-[#e5484d] bg-[#fdecec]') : 'border-line'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          {answer && answer !== 'bagi' && <p className="text-sm text-[#e5484d] mt-3">Coba lagi ya! Ingat fakta pertama tadi 😉</p>}
          {answer === 'bagi' && <p className="text-sm text-[#0f9a76] mt-3">Masya Allah, benar! 🎉</p>}
        </div>
      )}
    </MissionShell>
  )
}
