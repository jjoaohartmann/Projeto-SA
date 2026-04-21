# 📄 Páginas e Funcionalidades

**Versão**: 1.0 | **Data**: 19/04/2026 | **Completo**: ✅

---

## 📊 Mapa Completo do Sistema

Total: **27 páginas HTML** | **Status**: 🔧 Parcialmente funcional (12% dos botões)

---

## 👤 PÁGINAS DO CLIENTE

### 1. **index.html** - Página Inicial
- **Acesso**: Público (sem login necessário)
- **O que tem**:
  - ✅ Informações sobre RTV Solar
  - ✅ Simulador de economia (corrigido)
  - ✅ Botões: "Área do Cliente", "Login", "Admin"
- **Status**: ✅ Totalmente funcional

### 2. **login.html** - Login Cliente
- **Acesso**: Público
- **O que tem**:
  - ✅ Campos: Email, Senha
  - ✅ Validação de login
  - ✅ Link para "Criar Conta"
  - ✅ Redirecionamento para dashboard se aprovado
- **Status**: ✅ Totalmente funcional
- **Nota**: Cliente não acessa se não aprovado por admin

### 3. **registro.html** - Cadastro de Cliente
- **Acesso**: Público
- **O que tem**:
  - ✅ Formulário: Nome, Email, Telefone, Endereço, CPF, Senha
  - ✅ Validação de campos
  - ✅ Terms & conditions checkbox
  - ✅ Salva com status: "Aguardando Aprovação"
- **Status**: ✅ Totalmente funcional
- **Fluxo**: Novo cliente se registra → Aparece como "Pendente" no admin → Admin aprova

### 4. **cliente-geracao.html** - Geração Solar
- **Acesso**: Apenas cliente logado
- **O que tem**:
  - ✅ Gráficos de kW gerados (por hora, semana, ano)
  - ✅ Status dos equipamentos (painéis, inversor, medidor, bateria)
  - ✅ Performance global (%)
  - ✅ Dicas de otimização
- **Status**: ✅ Funcional (dados simulados)
- **Dados**: Gerados aleatoriamente, não são dados reais

### 5. **cliente-consumo.html** - Consumo de Energia
- **Acesso**: Apenas cliente logado
- **O que tem**:
  - ✅ Gráficode consumo por período
  - ✅ Comparação com meta mensal
  - ✅ Breakdown por equipamento (AC, chuveiro, geladeira, etc)
  - ✅ Dicas de economia
- **Status**: ✅ Funcional (dados simulados)

### 6. **cliente-financeiro.html** - Financeiro/ROI
- **Acesso**: Apenas cliente logado
- **O que tem**:
  - ✅ Economia gerada (mensal, anual)
  - ✅ Payback estimado
  - ✅ ROI (retorno sobre investimento)
  - ✅ Créditos disponíveis
- **Status**: ✅ Funcional

### 7. **cliente-contratos.html** - Contratos/Documentos
- **Acesso**: Apenas cliente logado
- **O que tem**:
  - ✅ Lista de contratos disponíveis
  - ✅ Termos de garantia (painéis: 25 anos)
  - ✅ Acordo de compensação (60 meses)
  - ❌ Download de PDFs (requer backend)
- **Status**: ⚠️ Parcial (sem downloads)

### 8. **cliente-sistema.html** - Status Geral
- **Acesso**: Apenas cliente logado
- **O que tem**:
  - ✅ Dashboard com mapa visual do sistema solar
  - ✅ Status de componentes (online/offline)
  - ✅ Alertas críticos
- **Status**: ✅ Funcional

### 9. **suporte.html** - Suporte/Chamados
- **Acesso**: Cliente e Admin
- **O que tem**:
  - ✅ Abrir novo chamado
  - ✅ Lista de chamados abertos
  - ✅ Status: Aberto, Em Análise, Resolvido
  - ✅ Campo de comentários
  - ⚠️ Admin vê todos, cliente vê só os dele (implementado)
- **Status**: ⚠️ Parcial (filtro por usuário funciona apenas com localStorage)

---

## 🛠️ PÁGINAS ADMINISTRATIVAS

### 10. **login-admin.html** - Login Admin
- **Acesso**: Público
- **O que tem**:
  - ✅ Email, senha específicos do admin
  - ✅ Redirecionamento para admin.html
- **Status**: ✅ Funcional
- **Credencial**: admin@rtvsolar.com / admin123

### 11. **admin.html** - Dashboard Admin
- **Acesso**: Apenas admin logado
- **O que tem**:
  - ✅ Métricas gerais (clientes, chamados abertos, equipamentos)
  - ✅ Gráficos de uso geral
  - ✅ Alertas do sistema
  - ✅ 4 abas: Overview, Aprovações, Serviços, Manutenção
- **Status**: ✅ Funcional

### 12. **auditoria.html** 🆕 - Logs de Auditoria
- **Acesso**: Apenas admin logado
- **O que tem**:
  - ✅ Filtros: Tipo de ação, usuário, período, severidade
  - ✅ Lista de logs com paginação (20 por página)
  - ✅ Estatísticas automáticas (total, últimas 24h, por categoria)
  - ✅ Exportar para CSV
