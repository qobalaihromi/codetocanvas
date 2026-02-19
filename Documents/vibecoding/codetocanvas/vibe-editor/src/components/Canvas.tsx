import { useCallback, useRef } from 'react';
import { useVibeStore } from '@/store/vibeStore';
import { readComponent } from '@/api/engineApi';

const TARGET_APP_URL = 'http://localhost:3000';

export function Canvas() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { mode, hoveredElement, selectedElement, setHoveredElement, setSelectedElement } =
        useVibeStore();

    const parseVibeId = (vibeId: string) => {
        const parts = vibeId.split(':');
        const column = parseInt(parts.pop()!, 10);
        const line = parseInt(parts.pop()!, 10);
        const file = parts.join(':');
        return { file, line, column };
    };

    const handleOverlayClick = useCallback(
        async (e: React.MouseEvent) => {
            if (mode !== 'select') return;
            e.preventDefault();
            e.stopPropagation();

            const iframe = iframeRef.current;
            if (!iframe?.contentDocument) return;

            const iframeRect = iframe.getBoundingClientRect();
            const x = e.clientX - iframeRect.left;
            const y = e.clientY - iframeRect.top;
            const element = iframe.contentDocument.elementFromPoint(x, y) as HTMLElement;
            if (!element) return;

            let target: HTMLElement | null = element;
            while (target && !target.dataset.vibeId) {
                target = target.parentElement;
            }

            if (!target?.dataset.vibeId) {
                const rect = element.getBoundingClientRect();
                setSelectedElement({
                    vibeId: 'none',
                    file: 'unknown',
                    line: 0,
                    column: 0,
                    component: element.tagName.toLowerCase(),
                    props: { className: element.className || '' },
                    rect: new DOMRect(rect.x + iframeRect.left, rect.y + iframeRect.top, rect.width, rect.height),
                });
                return;
            }

            const { file, line, column } = parseVibeId(target.dataset.vibeId);
            const rect = target.getBoundingClientRect();

            try {
                const componentData = await readComponent(file, line, column);
                setSelectedElement({
                    vibeId: target.dataset.vibeId,
                    file,
                    line,
                    column,
                    component: componentData.component,
                    props: componentData.props,
                    rect: new DOMRect(rect.x + iframeRect.left, rect.y + iframeRect.top, rect.width, rect.height),
                });
            } catch {
                setSelectedElement({
                    vibeId: target.dataset.vibeId,
                    file,
                    line,
                    column,
                    component: target.tagName.toLowerCase(),
                    props: { className: target.className || '' },
                    rect: new DOMRect(rect.x + iframeRect.left, rect.y + iframeRect.top, rect.width, rect.height),
                });
            }
        },
        [mode, setSelectedElement]
    );

    const handleOverlayMove = useCallback(
        (e: React.MouseEvent) => {
            if (mode !== 'select') return;
            const iframe = iframeRef.current;
            if (!iframe?.contentDocument) return;

            const iframeRect = iframe.getBoundingClientRect();
            const x = e.clientX - iframeRect.left;
            const y = e.clientY - iframeRect.top;
            const element = iframe.contentDocument.elementFromPoint(x, y) as HTMLElement;
            if (!element) { setHoveredElement(null); return; }

            const rect = element.getBoundingClientRect();
            setHoveredElement({
                vibeId: element.dataset.vibeId || element.tagName.toLowerCase(),
                rect: new DOMRect(rect.x + iframeRect.left, rect.y + iframeRect.top, rect.width, rect.height),
            });
        },
        [mode, setHoveredElement]
    );

    return (
        <div className="relative flex-1 overflow-hidden bg-background">
            {/* Checkerboard/subtle grid background */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Iframe */}
            <iframe
                ref={iframeRef}
                src={TARGET_APP_URL}
                title="Target App"
                className="w-full h-full border-none bg-white relative z-[1]"
            />

            {/* Overlay */}
            {mode === 'select' && (
                <div
                    onClick={handleOverlayClick}
                    onMouseMove={handleOverlayMove}
                    onMouseLeave={() => setHoveredElement(null)}
                    className="absolute inset-0 z-10 cursor-crosshair"
                />
            )}

            {/* Hover highlight */}
            {hoveredElement?.rect && (
                <div
                    className="fixed pointer-events-none z-20 transition-all duration-75 ease-out"
                    style={{
                        left: hoveredElement.rect.x,
                        top: hoveredElement.rect.y,
                        width: hoveredElement.rect.width,
                        height: hoveredElement.rect.height,
                        border: '1.5px solid rgb(59 130 246 / 0.7)',
                        background: 'rgba(59, 130, 246, 0.04)',
                    }}
                >
                    <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent text-accent-foreground whitespace-nowrap shadow-lg">
                        {hoveredElement.vibeId}
                    </span>
                </div>
            )}

            {/* Selected element */}
            {selectedElement?.rect && (
                <div
                    className="fixed pointer-events-none z-[21]"
                    style={{
                        left: selectedElement.rect.x,
                        top: selectedElement.rect.y,
                        width: selectedElement.rect.width,
                        height: selectedElement.rect.height,
                        border: '2px solid rgb(139 92 246)',
                        background: 'rgba(139, 92, 246, 0.06)',
                        boxShadow: '0 0 0 1px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1)',
                    }}
                >
                    <span className="absolute -top-5 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary text-primary-foreground whitespace-nowrap shadow-lg">
                        {selectedElement.component} — {selectedElement.file}
                    </span>
                </div>
            )}
        </div>
    );
}
