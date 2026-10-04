/**
 * Maskot asisten AI Aladin. Gambar diambil dari sprite sheet di folder Maskot/
 * (dipotong oleh web/scripts/crop_mascot.py ke web/public/mascot/).
 */
export type MascotPose =
  | 'gift' // memegang kado, latar masjid
  | 'hello' // dua jari, latar masjid
  | 'point' // menunjuk ke kanan
  | 'trophy' // memegang piala
  | 'idea' // lampu ide
  | 'shield' // perisai, aman
  | 'think' // bingung / bertanya
  | 'pray' // tangan menyatu, bersyukur
  | 'book' // membaca buku (edukasi syariah)
  | 'insight' // lampu + ikon keuangan
  | 'love' // memeluk hati (berbagi)
  | 'phone' // memegang ponsel
  | 'thumbs' // jempol

type Props = {
  pose?: MascotPose
  /** tinggi gambar dalam px */
  size?: number
  className?: string
}

export default function Mascot({ pose = 'point', size = 120, className = '' }: Props) {
  return (
    <img
      src={`/mascot/${pose}.png`}
      alt="Maskot Aladin"
      style={{ height: size }}
      className={`w-auto max-w-none select-none pointer-events-none ${className}`}
      draggable={false}
    />
  )
}
