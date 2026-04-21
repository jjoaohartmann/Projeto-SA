# 🚀 Backend Roadmap - Implementação Completa

**Versão**: 1.0 | **Data**: 19/04/2026 | **Status**: 🗺️ Planejamento

---

## 🎯 Visão Geral

Este documento guia a implementação do backend para RTV Solar. Sem backend, o sistema funcionava com `localStorage` apenas nos navegadores.

**Timeline estimada**: 2-4 semanas para produção  
**Tech Stack recomendado**: Node.js/Express + PostgreSQL  
**Alternativa**: Python/Django ou Python/FastAPI

---

## 📊 Fases de Implementação

### Fase 1: Setup Básico (1-2 dias)

#### 1.1 Provisionar Servidor
```bash
# Opções:
# - Heroku (rápido, fácil)
# - DigitalOcean (barato, controle)
# - AWS (escalável, complexo)
# - Azure (enterprise)

# Recomendação: DigitalOcean ($5-10/mês)
```

#### 1.2 Instalar Dependências
```bash
# Node.js + npm
node --version  # v16+ recomendado

# PostgreSQL
# Windows: PostgreSQL installer
# Linux: sudo apt install postgresql
# macOS: brew install postgresql

# Ferramentas
npm install -g pgAdmin  # GUI para PostgreSQL
```

#### 1.3 Estrutura Inicial do Projeto
```
backend/
├── .env                      # Variáveis de ambiente
├── .gitignore               
├── package.json             # Dependências
├── package-lock.json
├── server.js                # Arquivo principal
├── config/
│   └── database.js          # Conexão PostgreSQL
├── routes/
│   ├── auth.js              # Login/Registro
│   ├── chamados.js          # Solicitações
│   ├── clientes.js          # Gestão de clientes
│   ├── auditoria.js         # Logs
│   └── relatorios.js        # Análises
├── controllers/
│   ├── authController.js
│   ├── chamadosController.js
│   └── ...
├── middleware/
│   ├── auth.js              # JWT validation
│   └── rateLimit.js         # Anti-spam
├── models/
│   ├── User.js
│   ├── Chamado.js
│   └── ...
└── database/
    └── schema.sql           # Schema inicial
```

#### 1.4 package.json Inicial
```json
{
  "name": "rtv-solar-backend",
  "version": "1.0.0",
  "description": "Backend RTV Solar - Gerenciamento de energia solar",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.10.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "joi": "^17.9.0",
    "express-rate-limit": "^6.7.0",
    "nodemailer": "^6.9.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.5.0"
  }
}
```

---

### Fase 2: Autenticação & Permissões (3-5 dias)

#### 2.1 Schema do Banco - Usuários
```sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    cpf VARCHAR(14) UNIQUE,
    role VARCHAR(20) NOT NULL, -- 'admin', 'cliente'
    aprovado_admin BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bloqueado_ate TIMESTAMP NULL
);

CREATE TABLE permissoes (
    id SERIAL PRIMARY KEY,
    role VARCHAR(20) NOT NULL,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role, acao)
);

-- Índices para performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);
CREATE INDEX idx_usuarios_aprovado ON usuarios(aprovado_admin);
```

#### 2.2 Implementar Login Seguro
```javascript
// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    
    // 1. Validar entrada
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha obrigatórios' });
    }
    
    // 2. Buscar usuário
    const usuario = await db.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
    );
    
    if (usuario.rows.length === 0) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    const user = usuario.rows[0];
    
    // 3. Verificar se aprovado
    if (!user.aprovado_admin) {
        return res.status(403).json({ error: 'Sua conta ainda não foi aprovada' });
    }
    
    // 4. Validar senha (bcrypt)
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
        return res.status(401).json({ error: 'Senha inválida' });
    }
    
    // 5. Gerar JWT
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    // 6. Registrar auditoria
    await db.query(
        'INSERT INTO auditoria (usuario_id, acao, descricao) VALUES ($1, $2, $3)',
        [user.id, 'LOGIN_SUCESSO', `Login realizado para ${email}`]
    );
    
    res.json({
        token,
        usuario: { id: user.id, email: user.email, nome: user.nome, role: user.role }
    });
};

exports.registrar = async (req, res) => {
    const { email, senha, nome, telefone, cpf } = req.body;
    
    // 1. Validar entrada
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    // 2. Verificar se email já existe
    const existente = await db.query(
        'SELECT id FROM usuarios WHERE email = $1',
        [email]
    );
    
    if (existente.rows.length > 0) {
        return res.status(409).json({ error: 'Email já cadastrado' });
    }
    
    // 3. Criptografar senha com bcrypt
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // 4. Criar usuário novo
    const resultado = await db.query(
        `INSERT INTO usuarios 
         (email, senha_hash, nome, telefone, cpf, role, aprovado_admin) 
         VALUES ($1, $2, $3, $4, $5, 'cliente', FALSE)
         RETURNING id, email, nome`,
        [email, senhaHash, nome, telefone, cpf]
    );
    
    // 5. Registrar auditoria
    await db.query(
        'INSERT INTO auditoria (usuario_id, acao, descricao) VALUES ($1, $2, $3)',
        [resultado.rows[0].id, 'REGISTRO_NOVO', `Novo cliente registrado: ${email}`]
    );
    
    res.status(201).json({
        mensagem: 'Usuário registrado com sucesso',
        usuario: resultado.rows[0]
    });
};
```

