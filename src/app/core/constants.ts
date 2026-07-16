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
