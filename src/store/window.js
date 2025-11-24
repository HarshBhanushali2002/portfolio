import { INITIAL_Z_INDEX, WINDOW_CONFIG } from '@/constants'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useWindowStore = create(immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) => set((state) => {
        const window = state.windows[windowKey];
        if (!window) return;

        window.isOpen = true;
        window.data = data ?? window.data;
        window.zIndex = state.nextZIndex;
        state.nextZIndex += 1;

    }),

    closeWindow: (windowKey) => set((state) => {
        const window = state.windows[windowKey];
        if (!window) return;

        window.isOpen = false;
        window.data = null;
        window.zIndex = INITIAL_Z_INDEX;
    }),

    focusWindow: (windowKey) => set((state) => {
        const window = state.windows[windowKey];
        if (!window) return;

        window.zIndex = state.nextZIndex++;

    }),

    maximizeWindow: (windowKey) => set((state) => {
        const window = state.windows[windowKey];
        if (!window) return;
        window.isMaximized = !window.isMaximized; // Toggle maximize
        window.isMinimized = false; // Ensure not minimized
        window.isOpen = true;
        window.zIndex = state.nextZIndex++;
    }),

    minimizeWindow: (windowKey) => set((state) => {
        const window = state.windows[windowKey];
        if (!window) return;
        window.isMinimized = true; // Mark as minimized
        window.isOpen = true; // Keep open, just hidden
        window.zIndex = INITIAL_Z_INDEX;
        // Do NOT set isMaximized = false here; let animation finish first
    }),

    // Called after minimize animation completes
    finalizeMinimize: (windowKey) => set((state) => {
        const window = state.windows[windowKey];
        if (!window) return;
        window.isMaximized = false;
    }),

    restoreWindow: (windowKey) => set((state) => {
        const window = state.windows[windowKey];
        if (!window) return;
        window.isMinimized = false;
        window.isOpen = true;
        window.isMaximized = false; // Always restore to original size
        window.zIndex = state.nextZIndex++;
    }),
})))

export default useWindowStore;