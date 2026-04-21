# 🎓 Backend Passo-a-Passo Para Iniciantes

**Versão**: 1.0 | **Data**: 19/04/2026 | **Nível**: Iniciante Total  
**Objetivo**: Você nunca fez backend? Aqui é o lugar!

---

## 🎯 O Que Vamos Fazer

Vamos construir um backend simples em **4 lições**:

1. ✅ **Lição 1**: Instalar ferramentas necessárias (15 min)
2. ✅ **Lição 2**: Crear primeiro "Hello World" (30 min)
3. ✅ **Lição 3**: Conectar ao banco de dados (45 min)
4. ✅ **Lição 4**: Implementar Login seguro (1 hora)

**Tempo total**: ~2.5 horas

---

## 📚 Conceitos Básicos (Leia Primeiro!)

### O que é Backend?

```
ANTES (seu sistema agora):
┌────────────────────┐
│  index.html        │
│  (navegador)       │
│  localStorage      │  ← Dados guardados no seu computador
└────────────────────┘

DEPOIS (com backend):
┌────────────────────┐         ┌────────────────────┐
│  index.html        │  ←→     │  SERVIDOR BACKEND  │
│  (navegador)       │         │  (computador outro) │
└────────────────────┘         └────────────────────┘
                                  ↓
                               ┌────────────────────┐
                               │  PostgreSQL        │
                               │  (banco de dados)  │
                               └────────────────────┘
```

**Em palavras simples:**
- **Frontend** (index.html): O que você vê na tela
- **Backend** (servidor): Faz o trabalho pesado (guarda dados, valida, etc)
- **Banco de dados** (PostgreSQL): Guarda dados permanentemente

### O que é Node.js?

Node.js permite escrever código **JavaScript no servidor** (não só no navegador).

É como colocar o seu código JavaScript no computador do servidor!

---

## 🔧 LIÇÃO 1: Instalar Ferramentas (15 min)

### Passo 1.1: Instalar Node.js

**O que é?** Node.js permite rodar JavaScript fora do navegador.

**Como instalar:**

1. Abra https://nodejs.org
2. Clique em "LTS" (versão estável)
3. Baixe o instalador
4. Instale normalmente (next, next, next)
5. Reinicie seu computador

**Verificar se instalou:**

Abra PowerShell (Windows) e digite:
```powershell
node --version
npm --version
```

**Esperado:**
```
v18.16.0
9.6.7
```

Se aparecer versões, sucesso! ✅

---

### Passo 1.2: Instalar PostgreSQL

**O que é?** Banco de dados profissional.

**Como instalar:**

1. Abra https://www.postgresql.org/download/
2. Escolha Windows
3. Baixe o instalador
4. Execute
5. Quando pedir senha: Use algo simples como `postgres123`
6. Port: Deixe 5432 (padrão)
7. Instale

**Verificar:**

Abra "pgAdmin" (instalado automaticamente):
- Username: postgres
- Password: A senha que você colocou

Se consegue fazer login, sucesso! ✅

---

### Passo 1.3: Crie uma Pasta Para o Backend

Crie em um lugar fácil de lembrar:

```
C:\Users\SEU_USUARIO\projetos\rtv-backend\
```

**No Windows:**
1. Abra "Meu Computador"
2. Vá para seu usuário
3. Crie pasta `projetos`
4. Dentro crie `rtv-backend`
5. Abra nessa pasta um PowerShell

**Verificar:**

```powershell
cd C:\Users\SEU_USUARIO\projetos\rtv-backend
pwd  # Mostra o caminho atual
```

Sucesso! ✅

---

## 💻 LIÇÃO 2: Seu Primeiro "Hello World" (30 min)

### Passo 2.1: Inicializar Projeto

No PowerShell (já na pasta `rtv-backend`):

```powershell
npm init -y
```

**O que faz?** Cria um arquivo `package.json` (como um "cartão de identidade" do projeto).

**Resultado esperado:**

Arquivo criado: `package.json`

```json
{
  "name": "rtv-backend",
  "version": "1.0.0",
  "main": "index.js",
  ...
}
```

---

### Passo 2.2: Instalar Express

Express é uma **biblioteca que facilita criar servidores**.

No PowerShell:

```powershell
npm install express
```

**O que acontece?**
1. Baixa Express
2. Cria pasta `node_modules` (com todas as dependências)
3. Atualiza `package.json`

**Tempo:** 2-3 minutos

---

### Passo 2.3: Criar Arquivo do Servidor

Crie um arquivo chamado `server.js`:

```javascript
// server.js
const express = require('express');
const app = express();

// Rota 1: Hello World
app.get('/', (req, res) => {
    res.send('Olá! Servidor está funcionando!');
});

// Rota 2: API JSON
app.get('/api/teste', (req, res) => {
    res.json({ mensagem: 'Backend funcionando!', status: 'ok' });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('✅ Servidor rodando em http://localhost:3000');
});
```

