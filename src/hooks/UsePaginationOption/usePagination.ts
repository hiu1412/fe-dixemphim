import { useState, useCallback } from 'react';
import { BaseFilters } from '@/lib/api/types';

interface UsePaginationOptions<T extends BaseFilters> {
  defaultFilters: T;
  onFilterChange?: (filters: T) => void;
  resetPageOnFilterChange?: boolean;
}

export function usePagination<T extends BaseFilters>(options: UsePaginationOptions<T>) {
  const {
    defaultFilters,
    onFilterChange,
    resetPageOnFilterChange = true
  } = options;

  const [filters, setFilters] = useState<T>(defaultFilters);

  // Sửa updateFilter để xử lý đúng kiểu dữ liệu
  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    const newFilters = {
      ...filters,
      [key]: value,
      ...(resetPageOnFilterChange && key !== 'page' ? { page: 1 } : {})
    } as T;
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [filters, resetPageOnFilterChange, onFilterChange]);

  // Sửa các phương thức helper để đảm bảo type safety
  const setPage = useCallback((page: number) => {
    // Kiểm tra nếu 'page' tồn tại trong T và là kiểu number
    if ('page' in filters) {
      updateFilter('page' as keyof T, page as unknown as T[keyof T]);
    }
  }, [updateFilter, filters]);
  
  const setLimit = useCallback((limit: number) => {
    if ('limit' in filters) {
      updateFilter('limit' as keyof T, limit as unknown as T[keyof T]);
    }
  }, [updateFilter, filters]);
  
  const setSearch = useCallback((search: string) => {
    if ('search' in filters) {
      updateFilter('search' as keyof T, search as unknown as T[keyof T]);
    }
  }, [updateFilter, filters]);
  
  const setSortBy = useCallback((sortBy: string) => {
    if ('sortBy' in filters) {
      updateFilter('sortBy' as keyof T, sortBy as unknown as T[keyof T]);
    }
  }, [updateFilter, filters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  }, [defaultFilters, onFilterChange]);

  return {
    filters,
    updateFilter,
    resetFilters,
    setPage,
    setLimit,
    setSearch,
    setSortBy
  };
}