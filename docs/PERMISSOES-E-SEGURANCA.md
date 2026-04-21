# 🔐 Permissões e Segurança - RBAC

**Versão**: 1.0 | **Data**: 19/04/2026

---

## 🎯 O que é RBAC?

**RBAC = Role-Based Access Control** (Controle de Acesso Baseado em Papéis)

Significa: O sistema tem dois "papéis" distintos:
- **ADMIN**: Gerencia tudo
- **CLIENTE**: Acessa apenas dados próprios

---

## 👥 Os Dois Papéis

### ADMIN
**Quem é?** Usuários do suporte/gestão da RTV Solar

**O que pode fazer?**
- ✅ Ver TODOS os clientes
- ✅ Ver todos os chamados/solicitações
- ✅ Ver auditoria completa (quem fez o quê e quando)
- ✅ Aprovar/rejeitar novos clientes
- ✅ Modificar configurações do sistema
- ✅ Acessar dashboard de análise
- ✅ Gerenciar equipamentos/serviços

**Como acessar?**
```
1. Vá para index.html
2. Clique em "Login" (canto superior)
3. Use: admin@rtvsolar.com / admin123
```

### CLIENTE
**Quem é?** Pessoa com sistema solar instalado

**O que pode fazer?**
- ✅ Ver dados do PRÓPRIO sistema:
  - Geração solar (kW por hora/dia/ano)
  - Consumo de energia
  - Economia financeira
  - Documentos/contratos
- ✅ Abrir chamados de suporte
- ✅ Agendar manutenção
- ✅ Visualizar status do equipamento
- ✅ Ver impacto ambiental

**O que NÃO pode fazer?**
- ❌ Ver dados de outros clientes
- ❌ Modificar configurações
- ❌ Acessar auditoria
- ❌ Deletar clientes
- ❌ Ver relatórios administrativos

**Como acessar?**
```
1. Vá para index.html
2. Clique em "Área do Cliente"
3. Clique em "Criar Conta" ou use: cliente@demomail.com / cliente123
```

---

## 🔑 Como Funciona Internamente?

### 1. Identificação (Login)

```javascript
// Arquivo: script.js

// Antes de entrar, sistema verifica:
if (usuario.role === "cliente") {
    // É cliente, carrega cliente-funcoes.js
}
if (usuario.role === "admin") {
    // É admin, carrega admin-funcoes.js
}
```

### 2. Proteção de Páginas

```javascript
// Arquivo: sistema-permissoes.js

// Cada página só abre se você tem a permissão certa:
const ROTAS_PROTEGIDAS = {
    "auditoria.html": ["admin"],           // Só admin vê
    "admin-clientes.html": ["admin"],      // Só admin vê
    "cliente-geracao.html": ["cliente"],   // Só cliente vê
};
```

se você tenta acessar `auditoria.html` como cliente:
1. ❌ Sistema detecta que você não tem permissão
2. ❌ Redireciona para homepage
3. ❌ Mostra mensagem: "Acesso negado"

### 3. Controle de Elementos

Mesmo que esteja na mesma página HTML, elementos específicos aparecem/desaparecem:

```html
<!-- Este botão só aparece se o usuário é ADMIN -->
<button data-role="admin">Ver Auditoria</button>

<!-- Este só aparece se CLIENTE -->
<button data-role="cliente">Meu Dashboard</button>
```

```javascript
// Função que controla visibilidade:
function controlarVisibilidadeElementos() {
    // Esconde tudo que não é do seu role
    document.querySelectorAll('[data-role]').forEach(el => {
        if (el.dataset.role !== usuarioAtual.role) {
            el.style.display = 'none';
        }
    });
}
```

### 4. Separação de Menu

**Menu do CLIENTE:**
```
• Dashboard
• Geração Solar
• Consumo
• Financeiro
• Contratos
• Suporte
• Logout
```

**Menu do ADMIN:**
```
• Dashboard
• Auditoria
• Clientes
• Serviços
• Equipamentos
• Relatórios
• Configurações
• Logout
```

Cada um vê UM MENU DIFERENTE. Função `renderMenuDinamico()` cuida disso.

---

## 🚨 Questões de Segurança Atuais

### ✅ O que FUNCIONA bem:

