/**
 * Chia file CSV điểm thi (~1,2 triệu dòng) thành các file JSON nhỏ
 * theo 5 chữ số đầu của số báo danh, đặt trong public/data/.
 *
 * Chạy:  node scripts/build-data.mjs [đường-dẫn-csv]
 * Mặc định CSV nằm ở thư mục cha của project: ../diemthithpt_2026.csv
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = process.argv[2] ?? path.join(projectRoot, '..', 'diemthithpt_2026.csv');
const outDir = path.join(projectRoot, 'public', 'data');

const SCORE_COLUMNS = [
  'toan', 'van', 'ly', 'hoa', 'sinh', 'su', 'dia',
  'ktpl', 'tin', 'congnghiep', 'nongnghiep', 'ngoaingu',
];

if (!fs.existsSync(csvPath)) {
  console.error(`Không tìm thấy file CSV: ${csvPath}`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// shards: prefix 5 số đầu SBD -> mảng chuỗi `"sbd":{...}`
const shards = new Map();
let total = 0;
let skipped = 0;

const rl = readline.createInterface({ input: fs.createReadStream(csvPath) });
let header = null;

rl.on('line', (line) => {
  if (header === null) {
    header = line.split(',').map((h) => h.trim());
    return;
  }
  if (!line.trim()) return;

  const cells = line.split(',');
  const id = cells[0].trim();
  if (!/^\d{8}$/.test(id)) {
    skipped++;
    return;
  }

  const record = {};
  for (let i = 1; i <= 12; i++) {
    const raw = (cells[i] ?? '').trim();
    if (raw === '') continue;
    const value = Number(raw);
    if (Number.isNaN(value)) {
      skipped++;
      return;
    }
    record[SCORE_COLUMNS[i - 1]] = value;
  }
  const lang = (cells[13] ?? '').trim();
  if (lang) record.mangoaingu = lang;

  const prefix = id.slice(0, 5);
  if (!shards.has(prefix)) shards.set(prefix, []);
  shards.get(prefix).push(`"${id}":${JSON.stringify(record)}`);
  total++;
});

rl.on('close', () => {
  let files = 0;
  let bytes = 0;
  for (const [prefix, entries] of shards) {
    const content = `{${entries.join(',')}}`;
    fs.writeFileSync(path.join(outDir, `${prefix}.json`), content);
    files++;
    bytes += content.length;
  }
  console.log(`Đã ghi ${total.toLocaleString()} thí sinh vào ${files} file JSON`);
  console.log(`Tổng dung lượng data: ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  if (skipped > 0) console.warn(`Bỏ qua ${skipped} dòng không hợp lệ`);
});