**O que é cada linha?**

```javascript
const express = require('express');  // Importa Express
const app = express();              // Cria aplicação

app.get('/', (req, res) => {       // Quando alguém acessa /
    res.send('...');                // Responda com texto
});

app.listen(3000, () => {           // Escute na porta 3000
    console.log('...');             // Mostre mensagem
});
```

---

### Passo 2.4: Rodar o Servidor

No PowerShell (mesma pasta):

```powershell
node server.js
```

**Esperado:**

```
✅ Servidor rodando em http://localhost:3000
```

### Passo 2.5: Testar no Navegador

1. Abra navegador
2. Digite na barra de endereço: `http://localhost:3000`
3. Você deve ver: "Olá! Servidor está funcionando!"

**Sucesso!** ✅ Seu primeiro servidor está rodando!

### Passo 2.6: Parar o Servidor

No PowerShell:

```powershell
Ctrl + C
```

(Aperta Ctrl e C ao mesmo tempo)

---

## 🗄️ LIÇÃO 3: Conectar ao Banco de Dados (45 min)

### Passo 3.1: Criar Banco de Dados

Abra **pgAdmin** (foi instalado com PostgreSQL):

```
Usuário: postgres
Senha: postgres123 (ou a que você colocou)
```

**Passos:**

1. Conecte ao servidor (à esquerda)
2. Clique direito em "Databases"
3. Create → Database
4. Nome: `rtv_solar`
5. Save

Pronto! Banco criado! ✅

### Passo 3.2: Criar Tabela de Usuários

Ainda no pgAdmin:

1. Abra o banco `rtv_solar`
2. Clique em "Query Tool" (icone do símbolo SQL)
3. Cole este código:

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'cliente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Clique no botão "Execute" (Play)

**Esperado:** "Query returned successfully"

Sucesso! ✅ Tabela criada!

### Passo 3.3: Instalar Driver PostgreSQL

No PowerShell:

```powershell
npm install pg
```

### Passo 3.4: Conectar ao Banco no Código

Crie novo arquivo: `database.js`

```javascript
// database.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'postgres123',  // Sua senha
    host: 'localhost',
    port: 5432,
    database: 'rtv_solar'
});

module.exports = pool;
```

**O que é cada linha?**
- `user`: Seu usuário PostgreSQL
- `password`: Sua senha
- `host`: localhost = seu computador
- `database`: Nome do banco que criou

### Passo 3.5: Testar Conexão

Atualize `server.js`:

```javascript
// server.js
const express = require('express');
const pool = require('./database');  // ← Adicione isto

const app = express();

// Rota de teste de banco de dados
app.get('/api/usuarios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios');
        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

app.listen(3000, () => {
    console.log('✅ Servidor rodando em http://localhost:3000');
});
```

**Execute:**

```powershell
node server.js
```

**Teste no navegador:**

```
http://localhost:3000/api/usuarios
```

**Esperado:**

```
[]
```

(Array vazio = Conexão funcionando!) ✅

---

## 🔐 LIÇÃO 4: Implementar Login (1 hora)

### Passo 4.1: Instalar Bibliotecas de Segurança

```powershell
npm install bcryptjs jsonwebtoken
```

**O que fazem?**
- `bcryptjs`: Criptografa senhas
- `jsonwebtoken`: Cria tokens de autenticação

### Passo 4.2: Criar Rota de Registro

Atualize `server.js`:

```javascript
// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./database');

const app = express();
app.use(express.json());  // ← Adicione isto (para aceitar JSON)

const JWT_SECRET = 'sua_chave_super_secreta_123456';

// ROTA 1: Registrar novo usuário
app.post('/api/auth/registrar', async (req, res) => {
    try {
        const { email, nome, senha } = req.body;
        
        // 1. Validar entrada
        if (!email || !nome || !senha) {
            return res.status(400).json({ erro: 'Faltam campos' });
        }
        
        // 2. Verificar se email já existe
        const usuarioExiste = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );
        
        if (usuarioExiste.rows.length > 0) {
            return res.status(409).json({ erro: 'Email já cadastrado' });
        }
        
        // 3. Criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // 4. Salvar no banco
        const resultado = await pool.query(
            'INSERT INTO usuarios (email, nome, senha_hash) VALUES ($1, $2, $3) RETURNING id, email, nome',
            [email, nome, senhaHash]
        );
        
        res.status(201).json({
            mensagem: 'Usuário criado com sucesso!',
            usuario: resultado.rows[0]
        });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ROTA 2: Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // 1. Validar entrada
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha obrigatórios' });
        }
        
        // 2. Buscar usuário no banco
        const resultado = await pool.query(
            'SELECT id, email, nome, senha_hash FROM usuarios WHERE email = $1',
            [email]
        );
        
        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }
        
        const usuario = resultado.rows[0];
        
        // 3. Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha inválida' });
        }
        
        // 4. Gerar token
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            mensagem: 'Login realizado!',
            token,
            usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome }
        });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

app.listen(3000, () => {
    console.log('✅ Servidor rodando em http://localhost:3000');
});
```