| Aspecto | Status | Detalhe |
|---------|--------|---------|
| Separação de menus | ✅ Funciona | Cliente/Admin veem menus diferentes |
| Proteção de rotas | ✅ Funciona | Páginas redirecionam se sem permission |
| Ocultamento de elementos | ✅ Funciona | Botões/campos por role funcionam |
| Validação de login | ✅ Funciona | Valida credenciais |
| Audit logging | ✅ Funciona | Registra ações no localStorage |
| Aprovação de cliente | ✅ Funciona | Cliente não acessa até admin aprovar |

### ⚠️ O que PRECISA Backend:

| Problema | Impacto | Solução |
|----------|--------|--------|
| Senhas em plain text | 🔴 CRÍTICO | Implementar bcrypt no backend |
| localStorage compartilhado | 🔴 CRÍTICO | Banco de dados com isolamento por user |
| Sem HTTPS | 🟠 ALTO | Deploy com SSL/TLS |
| Sem session timeout | 🟠 ALTO | Implementar JWT com expiração |
| Sem 2FA | 🟡 MÉDIO | SendGrid + Google Authenticator setup |
| Sem rate limiting | 🟡 MÉDIO | API com throttling |

---

## 🏗️ Onde Está o Código de Permissões?

| Arquivo | O que faz |
|---------|----------|
| `sistema-permissoes.js` | **Arquivo principal de RBAC** - Defini roles, rotas, permissões |
| `script.js` | Valida login, usa dados de permissão |
| `cliente-funcoes.js` | Carrega apenas quando cliente conecta |
| `admin-funcoes.js` | Carrega apenas quando admin conecta |
| HTML pages | Elementos com `data-role` para controle visual |

### Exemplo de Permissão

```javascript
// Em sistema-permissoes.js

const PERMISSOES_POR_ROLE = {
    admin: [
        "ver_auditoria",
        "gerenciar_clientes",
        "aprovar_clientes",
        "ver_relatorios",
        ...
    ],
    cliente: [
        "ver_proprio_consumo",
        "abrir_chamado",
        "ver_contrato",
        ...
    ]
};
```

Quando você tenta fazer algo:
```javascript
function podeExecutarAcao(acao) {
    const permissoes = PERMISSOES_POR_ROLE[usuarioAtual.role];
    if (!permissoes.includes(acao)) {
        return false; // NÃO pode
    }
    return true; // Pode
}
```

---

## 📝 Boas Práticas para Adicionar Novos Recursos

Se você quer adicionar uma nova página/funcionalidade:

### 1. Identifique quem pode acessar
```javascript
// Exemplo: Nova página "relatorios-avancados.html"
// Só admin pode acessar
```

### 2. Adicione à rota protegida
```javascript
// Em sistema-permissoes.js
const ROTAS_PROTEGIDAS = {
    ...
    "relatorios-avancados.html": ["admin"], // ← Adicione aqui
};
```

### 3. Se houver elemento visual específico
```html
<!-- Na página HTML -->
<div data-role="admin">
    <!-- Conteúdo só para admin -->
</div>
```

### 4. Se há lógica em JS
```javascript
// Começe com verificação:
if (usuarioAtual.role !== "admin") {
    window.location.href = "index.html";
    return;
}
// Resto da lógica aqui
```

---

## 🔍 Como Testar Permissões

### Teste 1: Cliente não pode acessar admin
```
1. Login como cliente@demomail.com
2. Tente abrir admin.html direto na URL
3. ❌ Deve redirecionar para index.html
```

### Teste 2: Admin pode acessar tudo
```
1. Login como admin@rtvsolar.com
2. Veja que menu tem todas as abas
3. ✅ Pode clicar em todos os links
```

### Teste 3: Menus diferentes
```
1. Logout
2. Faça login como cliente
3. Veja menu simplificado (7 itens)
4. Logout
5. Faça login como admin
6. Veja menu completo (15 itens)
```

### Teste 4: Auditoria só admin
```
1. Login como cliente
2. Tente: admin-relatorios.html → auditoria.html
3. ❌ Deve ser bloqueado
```

---

## 🎓 Resumo

**RBAC neste projeto:**
- ✅ Implementado no `sistema-permissoes.js`
- ✅ Funciona 100% sem backend
- ✅ Duas roles: `admin` e `cliente`
- ✅ Controla: rotas, menus, elementos HTML
- ⚠️ Precisa backend para: senhas seguras, isolamento total de dados, session management

*Para implementação de backend seguro, veja [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md)*
