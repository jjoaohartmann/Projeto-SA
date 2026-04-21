# 🌞 RTV Solar - Sistema de Gerenciamento de Energia Solar

## ⚡ Status do Projeto

| Aspecto | Status | Detalhes |
|---------|--------|----------|
| **Frontend** | ✅ 100% Completo | 27 páginas HTML, CSS3 dark theme |
| **Autenticação** | ✅ Funcional | Login cliente/admin, registro com aprovação |
| **Permissões (RBAC)** | ✅ Implementado | Separação admin/cliente |
| **Auditoria** | ✅ Restaurado | Logs completos com filtros e export |
| **Backend** | ❌ Não implementado | Próxima fase |
| **Banco de dados** | ❌ Não implementado | PostgreSQL planejado |
| **Email/SMS** | ❌ Não implementado | SendGrid + Twilio planejado |

**TL;DR**: Sistema funciona sem backend. Dados simulados com localStorage. **NUNCA DEPLOY PARA PRODUÇÃO** neste estado.

---

## 🚀 Começar em 2 Minutos

### 1. Abrir o Sistema
```
Duplo-clique em: index.html
```

### 2. Credenciais de Teste
**Cliente:**
```
Email: cliente@demomail.com
Senha: cliente123

OU registre um novo (qualquer credencial)
```

**Admin:**
```
Email: admin@rtvsolar.com
Senha: admin123
```

### 3. Próximo Passo
- Leia: `docs/START-HERE.md` (guia completo de leitura)

---

## 📚 Documentação

**🎯 COMECE AQUI**: [`docs/START-HERE.md`](docs/START-HERE.md)

Todos os documentos em [`/docs`](docs/):

| Documento | Público | Tempo |
|-----------|---------|-------|
| **START-HERE.md** | Todos | 2 min |
| **GUIA-RAPIDO-INICIO.md** | Usuários | 5 min |
| **ARQUITETURA.md** | Developers | 10 min |
| **PERMISSOES-E-SEGURANCA.md** | Developers | 5 min |
| **PAGINAS-E-FUNCIONALIDADES.md** | QA/Developers | 10 min |
| **SETUP.md** | Novos devs | 5 min |
| **KNOWN-ISSUES.md** | Todos | 10 min |
| **MANUTENCAO.md** | Developers/QA | 15 min |
| **RELATORIO-REORGANIZACAO.md** | PM/Leads | 5 min |

---

## 🎯 Dois Caminhos Possíveis

### Caminho 1: Apenas Testar/Entender ⚡ (15 min)
```
1. START-HERE.md
2. GUIA-RAPIDO-INICIO.md
3. Abra index.html e teste
✅ Pronto!
```

### Caminho 2: Desenvolver/Manter 🔧 (1 hora)
```
1. START-HERE.md
2. GUIA-RAPIDO-INICIO.md
3. ARQUITETURA.md
4. PERMISSOES-E-SEGURANCA.md
5. PAGINAS-E-FUNCIONALIDADES.md
6. SETUP.md
7. MANUTENCAO.md
✅ Pronto para contribuir!
```

---

## 📁 Estrutura do Projeto

```
Projeto-SA/
│
├── 📄 PÁGINAS HTML (27 arquivos)
│   ├── index.html                    # Home
│   ├── login.html, login-admin.html  # Login
│   ├── registro.html                 # Cadastro
│   ├── cliente-*.html (8)            # Dashboard cliente
│   ├── admin-*.html (8)              # Dashboard admin
│   └── *.html (outros)               # Suporte, config, etc
│
├── 🔧 SCRIPTS (15 arquivos)
│   ├── script.js                     # Core (2150+ linhas)
│   ├── sistema-permissoes.js         # RBAC
│   ├── sistema-aprovacoes.js         # Fluxo aprovação
│   └── cliente-*.js, admin-*.js      # Funcões específicas
│
├── 🎨 ESTILOS
│   └── style.css                     # Dark theme
│
├── 🖼️ IMAGENS
│   └── imagens/                      # Assets
│
└── 📚 DOCUMENTAÇÃO (centralizada)
    └── docs/                         # NOVA ESTRUTURA
        ├── START-HERE.md             # ← COMECE AQUI
        ├── GUIA-RAPIDO-INICIO.md
        ├── ARQUITETURA.md
        ├── PERMISSOES-E-SEGURANCA.md
        ├── PAGINAS-E-FUNCIONALIDADES.md
        ├── SETUP.md
        ├── KNOWN-ISSUES.md
        ├── MANUTENCAO.md
        ├── RELATORIO-REORGANIZACAO.md
        └── ARQUIVO/                  # Documentação histórica
            └── (20+ arquivos antigos, consultivos)
```

