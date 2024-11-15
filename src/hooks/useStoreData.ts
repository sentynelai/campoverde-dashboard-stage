import useSWR from 'swr';
import { fetchStoreData } from '../lib/api';
import type { StoreData } from '../types';
import { atom, useAtom } from 'jotai';
import { useState, useCallback, useMemo } from 'react';

const lastUpdateAtom = atom<Date>(new Date());
const isRefreshingAtom = atom<boolean>(false);
export const errorMessageAtom = atom<string | null>(null);

const CACHE_KEY = 'store-data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useStoreData() {
  const [lastUpdate, setLastUpdate] = useAtom(lastUpdateAtom);
  const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<{ data: StoreData[]; error?: string }>(
    CACHE_KEY,
    fetchStoreData,
    {
      refreshInterval: CACHE_DURATION,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 60000,
      fallbackData: { data: [] },
      suspense: false
    }
  );

  const stores = useMemo(() => data?.data || [], [data]);

  const refreshData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setErrorMessage(null);
      
      const result = await mutate(undefined, { revalidate: true });
      
      if (result?.error) {
        setErrorMessage(result.error);
        setShowErrorModal(true);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh data';
      console.error('Error refreshing data:', message);
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [mutate, setIsRefreshing, setErrorMessage, setLastUpdate]);

  return {
    stores,
    allStores: stores,
    isLoading,
    isError: error,
    refreshData,
    lastUpdate,
    isRefreshing,
    errorMessage,
    showErrorModal,
    setShowErrorModal
  };
}