#### 2.3 Middleware JWT
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

const verificarRole = (rolesPermitidas) => {
    return (req, res, next) => {
        if (!rolesPermitidas.includes(req.usuario.role)) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        next();
    };
};

module.exports = { verificarToken, verificarRole };
```

---

### Fase 3: Dados Principais (5-7 dias)

#### 3.1 Schema - Chamados
```sql
CREATE TABLE chamados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'aberto', -- aberto, em_analise, resolvido
    prioridade VARCHAR(20) DEFAULT 'normal', -- baixa, normal, alta, crítica
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolvido_em TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE comentarios_chamados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chamado_id UUID NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    texto TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chamados_usuario ON chamados(usuario_id);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_prioridade ON chamados(prioridade);
```

#### 3.2 API Chamados
```javascript
// routes/chamados.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');

// Listar chamados (apenas do usuário ou todos se admin)
router.get('/', verificarToken, async (req, res) => {
    try {
        let query = `
            SELECT id, titulo, descricao, status, prioridade, criado_em 
            FROM chamados 
        `;
        let params = [];
        
        // Se cliente, vê apenas seus chamados
        if (req.usuario.role === 'cliente') {
            query += ' WHERE usuario_id = $1 ';
            params.push(req.usuario.id);
        }
        
        query += ' ORDER BY criado_em DESC';
        
        const resultado = await db.query(query, params);
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar chamado novo
router.post('/', verificarToken, async (req, res) => {
    const { titulo, descricao, prioridade } = req.body;
    
    try {
        const resultado = await db.query(
            `INSERT INTO chamados 
             (usuario_id, titulo, descricao, prioridade) 
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.usuario.id, titulo, descricao, prioridade || 'normal']
        );
        
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar status (apenas admin)
router.patch('/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (req.usuario.role !== 'admin') {
        return res.status(403).json({ error: 'Apenas admin pode atualizar' });
    }
    
    try {
        const resultado = await db.query(
            `UPDATE chamados 
             SET status = $1, atualizado_em = NOW() 
             WHERE id = $2 
             RETURNING *`,
            [status, id]
        );
        
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

#### 3.3 Schema - Auditoria
```sql
CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id),
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    severidade VARCHAR(20) DEFAULT 'info', -- info, warning, error
    detalhes JSONB,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_acao ON auditoria(acao);
CREATE INDEX idx_auditoria_data ON auditoria(criado_em);
```

---

### Fase 4: Integrações Externas (1-2 semanas)

#### 4.1 Email (SendGrid)
```bash
npm install @sendgrid/mail
```

```javascript
// services/email.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function enviarEmailChamado(emailCliente, chamadoId) {
    const msg = {
        to: emailCliente,
        from: 'noreply@rtvsolar.com',
        subject: `Novo Chamado Aberto #${chamadoId}`,
        html: `
            <h2>Seu chamado foi aberto com sucesso!</h2>
            <p>ID do Chamado: ${chamadoId}</p>
            <p>Você receberá atualizações por email.</p>
        `
    };
    
    await sgMail.send(msg);
}
```

#### 4.2 Smart Meter (Distribuidor)
```javascript
// services/smartMeter.js
async function buscarConsumoDado(codigoMedidor) {
    // Exemplo: CELESC, ENEL, etc
    const resposta = await fetch(
        `https://api.distribuidor.com.br/meter/${codigoMedidor}`,
        {
            headers: { 'Authorization': `Bearer ${process.env.METER_API_KEY}` }
        }
    );
    
    const dados = await resposta.json();
    
    // kWh consumido, horário de pico, etc.
    return {
        consumoDiario: dados.consumoDiario,
        consumoMensal: dados.consumoMensal,
        timestamp: new Date()
    };
}
```

#### 4.3 Pagamento (Stripe)
```bash
npm install stripe
```

```javascript
// services/pagamento.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function criarFatura(usuarioId, valor) {
    const intencaoPagamento = await stripe.paymentIntents.create({
        amount: Math.round(valor * 100), // Stripe usa centavos
        currency: 'brl',
        metadata: { usuarioId }
    });
    
    return intencaoPagamento;
}
```

---

### Fase 5: Deploy e Segurança (3-5 dias)

#### 5.1 Variáveis de Ambiente (.env)
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/rtv_solar
JWT_SECRET=sua_chave_super_secreta_aqui_64_caracteres_minimo
SENDGRID_API_KEY=SG.xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
METER_API_KEY=sua_chave_api
CORS_ORIGIN=https://seu-dominio.com
RATE_LIMIT_JANELA=15 # minutos
RATE_LIMIT_TENTATIVAS=100 # por IP
```

#### 5.2 Implementar Rate Limiting
```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 requisições por IP
    message: 'Muitas requisições, tente mais tarde'
});

const limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Máximo 5 tentativas de login
    skipSuccessfulRequests: true,
    message: 'Muitas tentativas de login, tente mais tarde'
});

module.exports = { limiter, limiterLogin };
```

#### 5.3 Headers de Segurança
```javascript
// server.js
const helmet = require('helmet');

app.use(helmet()); // Adiciona headers de segurança
// Exemplo: X-Content-Type-Options: nosniff
//          X-Frame-Options: DENY
//          Content-Security-Policy
```

#### 5.4 HTTPS/SSL
```bash
# Usar Let's Encrypt (grátis)
# Recomendação: Certbot

# Linux:
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d seu-dominio.com

# Resultado: /etc/letsencrypt/live/seu-dominio.com/
```

```javascript
// server.js
const fs = require('fs');
const https = require('https');

if (process.env.NODE_ENV === 'production') {
    const opcoes = {
        key: fs.readFileSync('/etc/letsencrypt/live/seu-dominio.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/seu-dominio.com/fullchain.pem')
    };
    
    https.createServer(opcoes, app).listen(443);
} else {
    app.listen(3000);
}
```

---

## 📋 Endpoints API Essenciais

### Autenticação
```
POST   /api/auth/registrar          - Criar conta
POST   /api/auth/login              - Fazer login
POST   /api/auth/logout             - Logout
POST   /api/auth/recuperar-senha    - Reset senha
```

### Chamados/Solicitações
```
GET    /api/chamados                - Listar (cliente vê seus, admin vê todos)
POST   /api/chamados                - Criar novo
GET    /api/chamados/:id            - Detalhes
PATCH  /api/chamados/:id            - Atualizar status (admin)
DELETE /api/chamados/:id            - Deletar (apenas admin)

POST   /api/chamados/:id/comentarios - Adicionar comentário
```

### Clientes (Admin)
```
GET    /api/clientes                - Listar todos (admin)
GET    /api/clientes/:id            - Detalhes
PATCH  /api/clientes/:id/aprovar    - Aprovar cliente
PATCH  /api/clientes/:id/bloquear   - Bloquear/desbloquear
```

### Auditoria (Admin)
```
GET    /api/auditoria               - Listar logs
GET    /api/auditoria/usuario/:id   - Logs de usuário específico
GET    /api/auditoria/export        - Exportar CSV
```

### Dados Solares/Consumo
```
GET    /api/consumo                 - Histórico de consumo
GET    /api/geracao                 - Histórico de geração
GET    /api/economia                - Calculado automaticamente
```

---

## 🧪 Testes Essenciais

### Teste de Autenticação
```javascript
// tests/auth.test.js
describe('Autenticação', () => {
    test('Registrar novo usuário', async () => {
        const resposta = await request(app)
            .post('/api/auth/registrar')
            .send({
                email: 'novo@teste.com',
                senha: 'Senha123!',
                nome: 'João'
            });
        
        expect(resposta.status).toBe(201);
        expect(resposta.body.usuario.email).toBe('novo@teste.com');
    });
    
    test('Login com credenciais corretas', async () => {
        // Setup: criar usuário primeiro
        
        const resposta = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'novo@teste.com',
                senha: 'Senha123!'
            });
        
        expect(resposta.status).toBe(200);
        expect(resposta.body.token).toBeDefined();
    });
});
```

---

## 📊 Timeline de Implementação

```
Semana 1:
├─ Dia 1-2: Setup (servidor, DB, dependências)
├─ Dia 3-4: Autenticação (login, registro, JWT)
└─ Dia 5: Primeiros testes

Semana 2:
├─ Dia 1-2: API Chamados (CRUD)
├─ Dia 3-4: API Auditoria e dados
└─ Dia 5: Testes de integração

Semana 3:
├─ Dia 1-2: Email (SendGrid)
├─ Dia 3-4: Smart Meter (distribuidor)
└─ Dia 5: Pagamento (Stripe) - Opcional

Semana 4:
├─ Dia 1-2: Deploy (HTTPS, SSL)
├─ Dia 3: Testes em produção
├─ Dia 4: Security audit
└─ Dia 5: Documentação final
```

---

## 💡 Boas Práticas

### 1. Variáveis de Ambiente
- ✅ SEMPRE em .env
- ✅ NUNCA commitar .env no Git
- ✅ Diferentes para dev/test/prod

### 2. Senhas
- ✅ SEMPRE criptografadas com bcrypt
- ✅ Mínimo 10 caracteres de salt
- ✅ NUNCA em plain text

### 3. APIs
- ✅ HTTPS obrigatório
- ✅ Rate limiting para evitar spam
- ✅ Validação de entrada com Joi/Yup
- ✅ Resposta consistente (status + mensagem)

### 4. Banco de Dados
- ✅ Índices em colunas frequentemente usadas
- ✅ Foreign keys para integridade
- ✅ Backup automático diário
- ✅ Versionamento de schema (migrations)

### 5. Testes
- ✅ Unit tests para funções críticas
- ✅ Integration tests para APIs
- ✅ Teste de segurança (injeção SQL, XSS, etc)

---

## 🚨 Security Checklist

- [ ] ✅ HTTPS/SSL implementado
- [ ] ✅ Senhas com bcrypt (mínimo 10 rounds)
- [ ] ✅ JWT com expiração (24h máximo)
- [ ] ✅ Rate limiting ativo
- [ ] ✅ CORS configurado corretamente
- [ ] ✅ Input validation (Joi/Yup)
- [ ] ✅ SQL injection prevention (parameterized queries)
- [ ] ✅ XSS protection (sanitize output)
- [ ] ✅ CSRF tokens se necessário
- [ ] ✅ Logs de segurança (auditoria)
- [ ] ✅ Backup automático
- [ ] ✅ Monitoramento de erros (Sentry)

---

## 📚 Recursos Úteis

### Documentação
- Node.js: https://nodejs.org/docs
- Express: https://expressjs.com
- PostgreSQL: https://www.postgresql.org/docs
- JWT: https://jwt.io
- bcrypt: https://www.npmjs.com/package/bcryptjs

### Tutorials
- Docker: https://docs.docker.com/
- Testing: https://jestjs.io
- Security: https://owasp.org

### Tools
- Postman: Testar APIs
- pgAdmin: Gerenciar PostgreSQL
- DBeaver: SQL IDE
- Sentry: Error tracking

---

## ✅ Próximos Passos

1. **Hoje**: Ler este documento
2. **Amanhã**: Setup servidor + banco de dados
3. **Próximos 3 dias**: Login + JWT
4. **Semana 2**: APIs principais
5. **Semana 3**: Integrações
6. **Semana 4**: Deploy

---

## 📞 Dúvidas Frequentes

**P: Preciso de Docker?**
R: Não é obrigatório, mas recomendado para padronização.

**P: Qual alternativa a Node.js?**
R: Python (Django/FastAPI), Java (Spring Boot), Go, etc. Node.js é mais rápido de começar.

**P: Posso usar SQLite em vez de PostgreSQL?**
R: Para produção: não. SQLite é single-file, não suporta concorrência.

**P: Quanto vai custar?**
R: Servidor: $5-50/mês. SendGrid/Stripe: pay-as-you-go. Budget estimado: $100-200/mês.

---

**Status**: 🟢 Pronto para começar!

Comece pela Fase 1 e siga o timeline. Boa sorte! 🚀

---

*Para dúvidas sobre frontend, veja [START-HERE.md](./START-HERE.md)*  
*Para problemas conhecidos, veja [KNOWN-ISSUES.md](./KNOWN-ISSUES.md)*
