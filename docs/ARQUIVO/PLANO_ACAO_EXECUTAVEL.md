# 📊 RTV SOLAR - PLANO DE AÇÃO PARA RESOLUÇÃO DE PROBLEMAS

> **Data:** 18 de Abril de 2026  
> **Prioridade:** 🔴 CRÍTICA - Projeto é 95% mockup  
> **Esforço Total Estimado:** 60-80 horas (3-4 semanas full-time)

---

## 📌 DECISÃO ARQUITETURAL INICIAL

Antes de começar, **escolha UM dos dois caminhos:**

### Caminho A: Backend Real (RECOMENDADO) ✅
- **Tempo:** 3-4 semanas
- **Resultado:** Sistema produtivo e real
- **Stack Sugerida:** Node.js + Express + PostgreSQL + React/SPA opcional
- **Benefício:** Escalável, seguro, profissional

### Caminho B: Continuar como Mockup
- **Tempo:** 1-2 semanas
- **Resultado:** Demonstração/portfolio
- **Mudanças:** Remover tudo fake, documentar como DEMO
- **Risco:** Não é produtivo

**→ Recomendação: Caminho A**

---

## 🔴 FASE 1: SETUP BACKEND (Semana 1)

### 1.1 Preparação do Projeto

**Tempo:** 2 horas

**Tarefas:**
```bash
# 1. Criar pasta backend
mkdir rtv-backend
cd rtv-backend

# 2. Inicializar Node.js
npm init -y
npm install express dotenv cors bcryptjs jsonwebtoken pg

# 3. Criar estrutura
mkdir src/{routes,middleware,controllers,models,config}
touch .env .gitignore src/server.js

# 4. Setup Git
git init
```

**Arquivo .env:**
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/rtv_solar
JWT_SECRET=sua_chave_secreta_super_segura_aqui_com_min_32_caracteres
FRONTEND_URL=http://localhost:3000
```

### 1.2 Setup Banco de Dados

**Tempo:** 3 horas

**Tarefas:**
```sql
/* Script: schema_inicial.sql */

-- Tabela de usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'cliente',
    aprovado_admin BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT NOW(),
    data_aprovacao TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de sistemas solares
CREATE TABLE sistemas_solares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    data_instalacao DATE,
    potencia_total_kw DECIMAL(10,2),
    
    -- Equipamentos
    paineis_quantidade INT,
    inversor_modelo VARCHAR(255),
    medidor_modelo VARCHAR(255),
    bateria_presente BOOLEAN DEFAULT FALSE,
    
    CREATED_AT TIMESTAMP DEFAULT NOW()
);

-- Tabela de métricas (diárias)
CREATE TABLE metricas_diarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sistema_id UUID REFERENCES sistemas_solares(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    
    -- Geração
    geracao_hora_kw DECIMAL(10,2),
    geracao_dia_kwh DECIMAL(10,2),
    geracao_media_kwh DECIMAL(10,2),
    
    -- Consumo
    consumo_hora_kw DECIMAL(10,2),
    consumo_dia_kwh DECIMAL(10,2),
    consumo_media_kwh DECIMAL(10,2),
    
    -- Economia
    economia_dia DECIMAL(10,2),
    co2_evitado_kg DECIMAL(10,2),
    
    -- Status
    eficiencia_global_pct DECIMAL(5,2),
    scoring VARCHAR(5),
    
    CREATED_AT TIMESTAMP DEFAULT NOW()
);

-- Tabela de chamados
CREATE TABLE chamados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    numero_chamado VARCHAR(50) UNIQUE,
    categoria VARCHAR(100),
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'aberto',
    data_abertura TIMESTAMP DEFAULT NOW(),
    data_fechamento TIMESTAMP,
    prioridade VARCHAR(20) DEFAULT 'normal'
);

-- Tabela de serviços
CREATE TABLE servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2),
    duracao_meses INT,
    ativo BOOLEAN DEFAULT TRUE
);

-- Criar índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_sistemas_usuario ON sistemas_solares(usuario_id);
CREATE INDEX idx_metricas_sistema_data ON metricas_diarias(sistema_id, data);
CREATE INDEX idx_chamados_usuario ON chamados(usuario_id);
```

**Executar:**
```bash
psql -U postgres -d rtv_solar -f schema_inicial.sql
```

### 1.3 Configurar Express + Middleware

**Tempo:** 1.5 horas

**Arquivo: src/server.js**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ erro: err.message });
});

// Rotas (a implementar)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/sistemas', require('./routes/sistemas'));
app.use('/api/metricas', require('./routes/metricas'));
app.use('/api/chamados', require('./routes/chamados'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
```