---

### Passo 4.3: Testar com Postman

**O que é Postman?** Ferramenta para testar APIs.

**Instalar:**
1. Baixe em https://www.postman.com/downloads/
2. Instale normalmente

**Teste 1: Registrar**

1. Abra Postman
2. Nova requisição (New → Request)
3. Mude para POST
4. URL: `http://localhost:3000/api/auth/registrar`
5. Aba "Body" → JSON
6. Cole:

```json
{
    "email": "joao@email.com",
    "nome": "João",
    "senha": "senha123"
}
```

7. Clique "Send"

**Esperado:**

```json
{
    "mensagem": "Usuário criado com sucesso!",
    "usuario": {
        "id": 1,
        "email": "joao@email.com",
        "nome": "João"
    }
}
```

Sucesso! ✅

**Teste 2: Login**

1. Nova requisição
2. POST
3. URL: `http://localhost:3000/api/auth/login`
4. Body JSON:

```json
{
    "email": "joao@email.com",
    "senha": "senha123"
}
```

5. Send

**Esperado:**

```json
{
    "mensagem": "Login realizado!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": { ... }
}
```

Sucesso! ✅ Você tem um token!

---

## 🚀 Próximas Etapas

### Depois de aprender o básico:

1. **Adicione mais rotas:**
   - GET /api/chamados (listar chamados)
   - POST /api/chamados (criar chamado)
   - etc.

2. **Implemente autenticação:**
   - Verificar token em cada requisição
   - Só usuarios cadastrados podem criar chamados

3. **Conecte com frontend:**
   - Atualize `script.js` para usar API
   - Em vez de `localStorage`, envie para servidor

4. **Deploy:**
   - Coloque no servidor (Heroku, DigitalOcean)
   - Compre domínio

---

## 🐛 Resolução de Problemas

### Erro: "Cannot find module 'express'"

**Solução:** Instalou mas não está rodando na pasta certa.

```powershell
# Verificar se está na pasta correta
pwd
# Deve mostrar: ...\rtv-backend

# Instale novamente
npm install express
```

---

### Erro: "Port 3000 already in use"

**Significa:** Outro programa está usando a porta 3000.

**Solução:**

```powershell
# Use porta diferente:
# Mude no código: app.listen(3001, () => {
# E acesse: http://localhost:3001
```

---

### Erro: "Could not connect to database"

**Significa:** PostgreSQL não está rodando.

**Solução:**

```powershell
# Windows: Abra Services (Win + R → services.msc)
# Procure "postgresql-*"
# Se parado, clique direito → Start
```

---

### Erro: "Syntax error"

**Significa:** Erro no Javascript.

**Solução:**
1. Leia a mensagem de erro (indica a linha)
2. Verifique se há chaves `{}` abertas e fechadas
3. Verifique se há aspas 
4. Teste em https://jsfiddle.net para isolar o problema

---

## 📊 Checklist - Você Aprendeu:

- [ ] ✅ Instalou Node.js
- [ ] ✅ Instalou PostgreSQL
- [ ] ✅ Criou primeira aplicação Express
- [ ] ✅ Conectou ao banco de dados
- [ ] ✅ Criou login com senha criptografada
- [ ] ✅ Gerou tokens JWT
- [ ] ✅ Testou com Postman

**Se todos estão checkados, você está pronto para o próximo nível!** 🎉

---

## 📚 Recursos Extras

### Documentação Oficial:
- Express: https://expressjs.com
- PostgreSQL: https://www.postgresql.org/docs
- Node.js: https://nodejs.org

### Tutoriais Video:
- "Node.js para Iniciantes" no YouTube
- "Curso Express.js" (procure em português)

### Comunidades:
- Stack Overflow (em português)
- Reddit r/learnprogramming
- Discord de programação Python/JS

---

## ✅ Conclusão

Você agora sabe:
1. ✅ Instalar ferramentas
2. ✅ Criar um servidor
3. ✅ Conectar banco de dados
4. ✅ Implementar login seguro

**Próximo?** Veja [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md) para recursos avançados.

---

*Boa sorte! Você consegue! 🚀*

*Qualquer dúvida, leia novamente a seção relevante - às vezes a resposta está ali!*
