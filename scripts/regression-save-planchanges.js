const http = require('http');
const fs = require('fs');
const path = require('path');
let chromium;

const repoRoot = path.resolve(__dirname, '..');
const defaultBaseUrl = 'http://127.0.0.1:8765/split/';
const backendUrl = 'https://script.google.com/macros/s/AKfycbw_uv4htKdG-Qur5DZysZgdbOdQ8kCeGJiIkErJut3-U7QQqGq8TV3HwggGaJfGIqgqyw/exec';
const productionBackendUrl = 'https://script.google.com/macros/s/AKfycbwoUFz4MwbWimGIHgQZtykkdHOSRA694gA8QDGzEkqIX4dX93H8Mvst8LuaVOnaznNj/exec';
const stagingPublicBaseUrl = 'https://cdkeyhouse.github.io/libretest/split/';
const productionPublicBaseUrl = 'https://libreonline.github.io/api-libre/split/';
const baseUrl = process.env.BASE_URL || defaultBaseUrl;
const facId = process.env.FAC_ID || 'FAC-001';
const facPin = process.env.FAC_PIN || '4101';
const headless = process.env.HEADFUL !== '1';
const strictNewSessionUi = process.env.STRICT_NEW_SESSION_UI === '1';
const scenarioFilter = String(process.env.SCENARIO_FILTER || '').trim().toLowerCase();
const cliArgs = new Set(process.argv.slice(2));
const dryRun = process.env.DRY_RUN === '1' || cliArgs.has('--dry-run');
const requireScenarioFilter = process.env.REQUIRE_SCENARIO_FILTER === '1' || cliArgs.has('--require-scenario-filter');
const exactScenarioFilter = process.env.EXACT_SCENARIO_FILTER === '1' || cliArgs.has('--exact-scenario-filter');
const artifactDir = path.resolve(process.env.ARTIFACT_DIR || path.join(repoRoot, 'artifacts', 'bartolo'));
const writeRecords = [];
let selectedScenarioNames = [];
let latestResults = [];

const scenarios = [
  {
    name: 'taller multigrupo observacion general',
    pattern: /\bTaller\b/i,
    exclude: null,
    kind: 'general',
    maxVisibleMs: 800
  },
  {
    name: 'multigrupo normal observacion general',
    pattern: /\b\d+\s+grupos\b/i,
    exclude: /\bTaller\b/i,
    kind: 'general',
    maxVisibleMs: 800
  },
  {
    name: 'grupo normal observacion general',
    pattern: /\b\d+\s+alumno\(s\)\b/i,
    exclude: /\b\d+\s+grupos\b|\bTaller\b/i,
    kind: 'general',
    maxVisibleMs: 800
  },
  {
    name: 'taller multigrupo observacion final',
    pattern: /\bTaller\b/i,
    exclude: null,
    kind: 'final',
    maxVisibleMs: 800
  },
  {
    name: 'multigrupo normal observacion final',
    pattern: /\b\d+\s+grupos\b/i,
    exclude: /\bTaller\b/i,
    kind: 'final',
    maxVisibleMs: 800
  }
];

function pad2(value) {
  return String(value).padStart(2, '0');
}

function makeRunId() {
  const explicit = String(process.env.BARTOLO_RUN_ID || '').trim();
  if (explicit) return explicit.replace(/[^A-Za-z0-9_-]/g, '-');
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    pad2(now.getMonth() + 1),
    pad2(now.getDate()),
    '-',
    pad2(now.getHours()),
    pad2(now.getMinutes()),
    pad2(now.getSeconds())
  ].join('');
  return 'BARTOLO-' + stamp + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

const runId = makeRunId();
const artifactPath = path.join(artifactDir, runId + '.json');

function normalizeComparableUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '').toLowerCase();
}

function parseUrl(value) {
  try {
    return new URL(value);
  } catch (_) {
    return null;
  }
}

function isLocalRunnerUrl(value) {
  const parsed = parseUrl(value);
  if (!parsed) return false;
  const host = String(parsed.hostname || '').toLowerCase();
  return host === '127.0.0.1' || host === 'localhost';
}

