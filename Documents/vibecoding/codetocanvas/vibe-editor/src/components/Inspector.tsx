import { useVibeStore } from '@/store/vibeStore';
import { updateProp } from '@/api/engineApi';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { StyleEditor } from './StyleEditor';

export function Inspector() {
    const { selectedElement, isInspectorOpen, setSelectedElement } = useVibeStore();
    const [updating, setUpdating] = useState(false);

    if (!isInspectorOpen || !selectedElement) return null;

    const handlePropChange = async (propName: string, newValue: string) => {
        if (!selectedElement || selectedElement.vibeId === 'none') return;
        setUpdating(true);
        try {
            await updateProp(
                selectedElement.file,
                selectedElement.line,
                selectedElement.column,
                propName,
                newValue,
                'update'
            );
            setSelectedElement({
                ...selectedElement,
                props: { ...selectedElement.props, [propName]: newValue },
            });
        } catch (err) {
            console.error('Failed to update prop:', err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="w-[300px] bg-card border-l border-border flex flex-col text-sm shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border">
                <Badge variant="secondary" className="font-mono text-xs bg-primary/20 text-primary border-primary/30">
                    &lt;{selectedElement.component} /&gt;
                </Badge>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedElement(null)}
                >
                    <X size={14} />
                </Button>
            </div>

            {/* File Info */}
            <div className="px-3 py-2.5 space-y-1">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    File
                </Label>
                <p className="font-mono text-xs text-accent break-all leading-relaxed">
                    {selectedElement.file}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                    Ln {selectedElement.line}, Col {selectedElement.column}
                </p>
            </div>

            <Separator />

            {/* Properties */}
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Properties
                    </Label>

                    {Object.entries(selectedElement.props).length === 0 ? (
                        <p className="text-muted-foreground text-xs italic text-center py-6">
                            No props detected
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {Object.entries(selectedElement.props).map(([key, val]) => (
                                <div key={key} className={`flex ${key === 'className' ? 'flex-col items-start gap-1 pb-2' : 'items-center gap-2'}`}>
                                    <Label className="font-mono text-xs text-muted-foreground min-w-[70px] shrink-0">
                                        {key}
                                    </Label>
                                    {key === 'className' ? (
                                        <div className="w-full pt-1">
                                            <StyleEditor
                                                className={val}
                                                onChange={(newVal) => handlePropChange('className', newVal)}
                                            />
                                        </div>
                                    ) : val === '[expression]' ? (
                                        <Badge variant="outline" className="font-mono text-[10px] text-yellow-400 border-yellow-400/30">
                                            {'{ expr }'}
                                        </Badge>
                                    ) : (
                                        <Input
                                            className="h-7 text-xs font-mono bg-background border-border"
                                            defaultValue={val}
                                            disabled={updating || selectedElement.vibeId === 'none'}
                                            onBlur={(e) => handlePropChange(key, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    handlePropChange(key, (e.target as HTMLInputElement).value);
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Status */}
            {updating && (
                <div className="px-3 py-2 bg-accent/10 text-accent text-xs font-mono border-t border-border flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Updating...
                </div>
            )}
            {selectedElement.vibeId === 'none' && (
                <div className="px-3 py-2.5 bg-yellow-400/10 text-yellow-400 text-[11px] leading-relaxed border-t border-border flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>No <code className="font-mono">data-vibe-id</code> found. Editing disabled.</span>
                </div>
            )}
        </div>
    );
}
