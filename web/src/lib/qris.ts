/** Utilitas QRIS (format EMVCo: TLV + CRC16). Payload buatan di sini memakai merchant DEMO, NMID & akun tidak valid. */

const tlv = (id: string, v: string) => id + String(v.length).padStart(2, '0') + v

function crc16(s: string) {
  let crc = 0xffff
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/** amount diisi = QRIS dinamis (nominal terkunci), kosong = QRIS statis. */
export function buildQrisPayload(merchant: string, city: string, amount?: number) {
  const body =
    tlv('00', '01') +
    tlv('01', amount ? '12' : '11') +
    tlv('26', tlv('00', 'ID.CO.ALADIN.DEMO') + tlv('01', '9360000000000000') + tlv('02', 'DEMO00000001') + tlv('03', 'UMI')) +
    tlv('51', tlv('00', 'ID.CO.QRIS.WWW') + tlv('02', 'ID0000DEMO0001') + tlv('03', 'UMI')) +
    tlv('52', '5814') +
    tlv('53', '360') +
    (amount ? tlv('54', String(Math.round(amount))) : '') +
    tlv('58', 'ID') +
    tlv('59', merchant.toUpperCase().slice(0, 25)) +
    tlv('60', city.toUpperCase().slice(0, 15)) +
    tlv('61', '10220') +
    '6304'
  return body + crc16(body)
}


export type QrisInfo = {
  merchant: string
  city: string
  /** nominal tetap (QRIS dinamis), null kalau user isi sendiri (QRIS statis) */
  amount: number | null
  nmid: string | null
  validCrc: boolean
}

function parseTlv(s: string) {
  const out: Record<string, string> = {}
  let i = 0
  while (i + 4 <= s.length) {
    const id = s.slice(i, i + 2)
    const len = Number(s.slice(i + 2, i + 4))
    if (Number.isNaN(len)) break
    out[id] = s.slice(i + 4, i + 4 + len)
    i += 4 + len
  }
  return out
}

/** Baca isi QR. Mengembalikan null kalau bukan QRIS. */
export function parseQris(raw: string): QrisInfo | null {
  const s = raw.trim()
  if (!s.startsWith('000201')) return null
  const t = parseTlv(s)
  if (!t['59'] || t['58'] !== 'ID') return null
  // NMID ada di template merchant 51 (sub-tag 02)
  const nmid = t['51'] ? (parseTlv(t['51'])['02'] ?? null) : null
  const body = s.slice(0, -4)
  return {
    merchant: t['59'].trim(),
    city: (t['60'] ?? '').trim(),
    amount: t['54'] ? Math.round(Number(t['54'])) : null,
    nmid,
    validCrc: body.endsWith('6304') && crc16(body) === s.slice(-4).toUpperCase(),
  }
}