function isStagingRunnerUrl(value) {
  return normalizeComparableUrl(value).startsWith(normalizeComparableUrl(stagingPublicBaseUrl));
}

function isProductionRunnerUrl(value) {
  const parsed = parseUrl(value);
  if (!parsed) return false;
  const host = String(parsed.hostname || '').toLowerCase();
  const pathName = String(parsed.pathname || '').toLowerCase();
  return host === 'libreonline.github.io' && pathName.startsWith('/api-libre/');
}

function assertBartoloSafeEnvironment() {
  if (normalizeComparableUrl(backendUrl) === normalizeComparableUrl(productionBackendUrl)) {
    throw new Error('Bartolo bloqueado: backendUrl apunta a produccion.');
  }
  if (isProductionRunnerUrl(baseUrl) || normalizeComparableUrl(baseUrl).startsWith(normalizeComparableUrl(productionPublicBaseUrl))) {
    throw new Error('Bartolo bloqueado: BASE_URL apunta a produccion. Usa staging o localhost.');
  }
  if (!isLocalRunnerUrl(baseUrl) && !isStagingRunnerUrl(baseUrl)) {
    throw new Error('Bartolo bloqueado: BASE_URL debe ser staging o localhost. Valor actual: ' + baseUrl);
  }
  if (requireScenarioFilter && !scenarioFilter) {
    throw new Error('Bartolo bloqueado: REQUIRE_SCENARIO_FILTER activo pero SCENARIO_FILTER esta vacio.');
  }
}

function getSelectedScenarios() {
  const selected = scenarioFilter
    ? scenarios.filter((scenario) => {
        const name = scenario.name.toLowerCase();
        return exactScenarioFilter ? name === scenarioFilter : name.includes(scenarioFilter);
      })
    : scenarios;
  if (!selected.length) {
    throw new Error('SCENARIO_FILTER no coincide con ningun escenario: ' + scenarioFilter);
  }
  return selected;
}

function recordWrite(record) {
  const next = Object.assign({
    runId,
    status: 'prepared',
    createdAt: new Date().toISOString()
  }, record || {});
  writeRecords.push(next);
  return next;
}

function updateWriteRecord(record, patch) {
  if (!record) return null;
  Object.assign(record, patch || {}, {
    updatedAt: new Date().toISOString()
  });
  return record;
}

function writeArtifact(payload) {
  const body = Object.assign({
    runner: 'Bartolo',
    runId,
    artifactPath,
    baseUrl,
    backendUrl,
    facId,
    scenarioFilter: scenarioFilter || 'todos',
    exactScenarioFilter,
    strictNewSessionUi,
    dryRun,
    selectedScenarios: selectedScenarioNames,
    writes: writeRecords
  }, payload || {});
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(artifactPath, JSON.stringify(body, null, 2));
  return body;
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

function startStaticServerIfNeeded() {
  if (baseUrl !== defaultBaseUrl) return Promise.resolve(null);
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(repoRoot, requestPath);
      if (requestPath.endsWith('/')) filePath = path.join(repoRoot, requestPath, 'index.html');
      if (!filePath.startsWith(repoRoot)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, {
          'content-type': contentType(filePath),
          'cache-control': 'no-store'
        });
        res.end(data);
      });
    });
    server.once('error', () => resolve(null));
    server.listen(8765, '127.0.0.1', () => resolve(server));
  });
}

function summarizeOutboxRetries(traceSummary) {
  const retryTraces = (traceSummary || []).filter((trace) =>
    trace.label === 'planeacionOutboxSync' && trace.status === 'error'
  );
  const reasons = {};
  retryTraces.forEach((trace) => {
    const code = String(trace.errorCode || '').trim() || 'ERROR';
    const message = String(trace.errorMessage || '').trim() || 'Sin mensaje';
    const key = `${code}: ${message}`;
    reasons[key] = (reasons[key] || 0) + 1;
  });
  return {
    count: retryTraces.length,
    reasons: Object.keys(reasons).map((reason) => ({
      reason,
      count: reasons[reason]
    }))
  };
}