---

## ✅ O que Funciona

✅ Login/Logout  
✅ Registro com aprovação  
✅ Dashboard com gráficos  
✅ Visualização de consumo/geração  
✅ Abrir chamados de suporte  
✅ Menu separado admin/cliente  
✅ Auditoria (logs completos)  
✅ Permissões (RBAC)  
✅ Cálculo de economia  
✅ Exportação CSV

---

## ❌ O que NÃO Funciona (Requer Backend)

❌ 169 botões precisam backend (Editar, Deletar, Pagar, etc)  
❌ Dados reais de energia (smart meter)  
❌ Persistência permanente (localStorage tem limite)  
❌ Senhas criptografadas  
❌ Múltiplos usuários simultâneos  
❌ Email/SMS de notificações  
❌ Pagamento de faturas  
❌ Reset de senha  
❌ 2FA (autenticação dupla)  

**Solução**: Veja [KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md) para roadmap completo

---

## 🔐 Segurança CRÍTICA

⚠️ **NUNCA DEPLOY PARA PRODUÇÃO** neste estado:

- ❌ Senhas em plain text
- ❌ Sem HTTPS/SSL
- ❌ Sem validação no servidor
- ❌ localStorage com limite
- ❌ Sem autenticação real

**Para produção**: Veja [BACKEND-ROADMAP.md](docs/BACKEND-ROADMAP.md)

---

## 👥 Papéis do Sistema

### 👤 CLIENTE
Pessoa com sistema solar instalado.

**Acessa:**
- Dashboard pessoal
- Geração/consumo/finaneiro
- Contratos
- Suporte (abrir chamados)

**Não acessa:**
- Dados de outros clientes
- Auditoria
- Gerenciamento

### 🛡️ ADMIN
Equipe RTV Solar.

**Acessa:**
- Todos os dados
- Auditoria completa
- Gerenciamento de clientes
- Aprovação de cadastros
- Relatórios

---

## 🚀 Próximas Etapas

### Curto Prazo (Esta Semana)
- [ ] Leia documentação em `/docs`
- [ ] Teste todos os fluxos principais
- [ ] Identifique bugs/issues

### Médio Prazo (Semanas 2-3)
- [ ] Implementar backend (Node.js/Python + PostgreSQL)
- [ ] Criar endpoints API
- [ ] Integrar email (SendGrid)

### Longo Prazo (Semanas 4+)
- [ ] Deploy com HTTPS
- [ ] Integrar smart meter
- [ ] Payment gateway (Stripe)
- [ ] 2FA

**Timeline estimada**: 2-4 semanas para produção

---

## 📁 Repositório

**Localização**: `C:\Users\prang\Downloads\Projeto-SA`

**Tipo**: Frontend vanilla (HTML5 + CSS3 + JavaScript)  
**Licença**: Projeto RTV Solar  
**Última atualização**: 19/04/2026

---

## 📞 Suporte/Dúvidas

**Como começar?**  
→ Abra [`docs/START-HERE.md`](docs/START-HERE.md)

**Problema/Bug?**  
→ Veja [`docs/KNOWN-ISSUES.md`](docs/KNOWN-ISSUES.md)

**Como debugar?**  
→ Veja [`docs/MANUTENCAO.md`](docs/MANUTENCAO.md)

**Desenvolvendo?**  
→ Veja [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)

---

## 🎉 Status Resumido

✅ **Frontend**: 100% funcional  
✅ **Autenticação**: Implementada  
✅ **Documentação**: Completa e centralizada  
❌ **Backend**: Próxima fase  

**Conclusão**: Sistema pronto para usar em desenvolvimento. Não é produção-ready.

---

**Comece agora**: Abra [`docs/START-HERE.md`](docs/START-HERE.md) 🚀
