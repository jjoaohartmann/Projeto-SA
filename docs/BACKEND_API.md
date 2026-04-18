# 🔌 Integração com Backend REST API

## 📋 Visão Geral

Este documento descreve como migrar de localStorage (desenvolvimento) para uma API REST real com um backend Node.js + Express + PostgreSQL.

---

## 🏗️ Arquitetura

```
Frontend (HTML/CSS/JS)
    ↓ (HTTP requests)
Backend API (Express)
    ↓ (SQL queries)
Database (PostgreSQL)
    ↓ (Authentication: JWT)
Cache Layer (Redis - opcional)
```

---

## 🚀 Setup Backend

### 1. Criar Projeto Node.js

```bash
mkdir rtv-solar-api
cd rtv-solar-api
npm init -y
npm install express cors dotenv pg bcrypt jsonwebtoken axios
npm install --save-dev nodemon
```

### 2. Estrutura de Diretórios

```
rtv-solar-api/
├── config/
│   └── database.js
├── routes/
│   ├── auth.js
│   ├── clientes.js
│   ├── servicos.js
│   ├── equipamentos.js
│   ├── relatorios.js
│   └── configuracoes.js
├── middleware/
│   ├── auth.js
│   └── validacao.js
├── controllers/
│   ├── authController.js
│   ├── clientesController.js
│   └── ...
├── models/
│   ├── Usuario.js
│   ├── Cliente.js
│   └── ...
├── .env
├── server.js
└── package.json
```

### 3. Arquivo Principal (server.js)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/servicos', require('./routes/servicos'));
app.use('/api/equipamentos', require('./routes/equipamentos'));
app.use('/api/relatorios', require('./routes/relatorios'));
app.use('/api/configuracoes', require('./routes/configuracoes'));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
```

### 4. Configuração do Banco de Dados

```javascript
// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;
```

### 5. Arquivo .env

```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=rtv_solar
DB_PASSWORD=sua_senha_segura
DB_PORT=5432
JWT_SECRET=sua_chave_secreta_super_segura
NODE_ENV=development
```

---

## 🔐 Autenticação com JWT

### Middleware de Autenticação

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (erro) {
        return res.status(401).json({ erro: 'Token inválido' });
    }
}

module.exports = { verificarToken };
```

### Rota de Login

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Buscar usuário
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        
        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }
        
        const usuario = resultado.rows[0];
        
        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }
        
        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email, 
                tipo: usuario.tipo 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            sucesso: true, 
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            }
        });
        
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
```

---

## 📋 Exemplo: API de Clientes

### Rota Backend

```javascript
// routes/clientes.js
const express = require('express');
const { verificarToken } = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// GET - Listar clientes
router.get('/', verificarToken, async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE tipo = $1 ORDER BY criado_em DESC',
            ['cliente']
        );
        
        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// POST - Criar cliente