async function login(page) {
  await page.goto(baseUrl + (baseUrl.includes('?') ? '&' : '?') + 'verify=save-regression', { waitUntil: 'domcontentloaded' });
  await page.fill('#facilitadorId', facId);
  await page.fill('#pinInput', facPin);
  await page.click('#loginBtn');
  await page.waitForFunction(() => {
    const hasOpenPlanButton = Array.from(document.querySelectorAll('button')).some((button) => /Abrir/i.test(button.textContent || ''));
    const text = document.body && document.body.innerText || '';
    return hasOpenPlanButton ||
      /Todav[ií]a no hay planeaciones/i.test(text) ||
      /Demasiadas solicitudes/i.test(text);
  }, null, { timeout: 90000 });
  const state = await page.evaluate(() => {
    const text = document.body && document.body.innerText || '';
    return {
      openButtons: Array.from(document.querySelectorAll('button')).filter((button) => /Abrir/i.test(button.textContent || '')).length,
      empty: /Todav[ií]a no hay planeaciones/i.test(text),
      rateLimit: /Demasiadas solicitudes/i.test(text)
    };
  });
  if (state.rateLimit) {
    throw new Error('Bartolo bloqueado por RATE_LIMIT durante login. Espera y vuelve a correr.');
  }
  if (!state.openButtons) {
    throw new Error('Bartolo no puede correr: staging no tiene planeaciones abiertas para el facilitador ' + facId + '. Ejecuta primero un seed controlado o crea una planeacion QA.');
  }
}

async function clickOpenButton(page, cardId) {
  await page.evaluate((id) => {
    const card = document.getElementById(id);
    if (!card) throw new Error('No existe tarjeta ' + id);
    const button = Array.from(card.querySelectorAll('button'))
      .find((item) => /Abrir/i.test(item.textContent || '') && item.offsetParent !== null && !item.disabled);
    if (!button) throw new Error('No hay boton Abrir visible en ' + id);
    button.click();
  }, cardId);
}

async function openScenario(page, scenario) {
  const cards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[id^="plan-card-"]')).map((card) => ({
      id: card.id,
      text: (card.innerText || '').replace(/\s+/g, ' ').trim()
    }));
  });
  const target = cards.find((card) => scenario.pattern.test(card.text) && !(scenario.exclude && scenario.exclude.test(card.text)));
  if (!target) {
    const summaries = cards.map((card) => ({
      id: card.id,
      hasOpenButton: /Abrir/i.test(card.text),
      hasTaller: /\bTaller\b/i.test(card.text),
      hasMultiGroup: /\b\d+\s+grupos\b/i.test(card.text),
      hasStudentCount: /\b\d+\s+alumno\(s\)\b/i.test(card.text)
    }));
    throw new Error(`No encontre tarjeta para escenario "${scenario.name}". Resumen de tarjetas: ${JSON.stringify(summaries, null, 2)}`);
  }
  await clickOpenButton(page, target.id);
  await page.waitForSelector('textarea[id^="obs-general-"]', { timeout: 90000 });
  const inputId = await page.locator('textarea[id^="obs-general-"]').first().getAttribute('id');
  const planId = String(inputId || '').replace('obs-general-', '');
  await page.waitForFunction((id) => {
    const button = document.getElementById('plan-save-' + id);
    return button && !button.disabled && /Guardar cambios/i.test(button.textContent || '');
  }, planId, { timeout: 90000 });
  return { target, inputId, planId };
}

