import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateUniqueId } from '../lib/utils';
import type { VCardData } from '../types';

interface VCardStore {
  data: VCardData;
  setData: (data: Partial<VCardData>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  addCustomField: (field: { label: string; value: string; icon?: string }) => void;
  removeCustomField: (id: string) => void;
  addSocialLink: (link: { platform: string; url: string; icon: string }) => void;
  removeSocialLink: (platform: string) => void;
  addImage: (url: string) => void;
  removeImage: (url: string) => void;
  generateShareableLink: () => string;
  clearData: () => void;
  loadSharedData: (id: string) => void;
  isPreviewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const STORAGE_PREFIX = 'vcard_shared_';
const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB limit

const initialData: VCardData = {
  firstName: '',
  lastName: '',
  organization: '',
  title: '',
  email: '',
  phone: '',
  website: '',
  photo: '',
  social: {
    linkedin: '',
    instagram: '',
    whatsapp: '',
  },
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  },
  theme: 'light',
  template: 'modern',
  brandColor: '#0066ff',
  customFields: [],
  additionalSocial: [],
  images: [],
};

export const useVCardStore = create<VCardStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      setData: (newData) =>
        set((state) => ({ data: { ...state.data, ...newData } })),
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      addCustomField: (field) =>
        set((state) => ({
          data: {
            ...state.data,
            customFields: [
              ...state.data.customFields,
              { ...field, id: generateUniqueId() },
            ],
          },
        })),
      removeCustomField: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            customFields: state.data.customFields.filter((field) => field.id !== id),
          },
        })),
      addSocialLink: (link) =>
        set((state) => ({
          data: {
            ...state.data,
            additionalSocial: [...state.data.additionalSocial, link],
          },
        })),
      removeSocialLink: (platform) =>
        set((state) => ({
          data: {
            ...state.data,
            additionalSocial: state.data.additionalSocial.filter(
              (link) => link.platform !== platform
            ),
          },
        })),
      addImage: (url) =>
        set((state) => ({
          data: {
            ...state.data,
            images: [...state.data.images, url],
          },
        })),
      removeImage: (url) =>
        set((state) => ({
          data: {
            ...state.data,
            images: state.data.images.filter((image) => image !== url),
          },
        })),
      generateShareableLink: () => {
        try {
          const cardId = generateUniqueId();
          const baseUrl = window.location.origin;
          const shareableLink = `${baseUrl}?id=${cardId}&preview=true`;
          
          // Clean up old shared cards
          const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
          let totalSize = 0;
          
          // Calculate total size and remove oldest items if needed
          keys.sort((a, b) => {
            const timeA = localStorage.getItem(a)?.timestamp || 0;
            const timeB = localStorage.getItem(b)?.timestamp || 0;
            return timeA - timeB;
          });
          
          for (const key of keys) {
            const size = localStorage.getItem(key)?.length || 0;
            totalSize += size;
            
            if (totalSize > MAX_STORAGE_SIZE) {
              localStorage.removeItem(key);
            }
          }
          
          // Save current data with timestamp
          const storageData = {
            data: get().data,
            timestamp: Date.now()
          };
          
          localStorage.setItem(
            `${STORAGE_PREFIX}${cardId}`, 
            JSON.stringify(storageData)
          );
          
          return shareableLink;
        } catch (error) {
          console.error('Error generating shareable link:', error);
          return window.location.href;
        }
      },
      clearData: () => {
        sessionStorage.removeItem('vcard-storage');
        set({ data: initialData });
      },
      loadSharedData: (id: string) => {
        const savedData = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
        if (savedData) {
          try {
            const { data } = JSON.parse(savedData);
            set({ data });
          } catch (error) {
            console.error('Error loading shared data:', error);
          }
        }
      },
      isPreviewMode: false,
      setPreviewMode: (mode: boolean) => set({ isPreviewMode: mode }),
      isAdmin: false,
      setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
    }),
    {
      name: 'vcard-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        data: state.data,
        theme: state.theme,
      }),
    }
  )
);