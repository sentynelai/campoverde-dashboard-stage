import { atom, useAtom } from 'jotai';
import type { StoreData } from '../types';

const selectedStoreAtom = atom<StoreData | null>(null);
const isLoadingStoreAtom = atom<boolean>(false);

export function useStoreSelection() {
  const [selectedStore, setSelectedStore] = useAtom(selectedStoreAtom);
  const [isLoadingStore, setIsLoadingStore] = useAtom(isLoadingStoreAtom);

  const selectStore = async (store: StoreData | null) => {
    try {
      setIsLoadingStore(true);
      // Simulate data loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setSelectedStore(store);
    } finally {
      setIsLoadingStore(false);
    }
  };

  return {
    selectedStore,
    setSelectedStore: selectStore,
    isLoadingStore
  };
}