import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  ChevronRight,
  CircleCheck,
  Eye,
  EyeOff,
  Gift,
  HandHeart,
  Landmark,
  ReceiptText,
  Send,
  Smartphone,
  Sparkles,
  Trophy,
  User,
  Wallet,
  Wifi,
  Zap,
} from 'lucide-react'
import { BottomNav, Button, Carousel, Modal, ProductCard, SectionTitle, useToast } from '../components/ui'
import Mascot from '../components/Mascot'
import SmartImg from '../components/SmartImg'
import { img } from '../images'
import { useApp } from '../state/AppState'
import { berbagi, campaigns, categoryColors, formatRp, missions, promos, type Category } from '../data'

export default function Home() {
  const navigate = useNavigate()
  const { state, update, onboardingDone } = useApp()
  const { toast, toastNode } = useToast()
  const [scrolled, setScrolled] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  const done = state.completedMissions.length
  const inJourney = state.onboardingStarted && !onboardingDone
  const showProactive = onboardingDone && !state.proactiveInsightSeen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 140)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Pop-up undangan AI muncul beberapa detik setelah beranda dibuka (pengguna baru)
  useEffect(() => {
    if (state.invitationDismissed || state.onboardingStarted) return
    const t = setTimeout(() => setShowInvite(true), 1200)
    return () => clearTimeout(t)
  }, [state.invitationDismissed, state.onboardingStarted])

  const soon = () => toast('Fitur ini segera hadir di prototipe 🙏')

  const expenses = state.transactions.filter((t) => t.amount < 0)
  const totalExpense = expenses.reduce((s, t) => s - t.amount, 0)
  const byCat = expenses.reduce<Partial<Record<Category, number>>>((acc, t) => {
    const c = t.category as Category
    acc[c] = (acc[c] ?? 0) - t.amount
    return acc
  }, {})
  const maxCat = Math.max(...Object.values(byCat).map((v) => v ?? 0), 1)

  const shortcuts = [
    { label: 'Ala Deposito', badge: '8,5%', icon: <Landmark size={22} />, bg: 'bg-navy text-gold', go: () => navigate('/kembangkan') },
    { label: 'Ala Impian', badge: '8%', icon: <Sparkles size={22} />, bg: 'bg-white text-navy', go: () => navigate('/kembangkan') },
    { label: 'Donasi', icon: <HandHeart size={22} />, bg: 'bg-white text-[#13b38a]', go: () => navigate('/berbagi') },
    { label: 'E-Wallet', icon: <Wallet size={22} />, bg: 'bg-white text-[#2b7de9]', go: soon },
    { label: 'Pulsa', icon: <Smartphone size={22} />, bg: 'bg-white text-[#2b7de9]', go: soon },
    { label: 'Paket Data', icon: <Wifi size={22} />, bg: 'bg-white text-[#2b7de9]', go: soon },
    { label: 'Token Listrik', icon: <Zap size={22} />, bg: 'bg-white text-[#2b7de9]', go: soon },
    { label: 'Tabungan Anak', icon: <span className="font-bold text-sm">Gen</span>, bg: 'bg-[#4ade80] text-white', go: soon },
    { label: 'Kuota Gratis', icon: <Gift size={22} />, bg: 'bg-white text-gold', go: soon },
  ]

  return (
    <div className="bg-white">
      {/* Header */}
      <header
        className={`sticky top-0 z-30 flex items-center justify-between px-5 h-16 transition-colors ${
          scrolled ? 'bg-white text-brand shadow-sm' : 'bg-navy text-white'
        }`}
      >
        <Logo />
        <div className="flex items-center gap-4">
          <button aria-label="Notifikasi" className="relative" onClick={() => navigate('/notifikasi')}>
            <Bell size={24} />
            {onboardingDone && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#e11d48]" />}
          </button>
          <button aria-label="Profil" onClick={() => navigate('/profil')}>
            <User size={24} />
          </button>
        </div>
      </header>

      {/* Latar navy + kartu dompet */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-44 bg-navy overflow-hidden">
          <Stars />
          <div className="absolute -bottom-16 -left-10 -right-10 h-28 bg-white rounded-[50%]" />
        </div>

        <div className="relative px-5 pt-2">
          {(inJourney || onboardingDone) && (
            <button
              onClick={() => navigate(onboardingDone ? '/challenge' : '/journey')}
              className="w-full mb-3 flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-2.5 text-left text-white"
            >
              <div className="flex-1">
                <p className="font-semibold">Assalamu'alaikum, {state.userName}!</p>
                <p className="text-xs text-white/75">
                  {onboardingDone ? `Poin kamu ${state.points.toLocaleString('id-ID')} · lanjutkan challenge` : 'Yuk lanjutkan perjalananmu'}
                </p>
                {!onboardingDone && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-white/20">
                      <div className="h-full rounded-full bg-mint" style={{ width: `${(done / missions.length) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold">
                      {done}/{missions.length}
                    </span>
                  </div>
                )}
              </div>
              <Mascot pose={onboardingDone ? 'thumbs' : 'point'} size={54} className="-my-2" />
            </button>
          )}

          <div className="rounded-3xl bg-white shadow-[0_6px_24px_rgba(11,26,94,0.12)] p-4">
            <div className="rounded-2xl bg-surface px-4 py-3">
              <div className="flex justify-between">
                <span className="text-muted text-sm">Ala Dompet</span>
                <button onClick={() => navigate('/keuangan')} className="text-brand font-bold text-sm">
                  Detail
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold">{state.hideBalance ? 'Rp•••••••' : formatRp(state.balance)}</span>
                <button
                  aria-label={state.hideBalance ? 'Tampilkan saldo' : 'Sembunyikan saldo'}
                  onClick={() => update((s) => ({ hideBalance: !s.hideBalance }))}
                  className="text-muted"
                >
                  {state.hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 mt-4">
              {[
                { label: 'Transfer', Icon: Send, go: () => navigate('/transfer') },
                { label: 'Bayar & Beli', Icon: ReceiptText, go: soon },
                { label: 'Tarik', Icon: ArrowDownToLine, go: soon },
                { label: 'Setor', Icon: ArrowUpFromLine, go: soon },
              ].map(({ label, Icon, go }) => (
                <button key={label} onClick={go} className="flex flex-col items-center gap-2">
                  <span className="w-11 h-11 rounded-xl bg-brand text-white flex items-center justify-center">
                    <Icon size={20} />
                  </span>
                  <span className="text-[13px]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shortcut */}
      <section className="no-scrollbar flex gap-1 overflow-x-auto px-3 pt-6 pb-2">
        {shortcuts.map((s) => (
          <button key={s.label} onClick={s.go} className="shrink-0 w-[76px] flex flex-col items-center gap-2 relative">
            {s.badge && (
              <span className="absolute -top-2 right-0 z-10 bg-[#e11d48] text-white text-[11px] font-semibold rounded-full px-1.5 py-0.5">
                {s.badge}
              </span>
            )}
            <SmartImg
              src={img.shortcut[s.label]}
              alt=""
              className="w-12 h-12 rounded-xl object-contain"
              fallback={<span className={`w-12 h-12 rounded-xl border border-line shadow-sm flex items-center justify-center ${s.bg}`}>{s.icon}</span>}
            />
            <span className="text-[12px] leading-tight text-center">{s.label}</span>
          </button>
        ))}
      </section>

      {/* Hadiah journey */}
      {onboardingDone && state.rewardEarned > 0 && (
        <section className="px-5 mt-4">
          <div className="rounded-2xl bg-[#fff6e0] border border-gold/30 p-4 flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
              <Gift size={26} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Uang hasil journey kamu</p>
              <p className="text-xl font-bold text-[#e5484d]">{formatRp(state.rewardEarned)} 🎁</p>
              <p className="text-xs text-muted">Sudah masuk ke Ala Dompet. Gunakan untuk transaksi pertamamu!</p>
            </div>
          </div>
        </section>
      )}

      {/* Insight keuangan */}
      {(inJourney || onboardingDone) && (
        <section className="mt-6">
          <SectionTitle title="Insight Keuangan" action="Lihat Semua" onAction={() => navigate('/keuangan?tab=pengeluaran')} />
          <div className="mx-5 rounded-2xl border border-line p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Pengeluaran bulan ini</p>
                <p className="text-2xl font-bold">{formatRp(totalExpense)}</p>
                <p className="text-xs text-[#13b38a] flex items-center gap-1 mt-1">
                  <CircleCheck size={14} /> 12% lebih rendah dari bulan lalu
                </p>
              </div>
              <div className="flex items-end gap-1.5 h-16">
                {(Object.keys(byCat) as Category[]).map((c) => (
                  <div
                    key={c}
                    title={c}
                    className="w-3 rounded-t"
                    style={{ height: `${((byCat[c] ?? 0) / maxCat) * 100}%`, background: categoryColors[c] }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Aladin Challenge */}
      {onboardingDone && (
        <section className="px-5 mt-6">
          <button onClick={() => navigate('/challenge')} className="w-full rounded-2xl bg-brand text-white p-4 flex items-center gap-3 text-left">
            <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Trophy size={22} className="text-gold" />
            </span>
            <div className="flex-1">
              <p className="font-semibold">Aladin Challenge</p>
              <p className="text-xs text-white/80">Selesaikan misi harian, kumpulkan poin & tukar reward</p>
            </div>
            <ChevronRight size={20} />
          </button>
        </section>
      )}

      {/* Temukan Berkah */}
      <section className="mt-7">
        <SectionTitle title="Temukan Berkah" action="Lihat Semua" onAction={soon} />
        <Carousel
          items={promos}
          render={(p) => (
            <div
              className="h-40 rounded-3xl p-4 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(120deg, ${p.from}, ${p.to})` }}
            >
              <SmartImg
                src={img.promo[p.id]}
                className="absolute inset-y-0 right-0 w-[58%] h-full object-cover [mask-image:linear-gradient(to_right,transparent,black_40%)]"
                fallback={<div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />}
              />
              <span className="relative inline-block bg-white text-navy text-xs font-bold rounded-lg px-2 py-1">{p.brand}</span>
              <p className="relative mt-2 text-[11px] font-semibold text-mint max-w-[60%]">{p.tag}</p>
              <p className="relative text-sm">{p.title}</p>
              <p className="relative text-3xl font-extrabold text-gold drop-shadow">{p.amount}</p>
              <span className="absolute bottom-3 left-4 text-[10px] bg-black/30 rounded-full px-2 py-0.5">Periode {p.period}</span>
            </div>
          )}
        />
      </section>

      {/* Banyak cara nabung */}
      <section className="mt-7">
        <SectionTitle title="Banyak cara nabung di Aladin" />
        <Carousel
          items={['deposito', 'impian'] as const}
          render={(id) => <ProductCard id={id} onClick={() => navigate('/kembangkan')} compact />}
        />
      </section>

      {/* Bantu Bangun Sesama */}
      <section className="mt-7">
        <SectionTitle title="Bantu Bangun Sesama" />
        <Carousel
          items={campaigns}
          render={(c) => (
            <button
              onClick={() => navigate('/berbagi')}
              className="w-full h-40 rounded-3xl p-5 text-white text-left relative overflow-hidden flex flex-col justify-end"
              style={{ background: `linear-gradient(160deg, ${c.from}, ${c.to})` }}
            >
              <SmartImg src={img.campaign[c.id]} className="absolute inset-0 w-full h-full object-cover" fallback={null} />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-0 right-6 bg-white text-ink text-[11px] font-semibold rounded-b-xl px-3 py-2">{c.partner}</span>
              <p className="relative text-lg font-bold">{c.title}</p>
              <p className="relative text-sm text-white/85">
                Bersama <b>{c.partner}</b>
              </p>
              <div className="relative mt-2 h-1.5 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-mint" style={{ width: `${c.raised}%` }} />
              </div>
            </button>
          )}
        />
      </section>

      {/* Menarik dari Aladin */}
      <section className="mt-7">
        <SectionTitle title="Menarik dari Aladin" />
        <Carousel
          items={[
            { title: 'Aladin Gen', badge: 'Baru', desc: 'Tabungan untuk anak dari Aladin', cta: 'Mulai Siapkan', pose: 'book' as const, image: img.illus.aladinGen },
            { title: 'Kuota Gratis', desc: 'Dapatkan Kuota Gratis di Aladin', cta: 'Lihat Kuotamu', pose: 'phone' as const, image: img.illus.kuotaGratis },
          ]}
          render={(it) => (
            <div className="h-40 rounded-3xl bg-brand-soft p-5 relative overflow-hidden">
              <div className="relative z-10 max-w-[60%]">
                <p className="font-bold text-[17px]">
                  {it.title}{' '}
                  {it.badge && <span className="ml-1 text-xs bg-mint text-navy rounded-full px-2 py-0.5 align-middle">{it.badge}</span>}
                </p>
                <p className="text-sm text-ink/80 mt-1">{it.desc}</p>
                <button onClick={soon} className="mt-3 h-9 px-4 rounded-full bg-brand text-white text-sm font-bold">
                  {it.cta}
                </button>
              </div>
              <SmartImg
                src={it.image}
                className="absolute right-0 bottom-0 h-full w-[45%] object-contain object-right-bottom"
                fallback={<Mascot pose={it.pose} size={140} className="absolute -right-2 -bottom-2" />}
              />
            </div>
          )}
        />
      </section>

      {/* Ala Berbagi */}
      <section className="mt-7">
        <SectionTitle title="Ala Berbagi" action="Lihat Semua" onAction={() => navigate('/berbagi')} />
        <Carousel
          dotStyle="bar"
          items={berbagi}
          render={(b) => (
            <div className="rounded-3xl overflow-hidden bg-surface">
              <div className="bg-brand text-white p-5 pt-3 h-40 relative overflow-hidden">
                <span className="relative z-10 inline-block -mt-3 mb-2 bg-mint text-brand font-bold rounded-b-xl px-4 py-1">{b.tag}</span>
                <p className="relative z-10 text-lg leading-snug max-w-[62%]">{b.headline}</p>
                <p className="relative z-10 text-sm font-semibold mt-2">{b.sub}</p>
                <SmartImg
                  src={img.berbagi[b.id]}
                  className="absolute inset-y-0 right-0 w-[48%] h-full object-cover [mask-image:linear-gradient(to_right,transparent,black_45%)]"
                  fallback={<Mascot pose="love" size={120} className="absolute -right-3 -bottom-3 opacity-95" />}
                />
              </div>
              <div className="p-5 flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-bold text-lg">{b.title}</p>
                  <p className="text-sm text-ink/80">{b.desc}</p>
                </div>
                <button onClick={() => navigate('/berbagi')} className="shrink-0 h-10 px-5 rounded-full bg-brand text-white text-sm">
                  {b.cta}
                </button>
              </div>
            </div>
          )}
        />
      </section>

      {/* Ajak teman */}
      <section className="px-5 mt-7">
        <div className="rounded-3xl bg-brand text-white p-5 relative overflow-hidden">
          <p className="relative z-10 font-bold text-lg leading-snug">
            Ajak teman,
            <br />
            dapatkan hadiahnya
          </p>
          <button onClick={soon} className="relative z-10 mt-3 bg-navy rounded-full px-4 py-2 font-bold text-sm flex items-center gap-2">
            Lihat Caranya <ChevronRight size={16} />
          </button>
          <SmartImg
            src={img.illus.ajakTeman}
            className="absolute right-1 bottom-0 h-[88%] w-[36%] object-contain object-right-bottom"
            fallback={<Mascot pose="hello" size={110} className="absolute -right-12 bottom-0" />}
          />
        </div>
      </section>

      {/* Tombol mengambang untuk melanjutkan journey */}
      {!onboardingDone && state.invitationDismissed && (
        <button
          onClick={() => navigate(state.goals.length ? '/journey' : '/onboarding/tujuan')}
          className="fixed bottom-24 z-30 right-[max(16px,calc(50vw-215px+16px))] flex items-center gap-1 rounded-full bg-white shadow-lg border border-line pl-1 pr-3 py-1 animate-float"
        >
          <span className="w-11 h-11 rounded-full bg-brand-soft overflow-hidden flex items-end justify-center">
            <Mascot pose="point" size={46} />
          </span>
          <span className="text-xs font-semibold text-brand leading-tight text-left">
            Aladin
            <br />
            Journey
          </span>
        </button>
      )}

      <BottomNav />
      {toastNode}

      {/* Pop-up undangan AI */}
      <Modal
        open={showInvite}
        onClose={() => {
          setShowInvite(false)
          update({ invitationDismissed: true })
        }}
      >
        <div className="rounded-3xl bg-white overflow-hidden">
          <div className="bg-gradient-to-b from-navy to-[#14306e] pt-6 flex justify-center">
            <Mascot pose="gift" size={170} />
          </div>
          <div className="p-5">
            <h2 className="text-2xl font-bold">Halo! 👋</h2>
            <p className="text-muted mt-1">Mau mulai perjalanan keuangan yang lebih terarah & sesuai prinsip syariah?</p>
            <div className="mt-4 rounded-2xl bg-[#fff6e0] p-4 flex items-center gap-3">
              <span className="w-12 h-12 rounded-xl bg-[#e5484d] text-white flex items-center justify-center">
                <Gift size={24} />
              </span>
              <div>
                <p className="text-sm font-semibold">Dapat hadiah awal</p>
                <p className="text-2xl font-bold text-[#e5484d]">Rp25.000</p>
                <p className="text-xs text-muted">untuk kamu yang ikut Aladin Journey! 🎁</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {['Kenal fitur utama', 'Pahami keuangan syariah', 'Dapat badge & reward seru'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CircleCheck size={18} className="text-[#13b38a]" /> {t}
                </li>
              ))}
            </ul>
            <Button
              variant="mint"
              className="w-full mt-5"
              onClick={() => {
                setShowInvite(false)
                update({ invitationDismissed: true, onboardingStarted: true })
                navigate('/onboarding/tujuan')
              }}
            >
              Yuk Mulai Sekarang!
            </Button>
            <button
              className="w-full mt-2 py-2 text-brand font-semibold underline underline-offset-4"
              onClick={() => {
                setShowInvite(false)
                update({ invitationDismissed: true })
              }}
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </Modal>

      {/* Insight proaktif AI (setelah onboarding) */}
      <Modal open={showProactive} onClose={() => update({ proactiveInsightSeen: true })}>
        <div className="rounded-3xl bg-white overflow-hidden">
          <div className="bg-gradient-to-b from-navy to-[#14306e] pt-5 flex justify-center">
            <Mascot pose="trophy" size={160} />
          </div>
          <div className="p-5">
            <h2 className="text-2xl font-bold">Punya Rp1.000.000?</h2>
            <p className="text-muted mt-1">Mau tahu cara mengembangkannya dengan prinsip syariah?</p>
            <ul className="mt-4 space-y-2 text-sm">
              {['Simpan dengan aman', 'Pahami akadnya', 'Tetap sesuai prinsip syariah'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CircleCheck size={18} className="text-[#13b38a]" /> {t}
                </li>
              ))}
            </ul>
            <Button
              variant="mint"
              className="w-full mt-5"
              onClick={() => {
                update({ proactiveInsightSeen: true })
                navigate('/kembangkan')
              }}
            >
              Lihat Pilihannya
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return <span className={`text-[28px] font-extrabold tracking-tight italic ${className}`}>Aladin</span>
}

function Stars() {
  return (
    <div className="absolute inset-0" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ width: (i % 3) + 1, height: (i % 3) + 1, left: `${(i * 53) % 100}%`, top: `${(i * 29) % 90}%`, opacity: 0.35 + (i % 4) * 0.15 }}
        />
      ))}
    </div>
  )
}
