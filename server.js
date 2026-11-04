/**
 * Servidor Local + Banco de Dados SQLite (Nativo Node.js)
 * Salva todas as inclusões em:
 *   - C:\Controle de Gastos\banco_de_dados.sqlite (Tabelas SQL reais)
 *   - C:\Controle de Gastos\dados_salvos.json (Espelho legível de segurança)
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = 3333;
const ROOT_DIR = __dirname;
const DB_PATH = path.join(ROOT_DIR, 'banco_de_dados.sqlite');
const JSON_MIRROR_PATH = path.join(ROOT_DIR, 'dados_salvos.json');

// Inicializa o Banco de Dados SQLite
const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  CREATE TABLE IF NOT EXISTS configuracoes (
    chave TEXT PRIMARY KEY,
    valor TEXT NOT NULL,
    atualizado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gastos_fixos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    valor REAL NOT NULL,
    dia_vencimento INTEGER NOT NULL DEFAULT 10,
    categoria TEXT,
    metodo_pagamento TEXT,
    observacao TEXT,
    icone TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS meses_resumo (
    mes_ano TEXT PRIMARY KEY,
    salario_especifico REAL,
    renda_extra REAL NOT NULL DEFAULT 0,
    observacao_renda TEXT,
    bloco_notas TEXT,
    fixos_pagos_json TEXT
  );

  CREATE TABLE IF NOT EXISTS gastos_variaveis (
    id TEXT PRIMARY KEY,
    mes_ano TEXT NOT NULL,
    nome TEXT NOT NULL,
    valor REAL NOT NULL,
    data_gasto TEXT NOT NULL,
    categoria TEXT,
    metodo_pagamento TEXT,
    observacao TEXT,
    icone TEXT,
    criado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS entradas_mes (
    id TEXT PRIMARY KEY,
    mes_ano TEXT NOT NULL,
    nome TEXT NOT NULL,
    valor REAL NOT NULL,
    data_entrada TEXT NOT NULL,
    observacao TEXT,
    criado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS observacoes (
    id TEXT PRIMARY KEY,
    mes_ano TEXT,
    tipo_tag TEXT NOT NULL DEFAULT 'Lembrete',
    texto TEXT NOT NULL,
    fixada_todos_meses INTEGER NOT NULL DEFAULT 0,
    criado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS usuarios_estado (
    email TEXT PRIMARY KEY,
    nome TEXT,
    foto TEXT,
    estado_json TEXT NOT NULL,
    atualizado_em TEXT NOT NULL
  );
`);

/**
 * Lê todo o estado estruturado diretamente das tabelas SQLite (por conta de usuário ou global)
 */