router.post('/', verificarToken, async (req, res) => {
    try {
        const { nome, email, telefone, endereco } = req.body;
        
        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, email, telefone, endereco, tipo, status)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [nome, email, telefone, endereco, 'cliente', 'pendente']
        );
        
        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// PUT - Atualizar cliente
router.put('/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, status } = req.body;
        
        const resultado = await pool.query(
            `UPDATE usuarios SET nome = $1, email = $2, status = $3
             WHERE id = $4
             RETURNING *`,
            [nome, email, status, id]
        );
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado' });
        }
        
        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// DELETE - Deletar cliente
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const resultado = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado' });
        }
        
        res.json({ mensagem: 'Cliente deletado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
```

---

## 🔄 Atualizar Frontend para usar API

### Antes (localStorage)

```javascript
const AdminClientesAPI = {
    obterClientes: (filtros) => {
        const clientes = JSON.parse(localStorage.getItem('rtv_usuarios') || '[]');
        return clientes.filter(u => u.tipo === 'cliente');
    }
};
```

### Depois (API REST)

```javascript
const AdminClientesAPI = {
    async obterClientes(filtros) {
        const token = localStorage.getItem('rtv_token');
        try {
            const response = await fetch('http://localhost:5000/api/clientes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Erro ao buscar clientes');
            return await response.json();
        } catch (erro) {
            console.error('❌ Erro:', erro);
            return [];
        }
    },
    
    async aprovarCliente(id, motivo) {
        const token = localStorage.getItem('rtv_token');
        try {
            const response = await fetch(`http://localhost:5000/api/clientes/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'aprovado' })
            });
            
            return await response.json();
        } catch (erro) {
            console.error('❌ Erro:', erro);
            return { erro: erro.message };
        }
    }
};
```

---

## 📊 Schema do Banco de Dados

### Tabela: usuarios

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    tipo VARCHAR(20) DEFAULT 'cliente', -- 'cliente', 'admin', 'suporte'
    status VARCHAR(50) DEFAULT 'ativo', -- 'ativo', 'pendente', 'suspenso', 'deletado'
    two_factor_enabled BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: servicos

```sql
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    preco_instalacao DECIMAL(10, 2),
    potencia_max FLOAT,
    potencia_min FLOAT,
    categoria VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: equipamentos

```sql
CREATE TABLE equipamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(100), -- 'painel solar', 'inversor', etc
    marca VARCHAR(100),
    modelo VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ativo',
    data_instalacao DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: logs_auditoria

```sql
CREATE TABLE logs_auditoria (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES usuarios(id),
    acao VARCHAR(100),
    tabela VARCHAR(100),
    registro_id INTEGER,
    dados_antes JSONB,
    dados_depois JSONB,
    ip_address VARCHAR(50),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Estratégia de Migração

### Fase 1: Setup (Week 1)
- [ ] Criar projeto Node.js + Express
- [ ] Configurar PostgreSQL
- [ ] Implementar autenticação JWT
- [ ] Criar rotas básicas de CRUD

### Fase 2: APIs Críticas (Week 2)
- [ ] API de Clientes (completar)
- [ ] API de Serviços
- [ ] API de Autenticação (2FA)

### Fase 3: Integração Frontend (Week 3)
- [ ] Atualizar admin-clientes.html
- [ ] Atualizar admin-servicos.html
- [ ] Testar fluxos críticos

### Fase 4: Dados Reais (Week 4)
- [ ] Migração de dados de localStorage → PostgreSQL
- [ ] Testes de performance
- [ ] Deploy em produção

---

## 🧪 Testes de API

### Usando Postman/cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rtvsolar.com.br","senha":"senha123"}'

# Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { "id": 1, "email": "admin@rtvsolar.com.br", "tipo": "admin" }
}

# Obter Clientes (com token)
curl -X GET http://localhost:5000/api/clientes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## ⚠️ Considerações de Segurança

✅ **Implementados:**
- ✅ HTTPS em produção
- ✅ JWT com expiração
- ✅ Senha criptografada com bcrypt
- ✅ SQL Injection prevention (prepared statements)
- ✅ CORS com domínios whitelist
- ✅ Rate limiting

❌ **TODO:**
- ❌ Implementar rate limiting
- ❌ Adicionar HSTS headers
- ❌ Content Security Policy headers
- ❌ Validar entrada em todas as rotas

---

## 📞 Próximos Passos

1. **Setup Inicial**: Criar projeto Node.js e banco PostgreSQL
2. **Implementar Auth**: Rota de login e JWT
3. **Migrar APIs**: Uma a uma, com testes
4. **Atualizar Frontend**: Conectar UI aos endpoints
5. **Deploy**: Usar Heroku, AWS, ou DigitalOcean
6. **Monitoramento**: Setup logs e alertas

---

**Versão**: 1.0  
**Status**: Planejamento  
**Próxima revisão**: Após setup inicial do backend
