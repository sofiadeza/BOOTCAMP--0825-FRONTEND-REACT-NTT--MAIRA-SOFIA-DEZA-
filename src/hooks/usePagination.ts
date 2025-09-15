import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize: number){
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentItems = useMemo(()=> {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);
  function goTo(n: number){ setPage(n < 1 ? 1 : (n > totalPages ? totalPages : n)); }
  return { page, totalPages, currentItems, goTo, setPage };
}
