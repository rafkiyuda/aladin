import { useState } from 'react'
import { CircleCheck, Sparkles } from 'lucide-react'
import { Button, Page, ProductIcon, Sheet } from '../components/ui'
import Mascot from '../components/Mascot'
import { goals, savingsProducts } from '../data'
import { useApp } from '../state/AppState'

const tabs = ['Tabungan', 'Deposito', 'Investasi Syariah'] as const

export default function Kembangkan() {
  const { state } = useApp()
  const [tab, setTab] = useState<(typeof tabs)[number]>(state.goals.includes('investasi') ? 'Deposito' : 'Tabungan')
  const [sheet, setSheet] = useState(false)
  const product = savingsProducts.find((p) => p.kind === tab)
  const goalLabels = goals.filter((g) => state.goals.includes(g.id)).map((g) => g.label.toLowerCase())

  return (
    <Page title="Kembangkan Uangmu" right={<Sparkles size={20} className="text-gold" />}>
      <div className="px-5">
        <p className="text-sm text-muted -mt-1">
          {goalLabels.length ? `Rekomendasi sesuai tujuanmu: ${goalLabels.join(', ')}.` : 'Produk untuk masa depan yang lebih berkah.'}
        </p>
        <div className="flex gap-2 mt-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t ? 'bg-[#13b38a] text-white' : 'bg-surface text-muted'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {product ? (
          <div className="mt-5 rounded-3xl border border-line p-5">
            <div className="flex items-center gap-4">
              <ProductIcon id={product.id as 'deposito' | 'impian'} size={64} />
              <div>
                <p className="text-lg font-bold">{product.name}</p>
                <p className="text-sm">
                  Bagi hasil hingga <b className="text-[#e5484d]">{product.rate.replace('*', '')}</b>
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {['Sesuai prinsip syariah', 'Aman dan terukur, dijamin LPS', product.min].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CircleCheck size={18} className="text-[#13b38a]" /> {t}
                </li>
              ))}
            </ul>
            <Button variant="mint" className="w-full mt-5" onClick={() => setSheet(true)}>
              {product.cta}
            </Button>
            <p className="text-[10px] text-muted mt-3">{product.note}</p>
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-line p-6 text-center">
            <Mascot pose="think" size={120} className="mx-auto" />
            <p className="font-semibold mt-3">Investasi Syariah segera hadir</p>
            <p className="text-sm text-muted">Reksa dana & sukuk syariah akan tersedia di Aladin.</p>
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-[#fff6e0] p-4 flex items-end gap-2">
          <Mascot pose="book" size={92} className="shrink-0 -mb-4" />
          <div>
            <p className="font-semibold">Tau nggak?</p>
            <p className="text-xs text-muted mt-1">
              Di deposito syariah, kamu mendapatkan bagi hasil sesuai kinerja, bukan bunga. Nisbahnya disepakati di awal akad.
            </p>
          </div>
        </div>
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)}>
        <div className="text-center">
          <Mascot pose="thumbs" size={120} className="mx-auto" />
          <p className="text-lg font-bold mt-2">Pembukaan {product?.name}</p>
          <p className="text-sm text-muted mt-1">Di prototipe ini pembukaan rekening hanya simulasi. Alur lengkap bisa ditambahkan berikutnya.</p>
          <Button className="w-full mt-5" onClick={() => setSheet(false)}>
            Mengerti
          </Button>
        </div>
      </Sheet>
    </Page>
  )
}
