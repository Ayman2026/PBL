/**
 * Simple in-memory cache for parsed CSV data
 * In production, consider Redis or file-based caching with TTL
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

class DataCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const dataCache = new DataCache();

// Cache keys
export const CACHE_KEYS = {
  SCHOOL_RECORDS: "school_records",
  GRANT_PERFORMANCE: "grant_performance",
  GRANT_FINANCE: "grant_finance",
  EVIDENCE_RECORDS: "evidence_records",
} as const;
