import { useVibeStore } from '@/store/vibeStore';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
    MousePointer2,
    Hand,
    Move,
    Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function FloatingToolbar() {
    const { mode, setMode } = useVibeStore();

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md border border-border shadow-2xl rounded-full p-1.5 flex items-center gap-1 z-50">
            <ToolButton
                Icon={MousePointer2}
                label="Select"
                active={mode === 'select'}
                onClick={() => setMode('select')}
                shortcut="V"
            />
            <ToolButton
                Icon={Hand}
                label="Hand"
                active={mode === 'hand'}
                onClick={() => setMode('hand')}
                shortcut="H"
            />
            <ToolButton
                Icon={Move}
                label="Freeform"
                active={mode === 'freeform'}
                onClick={() => setMode('freeform')}
                shortcut="F"
            />
            <Separator orientation="vertical" className="mx-1 h-6 bg-border" />
            <ToolButton
                Icon={Sparkles}
                label="AI Command"
                active={false}
                onClick={() => alert('AI Command (Cmd+K)')}
                shortcut="⌘K"
                className="text-ai hover:text-ai hover:bg-ai/10"
            />
        </div>
    );
}

function ToolButton({
    Icon,
    label,
    active,
    onClick,
    shortcut,
    className = '',
}: {
    Icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
    shortcut: string;
    className?: string;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    className={`
            flex items-center justify-center w-10 h-10 rounded-full
            transition-all duration-200 cursor-pointer
            ${active
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }
            ${className}
          `}
                >
                    <Icon size={20} strokeWidth={2} />
                </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs font-sans">
                {label} <kbd className="ml-1 text-muted-foreground font-mono">{shortcut}</kbd>
            </TooltipContent>
        </Tooltip>
    );
}