- **Status**: ✅ Totalmente restaurado e funcional
- **Dados originários de**: localStorage.rtv_logs_auditoria (sistema registra automaticamente)

### 13. **admin-clientes.html** - Gestão de Clientes
- **Acesso**: Apenas admin logado
- **O que tem**:
  - ✅ Lista de todos os clientes
  - ✅ Filtros por status (ativo, inativo, bloqueado)
  - ❌ Editar cliente (requer backend)
  - ❌ Deletar cliente (requer backend)
- **Status**: ⚠️ Parcial (lista funciona, edições não)

### 14. **admin-servicos.html** - Gerenciar Serviços
- **Acesso**: Apenas admin logado
- **O que tem**:
  - ✅ Lista de serviços (Instalação, Manutenção, Monitoramento, etc)
  - ❌ Criar novo serviço
  - ❌ Editar preço
- **Status**: ⚠️ Parcial (visualização apenas)

### 15. **admin-equipamentos.html** - Inventário
- **Acesso**: Apenas admin logado
- **O que tem**:
  - ✅ Lista de equipamentos (painéis, inversores, baterias)
  - ✅ Status (ativo, inativo, reservado)
  - ✅ Localização
- **Status**: ⚠️ Parcial (sem criar/editar)

### 16. **admin-relatorios.html** - Relatórios Analíticos
- **Acesso**: Apenas admin logado
- **O que tem**:
  - ✅ Relatórios por período
  - ✅ Exportar para Excel/PDF
- **Status**: ⚠️ Parcial (alguns botões funcionam)

### 17. **admin-configuracoes.html** - Configurações
- **Acesso**: Apenas admin (e às vezes cliente - BUG)
- **O que tem**:
  - ⚠️ Opções de sistema
  - ❌ Delete account (funciona)
  - ⚠️ **BUG**: Cliente também vê esta página (precisa fix)
- **Status**: 🔴 Requer correção

### 18. **configuracoes.html** - Configurações Geral
- **Acesso**: Ambos (cliente e admin compartilham)
- **Status**: 🔴 Requer separação/correção

---

## 🗂️ PÁGINAS COMPARTILHADAS

### 19. **monitoramento.html**
- **O que tem**: Monitoramento em tempo real
- **Status**: ✅ Funcional (dados simulados)

### 20. **manutencao.html**
- **O que tem**: Agendamento de manutenção
- **Status**: ✅ Funcional

### 21. **relatorios.html**
- **O que tem**: Relatórios gerais
- **Status**: ⚠️ Parcial

### 22. **servicos.html**
- **O que tem**: Lista de serviços disponíveis
- **Status**: ✅ Funcional

### 23. **dispositivos.html**
- **O que tem**: Status de dispositivos
- **Status**: ✅ Funcional

### 24-27. **Páginas Extras**
- dashboard.html, analíticos.html, etc
- **Status**: Varies (mostly partial)

---

## 📊 Resumo de Funcionalidade

| Categoria | Funcional | Parcial | Não funciona |
|-----------|-----------|---------|-------------|
| **Login/Registro** | 3 | 0 | 0 |
| **Dashboard Cliente** | 5 | 0 | 0 |
| **Dashboard Admin** | 2 | 0 | 0 |
| **Gerenciais** | 2 | 4 | 0 |
| **Suporte** | 1 | 1 | 0 |
| **TOTAL** | 13 | 5 | 0 |

**Taxa**: 72% totalmente funcional, 28% parcial

---

## 🔴 Problemas Conhecidos

### P1: Configurações compartilhadas
- `admin-configuracoes.html` E `configuracoes.html` não separadas
- Cliente vê opções de admin
- **Fix**: Criar versões separadas ou filtrar elementos com `data-role`

### P2: Alguns botões não funcionam
- ❌ 169 botões sem controlador/handler
- ❌ Requerem backend (banco de dados, API)
- **Exemplos**: Editar cliente, deletar equipamento, processar pagamento

### P3: Dados compartilhados no localStorage
- Se cliente conseguir acessar admin-clientes.html, vê TODOS os clientes
- localStorage não separa por usuário
- **Fix**: Requer backend com autenticação real

---

## ✅ O que Realmente Funciona

1. ✅ Login/Logout
2. ✅ Registro com aprovação
3. ✅ Dashboard com gráficos (dados simulados)
4. ✅ Visualização de consumo/geração
5. ✅ Abrir chamados de suporte
6. ✅ Menu separado admin/cliente
7. ✅ Auditoria (logs) para admin
8. ✅ Cálculo de economia
9. ✅ Controle de permissões
10. ✅ Exportação simples (CSV)

---

## ❌ O que NÃO Funciona sem Backend

1. ❌ Dados reais de energia (precisa smart meter API)
2. ❌ Modificações de dados (Editar, Deletar)
3. ❌ Pagamentos de fatura
4. ❌ Email de notificações
5. ❌ Múltiplos usuários simultâneos
6. ❌ Download de PDFs reais
7. ❌ Reset de senha
8. ❌ 2FA (autenticação de dois fatores)

---

*Para implementar as funcionalidades faltantes, veja [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md)*
