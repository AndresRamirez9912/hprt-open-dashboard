// Minimal EXIF reader: only the capture date of a JPEG.
// DateTimeOriginal (0x9003) > DateTimeDigitized (0x9004) > DateTime (0x0132, IFD0).

const SOI = 0xffd8;
const APP1 = 0xffe1;

/** Returns the photo's capture date, or null if the file has no readable EXIF date. */
export async function readExifDate(file: Blob): Promise<Date | null> {
  const buf = await file.slice(0, 256 * 1024).arrayBuffer();
  const v = new DataView(buf);
  if (v.byteLength < 4 || v.getUint16(0) !== SOI) return null;
  let off = 2;
  while (off + 4 <= v.byteLength) {
    const marker = v.getUint16(off);
    if ((marker & 0xff00) !== 0xff00) return null;
    const len = v.getUint16(off + 2);
    if (marker === APP1 && isExifHeader(v, off + 4))
      return parseTiff(v, off + 10, len - 8);
    if (marker === 0xffda) return null; // start of scan: no more metadata
    off += 2 + len;
  }
  return null;
}

function isExifHeader(v: DataView, off: number) {
  // "Exif\0\0"
  return (
    off + 6 <= v.byteLength &&
    v.getUint32(off) === 0x45786966 &&
    v.getUint16(off + 4) === 0
  );
}

function parseTiff(v: DataView, start: number, length: number): Date | null {
  const end = Math.min(v.byteLength, start + length);
  if (start + 8 > end) return null;
  const order = v.getUint16(start);
  if (order !== 0x4949 && order !== 0x4d4d) return null;
  const le = order === 0x4949;
  const u16 = (o: number) => v.getUint16(o, le);
  const u32 = (o: number) => v.getUint32(o, le);
  if (u16(start + 2) !== 42) return null;

  const readIfd = (ifdOff: number) => {
    const tags = new Map<
      number,
      { type: number; count: number; valueOff: number }
    >();
    const at = start + ifdOff;
    if (at + 2 > end) return tags;
    const n = u16(at);
    for (let i = 0; i < n; i++) {
      const e = at + 2 + i * 12;
      if (e + 12 > end) break;
      tags.set(u16(e), {
        type: u16(e + 2),
        count: u32(e + 4),
        valueOff: e + 8,
      });
    }
    return tags;
  };

  const ascii = (t?: { type: number; count: number; valueOff: number }) => {
    if (!t || t.type !== 2) return null;
    const at = t.count > 4 ? start + u32(t.valueOff) : t.valueOff;
    if (at + t.count > end) return null;
    let s = "";
    for (let i = 0; i < t.count; i++) {
      const c = v.getUint8(at + i);
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    return s;
  };

  const ifd0 = readIfd(u32(start + 4));
  const exifPtr = ifd0.get(0x8769);
  const exif = exifPtr ? readIfd(u32(exifPtr.valueOff)) : new Map();
  const raw =
    ascii(exif.get(0x9003)) ??
    ascii(exif.get(0x9004)) ??
    ascii(ifd0.get(0x0132));
  return raw ? parseExifDate(raw) : null;
}

/** "YYYY:MM:DD HH:MM:SS" (camera local time) -> Date. */
function parseExifDate(s: string): Date | null {
  const m = s
    .trim()
    .match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, mi, se] = m.map(Number);
  if (y < 1900 || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return new Date(y, mo - 1, d, h, mi, se);
}

export type DateFormat = "dmy" | "month" | "ymd" | "film";

export const DATE_FORMATS: DateFormat[] = ["dmy", "month", "ymd", "film"];

/**
 * Date stamp text in one of the design's formats:
 * dmy 24/10/2024 · month OCT 2024 · ymd 2024.10.24 · film '24 10 24 (classic film camera).
 * `locale` only affects the month name.
 */
export function formatStampDate(
  d: Date,
  format: DateFormat,
  locale: string,
): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const dd = p(d.getDate());
  const mm = p(d.getMonth() + 1);
  const yyyy = String(d.getFullYear());
  switch (format) {
    case "month":
      return `${d.toLocaleString(locale, { month: "short" }).replace(".", "").toUpperCase()} ${yyyy}`;
    case "ymd":
      return `${yyyy}.${mm}.${dd}`;
    case "film":
      return `'${yyyy.slice(2)} ${mm} ${dd}`;
    default:
      return `${dd}/${mm}/${yyyy}`;
  }
}