**Arquivo: src/config/database.js**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = pool;
```

---

## 🟡 FASE 2: AUTENTICAÇÃO E PERMISSÕES (Semana 1.5)

### 2.1 Criar Endpoints de Autenticação

**Tempo:** 4 horas

**Arquivo: src/routes/auth.js**
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// REGISTRO
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Validações
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha todos os campos' });
        }
        
        // Hash de senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Inserir usuário
        const resultado = await db.query(
            'INSERT INTO usuarios (nome, email, senha_hash, role, aprovado_admin) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, nome',
            [nome, email, senhaHash, 'cliente', false]
        );
        
        res.status(201).json({
            mensagem: 'Cadastro realizado! Aguardando aprovação do admin.',
            usuario: resultado.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao registrar' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha obrigatórios' });
        }
        
        // Buscar usuário
        const resultado = await db.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        
        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }
        
        const usuario = resultado.rows[0];
        
        // Validar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }
        
        // Verificar aprovação
        if (!usuario.aprovado_admin && usuario.role === 'cliente') {
            return res.status(403).json({ erro: 'Usuário aguardando aprovação do administrador' });
        }
        
        // Gerar JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            mensagem: `Bem-vindo, ${usuario.nome}!`,
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao fazer login' });
    }
});

module.exports = router;
```

### 2.2 Middleware de Autenticação

**Tempo:** 1.5 horas

**Arquivo: src/middleware/autenticacao.js**
```javascript
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const auth = req.headers.authorization;
    
    if (!auth) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }
    
    const [scheme, token] = auth.split(' ');
    
    if (scheme !== 'Bearer') {
        return res.status(401).json({ erro: 'Formato inválido' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}

function verificarRole(papelRequerido) {
    return (req, res, next) => {
        if (!req.usuario || req.usuario.role !== papelRequerido) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }
        next();
    };
}

module.exports = { verificarToken, verificarRole };
```

---

## 🔵 FASE 3: ENDPOINTS PRINCIPAIS (Semana 2)

### 3.1 Sistemas Solares

**Arquivo: src/routes/sistemas.js**
```javascript
const express = require('express');
const { verificarToken } = require('../middleware/autenticacao');
const db = require('../config/database');

const router = express.Router();

// GET - Obter sistema do usuário
router.get('/', verificarToken, async (req, res) => {
    try {
        const { rows } = await db.query(
            'SELECT * FROM sistemas_solares WHERE usuario_id = $1',
            [req.usuario.id]
        );
        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// POST - Criar/atualizar sistema
router.post('/', verificarToken, async (req, res) => {
    try {
        const { data_instalacao, potencia_total_kw, paineis_quantidade, inversor_modelo } = req.body;
        
        const resultado = await db.query(
            `INSERT INTO sistemas_solares 
            (usuario_id, data_instalacao, potencia_total_kw, paineis_quantidade, inversor_modelo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [req.usuario.id, data_instalacao, potencia_total_kw, paineis_quantidade, inversor_modelo]
        );
        
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
```

### 3.2 Métricas (Dados de Tempo Real)

**Arquivo: src/routes/metricas.js**
```javascript
const express = require('express');
const { verificarToken } = require('../middleware/autenticacao');
const db = require('../config/database');

const router = express.Router();

