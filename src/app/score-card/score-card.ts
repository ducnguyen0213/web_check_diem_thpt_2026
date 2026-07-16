import { Component, computed, input } from '@angular/core';
import {
  COMBINATIONS,
  FOREIGN_LANGUAGES,
  PROVINCES,
  ScoreRecord,
  SUBJECT_LABELS,
  SUBJECTS,
} from '../core/constants';

interface SubjectRow {
  label: string;
  score: number;
}

interface CombinationRow {
  code: string;
  detail: string;
  total: number;
}

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.html',
  styleUrl: './score-card.css',
})
export class ScoreCard {
  readonly sbd = input.required<string>();
  readonly record = input.required<ScoreRecord>();

  /** Tên tỉnh/thành theo 2 chữ số đầu SBD (hội đồng thi) */
  readonly province = computed<string | null>(
    () => PROVINCES[this.sbd().slice(0, 2)] ?? null,
  );

  /** Các môn thí sinh có điểm, theo thứ tự chuẩn */
  readonly rows = computed<SubjectRow[]>(() => {
    const record = this.record();
    return SUBJECTS.filter((s) => record[s.key] !== undefined).map((s) => ({
      label:
        s.key === 'ngoaingu' && record.mangoaingu
          ? `Ngoại ngữ (${FOREIGN_LANGUAGES[record.mangoaingu] ?? record.mangoaingu})`
          : s.label,
      score: record[s.key]!,
    }));
  });

  /** Các tổ hợp xét tuyển thí sinh có đủ 3 môn, xếp giảm dần theo tổng điểm */
  readonly combinations = computed<CombinationRow[]>(() => {
    const record = this.record();
    return COMBINATIONS.filter((c) =>
      c.subjects.every((key) => record[key] !== undefined),
    )
      .map((c) => ({
        code: c.code,
        detail: c.subjects.map((key) => SUBJECT_LABELS[key]).join(' + '),
        total: c.subjects.reduce((sum, key) => sum + record[key]!, 0),
      }))
      .sort((a, b) => b.total - a.total);
  });

  formatScore(value: number): string {
    return value.toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
}
