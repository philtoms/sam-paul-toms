import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'node:child_process';

const PORT = 4399;
const BASE_URL = `http://localhost:${PORT}`;

// These tests require a running dev server and are skipped unless
// the SAM_INTEGRATION env var is set (e.g. CI with a dedicated step).
const runIntegration = !!process.env.SAM_INTEGRATION;

async function waitForServer(url: string, timeoutMs: number) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not start within ${timeoutMs}ms`);
}

describe.skipIf(!runIntegration)('Release pages', () => {
  let server: ChildProcess;

  beforeAll(async () => {
    server = spawn('npx', ['astro', 'dev', '--port', String(PORT)], {
      stdio: 'pipe',
      shell: true,
    });
    await waitForServer(BASE_URL, 15000);
  }, 20000);

  afterAll(() => {
    server.kill();
  });

  it('renders the releases listing page', async () => {
    const res = await fetch(`${BASE_URL}/releases`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Midnight Sessions');
    expect(html).toContain('Echoes');
    expect(html).toContain('Neon Lights');
    expect(html).toContain('Gravity');
  });

  it('renders midnight-sessions detail page', async () => {
    const res = await fetch(`${BASE_URL}/releases/midnight-sessions`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Midnight Sessions');
    expect(html).toContain('Dusk');
    expect(html).toContain('Dawn');
    expect(html).toContain('Spotify');
  });

  it('renders echoes-ep detail page', async () => {
    const res = await fetch(`${BASE_URL}/releases/echoes-ep`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Echoes');
    expect(html).toContain('Reverberations');
  });

  it('renders neon-lights detail page', async () => {
    const res = await fetch(`${BASE_URL}/releases/neon-lights`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Neon Lights');
  });

  it('renders gravity detail page', async () => {
    const res = await fetch(`${BASE_URL}/releases/gravity`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Gravity');
  });

  it('redirects invalid slug to /releases', async () => {
    const res = await fetch(`${BASE_URL}/releases/nonexistent`, {
      redirect: 'manual',
    });
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/releases');
  });
});
