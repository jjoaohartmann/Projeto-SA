# 🔧 Manutenção e Debug do Sistema

**Versão**: 1.0 | **Data**: 19/04/2026

---

## 🎯 Para (Ter) Diferentes Públicos

- **QA/Tester**: Seção de "Testes Comuns"
- **Developer**: Seção de "Debug Técnico"
- **DevOps**: Seção de "Performance/Monitoring"
- **Support**: Seção de "Troubleshooting"

---

## 🧪 Testes Comuns (QA/Tester)

### Teste 1: Verificar Login Funciona

```javascript
// Console (F12):

// 1. Limpar dados anteriores:
localStorage.clear();

// 2. Abrir index.html e clicar "Login"

// 3. Usar:
// Email: admin@rtvsolar.com
// Senha: admin123

// 4. Deve ir para: admin.html

// 5. Verificação final no console:
console.log(JSON.parse(localStorage.rtv_usuario_atual));
// Output deve mostrar: { email: "admin@rtvsolar.com", role: "admin" }
```

### Teste 2: Verificar Permissões (Cliente vs Admin)

```javascript
// Como CLIENTE:
// Não deve conseguir acessar: auditoria.html, admin-clientes.html

// Como ADMIN:
// Deve conseguir acessar: auditoria.html, admin-clientes.html

// No console de cliente:
JSON.parse(localStorage.rtv_usuario_atual).role
// Output: "cliente" ✅

// No console de admin:
JSON.parse(localStorage.rtv_usuario_atual).role
// Output: "admin" ✅
```

### Teste 3: Verificar Dados de Auditoria

```javascript
// Console (F12):

// Ver todos os logs:
const logs = JSON.parse(localStorage.rtv_logs_auditoria);
console.table(logs);

// Ver último log:
console.log(logs[logs.length - 1]);

// Cada log deve ter: { acao, usuario, data, severidade, descricao }
```

### Teste 4: Verificar Chamados de Suporte

```javascript
// Abrir chamado como cliente
// Browser > suporte.html > "Novo Chamado"

// No console:
const chamados = JSON.parse(localStorage.rtv_chamados);
console.table(chamados);

// Cada chamado deve ter: { id, titulo, descricao, status, dataCriacao }
```

### Teste 5: Validar Aprovação de Cliente

```javascript
// 1. Registrar novo cliente: index.html > "Criar Conta"

// 2. Como admin, ir para: admin.html > "Aprovações"

// 3. Clicar [Aprovar]

// 4. Logout e tentar com novo email/senha
//    → Deve conseguir acessar dashboard

// 5. Console:
const usuarios = JSON.parse(localStorage.rtv_usuarios);
console.log(usuarios.find(u => u.email === "novo@email.com"));
// Deve mostrar: { ..., aprovadoAdmin: true }
```

---

## 🐛 Debug Técnico (Developers)

### Verificar Estrutura de Dados

```javascript
// localStorage.rtv_usuarios
// Estrutura de cada usuário:
{
    id: "uuid-12345",
    email: "usuario@email.com",
    nome: "João Silva",
    telefone: "(11) 99999-9999",
    role: "cliente" | "admin",
    aprovadoAdmin: true | false,
    dataCriacao: "2026-04-19",
    dataBloqueio: null | "data-se-bloqueado",
    endereco: "Rua X, 123",
    cpf: "123.456.789-00"
}

// localStorage.rtv_chamados
// Estrutura de cada chamado:
{
    id: "chamado-12345",
    usuarioId: "uuid-12345",
    titulo: "Painel não liga",
    descricao: "Painel solar não está ligando",
    status: "aberto" | "em_analise" | "resolvido",
    dataCriacao: "2026-04-19T10:30:00Z",
    ultimaAtualizacao: "2026-04-19T11:00:00Z",
    comentarios: [
        { usuario: "admin", texto: "Analisando...", data: "..." }
    ]
}

// localStorage.rtv_logs_auditoria
// Estrutura de cada log:
{
    timestamp: "2026-04-19T10:30:00Z",
    acao: "LOGIN_SUCESSO" | "CHAMADO_ABERTO" | "CLIENTE_APROVADO",
    usuario: "admin@rtvsolar.com",
    severidade: "info" | "warning" | "error",
    descricao: "Admin fez login com sucesso",
    detalhes: { ...extra_data }
}
```

