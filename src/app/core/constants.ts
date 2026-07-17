/** Thứ tự và tên hiển thị các môn thi tốt nghiệp THPT 2026 */
export const SUBJECTS = [
  { key: 'toan', label: 'Toán' },
  { key: 'van', label: 'Ngữ văn' },
  { key: 'ngoaingu', label: 'Ngoại ngữ' },
  { key: 'ly', label: 'Vật lý' },
  { key: 'hoa', label: 'Hóa học' },
  { key: 'sinh', label: 'Sinh học' },
  { key: 'su', label: 'Lịch sử' },
  { key: 'dia', label: 'Địa lý' },
  { key: 'ktpl', label: 'Giáo dục kinh tế và pháp luật' },
  { key: 'tin', label: 'Tin học' },
  { key: 'congnghiep', label: 'Công nghệ – Công nghiệp' },
  { key: 'nongnghiep', label: 'Công nghệ – Nông nghiệp' },
] as const;

export type SubjectKey = (typeof SUBJECTS)[number]['key'];

/** Bản ghi điểm của một thí sinh (chỉ chứa các môn có điểm) */
export type ScoreRecord = Partial<Record<SubjectKey, number>> & {
  mangoaingu?: string;
};

/** Mã môn ngoại ngữ */
export const FOREIGN_LANGUAGES: Record<string, string> = {
  N1: 'Tiếng Anh',
  N2: 'Tiếng Nga',
  N3: 'Tiếng Pháp',
  N4: 'Tiếng Trung Quốc',
  N5: 'Tiếng Đức',
  N6: 'Tiếng Nhật',
  N7: 'Tiếng Hàn',
};

/** Mã hội đồng thi (2 chữ số đầu SBD) → tỉnh/thành phố, kỳ thi 2026 (34 tỉnh/thành) */
export const PROVINCES: Record<string, string> = {
  '01': 'Hà Nội',
  '04': 'Cao Bằng',
  '08': 'Tuyên Quang',
  '11': 'Điện Biên',
  '12': 'Lai Châu',
  '14': 'Sơn La',
  '15': 'Lào Cai',
  '19': 'Thái Nguyên',
  '20': 'Lạng Sơn',
  '22': 'Quảng Ninh',
  '24': 'Bắc Ninh',
  '25': 'Phú Thọ',
  '31': 'Hải Phòng',
  '33': 'Hưng Yên',
  '37': 'Ninh Bình',
  '38': 'Thanh Hóa',
  '40': 'Nghệ An',
  '42': 'Hà Tĩnh',
  '44': 'Quảng Trị',
  '46': 'Huế',
  '48': 'Đà Nẵng',
  '51': 'Quảng Ngãi',
  '52': 'Gia Lai',
  '56': 'Khánh Hòa',
  '66': 'Đắk Lắk',
  '68': 'Lâm Đồng',
  '75': 'Đồng Nai',
  '79': 'Hồ Chí Minh',
  '80': 'Tây Ninh',
  '82': 'Đồng Tháp',
  '86': 'Vĩnh Long',
  '91': 'An Giang',
  '92': 'Cần Thơ',
  '96': 'Cà Mau',
};

/** Mức giảm giá theo điểm trung bình (Hoàng Long Computer) */
export const DISCOUNT_TIERS = [
  { min: 9.5, max: 10, label: 'Từ 9,5 đến 10 điểm', shortLabel: '≥ 9,5', amount: 5_000_000 },
  { min: 9.0, max: 9.5, label: 'Từ 9,0 đến dưới 9,5 điểm', shortLabel: '9,0 – 9,49', amount: 3_000_000 },
  { min: 8.0, max: 9.0, label: 'Từ 8,0 đến dưới 9,0 điểm', shortLabel: '8,0 – 8,99', amount: 600_000 },
  { min: 7.0, max: 8.0, label: 'Từ 7,0 đến dưới 8,0 điểm', shortLabel: '7,0 – 7,99', amount: 500_000 },
  { min: 0, max: 7.0, label: 'Dưới 7,0 điểm', shortLabel: '< 7,0', amount: 300_000 },
] as const;

/** Các tổ hợp xét tuyển đại học thông dụng */
export const COMBINATIONS: { code: string; subjects: SubjectKey[] }[] = [
  { code: 'A00', subjects: ['toan', 'ly', 'hoa'] },
  { code: 'A01', subjects: ['toan', 'ly', 'ngoaingu'] },
  { code: 'B00', subjects: ['toan', 'hoa', 'sinh'] },
  { code: 'C00', subjects: ['van', 'su', 'dia'] },
  { code: 'C01', subjects: ['van', 'toan', 'ly'] },
  { code: 'C02', subjects: ['van', 'toan', 'hoa'] },
  { code: 'C03', subjects: ['van', 'toan', 'su'] },
  { code: 'C04', subjects: ['van', 'toan', 'dia'] },
  { code: 'C14', subjects: ['van', 'toan', 'ktpl'] },
  { code: 'D01', subjects: ['van', 'toan', 'ngoaingu'] },
  { code: 'D07', subjects: ['toan', 'hoa', 'ngoaingu'] },
  { code: 'D14', subjects: ['van', 'su', 'ngoaingu'] },
  { code: 'D15', subjects: ['van', 'dia', 'ngoaingu'] },
];

export const SUBJECT_LABELS: Record<SubjectKey, string> = Object.fromEntries(
  SUBJECTS.map((s) => [s.key, s.label]),
) as Record<SubjectKey, string>;