async function saveObservation(page, scenario) {
  console.log(`[regression] escenario: ${scenario.name}`);
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await login(page);
  const { target, inputId, planId } = await openScenario(page, scenario);
  console.log(`[regression] objetivo: ${scenario.name} -> ${planId}`);
  const note = `QA ${runId} ${scenario.name} ${Date.now()}`;
  const writeRecord = recordWrite({
    scenario: scenario.name,
    kind: scenario.kind,
    planId,
    targetPlanId: planId,
    alumnoId: '',
    note
  });
  let finalTarget = null;
  if (scenario.kind === 'final') {
    const preferredPrefix = 'obs-final-' + planId + '-';
    const preferredLocator = page.locator(`textarea[id^="${preferredPrefix}"]`).first();
    const hasPreferred = await preferredLocator.count();
    const finalInputId = hasPreferred
      ? await preferredLocator.getAttribute('id')
      : await page.locator('textarea[id^="obs-final-"]').first().getAttribute('id');
    if (!finalInputId) {
      throw new Error(`${scenario.name}: no encontre textarea de observacion final.`);
    }
    const normalizedFinalInputId = String(finalInputId || '');
    const onInput = await page.locator('#' + finalInputId).getAttribute('oninput');
    const onInputMatch = String(onInput || '').match(/updateOpenPlanFinalObservationDraft\('([^']*)',\s*'([^']*)'/);
    const targetPlanId = onInputMatch && onInputMatch[1] ? onInputMatch[1] : planId;
    const alumnoId = onInputMatch && onInputMatch[2]
      ? onInputMatch[2]
      : (normalizedFinalInputId.startsWith(preferredPrefix) ? normalizedFinalInputId.slice(preferredPrefix.length) : '');
    finalTarget = {
      inputId: finalInputId,
      planId: targetPlanId,
      alumnoId
    };
    updateWriteRecord(writeRecord, {
      targetPlanId,
      alumnoId
    });
    console.log(`[regression] final target: ${JSON.stringify(finalTarget)}`);
    await page.fill('#' + finalInputId, note);
  } else {
    await page.fill('#' + inputId, note);
  }
  updateWriteRecord(writeRecord, { status: 'submitted' });
  const countBefore = await page.locator('[id^="plan-card-"]').count();
  const startMs = Date.now();
  await page.evaluate((id) => {
    const button = document.getElementById('plan-save-' + id);
    if (!button) throw new Error('Falta boton guardar para ' + id);
    button.scrollIntoView({ block: 'center' });
    button.click();
  }, planId);

  await page.waitForFunction((id) => {
    const traces = window.__laSaveTrace || [];
    const trace = traces.find((item) => item.meta && item.meta.planId === id && item.label === 'guardarCambiosPlaneacion');
    return trace && trace.status !== 'running';
  }, planId, { timeout: 10000 });
  const visibleMs = Date.now() - startMs;
  const usesOutbox = await page.evaluate((id) => {
    const traces = window.__laSaveTrace || [];
    const trace = traces.find((item) => item.meta && item.meta.planId === id && item.label === 'guardarCambiosPlaneacion');
    const built = trace && trace.events && trace.events.find((event) => event.name === 'request_built');
    return !!(built && built.data && built.data.shouldUsePlaneacionOutbox);
  }, planId);

  if (scenario.kind === 'general') {
    await page.waitForFunction((value) => document.body.innerText.includes(value), note, { timeout: 5000 });
  }
  if (usesOutbox) {
    await page.waitForFunction((id) => {
      const traces = window.__laSaveTrace || [];
      return traces.some((item) =>
        item.label === 'planeacionOutboxSync' &&
        item.meta &&
        item.meta.planId === id &&
        item.status === 'success'
      );
    }, planId, { timeout: 90000 });
  }
  await page.waitForTimeout(800);

  const result = await page.evaluate(({ id, value, before, kind, finalInputId }) => {
    const input = document.getElementById('obs-general-' + id);
    const finalInput = finalInputId ? document.getElementById(finalInputId) : null;
    const traces = window.__laSaveTrace || [];
    return {
      countBefore: before,
      countAfter: document.querySelectorAll('[id^="plan-card-"]').length,
      targetStillExists: !!document.getElementById('plan-card-' + id),
      bodyContainsNote: document.body.innerText.includes(value),
      inputValue: input ? input.value : null,
      finalInputValue: finalInput ? finalInput.value : null,
      kind,
      traces: traces.filter((item) => item.meta && item.meta.planId === id)
    };
  }, { id: planId, value: note, before: countBefore, kind: scenario.kind, finalInputId: finalTarget && finalTarget.inputId || '' });
  const traceSummary = result.traces.map((trace) => ({
    label: trace.label,
    status: trace.status,
    duration_ms: trace.duration_ms,
    shouldSaveShared: trace.events && trace.events.find((event) => event.name === 'drafts_collected')?.data?.shouldSaveShared,
    shouldUsePlaneacionOutbox: trace.events && trace.events.find((event) => event.name === 'request_built')?.data?.shouldUsePlaneacionOutbox,
    errorCode: trace.result && trace.result.code || '',
    errorMessage: trace.result && trace.result.message || ''
  }));
  const retrySummary = summarizeOutboxRetries(traceSummary);
  console.log(`[regression] visible=${visibleMs}ms outbox=${usesOutbox} traces=${JSON.stringify(traceSummary)}`);
  if (retrySummary.count) {
    console.log(`[regression] guardado instantaneo, pero hubo ${retrySummary.count} reintento(s) outbox: ${JSON.stringify(retrySummary.reasons)}`);
  }

  if (visibleMs > scenario.maxVisibleMs) {
    throw new Error(`${scenario.name}: guardado visible lento (${visibleMs}ms).`);
  }
  if (result.countAfter < result.countBefore || !result.targetStillExists) {
    throw new Error(`${scenario.name}: la tarjeta desaparecio. ${JSON.stringify(result, null, 2)}`);
  }
  if (scenario.kind === 'general' && !result.bodyContainsNote) {
    throw new Error(`${scenario.name}: la observacion no aparece localmente.`);
  }
  if (scenario.kind === 'general' && String(result.inputValue || '').trim()) {
    throw new Error(`${scenario.name}: el textarea no quedo limpio.`);
  }
  if (scenario.kind === 'final' && String(result.finalInputValue || '').trim() !== note) {
    throw new Error(`${scenario.name}: la observacion final no quedo visible en su campo.`);
  }
  if (errors.length) {
    throw new Error(`${scenario.name}: errores de consola: ${errors.join(' | ')}`);
  }

  let persisted = null;
  const persistDeadline = Date.now() + 90000;
  while (Date.now() < persistDeadline) {
    persisted = await page.evaluate(async ({ url, id, value, kind, finalTarget }) => {
      const session = JSON.parse(localStorage.getItem('la_v8_session') || '{}');
      const targetPlanId = kind === 'final' && finalTarget && finalTarget.planId
        ? finalTarget.planId
        : id;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'getPlaneacionObservaciones',
          token: session.token,
          payload: {
            planeacion_id: targetPlanId,
            skip_cache: true
          }
        })
      });
      const json = await response.json();
      const obs = json && json.data && Array.isArray(json.data.obs_semana) ? json.data.obs_semana : [];
      const finalObs = json && json.data && Array.isArray(json.data.obs_alumno_final) ? json.data.obs_alumno_final : [];
      return {
        ok: !!(json && json.ok),
        code: json && (json.code || (json.error && json.error.code)) || '',
        count: obs.length,
        finalCount: finalObs.length,
        containsNote: kind === 'final'
          ? finalObs.some((row) =>
              String((row && row.planeacion_id) || '').trim() === String(targetPlanId || '').trim() &&
              (
                !String((finalTarget && finalTarget.alumnoId) || '').trim() ||
                String((row && row.alumno_id) || '').trim() === String((finalTarget && finalTarget.alumnoId) || '').trim()
              ) &&
              String((row && row.nota) || '').trim() === value
            )
          : obs.some((row) => String((row && row.texto) || '').trim() === value),
        error: json && (json.error || json.message || json.code) || ''
      };
    }, { url: backendUrl, id: planId, value: note, kind: scenario.kind, finalTarget });
    if (persisted && /RATE_LIMIT|Demasiadas solicitudes/i.test(String(persisted.code || persisted.error || ''))) {
      updateWriteRecord(writeRecord, { status: 'rate_limited', persisted });
      throw new Error(`${scenario.name}: RATE_LIMIT durante verificacion de persistencia. Espera y vuelve a correr.`);
    }
    if (persisted && persisted.ok && persisted.containsNote) break;
    await page.waitForTimeout(3000);
  }
  let persistedInputValue = '';
  if (strictNewSessionUi) {
    const context2 = await page.context().browser().newContext({ viewport: { width: 1440, height: 900 } });
    const page2 = await context2.newPage();
    await login(page2);
    await page2.waitForSelector('#' + target.id, { timeout: 60000 });
    await clickOpenButton(page2, target.id);
    try {
      await page2.waitForSelector('textarea[id^="obs-general-"]', { timeout: 60000 });
    } catch (err) {
      const bodyText = await page2.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 1200));
      throw new Error(`${scenario.name}: no abrio detalle en sesion nueva. Texto visible: ${bodyText}`);
    }
    await page2.waitForFunction((value) => document.body.innerText.includes(value), note, { timeout: 45000 });
    persistedInputValue = await page2.locator('textarea[id^="obs-general-"]').first().inputValue();
    await context2.close();
  }

  if (!persisted.ok || !persisted.containsNote) {
    updateWriteRecord(writeRecord, { status: 'not_confirmed', persisted });
    throw new Error(`${scenario.name}: backend no devolvio la observacion persistida. ${JSON.stringify({ persisted, traceSummary }, null, 2)}`);
  }
  updateWriteRecord(writeRecord, { status: 'persisted', persisted });
  if (scenario.kind === 'general' && String(persistedInputValue || '').trim()) {
    throw new Error(`${scenario.name}: sesion nueva reinyecto texto en textarea.`);
  }

  return {
    scenario: scenario.name,
    planId,
    visibleMs,
    target: {
      id: target.id,
      hasTaller: /\bTaller\b/i.test(target.text),
      hasMultiGroup: /\b\d+\s+grupos\b/i.test(target.text),
      hasStudentCount: /\b\d+\s+alumno\(s\)\b/i.test(target.text)
    },
    outboxRetryCount: retrySummary.count,
    outboxRetryReasons: retrySummary.reasons,
    write: writeRecord,
    traces: traceSummary
  };
}