### Debug de Permissões

```javascript
// Se elemento não aparece/aparece errado:

// Verificar role atual:
const usuario = JSON.parse(localStorage.rtv_usuario_atual);
console.log("Role atual:", usuario.role);

// Verificar se elemento está oculto:
const botao = document.getElementById("btn-admin");
console.log("Display:", window.getComputedStyle(botao).display);

// Executar função de controle manualmente:
// (Se existe no código)
controlarVisibilidadeElementos();

// Verificar se elemento tem data-role correto:
console.log(botao.getAttribute("data-role"));
```

### Debug de Login

```javascript
// Se login não funciona:

// 1. Verificar usuário existe:
const usuarios = JSON.parse(localStorage.rtv_usuarios || "[]");
console.log("Usuários cadastrados:", usuarios);

// 2. Verificar credenciais:
const admin = usuarios.find(u => u.email === "admin@rtvsolar.com");
console.log("Admin encontrado?", !!admin);

// 3. Se admin não existe, criar manualmente:
usuarios.push({
    id: "admin-001",
    email: "admin@rtvsolar.com",
    nome: "Administrador",
    role: "admin",
    aprovadoAdmin: true,
    dataCriacao: new Date().toISOString()
});
localStorage.rtv_usuarios = JSON.stringify(usuarios);

// 4. Testar login novo
```

### Debug de Botões Não Funcionando

```javascript
// Se botão não responde:

// 1. Verificar se tem event listener:
const botao = document.getElementById("meu-botao");
console.log("Event listeners:", getEventListeners(botao)); // Chrome DevTools

// 2. Verificar se handler função existe:
console.log(typeof minhaFuncao); // "function" ou "undefined"

// 3. Testar função manualmente:
minhaFuncao(); // Executar diretamente

// 4. Verificar se há console errors:
// F12 → Console → veja mensagens de error
```

### Debug de localStorage

```javascript
// Limpar um item específico:
localStorage.removeItem("rtv_usuario_atual");

// Resetar tudo:
localStorage.clear();

// Ver tamanho used:
for (let key in localStorage) {
    const size = new Blob([localStorage[key]]).size;
    console.log(key + ": " + size + " bytes");
}

// Se localStorage cheio (limite 5-10MB):
// Limpar itens obsoletos
```

---

## 📊 Performance e Monitoring

### Verificar Velocidade de Carregamento

```javascript
// Performance API (Chrome/Firefox):

// Tempo de carga total:
console.log(performance.timing.loadEventEnd - performance.timing.navigationStart);

// Tempo até interatividade:
console.log(performance.timing.domInteractive - performance.timing.navigationStart);

// Usar DevTools → Performance → Record
// 1. Abrir página
2. Gravar
// 3. Ver Timeline
```

### Monitorar localStorage Usage

```javascript
// Script para rodar periodicamente:
setInterval(() => {
    let total = 0;
    for (let key in localStorage) {
        total += new Blob([localStorage[key]]).size;
    }
    console.log("localStorage usado: " + (total / 1024).toFixed(2) + " KB");
}, 60000); // A cada minuto
```

### Verificar Memory Leaks

```javascript
// DevTools → Memory → Heap Snapshot
// 1. Fazer snapshot inicial
// 2. Abrir/fechar páginas varias vezes
// 3. Fazer snapshot final
// 4. Comparar se tamanho aumentou muito

// Se aumentou muito sem motivo = memory leak
```

---

## 🆘 Troubleshooting Comum

### Erro: "Cannot read property 'X' of undefined"

```javascript
// Causa: Variável não inicializada

// Solução 1: Verificar se localStorage tem dados:
console.log(localStorage.rtv_usuario_atual);

// Solução 2: Usar optional chaining (?):
const role = usuarioAtual?.role; // Ao invés de usuarioAtual.role
```

