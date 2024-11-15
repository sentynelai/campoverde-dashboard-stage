import useSWR from 'swr';
import { fetchStoreData } from '../lib/api';
import type { StoreData } from '../types';
import { atom, useAtom } from 'jotai';
import { useState, useCallback } from 'react';

const lastUpdateAtom = atom<Date>(new Date());
const isRefreshingAtom = atom<boolean>(false);
export const errorMessageAtom = atom<string | null>(null);

export function useStoreData() {
  const [lastUpdate, setLastUpdate] = useAtom(lastUpdateAtom);
  const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<{ data: StoreData[]; error?: string }>(
    'store-data',
    fetchStoreData,
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 60000,
      fallbackData: { data: [] }
    }
  );

  const refreshData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setErrorMessage(null);
      
      // Force revalidation with no cache
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

  const stores = data?.data || [];

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