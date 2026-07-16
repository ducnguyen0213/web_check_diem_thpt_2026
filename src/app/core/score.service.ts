import { Injectable } from '@angular/core';
import { ScoreRecord } from './constants';

type Shard = Record<string, ScoreRecord>;

export type LookupResult =
  | { status: 'found'; record: ScoreRecord }
  | { status: 'notfound' };

@Injectable({ providedIn: 'root' })
export class ScoreService {
  /** Cache các shard đã tải: prefix 5 số đầu SBD -> dữ liệu shard */
  private readonly cache = new Map<string, Shard | null>();

  /**
   * Tra cứu điểm theo số báo danh 8 chữ số.
   * Ném lỗi nếu không tải được dữ liệu (lỗi mạng).
   */
  async lookup(sbd: string): Promise<LookupResult> {
    const prefix = sbd.slice(0, 5);
    let shard = this.cache.get(prefix);

    if (shard === undefined) {
      shard = await this.fetchShard(prefix);
      this.cache.set(prefix, shard);
    }

    const record = shard?.[sbd];
    return record ? { status: 'found', record } : { status: 'notfound' };
  }

  /** Trả về null nếu shard không tồn tại (404 = không có SBD nào với prefix này) */
  private async fetchShard(prefix: string): Promise<Shard | null> {
    const res = await fetch(`data/${prefix}.json`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Không tải được dữ liệu (HTTP ${res.status})`);
    return (await res.json()) as Shard;
  }
}