### Erro: "localStorage quota exceeded"

```javascript
// Causa: Dados demais em localStorage (limite 5-10MB)

// Solução: Limpar dados antigos
localStorage.clear();

// Ou apenas remover itens específicos:
localStorage.removeItem("rtv_logs_auditoria"); // Logs ocupam espaço
```

### Erro: "CORS error"

```javascript
// Causa: Acessar página com HTTP://file:// e jQuery tenta fetch

// Solução: Usar servidor local (Live Server) ao invés de abrir arquivo direto
```

### Página fica branca/em branco

```javascript
// Causa provável: Erro em JavaScript

// Verificar:
// 1. F12 → Console → veja errors
// 2. Verificar sintaxe dos arquivos .js
// 3. Recarregar página (Ctrl+Shift+R = hard refresh)
```

### Dados não salvam

```javascript
// Causa: localStorage disabled ou inativa

// Verificar:
console.log(localStorage.length); // Se 0 ou error, localStorage offline

// Solução:
// 1. Reabrir navegador
// 2. Não abrir em modo "inprivate"/incógnito
// 3. Limpar dados de navegador e tentar novamente
```

---

## 📋 Checklist de Manutenção Regular

### Diária
- [ ] Verificar console para errors (`F12 → Console`)
- [ ] Testar login admin e cliente
- [ ] Testar abrir chamado de suporte

### Semanal
- [ ] Ver logs de auditoria (admin → Auditoria)
- [ ] Verificar se localStorage não está cheio
- [ ] Testar em diferentes navegadores (Chrome, Firefox, Edge)
- [ ] Testar em mobile (F12 → Device Toolbar)

### Mensal
- [ ] Backup de dados (exportar localStorage)
- [ ] Revisar issues reportados
- [ ] Limpar logs antigos se necessário

### Antes de Deploy
- [ ] Testar todos os fluxos principais
- [ ] Verificar performance (DevTools → Performance)
- [ ] Testar segurança (vê senhas em plain text? CRÍTICO!)
- [ ] Validar em mobile
- [ ] Testar em diferentes navegadores
- [ ] Documentação atualizada

---

## 🔐 Security Audit

### Verificar Exposição de Dados

```javascript
// ⚠️ NUNCA rodar em produção, apenas desenvolvimento!

// Listar TODAS as senhas (se em localStorage):
const usuarios = JSON.parse(localStorage.rtv_usuarios || "[]");
usuarios.forEach(u => console.log(u.email, u.senha)); // 🚨 EXPOSIÇÃO!

// Solução: Senhas devem ir para backend com bcrypt
```

### Validar HTTPS na Produção

```
// Antes de deploy:
1. Certificado SSL instalado? ✅
2. HTTP redireciona para HTTPS? ✅
3. Headers de segurança presentes? ✅
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Content-Security-Policy: ...
```

---

## 📝 Logs Úteis para Debug

Padrão de log no projeto:

```javascript
// Quando ação importante acontece:
registrarAuditoria(
    acao,         // Ex: "LOGIN_SUCESSO"
    usuarioEmail, // Ex: "admin@rtvsolar.com"
    severidade,   // "info", "warning", "error"
    descricao     // Tekstextendido
);

// Exemplo:
registrarAuditoria(
    "CHAMADO_ABERTO",
    "cliente@email.com",
    "info",
    "Cliente abriu chamado #12345"
);
```

Ver todos em: **admin.html → Auditoria**

---

## 🚀 Próximos Passos

**Se sistema funciona**:
- ✅ Leia [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md) para próxima fase

**Se encontrou bug**:
- ✅ Documente com screenshot + console error
- ✅ Estude [KNOWN-ISSUES.md](./KNOWN-ISSUES.md) para saber se é conhecido

**Se sistema está lento**:
- ✅ Use DevTools → Performance para profiling
- ✅ Veja seção "Performance" acima

---

*Dúvida não coberta aqui? Veja [START-HERE.md](./START-HERE.md)*