function readStateFromSQLite(userEmail = '') {
  const cleanEmail = String(userEmail || '').trim().toLowerCase();
  if (cleanEmail) {
    const userRow = db.prepare(`SELECT estado_json FROM usuarios_estado WHERE email = ?`).get(cleanEmail);
    if (!userRow) {
      return {
        isEmptyDatabase: true,
        state: {
          defaultSalary: 0,
          fixedExpenses: [],
          pinnedObservations: [],
          months: {}
        }
      };
    }
    try {
      const parsed = JSON.parse(userRow.estado_json || '{}');
      return {
        isEmptyDatabase: false,
        state: {
          defaultSalary: Number(parsed.defaultSalary) || 0,
          fixedExpenses: Array.isArray(parsed.fixedExpenses) ? parsed.fixedExpenses : [],
          pinnedObservations: Array.isArray(parsed.pinnedObservations) ? parsed.pinnedObservations : [],
          months: parsed.months && typeof parsed.months === 'object' ? parsed.months : {}
        }
      };
    } catch {
      return {
        isEmptyDatabase: true,
        state: { defaultSalary: 0, fixedExpenses: [], pinnedObservations: [], months: {} }
      };
    }
  }
  const configRow = db.prepare(`SELECT valor FROM configuracoes WHERE chave = 'defaultSalary'`).get();
  const hasInitializedRow = db.prepare(`SELECT valor FROM configuracoes WHERE chave = 'initialized'`).get();

  const fixedRows = db.prepare(`SELECT * FROM gastos_fixos ORDER BY dia_vencimento ASC, criado_em ASC`).all();
  const monthRows = db.prepare(`SELECT * FROM meses_resumo`).all();
  const incomeRows = db.prepare(`SELECT * FROM entradas_mes ORDER BY data_entrada ASC, criado_em ASC`).all();
  const varRows = db.prepare(`SELECT * FROM gastos_variaveis ORDER BY data_gasto DESC, criado_em DESC`).all();
  const obsRows = db.prepare(`SELECT * FROM observacoes ORDER BY criado_em DESC`).all();

  const fixedExpenses = fixedRows.map((r) => ({
    id: r.id,
    name: r.nome,
    amount: Number(r.valor) || 0,
    day: Number(r.dia_vencimento) || 10,
    category: r.categoria || 'Assinatura / Streaming',
    method: r.metodo_pagamento || 'Cartão de Crédito',
    note: r.observacao || '',
    iconKey: r.icone || '',
    active: r.ativo === 1
  }));

  const pinnedObservations = [];
  const months = {};

  for (const m of monthRows) {
    let paidFixedIds = [];
    try {
      paidFixedIds = JSON.parse(m.fixos_pagos_json || '[]');
    } catch {
      paidFixedIds = [];
    }
    months[m.mes_ano] = {
      incomes: [],
      salaryOverride: m.salario_especifico !== null && m.salario_especifico !== undefined ? Number(m.salario_especifico) : null,
      extraIncome: Number(m.renda_extra) || 0,
      extraIncomeNote: m.observacao_renda || '',
      paidFixedIds: Array.isArray(paidFixedIds) ? paidFixedIds : [],
      variableExpenses: [],
      notepad: m.bloco_notas || '',
      observations: []
    };
  }

  for (const inc of incomeRows) {
    if (!months[inc.mes_ano]) {
      months[inc.mes_ano] = {
        incomes: [],
        salaryOverride: null,
        extraIncome: 0,
        extraIncomeNote: '',
        paidFixedIds: [],
        variableExpenses: [],
        notepad: '',
        observations: []
      };
    }
    months[inc.mes_ano].incomes.push({
      id: inc.id,
      name: inc.nome,
      amount: Number(inc.valor) || 0,
      date: inc.data_entrada,
      note: inc.observacao || ''
    });
  }

  for (const v of varRows) {
    if (!months[v.mes_ano]) {
      months[v.mes_ano] = {
        incomes: [],
        salaryOverride: null,
        extraIncome: 0,
        extraIncomeNote: '',
        paidFixedIds: [],
        variableExpenses: [],
        notepad: '',
        observations: []
      };
    }
    months[v.mes_ano].variableExpenses.push({
      id: v.id,
      name: v.nome,
      amount: Number(v.valor) || 0,
      date: v.data_gasto,
      category: v.categoria || 'Outros',
      method: v.metodo_pagamento || 'PIX',
      note: v.observacao || '',
      iconKey: v.icone || ''
    });
  }

  for (const o of obsRows) {
    const obsObj = {
      id: o.id,
      tag: o.tipo_tag || 'Lembrete',
      text: o.texto,
      pinned: o.fixada_todos_meses === 1,
      createdAt: o.mes_ano || ''
    };
    if (obsObj.pinned) {
      pinnedObservations.push(obsObj);
    } else if (o.mes_ano) {
      if (!months[o.mes_ano]) {
        months[o.mes_ano] = {
          salaryOverride: null,
          extraIncome: 0,
          extraIncomeNote: '',
          paidFixedIds: [],
          variableExpenses: [],
          notepad: '',
          observations: []
        };
      }
      months[o.mes_ano].observations.push(obsObj);
    }
  }

  return {
    isEmptyDatabase: !hasInitializedRow,
    state: {
      defaultSalary: configRow ? Number(configRow.valor) || 0 : 0,
      fixedExpenses,
      pinnedObservations,
      months
    }
  };
}

