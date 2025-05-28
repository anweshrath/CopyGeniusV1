import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Copy {
  id: string;
  title: string;
  type: string;
  niche: string;
  purpose: string;
  framework: string;
  content: string;
  lastModified: string;
}

interface CopyStore {
  copies: Copy[];
  addCopy: (copy: Copy) => void;
  updateCopy: (copy: Copy) => void;
  removeCopy: (id: string) => void;
  clearAllCopies: () => void;
}

export const useCopyStore = create<CopyStore>()(
  persist(
    (set) => ({
      copies: [],
      
      addCopy: (copy) => set((state) => ({
        copies: [...state.copies, copy]
      })),
      
      updateCopy: (copy) => set((state) => ({
        copies: state.copies.map((c) => 
          c.id === copy.id ? copy : c
        )
      })),
      
      removeCopy: (id) => set((state) => ({
        copies: state.copies.filter((c) => c.id !== id)
      })),
      
      clearAllCopies: () => set({ copies: [] })
    }),
    {
      name: 'copy-store'
    }
  )
);
