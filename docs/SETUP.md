# 🛠️ Setup e Instalação

**Versão**: 1.0 | **Data**: 19/04/2026

---

## 📦 Requisitos

### Mínimo necessário:
- Um navegador moderno (Chrome, Firefox, Edge, Safari)
- Um editor de texto (VS Code recomendado)
- Nada mais! Sem banco de dados, sem Node.js, sem Python

### Opcional (para desenvolvimento):
- **VS Code** - Editor recomendado
- **Live Server extension** - Para recarregar página automaticamente
- **Git** - Para controle de versão
- **Node.js** (se for usar backend depois)

---

## ⚡ Instalação Rápida (2 minutos)

### Opção 1: Abrir arquivo local (mais simples)

```bash
1. Navegue até a pasta do projeto
   C:\Users\prang\Downloads\Projeto-SA

2. Clique 2x em index.html

3. Pronto! 🎉 Sistema abre no navegador
```

### Opção 2: Usar Live Server (desenvolvimento)

```bash
1. Abra a pasta em VS Code:
   File → Open Folder → Projeto-SA

2. Clique direito em index.html

3. Escolha "Open with Live Server"

4. Navegador abre automaticamente em localhost:5500
```

### Opção 3: Usar Python (se tiver instalado)

```bash
# Navegar até a pasta:
cd C:\Users\prang\Downloads\Projeto-SA

# Python 3.x:
python -m http.server 8000

# Depois abra:
http://localhost:8000
```

---

## 📁 Estrutura de Pastas

```
Projeto-SA/
│
├── 📄 Páginas HTML (27 arquivos):
│   ├── index.html                    # Home
│   ├── login.html, login-admin.html  # Login
│   ├── registro.html                 # Cadastro
│   ├── cliente-*.html                # Páginas cliente (8 arquivos)
│   ├── admin-*.html                  # Páginas admin (8 arquivos)
│   └── *.html                        # Outros (dashboard, suporte, etc)
│
├── 🔧 Scripts JavaScript:
│   ├── script.js                     # Core principal (2150+ linhas)
│   ├── sistema-permissoes.js         # RBAC
│   ├── sistema-aprovacoes.js         # Aprovação de clientes
│   ├── workflow-aprovacoes.js        # State machine
│   ├── cliente-funcoes.js            # Funções cliente
│   ├── admin-*.js                    # Funções admin específicas
│   └── imagens/                      # Pasta de imagens
│
├── 🎨 Estilos:
│   └── style.css                     # Dark theme (CSS3)
│
└── 📚 Documentação:
    └── docs/                         # ← Você está aqui!
        ├── START-HERE.md             # Leia primeiro
        ├── GUIA-RAPIDO-INICIO.md    # Quick start
        ├── ARQUITETURA.md            # Estrutura técnica
        ├── PERMISSOES-E-SEGURANCA.md # RBAC
        ├── PAGINAS-E-FUNCIONALIDADES.md # Mapa do sistema
        ├── SETUP.md                  # Este arquivo
        ├── KNOWN-ISSUES.md           # Problemas conhecidos
        ├── MANUTENCAO.md             # Manutenção/debug
        └── BACKEND-ROADMAP.md        # Próximas fases
```

---

## ⚙️ Configuração Detalhada

### 1. Desenvolvimento Local (VS Code)

**Instalação recomendada:**

```bash
# 1. Abir VS Code

# 2. Instalar extensão "Live Server":
# - Vá a Extensions (Ctrl+Shift+X)
# - Procure "Live Server"
# - Instale versão oficial (Ritwick Dey)

# 3. Abrir projeto:
File → Open Folder → C:\Users\prang\Downloads\Projeto-SA

# 4. Clicar em index.html com direito:
# → "Open with Live Server"

# 5. Navegador abre em:
http://localhost:5500
```

**Pra que serve Live Server?**
- Recarrega página automaticamente ao salvar arquivos
- Não vai perder dados entre recarregamentos (localStorage persiste)
- Melhor experiência de desenvolvimento

### 2. Estrutura localStorage

Quando você faz login/registro, dados são salvos localmente:

```javascript
// Cliente logado:
localStorage.rtv_usuarios          // { nome, email, role: "cliente", ... }
localStorage.rtv_chamados_USERID   // Chamados da pessoa

// Admin logado:
localStorage.rtv_logs_auditoria    // { acao, usuario, data, ... }
localStorage.rtv_permissoes        // Roles e permissões

// Geral:
localStorage.rtv_usuario_atual     // Quem está logado agora
```

**Limpar dados (reset):**
```javascript
// No Console (F12 → Console):
localStorage.clear();
// Pronto! Todos os dados apagados
```

### 3. Testar Diferentes Personas

Para testar como cliente E admin simultaneamente:

```
1. Abra index.html no CHROME
2. Faça login como cliente@demomail.com

3. Abra index.html em FIREFOX (outra janela)
4. Faça login como admin@rtvsolar.com

5. Agora você tem 2 usuários em paralelo:
   - Chrome: Cliente
   - Firefox: Admin
```

Cada navegador tem seu localStorage separado!

---

## 🚀 Primeiro Login/Teste

### Como Cliente

```
1. Abra index.html
2. Clique em "Área do Cliente"
3. Use: cliente@demomail.com / cliente123

OU crie novo cadastro:
1. Clique em "Criar Conta"
2. Preencha: Nome, Email, Telefone, CPF, Senha
3. Confirme Terms
4. Clique em "Registrar"

5. Aviso: Você verá "Sua conta está sob revisão"
```

### Admin Aprova Cliente (depois)

```
1. Logout do cliente
2. Faça login como: admin@rtvsolar.com / admin123
3. Vá para "Admin Dashboard"
4. Procure aba "Aprovações"
5. Clique em [Aprovar] do cliente novo
6. Mensagem: "Cliente aprovado!"

7. Cliente agora pode acessar totalmente
```

### Como Admin

```
1. Abra index.html
2. Clique em "Login" (canto superior)
3. Use: admin@rtvsolar.com / admin123
4. Você está em admin.html

5. Veja menu completo:
   - Dashboard
   - Auditoria ← Veja aqui dados de quem fez o quê
   - Clientes
   - Serviços
   - Equipamentos
   - etc.
```

---

## 🔧 Troubleshooting Basic Setup

### Problema: Página não carrega
```
Solução:
1. Certifique que abriu index.html (não outra página)
2. Verifique console (F12 → Console) para erros
3. Tente em outro navegador
```

### Problema: Dados sumiram
```
Solução:
1. localStorage foi limpo
2. Abra F12 → Console
3. Digite: localStorage.clear()
4. Recarregue página (F5)
5. Faça login novamente
```

### Problema: Permissão de acesso negada
```
Solução:
1. Certifique que está logado
2. Se cliente novo: Peça admin para aprovar
3. F12 → Console → localStorage.clear() → Recarregue
```

### Problema: Botões não funcionam
```
Solução:
1. Isso é esperado! Muitos botões precisam de backend
2. Veja: PAGINAS-E-FUNCIONALIDADES.md → "O que não funciona"
3. Para suporte: Veja KNOWN-ISSUES.md
```

---

## 📊 Verificar Logs da Sistema

```javascript
// No Console (F12):

// Ver todas as ações registradas:
console.log(JSON.parse(localStorage.rtv_logs_auditoria));

// Ver usuários cadastrados:
console.log(JSON.parse(localStorage.rtv_usuarios));

// Ver chamados abertos:
console.log(JSON.parse(localStorage.rtv_chamados));

// Ver usuário atual:
console.log(JSON.parse(localStorage.rtv_usuario_atual));
```

---

## 📈 Próximos Passos

**Depois de testar localmente:**

1. ✅ Leia [ARQUITETURA.md](./ARQUITETURA.md) - entenda o código
2. ✅ Leia [PERMISSOES-E-SEGURANCA.md](./PERMISSOES-E-SEGURANCA.md) - segurança
3. ✅ Estude [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md) - próximas fases

---

## ❓ Dúvidas?

- **Problema técnico?** Veja [MANUTENCAO.md](./MANUTENCAO.md)
- **Comportamento inesperado?** Veja [KNOWN-ISSUES.md](./KNOWN-ISSUES.md)
- **O que deveria funcionar?** Veja [PAGINAS-E-FUNCIONALIDADES.md](./PAGINAS-E-FUNCIONALIDADES.md)

---

*Pronto! Agora abra index.html e comece! 🚀*
