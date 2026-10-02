require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TESTS_DIR = 'e2e/GPP-API-Tests/Testes Homologação';
const TESTS_PATH = path.join(__dirname, TESTS_DIR);
const REPORT_FILE = path.join(__dirname, 'cypress', 'reports', 'mochawesome.json');
const HISTORY_FILE = path.join(__dirname, 'history.json');
const HISTORY_LIMIT = 50;

const app = express();
app.use(express.static('public'));
app.use(express.json());

function readJson(file, fallback) {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

function listSpecs() {
    return fs.readdirSync(TESTS_PATH, { recursive: true })
        .filter(f => f.endsWith('.cy.js'))
        .map(f => f.replace(/\\/g, '/'));
}

function buildSpecPattern(specs) {
    // Múltiplas specs são agrupadas em glob: {spec1,spec2}
    const target = specs.length === 1 ? specs[0] : `{${specs.join(',')}}`;
    return `${TESTS_DIR}/${target}`;
}

function saveToHistory(report) {
    const history = readJson(HISTORY_FILE, []);
    history.unshift({
        date: new Date().toLocaleString('pt-BR'),
        stats: report.stats,
        results: report.results
    });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, HISTORY_LIMIT), null, 2));
}

// Listar arquivos para a tela de seleção
app.get('/api/tests', (req, res) => {
    if (!fs.existsSync(TESTS_PATH)) {
        return res.status(404).json({ error: `Diretório não encontrado: ${TESTS_PATH}` });
    }
    try {
        res.json(listSpecs());
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar testes', details: err.message });
    }
});

// Rodar testes via Cypress CLI
app.post('/api/run', (req, res) => {
    const { specs } = req.body;

    if (!Array.isArray(specs) || specs.length === 0) {
        return res.status(400).json({ error: 'Nenhuma spec selecionada.' });
    }

    // Só aceita specs existentes, evitando injeção de comandos no shell
    const available = new Set(listSpecs());
    const invalid = specs.filter(spec => !available.has(spec));
    if (invalid.length > 0) {
        return res.status(400).json({ error: 'Specs inválidas.', invalid });
    }

    const command = `npx cypress run --spec "${buildSpecPattern(specs)}" --reporter cypress-mochawesome-reporter`;

    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
        if (!fs.existsSync(REPORT_FILE)) {
            console.error('Cypress Output:', stdout);
            return res.status(500).json({ error: 'Relatório não gerado após a execução.', stdout, stderr });
        }

        try {
            const report = readJson(REPORT_FILE);
            saveToHistory(report);
            res.json(report);
        } catch (parseError) {
            res.status(500).json({ error: 'Erro ao ler relatório', details: parseError.message });
        }
    });
});

// Histórico de execuções
app.get('/api/history', (req, res) => {
    res.json(readJson(HISTORY_FILE, []));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