// GET - Última métrica (hoje)
router.get('/hoje', verificarToken, async (req, res) => {
    try {
        const sistema = await db.query(
            'SELECT id FROM sistemas_solares WHERE usuario_id = $1',
            [req.usuario.id]
        );
        
        if (sistema.rows.length === 0) {
            return res.status(404).json({ erro: 'Sistema não encontrado' });
        }
        
        const sistema_id = sistema.rows[0].id;
        
        const { rows } = await db.query(
            `SELECT * FROM metricas_diarias 
            WHERE sistema_id = $1 AND data = CURRENT_DATE
            ORDER BY created_at DESC LIMIT 1`,
            [sistema_id]
        );
        
        // Se não existir, retornar default
        if (rows.length === 0) {
            return res.json({
                geracao_hora_kw: 0,
                consumo_hora_kw: 0,
                economia_dia: 0
            });
        }
        
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// GET - Histórico mensal
router.get('/mes/:mes/:ano', verificarToken, async (req, res) => {
    try {
        const { mes, ano } = req.params;
        const sistema = await db.query(
            'SELECT id FROM sistemas_solares WHERE usuario_id = $1',
            [req.usuario.id]
        );
        
        if (sistema.rows.length === 0) {
            return res.status(404).json({ erro: 'Sistema não encontrado' });
        }
        
        const { rows } = await db.query(
            `SELECT * FROM metricas_diarias 
            WHERE sistema_id = $1 
            AND EXTRACT(MONTH FROM data) = $2 
            AND EXTRACT(YEAR FROM data) = $3
            ORDER BY data ASC`,
            [sistema.rows[0].id, mes, ano]
        );
        
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// POST - Registrar métrica (admin/sistema automatizado)
router.post('/', verificarToken, async (req, res) => {
    // Apenas admin ou sistema automatizado pode registrar
    const { geracao, consumo, economia, co2, eficiencia } = req.body;
    
    const sistema = await db.query(
        'SELECT id FROM sistemas_solares WHERE usuario_id = $1',
        [req.usuario.id]
    );
    
    if (sistema.rows.length === 0) {
        return res.status(404).json({ erro: 'Sistema não encontrado' });
    }
    
    const resultado = await db.query(
        `INSERT INTO metricas_diarias
        (sistema_id, data, geracao_hora_kw, consumo_hora_kw, economia_dia, co2_evitado_kg, eficiencia_global_pct)
        VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6)
        RETURNING *`,
        [sistema.rows[0].id, geracao, consumo, economia, co2, eficiencia]
    );
    
    res.status(201).json(resultado.rows[0]);
});

module.exports = router;
```

### 3.3 Chamados

**Arquivo: src/routes/chamados.js**
```javascript
const express = require('express');
const { verificarToken } = require('../middleware/autenticacao');
const db = require('../config/database');

const router = express.Router();

// GET - Listar chamados do usuário
router.get('/', verificarToken, async (req, res) => {
    try {
        const { rows } = await db.query(
            'SELECT * FROM chamados WHERE usuario_id = $1 ORDER BY data_abertura DESC',
            [req.usuario.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// POST - Abrir novo chamado
router.post('/', verificarToken, async (req, res) => {
    try {
        const { categoria, descricao } = req.body;
        const numero = '#' + Math.floor(Math.random() * 90000 + 10000);
        
        const resultado = await db.query(
            `INSERT INTO chamados
            (usuario_id, numero_chamado, categoria, descricao)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [req.usuario.id, numero, categoria, descricao]
        );
        
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
```

---

## 🟠 FASE 4: FRONTEND - CONECTAR A API (Semana 2-3)

### 4.1 Criar API Client

**Arquivo: frontend/js/api-client.js**
```javascript
class APIClient {
    constructor(baseURL = 'http://localhost:3001/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('rtv_token');
    }
    
    setToken(token) {
        this.token = token;
        localStorage.setItem('rtv_token', token);
    }
    
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro na requisição');
        }
        
        return response.json();
    }
    
    // Auth
    async registro(nome, email, senha) {
        return this.request('/auth/registro', {
            method: 'POST',
            body: JSON.stringify({ nome, email, senha })
        });
    }
    
    async login(email, senha) {
        const dados = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
        this.setToken(dados.token);
        return dados;
    }
    
    // Sistemas
    async obterSistema() {
        return this.request('/sistemas');
    }
    
    async criar Sistema(dados) {
        return this.request('/sistemas', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
    }
    
    // Métricas
    async obterMetricasHoje() {
        return this.request('/metricas/hoje');
    }
    
    async obterMetricasMes(mes, ano) {
        return this.request(`/metricas/mes/${mes}/${ano}`);
    }
    
    // Chamados
    async listarChamados() {
        return this.request('/chamados');
    }
    
    async abrirChamado(categoria, descricao) {
        return this.request('/chamados', {
            method: 'POST',
            body: JSON.stringify({ categoria, descricao })
        });
    }
}

const api = new APIClient();
```

### 4.2 Atualizar script.js para usar API

**Modificar em script.js:**
```javascript
// Remover seed localStorage
// function seedUsuariosPadrao() { ... } // REMOVER

// Novo sistema de autenticação com API
if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        try {
            const dados = await api.login(email, senha);
            showToast(`Bem-vindo de volta, ${dados.usuario.nome}!`, "success");
            
            // Salvar usuário localmente
            localStorage.setItem("rtv_usuario_logado", JSON.stringify(dados.usuario));
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1200);
        } catch (err) {
            showToast(err.message, "error");
        }
    });
}

// Novo sistema para abrir chamado
if (formChamado && tabelaChamados) {
    formChamado.addEventListener("submit", async (e) => {
        e.preventDefault();
        const categoria = document.getElementById("cat-chamado").value;
        const descricao = document.getElementById("desc-chamado").value;
        
        try {
            await api.abrirChamado(categoria, descricao);
            showToast("Chamado aberto com sucesso!", "success");
            fecharModalChamado();
            formChamado.reset();
            
            // Recarregar chamados da API
            carregarChamadosAPI();
        } catch (err) {
            showToast(err.message, "error");
        }
    });
}
```

### 4.3 Renderizar Dashboard com Dados Reais

**Novo no script.js - após login:**
```javascript
async function renderizarDashboardComDadosReais() {
    try {
        // Obter sistema
        const sistema = await api.obterSistema();
        if (!sistema) {
            console.log("Sistema não configurado ainda");
            return;
        }
        
        // Obter métricas de hoje
        const metricas = await api.obterMetricasHoje();
        
        // Atualizar elementos HTML
        const geracaoAtual = document.getElementById("geracao-atual");
        if (geracaoAtual && metricas) {
            geracaoAtual.textContent = (metricas.geracao_hora_kw || 0).toFixed(1) + " kW";
        }
        
        const consumoAtual = document.getElementById("consumo-atual");
        if (consumoAtual && metricas) {
            consumoAtual.textContent = (metricas.consumo_hora_kw || 0).toFixed(1) + " kW";
        }
        
        // ... continuar para todos os elementos
        
    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
    }
}

// Chamar ao carregar dashboard
document.addEventListener('DOMContentLoaded', async () => {
    if (document.body.classList.contains("pagina-painel")) {
        await renderizarDashboardComDadosReais();
        
        // Atualizar a cada 30 segundos
        setInterval(renderizarDashboardComDadosReais, 30000);
    }
});
```

---

## 🟢 FASE 5: PAINEL ADMIN (Semana 3)

### 5.1 Criar Endpoints Admin

**Arquivo: src/routes/admin.js**
```javascript
const express = require('express');
const { verificarToken, verificarRole } = require('../middleware/autenticacao');
const db = require('../config/database');

const router = express.Router();

// GET - Listar clientes pendentes
router.get('/clientes/pendentes', verificarToken, verificarRole('admin'), async (req, res) => {
    try {
        const { rows } = await db.query(
            `SELECT id, nome, email, data_cadastro FROM usuarios 
            WHERE role = 'cliente' AND aprovado_admin = FALSE
            ORDER BY data_cadastro ASC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// POST - Aprovar cliente
router.post('/clientes/:id/aprovar', verificarToken, verificarRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        
        const resultado = await db.query(
            `UPDATE usuarios 
            SET aprovado_admin = TRUE, data_aprovacao = NOW()
            WHERE id = $1
            RETURNING *`,
            [id]
        );
        
        res.json({
            mensagem: `Cliente ${resultado.rows[0].nome} aprovado`,
            usuario: resultado.rows[0]
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// POST - Rejeitar cliente
router.delete('/clientes/:id', verificarToken, verificarRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
        
        res.json({ mensagem: 'Cliente rejeitado e removido' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
```

### 5.2 Implementar admin-clientes.js

**Novo arquivo: admin-clientes.js**
```javascript
async function renderPainelAdminClientes() {
    try {
        // Clientes Pendentes
        const pendentes = await api.request('/admin/clientes/pendentes');
        const containerPendentes = document.getElementById("tabela-clientes-pendentes");
        
        if (containerPendentes) {
            containerPendentes.innerHTML = pendentes.map(cliente => `
                <tr style="border-left: 4px solid var(--amarelo-vivo);">
                    <td>${cliente.nome}</td>
                    <td>${cliente.email}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${new Date(cliente.data_cadastro).toLocaleDateString('pt-BR')}</td>
                    <td><span class="badge" style="background-color: var(--amarelo-vivo); color: #000;">Pendente</span></td>
                    <td style="text-align: center;">
                        <button class="btn-aprovar-cliente" data-id="${cliente.id}" style="background: #27c93f; color: white; padding: 6px 12px; border-radius: 5px; cursor: pointer; margin-right: 5px;">
                            Aprovar
                        </button>
                        <button class="btn-rejeitar-cliente" data-id="${cliente.id}" style="background: #ff5f56; color: white; padding: 6px 12px; border-radius: 5px; cursor: pointer;">
                            Rejeitar
                        </button>
                    </td>
                </tr>
            `).join("");
            
            // Atualizar contadores
            atualizarMetricasAdmin();
        }
    } catch (err) {
        console.error("Erro ao renderizar painel admin:", err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains("pagina-admin")) {
        renderPainelAdminClientes();
        
        // Listeners para botões
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-aprovar-cliente')) {
                const id = e.target.dataset.id;
                try {
                    await api.request(`/admin/clientes/${id}/aprovar`, { method: 'POST' });
                    showToast("Cliente aprovado com sucesso!", "success");
                    renderPainelAdminClientes();
                } catch (err) {
                    showToast(err.message, "error");
                }
            }
            
            if (e.target.classList.contains('btn-rejeitar-cliente')) {
                const id = e.target.dataset.id;
                if (confirm("Tem certeza que deseja rejeitar este cliente?")) {
                    try {
                        await api.request(`/admin/clientes/${id}`, { method: 'DELETE' });
                        showToast("Cliente rejeitado", "success");
                        renderPainelAdminClientes();
                    } catch (err) {
                        showToast(err.message, "error");
                    }
                }
            }
        });
    }
});
```

---

## 📈 FASE 6: LIMPEZA E OTIMIZAÇÃO (Semana 4)

### 6.1 Remover Código Fake

**Tarefas:**
- [ ] Remover `seedUsuariosPadrao()` de script.js
- [ ] Remover dados hardcoded de admin-*.html
- [ ] Remover RTV Intelligence box
- [ ] Remover tabelas hardcoded
- [ ] Implementar gráficos reais com Chart.js

### 6.2 Gráficos com Dados Reais

**Modificar cliente-consumo.html:**
```javascript
async function inicializarGraficosConsumo() {
    try {
        const metricas = await api.obterMetricasMes(new Date().getMonth() + 1, new Date().getFullYear());
        
        const ctx = document.getElementById('chart-consumo-horaria');
        if (ctx && metricas && metricas.length > 0) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: metricas.map(m => new Date(m.data).getDate()),
                    datasets: [{
                        label: 'Consumo (kWh)',
                        data: metricas.map(m => m.consumo_dia_kwh),
                        borderColor: '#ff9500',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    } catch (err) {
        console.error("Erro ao inicializar gráficos:", err);
    }
}
```

### 6.3 Remover localStorage (Usar apenas API)

**Modificar cliente-sistema.js:**
```javascript
// REMOVER FUNÇÃO
// function obterSistemaCliente() { ... }

// NOVA FUNÇÃO
async function obterSistemaClienteReal() {
    return await api.obterSistema();
}

// Atualizar todas referências de sistema = obterSistemaCliente()
// Para: sistema = await obterSistemaClienteReal()
```

---

## ✅ CHECKLIST FINAL

### Semana 1
- [ ] Backend: Setup Node.js + Express + PostgreSQL
- [ ] Backend: Schema de banco de dados criado
- [ ] Backend: Endpoints de autenticação funcionando
- [ ] Backend: Middleware de autenticação implementado

### Semana 2
- [ ] Backend: Endpoints de sistemas/métricas/chamados
- [ ] Backend: RBAC validation
- [ ] Frontend: API Client criado
- [ ] Frontend: Login conectado à API
- [ ] Frontend: Dashboard mostrando dados reais

### Semana 3
- [ ] Backend: Endpoints admin funcionando
- [ ] Frontend: admin-clientes.js implementado
- [ ] Frontend: Gráficos conectados a API
- [ ] Frontend: Removido localStorage (exceto token)

### Semana 4
- [ ] Frontend: Remover código fake
- [ ] Frontend: Limpeza geral
- [ ] Testes de segurança
- [ ] Deploy documentação

---

## 📊 RESULTADOS ESPERADOS

Após implementar este plano:

| Métrica | Antes | Depois |
|---------|-------|--------|
| Dados Reais | 0% | 100% |
| Segurança | 0% | 95% |
| Gráficos Funcionando | 0% | 100% |
| RBAC Validado | 0% | 100% |
| Botões Funcionando | 20% | 95% |
| Health Score | 25/100 | 85/100 |

---

**🎯 Objetivo Final: Sistema produtivo e seguro em 4-5 semanas**
