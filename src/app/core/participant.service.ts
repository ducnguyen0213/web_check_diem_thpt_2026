import { Injectable, signal } from '@angular/core';

type ParticipantsResponse = { count: number };

/**
 * Đếm số thí sinh đã tra cứu thành công (unique SBD), đồng bộ qua API server
 * (`/api/participants`) nên mọi người dùng trên mọi thiết bị thấy cùng một số.
 * Chỉ SBD (dạng hash) được gửi lên server, không lưu điểm thi.
 */
@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly countSignal = signal(0);

  readonly count = this.countSignal.asReadonly();

  constructor() {
    void this.refresh();
  }

  /** Ghi nhận một lượt tra cứu thành công theo SBD (server chỉ đếm unique). */
  async recordLookup(sbd: string): Promise<void> {
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sbd }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as ParticipantsResponse;
      this.countSignal.set(data.count);
    } catch {
      // Mất mạng / API lỗi — bỏ qua, giữ số hiện tại
    }
  }

  private async refresh(): Promise<void> {
    try {
      const res = await fetch('/api/participants');
      if (!res.ok) return;
      const data = (await res.json()) as ParticipantsResponse;
      this.countSignal.set(data.count);
    } catch {
      // Mất mạng — giữ giá trị mặc định
    }
  }
}