/**
 * Grava todo o estado de forma transacional no banco SQLite + espelho JSON
 */
function writeStateToSQLite(newState, userMeta = {}) {
  const nowISO = new Date().toISOString();
  const cleanEmail = String(userMeta.userEmail || '').trim().toLowerCase();

  db.exec('BEGIN IMMEDIATE TRANSACTION');
  try {
    if (cleanEmail) {
      const upsertUser = db.prepare(`
        INSERT INTO usuarios_estado (email, nome, foto, estado_json, atualizado_em)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          nome = excluded.nome,
          foto = excluded.foto,
          estado_json = excluded.estado_json,
          atualizado_em = excluded.atualizado_em
      `);
      upsertUser.run(
        cleanEmail,
        String(userMeta.userName || ''),
        String(userMeta.userPicture || ''),
        JSON.stringify(newState || {}),
        nowISO
      );
    }

    const upsertConfig = db.prepare(`
      INSERT INTO configuracoes (chave, valor, atualizado_em)
      VALUES (?, ?, ?)
      ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizado_em = excluded.atualizado_em
    `);

    upsertConfig.run('defaultSalary', String(Number(newState.defaultSalary) || 0), nowISO);
    upsertConfig.run('initialized', '1', nowISO);
    upsertConfig.run('lastSavedAt', nowISO, nowISO);

    // Atualiza gastos_fixos
    db.exec('DELETE FROM gastos_fixos');
    const insertFixed = db.prepare(`
      INSERT INTO gastos_fixos (id, nome, valor, dia_vencimento, categoria, metodo_pagamento, observacao, icone, ativo, criado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of newState.fixedExpenses || []) {
      insertFixed.run(
        String(item.id),
        String(item.name || ''),
        Number(item.amount) || 0,
        Number(item.day) || 10,
        String(item.category || ''),
        String(item.method || ''),
        String(item.note || ''),
        String(item.iconKey || ''),
        item.active === false ? 0 : 1,
        nowISO
      );
    }

    // Atualiza meses_resumo, entradas_mes, gastos_variaveis e observacoes
    db.exec('DELETE FROM meses_resumo');
    db.exec('DELETE FROM entradas_mes');
    db.exec('DELETE FROM gastos_variaveis');
    db.exec('DELETE FROM observacoes');

    const insertMonth = db.prepare(`
      INSERT INTO meses_resumo (mes_ano, salario_especifico, renda_extra, observacao_renda, bloco_notas, fixos_pagos_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertIncome = db.prepare(`
      INSERT INTO entradas_mes (id, mes_ano, nome, valor, data_entrada, observacao, criado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertVar = db.prepare(`
      INSERT INTO gastos_variaveis (id, mes_ano, nome, valor, data_gasto, categoria, metodo_pagamento, observacao, icone, criado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertObs = db.prepare(`
      INSERT INTO observacoes (id, mes_ano, tipo_tag, texto, fixada_todos_meses, criado_em)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const obs of newState.pinnedObservations || []) {
      insertObs.run(
        String(obs.id),
        String(obs.createdAt || ''),
        String(obs.tag || 'Lembrete'),
        String(obs.text || ''),
        1,
        nowISO
      );
    }

    const monthsObj = newState.months && typeof newState.months === 'object' ? newState.months : {};
    for (const [monthKey, bucket] of Object.entries(monthsObj)) {
      if (!bucket || typeof bucket !== 'object') continue;

      const salOverride =
        bucket.salaryOverride !== null && bucket.salaryOverride !== undefined && bucket.salaryOverride !== ''
          ? Number(bucket.salaryOverride)
          : null;

      insertMonth.run(
        monthKey,
        salOverride,
        Number(bucket.extraIncome) || 0,
        String(bucket.extraIncomeNote || ''),
        String(bucket.notepad || ''),
        JSON.stringify(Array.isArray(bucket.paidFixedIds) ? bucket.paidFixedIds : [])
      );

      for (const inc of bucket.incomes || []) {
        insertIncome.run(
          String(inc.id),
          monthKey,
          String(inc.name || ''),
          Number(inc.amount) || 0,
          String(inc.date || `${monthKey}-05`),
          String(inc.note || ''),
          nowISO
        );
      }

      for (const v of bucket.variableExpenses || []) {
        insertVar.run(
          String(v.id),
          monthKey,
          String(v.name || ''),
          Number(v.amount) || 0,
          String(v.date || `${monthKey}-01`),
          String(v.category || 'Outros'),
          String(v.method || 'PIX'),
          String(v.note || ''),
          String(v.iconKey || ''),
          nowISO
        );
      }

      for (const o of bucket.observations || []) {
        insertObs.run(
          String(o.id),
          monthKey,
          String(o.tag || 'Lembrete'),
          String(o.text || ''),
          0,
          nowISO
        );
      }
    }

    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  // Salva também um espelho JSON legível no disco
  try {
    fs.writeFileSync(JSON_MIRROR_PATH, JSON.stringify(newState, null, 2), 'utf-8');
  } catch (e) {
    console.error('Aviso ao gravar espelho JSON:', e.message);
  }

  return getDatabaseStats();
}

function getDatabaseStats() {
  const fixedCount = db.prepare(`SELECT COUNT(*) AS total FROM gastos_fixos`).get().total;
  const varCount = db.prepare(`SELECT COUNT(*) AS total FROM gastos_variaveis`).get().total;
  const obsCount = db.prepare(`SELECT COUNT(*) AS total FROM observacoes`).get().total;
  const lastSaved = db.prepare(`SELECT valor FROM configuracoes WHERE chave = 'lastSavedAt'`).get();

  let fileSizeKB = 0;
  try {
    const st = fs.statSync(DB_PATH);
    fileSizeKB = Math.round(st.size / 1024);
  } catch {}

  return {
    dbFile: DB_PATH,
    jsonMirror: JSON_MIRROR_PATH,
    fixedCount,
    variableCount: varCount,
    observationsCount: obsCount,
    totalRecords: fixedCount + varCount + obsCount,
    fileSizeKB,
    lastSavedAt: lastSaved ? lastSaved.valor : new Date().toISOString()
  };
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers para funcionar tanto em http://localhost:3333 quanto clicando direto no index.html (file://)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // API: Status do Banco
  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, stats: getDatabaseStats() }));
    return;
  }

  // API: Ler Estado Completo do Banco SQLite
  if (pathname === '/api/state' && req.method === 'GET') {
    try {
      const userParam = parsedUrl.searchParams.get('user') || '';
      const payload = readStateFromSQLite(userParam);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, ...payload, stats: getDatabaseStats() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  // API: Salvar Estado Completo no Banco SQLite
  if (pathname === '/api/state' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const stateToSave = parsed.state || parsed;
        const stats = writeStateToSQLite(stateToSave, {
          userEmail: parsed.userEmail || '',
          userName: parsed.userName || '',
          userPicture: parsed.userPicture || ''
        });
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, stats }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // Arquivos Estáticos do Site
  let filePath = pathname === '/' ? path.join(ROOT_DIR, 'index.html') : path.join(ROOT_DIR, pathname);
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Acesso negado');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Arquivo não encontrado');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('====================================================');
  console.log(' MEU CAIXA — BANCO DE DADOS SQLITE ATIVO');
  console.log(` Banco SQLite: ${DB_PATH}`);
  console.log(` Acesse no navegador: http://localhost:${PORT}`);
  console.log('====================================================');
});
