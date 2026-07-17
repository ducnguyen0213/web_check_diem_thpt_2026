import { Component, computed, input } from '@angular/core';
import {
  DISCOUNT_TIERS,
  FOREIGN_LANGUAGES,
  PROVINCES,
  ScoreRecord,
  SUBJECTS,
} from '../core/constants';

interface SubjectRow {
  label: string;
  score: number;
}

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.html',
  styleUrl: './score-card.css',
})
export class ScoreCard {
  readonly shopUrl = 'https://hoanglongcomputer.vn/';

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

  /** Điểm trung bình các môn có điểm */
  readonly average = computed<number | null>(() => {
    const rows = this.rows();
    if (rows.length === 0) return null;
    const sum = rows.reduce((acc, row) => acc + row.score, 0);
    return sum / rows.length;
  });

  /** Mức giảm giá áp dụng theo điểm trung bình */
  readonly activeDiscount = computed(() => {
    const average = this.average();
    if (average === null) return null;
    return DISCOUNT_TIERS.find((tier) => this.matchesTier(average, tier)) ?? null;
  });

  formatScore(value: number): string {
    return value.toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  formatCurrency(value: number): string {
    return `${value.toLocaleString('vi-VN')}đ`;
  }

  private matchesTier(
    average: number,
    tier: (typeof DISCOUNT_TIERS)[number],
  ): boolean {
    if (tier.max === 10) return average >= tier.min && average <= tier.max;
    if (tier.max === 7.0) return average < tier.max;
    return average >= tier.min && average < tier.max;
  }
}
