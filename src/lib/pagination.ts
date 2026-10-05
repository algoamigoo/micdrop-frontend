// The API caps `limit` per endpoint, so paging grows the limit and must clamp at the cap.
export function nextLimit(current: number, step: number, max: number): number {
  return Math.min(current + step, max);
}

export function hasMorePages(count: number, limit: number, max: number): boolean {
  return count === limit && limit < max;
}
