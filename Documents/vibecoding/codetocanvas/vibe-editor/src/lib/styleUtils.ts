export type StyleCategory = 'layout' | 'spacing' | 'typography' | 'appearance' | 'effects';

export interface StyleState {
    // Layout
    display: string; // block, flex, grid, hidden
    flexDirection: string; // flex-row, flex-col
    alignItems: string; // items-start, items-center, ...
    justifyContent: string; // justify-start, justify-center, ...
    gap: string; // gap-0, gap-4...

    // Spacing
    padding: string; // p-4
    margin: string; // m-0

    // Typography
    fontSize: string; // text-sm
    fontWeight: string; // font-bold
    textAlign: string; // text-left
    textColor: string; // text-blue-500

    // Appearance
    backgroundColor: string; // bg-white
    borderRadius: string; // rounded-lg
    borderWidth: string; // border
    borderColor: string; // border-gray-200

    // Effects
    shadow: string; // shadow-md
    opacity: string; // opacity-100
}

// Helper to extract a class based on a prefix regex
function extractClass(classes: string, prefixRegex: RegExp, defaultValue: string = ''): string {
    const match = classes.match(prefixRegex);
    return match ? match[0] : defaultValue;
}

export function parseStyle(className: string): StyleState {
    const cls = className || '';

    return {
        display: extractClass(cls, /\b(block|flex|grid|hidden|inline-block|inline)\b/, 'block'),
        flexDirection: extractClass(cls, /\bflex-(row|col)(-reverse)?\b/),
        alignItems: extractClass(cls, /\bitems-(start|end|center|baseline|stretch)\b/),
        justifyContent: extractClass(cls, /\bjustify-(start|end|center|between|around|evenly)\b/),
        gap: extractClass(cls, /\bgap-\d+\b/),

        padding: extractClass(cls, /\bp-\d+\b/),
        margin: extractClass(cls, /\bm-\d+\b/),

        fontSize: extractClass(cls, /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl)\b/),
        fontWeight: extractClass(cls, /\bfont-(thin|light|normal|medium|semibold|bold|extrabold)\b/),
        textAlign: extractClass(cls, /\btext-(left|center|right|justify)\b/),
        textColor: extractClass(cls, /\btext-[a-z]+(-\d{1,3})?\b/, ''), // approximate

        backgroundColor: extractClass(cls, /\bbg-[a-z]+(-\d{1,3})?(\/[0-9]+)?\b/),
        borderRadius: extractClass(cls, /\brounded(-[a-z]+)?\b/),
        borderWidth: extractClass(cls, /\bborder(-[0-9]+)?\b/),
        borderColor: extractClass(cls, /\bborder-[a-z]+(-\d{1,3})?\b/),

        shadow: extractClass(cls, /\bshadow(-[a-z]+)?\b/),
        opacity: extractClass(cls, /\bopacity-\d+\b/),
    };
}

export function updateStyle(currentClassName: string, category: keyof StyleState, value: string): string {
    let classes = currentClassName.split(' ').filter(Boolean);
    const prefixMap: Record<keyof StyleState, RegExp> = {
        display: /\b(block|flex|grid|hidden|inline-block|inline)\b/,
        flexDirection: /\bflex-(row|col)(-reverse)?\b/,
        alignItems: /\bitems-(start|end|center|baseline|stretch)\b/,
        justifyContent: /\bjustify-(start|end|center|between|around|evenly)\b/,
        gap: /\bgap-\d+\b/,
        padding: /\bp-\d+\b/,
        margin: /\bm-\d+\b/,
        fontSize: /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl)\b/,
        fontWeight: /\bfont-(thin|light|normal|medium|semibold|bold|extrabold)\b/,
        textAlign: /\btext-(left|center|right|justify)\b/,
        textColor: /\btext-[a-z]+(-\d{1,3})?\b/,
        backgroundColor: /\bbg-[a-z]+(-\d{1,3})?(\/[0-9]+)?\b/,
        borderRadius: /\brounded(-[a-z]+)?\b/,
        borderWidth: /\bborder(-[0-9]+)?\b/,
        borderColor: /\bborder-[a-z]+(-\d{1,3})?\b/,
        shadow: /\bshadow(-[a-z]+)?\b/,
        opacity: /\bopacity-\d+\b/,
    };

    const regex = prefixMap[category];

    // Remove existing
    if (regex) {
        classes = classes.filter(c => !regex.test(c));
    }

    // Add new if not empty
    if (value) {
        classes.push(value);
    }

    return classes.join(' ');
}
