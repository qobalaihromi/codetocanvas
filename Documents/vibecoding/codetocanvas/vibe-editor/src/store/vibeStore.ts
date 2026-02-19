import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────

export interface SelectedElement {
    vibeId: string;    // "Button.tsx:42:5"
    file: string;      // "src/components/Button.tsx"
    line: number;
    column: number;
    component: string; // "Button"
    props: Record<string, string>;
    rect: DOMRect | null;
}

interface VibeState {
    // Selection
    selectedElement: SelectedElement | null;
    hoveredElement: { vibeId: string; rect: DOMRect } | null;

    // Mode
    mode: 'select' | 'hand' | 'freeform';

    // Inspector
    isInspectorOpen: boolean;

    // Terminal
    isTerminalOpen: boolean;

    // Actions
    setSelectedElement: (el: SelectedElement | null) => void;
    setHoveredElement: (el: { vibeId: string; rect: DOMRect } | null) => void;
    setMode: (mode: 'select' | 'hand' | 'freeform') => void;
    toggleInspector: () => void;
    toggleTerminal: () => void;
}

export const useVibeStore = create<VibeState>((set) => ({
    selectedElement: null,
    hoveredElement: null,
    mode: 'select',
    isInspectorOpen: false,
    isTerminalOpen: false,

    setSelectedElement: (el) =>
        set({ selectedElement: el, isInspectorOpen: el !== null }),
    setHoveredElement: (el) => set({ hoveredElement: el }),
    setMode: (mode) => set({ mode }),
    toggleInspector: () => set((s) => ({ isInspectorOpen: !s.isInspectorOpen })),
    toggleTerminal: () => set((s) => ({ isTerminalOpen: !s.isTerminalOpen })),
}));
