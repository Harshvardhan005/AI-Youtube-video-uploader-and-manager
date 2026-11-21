/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    showNotification: (title: string, body: string) => Promise<void>;
    isElectron: boolean;
  };
}
