import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import * as fs from 'fs';
import * as path from 'path';
import { readComponentAtLocation, updateProp } from './ast/transformer';

const PORT = 3001;
const TARGET_APP_DIR = path.resolve(__dirname, '../../target-app');

const fastify = Fastify({ logger: true });

async function start() {
    // Register plugins
    await fastify.register(cors, { origin: '*' });
    await fastify.register(websocket);

    // Health check
    fastify.get('/api/health', async () => ({ status: 'ok', engine: 'vibe-engine' }));

    // ─── AST Routes ───────────────────────────────────────────────────

    /**
     * POST /api/ast/read
     * Read component info at a given location.
     * Body: { file: string, line: number, column: number }
     */
    fastify.post<{
        Body: { file: string; line: number; column: number };
    }>('/api/ast/read', async (request, reply) => {
        const { file, line, column } = request.body;
        const filePath = path.isAbsolute(file) ? file : path.join(TARGET_APP_DIR, file);

        try {
            const result = readComponentAtLocation(filePath, line, column);
            if (!result) {
                return reply.status(404).send({ error: 'No component found at location' });
            }
            return result;
        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }
    });

    /**
     * POST /api/ast/update
     * Update a prop on a component at a given location.
     * Body: { file, line, column, prop, value, operation }
     */
    fastify.post<{
        Body: {
            file: string;
            line: number;
            column: number;
            prop: string;
            value: string;
            operation: 'update' | 'add' | 'remove';
        };
    }>('/api/ast/update', async (request, reply) => {
        const { file, line, column, prop, value, operation } = request.body;
        const filePath = path.isAbsolute(file) ? file : path.join(TARGET_APP_DIR, file);

        const result = updateProp({
            file: filePath,
            line,
            column,
            prop,
            value,
            operation: operation || 'update',
        });

        if (!result.success) {
            return reply.status(400).send({ error: result.error });
        }
        return { success: true, message: `Updated ${prop} at ${file}:${line}:${column}` };
    });

    /**
     * GET /api/files
     * List all .tsx/.jsx files in the target app src directory.
     */
    fastify.get('/api/files', async () => {
        const srcDir = path.join(TARGET_APP_DIR, 'src');
        const files: string[] = [];

        function walk(dir: string) {
            if (!fs.existsSync(dir)) return;
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory() && entry.name !== 'node_modules') {
                    walk(fullPath);
                } else if (/\.(tsx|jsx)$/.test(entry.name)) {
                    files.push(path.relative(TARGET_APP_DIR, fullPath));
                }
            }
        }

        walk(srcDir);
        return { files };
    });

    /**
     * GET /api/file/:filepath
     * Read the contents of a file.
     */
    fastify.get<{ Params: { '*': string } }>('/api/file/*', async (request, reply) => {
        const filepath = (request.params as any)['*'];
        const filePath = path.join(TARGET_APP_DIR, filepath);

        if (!fs.existsSync(filePath)) {
            return reply.status(404).send({ error: 'File not found' });
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return { file: filepath, content };
    });

    // ─── Terminal WebSocket ───────────────────────────────────────────

    fastify.register(async function (fastify) {
        fastify.get('/ws/terminal', { websocket: true }, (socket, req) => {
            // Terminal will be implemented in Phase 3
            // For now, echo back messages
            socket.on('message', (message: Buffer) => {
                socket.send(`[echo] ${message.toString()}`);
            });
            socket.send('Vibe Terminal connected. Terminal feature coming in Phase 3.\r\n');
        });
    });

    // ─── Start Server ────────────────────────────────────────────────

    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`\n🚀 Vibe Engine running at http://localhost:${PORT}`);
        console.log(`📁 Target app directory: ${TARGET_APP_DIR}\n`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
