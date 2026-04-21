# 🚀 RTV Solar - Guia Rápido de Início

**Versão**: 1.0 | **Data**: 19/04/2026 | **Status**: ✅ Pronto

---

## ⚡ 5 Minutos: Começar Agora

### 1️⃣ Abrir o Sistema

```
1. Abra o arquivo: index.html no seu navegador
2. Clique em "Área do Cliente" ou "Login"
```

### 2️⃣ Usuários de Teste

**Para testar como CLIENTE:**
```
Email: cliente@demomail.com
Senha: cliente123

OU registre um novo (qualquer credencial funciona)
```

**Para testar como ADMIN:**
```
Email: admin@rtvsolar.com
Senha: admin123
```

### 3️⃣ O que Você Pode Fazer Agora

#### ✅ Cliente pode:
- ✅ Dashboard: Ver dados de geração solar, consumo, economia
- ✅ Geração: Gráficos de produção de energia
- ✅ Consumo: Análise de uso de energia
- ✅ Financeiro: Ver economia gerada e ROI
- ✅ Contratos: Acessar documentos e termos
- ✅ Suporte: Abrir chamados (armazenados localmente)
- ✅ Logout: Desconectar com segurança

#### ✅ Admin pode:
- ✅ Dashboard: Visão geral de todos os clientes
- ✅ Auditoria: Ver logs de todas as ações
- ✅ Gerenciar Clientes: Lista completa de usuários
- ✅ Configurações: Ajustes do sistema
- ✅ Permissões: Ver/modificar roles e acessos
- ✅ Logout: Desconectar

### 4️⃣ Dados Simulados x Dados Reais

**O que é simulado (não precisa backend)?**
- ✅ Login/Logout
- ✅ Registro de usuários
- ✅ Gráficos com números aleatórios
- ✅ Chamados abertos/armazenados
- ✅ Logs de auditoria
- ✅ Permissões e acesso

**O que NÃO funciona sem backend?**
- ❌ Dados reais de energia (precisa smart meter)
- ❌ Pagamento de faturas (precisa Stripe)
- ❌ Email de notificações (precisa SendGrid)
- ❌ Dados persistem para sempre (localStorage tem limite)
- ❌ Múltiplos usuários em paralelo (simulado apenas)

---

## 📍 Estrutura do Projeto

```
├── index.html                    # Home page
├── login.html                    # Login cliente
├── login-admin.html              # Login admin
├── registro.html                 # Cadastro novo cliente
│
├── Dashboard & Cliente
├── cliente-geracao.html          # Gráficos de geração solar
├── cliente-consumo.html          # Análise de consumo
├── cliente-financeiro.html       # Economia e ROI
├── cliente-contratos.html        # Documentos/contratos
├── cliente-sistema.html          # Status do sistema
│
├── Admin
├── admin.html                    # Dashboard admin
├── auditoria.html                # 🆕 Logs de auditória (RESTAURADO)
├── admin-clientes.html           # Gestão de clientes
├── admin-servicos.html           # Serviços oferecidos
├── admin-equipamentos.html       # Inventário de equipamentos
├── admin-relatorios.html         # Relatórios analíticos
├── admin-configuracoes.html      # Configurações do sistema
│
├── Core Scripts
├── script.js                     # Lógica principal (2150+ linhas)
├── sistema-permissoes.js         # RBAC (quem pode fazer o quê)
├── sistema-aprovacoes.js         # Fluxo de aprovação de clientes
├── workflow-aprovacoes.js        # State machine de aprovações
├── cliente-funcoes.js            # Funções específicas do cliente
├── admin-funcoes.js              # Funções específicas do admin
│
├── Estilos
└── style.css                     # Dark theme (CSS3)
```

---

## 🔐 Conceitos Importantes

### Dois Universos Separados
O sistema separa completamente **Cliente** de **Admin**:

| Aspecto | Cliente | Admin |
|---------|---------|-------|
| **Acesso a** | Dados próprios | Todos os dados |
| **Pode fazer** | Ver/gerar chamados | Gerenciar tudo |
| **Vê menu** | Limitado (7 itens) | Completo (15 itens) |
| **Dados que enxerga** | Seu próprio sistema | Todos os clientes |

### localStorage: Onde Ficam os Dados
Como não há backend, os dados são armazenados no navegador:

```javascript
// Cliente:
localStorage.rtv_usuarios        // Lista de usuários
localStorage.rtv_chamados        // Chamados abertos

// Admin:
localStorage.rtv_logs_auditoria  // Todos os logs
localStorage.rtv_permissoes      // Roles/permissões
```

**Importante**: Cada navegador tem seus próprios dados!
- Chrome = Dados diferentes de Firefox
- Limpar histórico = Perder dados

---

## 🆕 Novo: Sistema de Aprovação

**Cliente novo se registra → Admin aprova → Cliente pode acessar**

```
Cliente faz registro
         ↓
Aparece como "Pendente" no admin
         ↓
Admin clica [Aprovar]
         ↓
Cliente recebe acesso
```

Enquanto "Pendente", cliente vê: *"Sua conta está sob revisão"*

---

## ❓ Perguntas Comuns

**P: Perdi minha senha, como reseto?**
- R: Não há sistema de recovery. Use Dev Tools (F12) → Console e limpe localStorage.

**P: Os dados salvam forever?**
- R: Não, apenas no navegador (localStorage). Se limpar cookies/cache, perdem.

**P: Posso acessar como dois usuários ao mesmo tempo?**
- R: Não, apenas um ativo por navegador. Use outro navegador ou inprivate.

**P: Por que alguns botões não fazem nada?**
- R: Porque precisam de backend (banco de dados, API). Veja [KNOWN-ISSUES.md](./KNOWN-ISSUES.md)

**P: Como começo o backend?**
- R: Veja [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md) para guia completo.

---

## 🎯 Próximos Passos

**Se você é developer:**
1. ✅ Leia [ARQUITETURA.md](./ARQUITETURA.md) - 10 min
2. ✅ Leia [PERMISSOES-E-SEGURANCA.md](./PERMISSOES-E-SEGURANCA.md) - 5 min
3. ✅ Veja [PAGINAS-E-FUNCIONALIDADES.md](./PAGINAS-E-FUNCIONALIDADES.md) - 10 min
4. ✅ Estude [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md) quando pronto para desenvolver

**Se você é tester/QA:**
1. ✅ Leia este arquivo (você acabou!)
2. ✅ Abra o sistema e teste cada página
3. ✅ Veja [PAGINAS-E-FUNCIONALIDADES.md](./PAGINAS-E-FUNCIONALIDADES.md) para saber o que deveria funcionar
4. ✅ Reporte problemas contra [KNOWN-ISSUES.md](./KNOWN-ISSUES.md)

**Se você é manager/stakeholder:**
- Veja [README.md](./README.md) para status geral do projeto
- Veja [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md) para timeline estimada

---

*Pronto para começar? Abra index.html! 🎉*
