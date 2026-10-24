export type TSafeStorage = {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => boolean;
    removeItem: (key: string) => boolean;
};

export function createSafeStorage(getStorage: () => Storage | undefined): TSafeStorage {
    return {
        getItem(key) {
            try {
                return getStorage()?.getItem(key) ?? null;
            } catch {
                return null;
            }
        },
        setItem(key, value) {
            try {
                const storage = getStorage();
                if (!storage) return false;

                storage.setItem(key, value);
                return true;
            } catch {
                return false;
            }
        },
        removeItem(key) {
            try {
                const storage = getStorage();
                if (!storage) return false;

                storage.removeItem(key);
                return true;
            } catch {
                return false;
            }
        },
    };
}

export const safeLocalStorage = createSafeStorage(() =>
    typeof window === 'undefined' ? undefined : window.localStorage,
);

export const safeSessionStorage = createSafeStorage(() =>
    typeof window === 'undefined' ? undefined : window.sessionStorage,
);
