import useSWR from 'swr';
import { fetchProductKPIs } from '../lib/api';
import type { ProductKPI } from '../types';
import { useAtom } from 'jotai';
import { errorMessageAtom } from './useStoreData';
import { useEffect } from 'react';

export function useProductKPIs() {
  const [, setErrorMessage] = useAtom(errorMessageAtom);

  const { data, error, isLoading, mutate } = useSWR<{ data: ProductKPI[]; error?: string }>(
    'product-kpis',
    fetchProductKPIs,
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 60000,
      fallbackData: { data: [] },
      onError: (err) => {
        console.warn('Error in useProductKPIs:', err);
        setErrorMessage(err.message);
      }
    }
  );

  // Initial load
  useEffect(() => {
    mutate();
  }, []);

  return {
    products: data?.data || [],
    isError: error,
    isLoading,
    refreshData: mutate
  };
}