(async () => {
  assertBartoloSafeEnvironment();
  const selectedScenarios = getSelectedScenarios();
  selectedScenarioNames = selectedScenarios.map((scenario) => scenario.name);
  console.log(JSON.stringify({
    runner: 'Bartolo',
    runId,
    mode: 'staging-qa',
    dryRun,
    baseUrl,
    backendUrl,
    facId,
    scenarioFilter: scenarioFilter || 'todos',
    exactScenarioFilter,
    strictNewSessionUi,
    artifactPath,
    selectedScenarios: selectedScenarioNames
  }, null, 2));
  if (dryRun) {
    const payload = writeArtifact({
      ok: true,
      message: 'Dry-run: no se abrio navegador y no se escribieron datos.'
    });
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  ({ chromium } = require('playwright'));
  const server = await startStaticServerIfNeeded();
  const browser = await chromium.launch({ headless });
  const results = [];
  try {
    for (const scenario of selectedScenarios) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      try {
        results.push(await saveObservation(page, scenario));
      } finally {
        await context.close();
      }
    }
    latestResults = results;
    const payload = writeArtifact({ ok: true, results });
    console.log(JSON.stringify(payload, null, 2));
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch((err) => {
  try {
    writeArtifact({
      ok: false,
      error: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack : '',
      results: latestResults,
      pendingWrites: writeRecords.filter((record) => record.status !== 'persisted')
    });
    console.error('[Bartolo] artifact: ' + artifactPath);
  } catch (artifactError) {
    console.error('[Bartolo] no se pudo escribir artifact: ' + (artifactError && artifactError.message || artifactError));
  }
  console.error(err);
  process.exit(1);
});
