/** Payload QRIS format EMVCo (TLV + CRC16) untuk merchant DEMO. NMID & akun tidak valid, hanya untuk simulasi. */

const tlv = (id: string, v: string) => id + String(v.length).padStart(2, '0') + v

function crc16(s: string) {
  let crc = 0xffff
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function buildQrisPayload(merchant: string, city: string) {
  const body =
    tlv('00', '01') +
    tlv('01', '11') +
    tlv('26', tlv('00', 'ID.CO.ALADIN.DEMO') + tlv('01', '9360000000000000') + tlv('02', 'DEMO00000001') + tlv('03', 'UMI')) +
    tlv('51', tlv('00', 'ID.CO.QRIS.WWW') + tlv('02', 'ID0000DEMO0001') + tlv('03', 'UMI')) +
    tlv('52', '5814') +
    tlv('53', '360') +
    tlv('58', 'ID') +
    tlv('59', merchant.toUpperCase().slice(0, 25)) +
    tlv('60', city.toUpperCase().slice(0, 15)) +
    tlv('61', '10220') +
    '6304'
  return body + crc16(body)
}

