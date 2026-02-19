import { useEffect, useState } from 'react';
import { parseStyle, updateStyle, type StyleState } from '@/lib/styleUtils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, PaintBucket, Layout, BoxSelect } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface StyleEditorProps {
    className: string;
    onChange: (newClassName: string) => void;
}

export function StyleEditor({ className, onChange }: StyleEditorProps) {
    const [style, setStyle] = useState<StyleState>(parseStyle(className));

    // Sync with prop changes (e.g. selection change)
    useEffect(() => {
        setStyle(parseStyle(className));
    }, [className]);

    const handleUpdate = (category: keyof StyleState, value: string) => {
        const newClassName = updateStyle(className, category, value);
        onChange(newClassName);
        // Optimistic update
        setStyle(prev => ({ ...prev, [category]: value }));
    };

    return (
        <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-8 p-0.5 bg-muted/50 rounded-md mb-3">
                <TabsTrigger value="appearance" className="text-[10px] h-7 px-0"><PaintBucket size={12} /></TabsTrigger>
                <TabsTrigger value="typography" className="text-[10px] h-7 px-0"><Type size={12} /></TabsTrigger>
                <TabsTrigger value="spacing" className="text-[10px] h-7 px-0"><BoxSelect size={12} /></TabsTrigger>
                <TabsTrigger value="layout" className="text-[10px] h-7 px-0"><Layout size={12} /></TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
                {/* Background Color */}
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">Background</Label>
                    <div className="grid grid-cols-6 gap-1">
                        {['bg-transparent', 'bg-white', 'bg-black', 'bg-slate-100', 'bg-slate-900', 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'].map(bg => (
                            <button
                                key={bg}
                                className={`w-6 h-6 rounded border border-border ${bg.replace('bg-', 'bg-')} ${style.backgroundColor === bg ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                                onClick={() => handleUpdate('backgroundColor', bg)}
                                title={bg}
                            />
                        ))}
                    </div>
                    <Input
                        className="h-6 text-xs font-mono"
                        placeholder="custom-class"
                        value={style.backgroundColor}
                        onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                    />
                </div>

                <Separator />

                {/* Border Radius */}
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">Radius</Label>
                    <Select value={style.borderRadius || 'rounded-none'} onValueChange={(v: string) => handleUpdate('borderRadius', v)}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rounded-none">None</SelectItem>
                            <SelectItem value="rounded-sm">Small</SelectItem>
                            <SelectItem value="rounded">Default</SelectItem>
                            <SelectItem value="rounded-md">Medium</SelectItem>
                            <SelectItem value="rounded-lg">Large</SelectItem>
                            <SelectItem value="rounded-full">Full</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
                {/* Font Size */}
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">Size</Label>
                    <Select value={style.fontSize || 'text-base'} onValueChange={(v: string) => handleUpdate('fontSize', v)}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text-xs">XS</SelectItem>
                            <SelectItem value="text-sm">Small</SelectItem>
                            <SelectItem value="text-base">Base</SelectItem>
                            <SelectItem value="text-lg">Large</SelectItem>
                            <SelectItem value="text-xl">XL</SelectItem>
                            <SelectItem value="text-2xl">2XL</SelectItem>
                            <SelectItem value="text-4xl">4XL</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Font Weight */}
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">Weight</Label>
                    <Select value={style.fontWeight || 'font-normal'} onValueChange={(v: string) => handleUpdate('fontWeight', v)}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="font-thin">Thin</SelectItem>
                            <SelectItem value="font-light">Light</SelectItem>
                            <SelectItem value="font-normal">Normal</SelectItem>
                            <SelectItem value="font-medium">Medium</SelectItem>
                            <SelectItem value="font-bold">Bold</SelectItem>
                            <SelectItem value="font-extrabold">Extra Bold</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Alignment */}
                <div className="grid grid-cols-3 gap-1 bg-secondary rounded p-0.5">
                    {['text-left', 'text-center', 'text-right'].map(align => (
                        <button
                            key={align}
                            className={`text-[10px] py-1 rounded ${style.textAlign === align ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
                            onClick={() => handleUpdate('textAlign', align)}
                        >
                            {align.replace('text-', '')}
                        </button>
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">Padding</Label>
                    <Select value={style.padding || 'p-0'} onValueChange={(v: string) => handleUpdate('padding', v)}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[0, 1, 2, 3, 4, 6, 8, 12, 16].map(n => (
                                <SelectItem key={n} value={`p-${n}`}>p-{n}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">Margin</Label>
                    <Select value={style.margin || 'm-0'} onValueChange={(v: string) => handleUpdate('margin', v)}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[0, 1, 2, 3, 4, 6, 8, 12, 16, 'auto'].map(n => (
                                <SelectItem key={n} value={`m-${n}`}>m-{n}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
                <div className="grid grid-cols-3 gap-1 bg-secondary rounded p-0.5">
                    {['block', 'flex', 'grid'].map(d => (
                        <button
                            key={d}
                            className={`text-[10px] py-1 rounded ${style.display === d ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
                            onClick={() => handleUpdate('display', d)}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                {style.display === 'flex' && (
                    <div className="space-y-2 pt-2">
                        <Label className="text-[10px]">Direction</Label>
                        <Select value={style.flexDirection || 'flex-row'} onValueChange={(v: string) => handleUpdate('flexDirection', v)}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="flex-row">Row</SelectItem>
                                <SelectItem value="flex-col">Column</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label className="text-[10px]">Justify</Label>
                        <Select value={style.justifyContent || 'justify-start'} onValueChange={(v: string) => handleUpdate('justifyContent', v)}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="justify-start">Start</SelectItem>
                                <SelectItem value="justify-center">Center</SelectItem>
                                <SelectItem value="justify-between">Between</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label className="text-[10px]">Items</Label>
                        <Select value={style.alignItems || 'items-start'} onValueChange={(v: string) => handleUpdate('alignItems', v)}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="items-start">Start</SelectItem>
                                <SelectItem value="items-center">Center</SelectItem>
                                <SelectItem value="items-end">End</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );
}
