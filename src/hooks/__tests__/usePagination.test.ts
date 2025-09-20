import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

const make = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

describe('usePagination (items, pageSize)', () => {
  test('estado inicial y currentItems', () => {
    const { result } = renderHook(({items, size}) => usePagination(items, size), {
      initialProps: { items: make(25), size: 10 },
    });

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);       // 25/10 => 3
    expect(result.current.currentItems).toEqual(make(10)); // 1..10
  });

  test('goTo navega y clampa', () => {
    const { result } = renderHook(({items, size}) => usePagination(items, size), {
      initialProps: { items: make(25), size: 10 },
    });

    act(() => result.current.goTo(3));
    expect(result.current.page).toBe(3);
    expect(result.current.currentItems).toEqual(make(25).slice(20, 30)); // 21..25

    act(() => result.current.goTo(0));
    expect(result.current.page).toBe(1);

    act(() => result.current.goTo(999));
    expect(result.current.page).toBe(3);
  });

  test('setPage funciona y currentItems cambia', () => {
    const { result } = renderHook(({items, size}) => usePagination(items, size), {
      initialProps: { items: make(25), size: 10 },
    });

    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    expect(result.current.currentItems).toEqual(make(25).slice(10, 20)); // 11..20
  });

  test('al cambiar los items, recalcula totalPages y currentItems', () => {
    const { result, rerender } = renderHook(({items, size}) => usePagination(items, size), {
      initialProps: { items: make(25), size: 10 },
    });

    act(() => result.current.goTo(3)); // estabas en 3
    rerender({ items: make(30), size: 10 }); // ahora hay 30
    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentItems).toEqual(make(30).slice(20, 30)); // 21..30
  });
});