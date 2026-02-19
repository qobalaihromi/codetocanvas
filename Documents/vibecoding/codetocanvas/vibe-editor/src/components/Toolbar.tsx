import { useVibeStore } from '@/store/vibeStore';
import { Button } from '@/components/ui/button';
import {
    Zap,
    Share2,
    Terminal,
    Wand2,
    Play
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Toolbar() {
    const { isTerminalOpen, toggleTerminal } = useVibeStore();

    return (
        <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4 shrink-0">
            {/* Left: Logo + Breadcrumbs */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Zap size={18} className="text-primary fill-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight font-display leading-none">
                            Vibe Editor
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                            Drafts / Untitled Vibe
                        </span>
                    </div>
                </div>
            </div>

            {/* Center: Play/Deploy (Placeholder for now) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <div className="bg-card border border-border rounded-lg p-1 flex text-xs font-mono text-muted-foreground">
                    <span className="px-2 py-0.5 grid place-content-center">100%</span>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full w-8 h-8">
                    <Play size={14} className="ml-0.5 fill-current" />
                </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <Button
                    variant={isTerminalOpen ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={toggleTerminal}
                    className="text-xs gap-2 h-8"
                >
                    <Terminal size={14} />
                    <span className="hidden sm:inline">Terminal</span>
                </Button>

                <Separator orientation="vertical" className="h-6 bg-border" />

                <Button
                    size="sm"
                    className="text-xs gap-2 h-8 bg-ai hover:bg-ai/90 text-white border-none shadow-lg shadow-ai/20"
                    onClick={() => alert('Vibeify — Phase 4')}
                >
                    <Wand2 size={14} />
                    <span className="font-medium">Vibe AI</span>
                </Button>

                <Button
                    size="sm"
                    className="text-xs gap-2 h-8 bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20"
                >
                    <Share2 size={14} />
                    <span className="font-medium">Share</span>
                </Button>

                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border-2 border-background ring-1 ring-border" />
            </div>
        </div>
    );
}
