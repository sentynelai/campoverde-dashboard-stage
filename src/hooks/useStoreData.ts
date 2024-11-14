import useSWR from 'swr';
import { fetchStoreData } from '../lib/api';
import type { StoreData } from '../types';
import { useStoreSelection } from './useStoreSelection';
import { atom, useAtom } from 'jotai';

const lastUpdateAtom = atom<Date>(new Date());

export function useStoreData() {
  const { data, error, isLoading, mutate } = useSWR<StoreData[]>(
    'store-data',
    fetchStoreData,
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 60000,
    }
  );

  const { selectedStore } = useStoreSelection();
  const [lastUpdate, setLastUpdate] = useAtom(lastUpdateAtom);

  const refreshData = async () => {
    await mutate();
    setLastUpdate(new Date());
  };

  const filteredStores = data?.filter(store => {
    if (!selectedStore) return true;
    return store.region === selectedStore.region;
  });

  return {
    stores: filteredStores || [],
    allStores: data || [],
    isLoading,
    isError: error,
    refreshData,
    lastUpdate
  };
}