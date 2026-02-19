const ENGINE_URL = 'http://localhost:3001';

export async function readComponent(file: string, line: number, column: number) {
    const res = await fetch(`${ENGINE_URL}/api/ast/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, line, column }),
    });
    if (!res.ok) throw new Error(`Failed to read component: ${res.statusText}`);
    return res.json();
}

export async function updateProp(
    file: string,
    line: number,
    column: number,
    prop: string,
    value: string,
    operation: 'update' | 'add' | 'remove' = 'update'
) {
    const res = await fetch(`${ENGINE_URL}/api/ast/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, line, column, prop, value, operation }),
    });
    if (!res.ok) throw new Error(`Failed to update prop: ${res.statusText}`);
    return res.json();
}

export async function listFiles() {
    const res = await fetch(`${ENGINE_URL}/api/files`);
    if (!res.ok) throw new Error(`Failed to list files: ${res.statusText}`);
    return res.json();
}

export async function readFile(filepath: string) {
    const res = await fetch(`${ENGINE_URL}/api/file/${filepath}`);
    if (!res.ok) throw new Error(`Failed to read file: ${res.statusText}`);
    return res.json();
}
