import { Component, inject, signal } from '@angular/core';
import { ScoreRecord } from './core/constants';
import { ParticipantService } from './core/participant.service';
import { ScoreService } from './core/score.service';
import { ScoreCard } from './score-card/score-card';

type Status = 'idle' | 'loading' | 'found' | 'notfound' | 'error';

@Component({
  selector: 'app-root',
  imports: [ScoreCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly scoreService = inject(ScoreService);
  private readonly participantService = inject(ParticipantService);

  protected readonly sbd = signal('');
  protected readonly status = signal<Status>('idle');
  protected readonly record = signal<ScoreRecord | null>(null);
  /** SBD của kết quả đang hiển thị (giữ nguyên khi người dùng gõ tiếp) */
  protected readonly resultSbd = signal('');

  protected readonly currentYear = new Date().getFullYear();
  protected readonly participantCount = this.participantService.count;

  /** Chế độ nhúng (?embed=1): ẩn tiêu đề và footer khi đặt trong iframe */
  protected readonly embed = signal(false);

  /** Ẩn ô tra cứu nội bộ khi trang ngoài đã có ô nhập riêng (embed + sbd qua URL) */
  protected readonly hideForm = signal(false);

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.embed.set(params.get('embed') === '1');

    if (this.embed()) {
      document.documentElement.classList.add('embed');
      document.body.classList.add('embed');

      const report = () => {
        const height = Math.ceil(
          Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
          ),
        );

        // Cùng origin: tự chỉnh chiều cao iframe ngay, không cần code ở trang cha
        try {
          const frame = window.frameElement as HTMLElement | null;
          if (frame) frame.style.height = `${height}px`;
        } catch {
          // Khác origin: không truy cập được frameElement, dùng postMessage bên dưới
        }

        // Khác origin: gửi chiều cao để trang cha tự set (cần listener ở trang cha)
        window.parent.postMessage({ type: 'diemthi-height', height }, '*');
      };

      new ResizeObserver(report).observe(document.body);
    }

    // Cho phép trang ngoài truyền SBD qua URL: /?sbd=01000001
    const sbd = (params.get('sbd') ?? '').replace(/\D/g, '').slice(0, 8);
    if (/^\d{8}$/.test(sbd)) {
      this.hideForm.set(this.embed());
      this.sbd.set(sbd);
      void this.search();
    }
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Chỉ giữ chữ số, tối đa 8 ký tự
    const cleaned = input.value.replace(/\D/g, '').slice(0, 8);
    input.value = cleaned;
    this.sbd.set(cleaned);
  }

  protected get isValid(): boolean {
    return /^\d{8}$/.test(this.sbd());
  }

  protected async search(): Promise<void> {
    if (!this.isValid || this.status() === 'loading') return;

    const sbd = this.sbd();
    this.status.set('loading');
    try {
      const result = await this.scoreService.lookup(sbd);
      this.resultSbd.set(sbd);
      if (result.status === 'found') {
        this.record.set(result.record);
        this.status.set('found');
        void this.participantService.recordLookup(sbd).then(() => {
          if (this.embed()) {
            // Báo cho trang cha (vd. LadiPage) cập nhật số thí sinh ngay khi tra cứu thành công
            window.parent.postMessage(
              { type: 'diemthi-participant-count', count: this.participantService.count() },
              '*',
            );
          }
        });
      } else {
        this.record.set(null);
        this.status.set('notfound');
      }
    } catch {
      this.record.set(null);
      this.resultSbd.set(sbd);
      this.status.set('error');
    }
  }
}
