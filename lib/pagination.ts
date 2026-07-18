export const PAGE_SIZE = 15;

export function totalPagesFor(count: number, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(count / pageSize));
}

export function paginateItems<T>(
  items: readonly T[],
  page: number,
  pageSize = PAGE_SIZE,
): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
