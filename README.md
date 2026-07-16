# Tra cứu điểm thi tốt nghiệp THPT 2026

Web tĩnh tra cứu điểm thi theo số báo danh, xây dựng bằng Angular 20.
Dữ liệu 1.208.863 thí sinh được chia thành 1.237 file JSON theo 5 chữ số đầu
của SBD (`public/data/*.json`) — mỗi lượt tra cứu trình duyệt chỉ tải ~50KB.

## Cấu trúc chính

- `scripts/build-data.mjs` — chia file CSV gốc thành các file JSON trong `public/data/`
- `src/app/core/constants.ts` — tên môn, mã ngoại ngữ (N1–N7), bảng mã 34 hội đồng thi (tỉnh/thành), các tổ hợp xét tuyển
- `src/app/core/score.service.ts` — tải shard theo prefix SBD, cache, tra cứu
- `src/app/score-card/` — bảng điểm + điểm tổ hợp xét tuyển
- `src/app/app.ts` — trang chính: ô nhập SBD, validate, trạng thái loading/lỗi

## Cập nhật dữ liệu

Khi có file CSV mới (cột: `id,toan,van,ly,hoa,sinh,su,dia,ktpl,tin,congnghiep,nongnghiep,ngoaingu,mangoaingu`):

```bash
node scripts/build-data.mjs duong-dan/den/file.csv
```

Mặc định script đọc `../diemthithpt_2026.csv` (thư mục cha của project).

## Chạy thử tại máy

```bash
npm install
ng serve          # http://localhost:4200
```

## Build & Deploy lên Vercel

Đã có sẵn `vercel.json` (framework Angular, output `dist/diemthi2026-web/browser`,
cache CDN 1 ngày cho `/data/*`).

**Cách 1 — Vercel CLI (nhanh nhất):**

```bash
npm i -g vercel
vercel login
vercel --prod
```

**Cách 2 — Qua GitHub:** tạo repo, push toàn bộ project (kể cả `public/data/`),
rồi vào vercel.com → Add New Project → import repo. Vercel tự nhận cấu hình
từ `vercel.json`.

## Kiểm thử

```bash
ng test --watch=false --browsers=ChromeHeadless
```

SBD thử nghiệm: `01000001` (bản ghi đầu), `96019667` (bản ghi cuối),
`99999999` (không tồn tại).
