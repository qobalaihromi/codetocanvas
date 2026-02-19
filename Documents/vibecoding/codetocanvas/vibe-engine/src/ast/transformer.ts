import jscodeshift, { API, FileInfo } from 'jscodeshift';
import * as fs from 'fs';
import * as path from 'path';

interface UpdatePropRequest {
    file: string;        // Absolute path to the .tsx file
    line: number;        // Line number of the JSX element
    column: number;      // Column number of the JSX element
    prop: string;        // Prop name to update (e.g., "className")
    value: string;       // New value for the prop
    operation: 'update' | 'add' | 'remove';
}

interface ReadComponentResult {
    file: string;
    component: string;
    props: Record<string, string>;
    children?: string;
    location: { line: number; column: number };
}

/**
 * Read a file and parse its AST to extract component info at a given location.
 */
export function readComponentAtLocation(
    filePath: string,
    line: number,
    column: number
): ReadComponentResult | null {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const source = fs.readFileSync(filePath, 'utf-8');
    const j = jscodeshift.withParser('tsx');
    const root = j(source);
    let result: ReadComponentResult | null = null;

    root.find(j.JSXOpeningElement).forEach((nodePath) => {
        const loc = nodePath.node.loc;
        if (!loc) return;

        if (loc.start.line === line && loc.start.column === column) {
            const name =
                nodePath.node.name.type === 'JSXIdentifier'
                    ? nodePath.node.name.name
                    : nodePath.node.name.type === 'JSXMemberExpression'
                        ? `${(nodePath.node.name.object as any).name}.${nodePath.node.name.property.name}`
                        : 'Unknown';

            const props: Record<string, string> = {};
            const attributes = nodePath.node.attributes || [];
            attributes.forEach((attr) => {
                if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
                    const propName = attr.name.name;
                    if (attr.value) {
                        if (attr.value.type === 'StringLiteral') {
                            props[propName] = attr.value.value;
                        } else if (
                            attr.value.type === 'JSXExpressionContainer' &&
                            attr.value.expression.type === 'StringLiteral'
                        ) {
                            props[propName] = attr.value.expression.value;
                        } else {
                            props[propName] = '[expression]';
                        }
                    } else {
                        props[propName] = 'true'; // Boolean shorthand
                    }
                }
            });

            result = {
                file: filePath,
                component: name,
                props,
                location: { line, column },
            };
        }
    });

    return result;
}

/**
 * Update a specific prop on a JSX element at a given file location.
 * This is the core "surgical update" — only the target prop is changed.
 */
export function updateProp(request: UpdatePropRequest): {
    success: boolean;
    updatedSource?: string;
    error?: string;
} {
    const { file: filePath, line, column, prop, value, operation } = request;

    if (!fs.existsSync(filePath)) {
        return { success: false, error: `File not found: ${filePath}` };
    }

    // Create backup before writing
    const backupPath = filePath + '.vibe-backup';
    const source = fs.readFileSync(filePath, 'utf-8');
    fs.writeFileSync(backupPath, source, 'utf-8');

    const j = jscodeshift.withParser('tsx');
    const root = j(source);
    let found = false;

    root.find(j.JSXOpeningElement).forEach((nodePath) => {
        const loc = nodePath.node.loc;
        if (!loc) return;

        if (loc.start.line === line && loc.start.column === column) {
            found = true;

            const attributes = nodePath.node.attributes || [];

            if (operation === 'remove') {
                nodePath.node.attributes = attributes.filter(
                    (attr) =>
                        !(attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier' && attr.name.name === prop)
                );
                return;
            }

            // Find existing attribute
            const existingAttr = attributes.find(
                (attr) =>
                    attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier' && attr.name.name === prop
            );

            if (existingAttr && existingAttr.type === 'JSXAttribute') {
                // Update existing prop
                existingAttr.value = j.stringLiteral(value);
            } else if (operation === 'add' || operation === 'update') {
                // Add new prop
                const newAttr = j.jsxAttribute(j.jsxIdentifier(prop), j.stringLiteral(value));
                nodePath.node.attributes = [...attributes, newAttr];
            }
        }
    });

    if (!found) {
        return { success: false, error: `No JSX element found at ${filePath}:${line}:${column}` };
    }

    const updatedSource = root.toSource({ quote: 'single' });
    fs.writeFileSync(filePath, updatedSource, 'utf-8');

    return { success: true, updatedSource };
}
