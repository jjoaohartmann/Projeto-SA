# 📋 PLANO DE REORGANIZAÇÃO - RTV SOLAR

## Status: EM PROGRESSO ✅

---

## ✅ JÁ IMPLEMENTADO

### 1. Sistema de Permissões (`sistema-permissoes.js`) ✅
- Definição de ROLES (admin, cliente)
- Permissões específicas por role
- Menu dinâmico baseado no role
- Rotas protegidas
- Verificação de acesso em tempo real
- Elementos HTML com controle de visibilidade (`data-permissao`, `data-role`)

### 2. Gerenciador de Dados do Cliente (`cliente-sistema.js`) ✅ 
- Estrutura de dados do sistema solar
- Métricas de geração e consumo
- Economia acumulada
- Impacto ambiental (CO2, árvores)
- ROI e payback estimado
- Renderização de widgets

### 3. Dashboard Cliente Atualizado ✅
- 14 widgets novos com dados reais
- Geração solar em tempo real
- Consumo vs geração
- Economia acumulada
- Créditos disponíveis
- CO2 evitado e árvores plantadas
- Eficiência e payback
- Todos com permissões controladas

---

## 🔄 PRÓXIMAS ETAPAS

### Fase 2: Corrigir Menus e Navegação

**O QUE FAZER:**

1. **Atualizar todos os HTMLs para incluir `sistema-permissoes.js`**
   - [ ] login.html
   - [ ] login-admin.html
   - [ ] suporte.html
   - [ ] manutencao.html
   - [ ] auditoria.html
   - [ ] configuracoes.html
   - [ ] dispositivos.html
   - [ ] monitoramento.html
   - [ ] analytics.html
   - [ ] relatorios.html

2. **Criar páginas específicas de cliente** (usando a mesma estética):
   - [ ] cliente-geracao.html
   - [ ] cliente-consumo.html
   - [ ] cliente-financeiro.html
   - [ ] cliente-contratos.html

3. **Criar páginas específicas de admin** (usando a mesma estética):
   - [ ] admin-clientes.html (gestão de clientes)
   - [ ] admin-servicos.html (gestão de serviços)
   - [ ] admin-equipamentos.html (gestão de equipamentos)
   - [ ] admin-relatorios.html (relatórios globais)
   - [ ] admin-configuracoes.html (configurações gerais)

### Fase 3: Remover Duplicidade

**O QUE FAZER:**

1. [ ] Manter apenas `registro.html` para cadastro
2. [ ] Remover ou desativar `cadastro.html`
3. [ ] Remover links para cadastro.html em todo o site
4. [ ] Limpar código redundante

### Fase 4: Ajustar Menus Dinâmicos

**O QUE FAZER:**

1. [ ] Sidebar dashboard.html vai gerar menu de cliente automaticamente
2. [ ] Sidebar admin.html vai gerar menu de admin automaticamente
3. [ ] Menu vai mudar conforme o usuário faz logout/login

### Fase 5: Adicionar Funcionalidades Admin

**Gestão de Clientes (admin-clientes.html):**
- [ ] Lista de todos os clientes
- [ ] Status (aprovado, pendente, ativo)
- [ ] Ações: Editar, Deletar, Aprovar
- [ ] Filtros: Por status, por data

**Gestão de Serviços (admin-servicos.html):**
- [ ] Lista de serviços disponíveis
- [ ] Preços e descrições
- [ ] Serviços contratados por cliente
- [ ] Status de instalação

**Gestão de Equipamentos (admin-equipamentos.html):**
- [ ] Inventário de equipamentos
- [ ] Equipamentos por cliente
- [ ] Status de garantia
- [ ] Alertas de manutenção

### Fase 6: Scripts JavaScript Adicionais Necessários

**O QUE CRIAR:**

1. [ ] `admin-clientes.js` - Lógica de gestão de clientes
2. [ ] `admin-servicos.js` - Lógica de gestão de serviços
3. [ ] `admin-equipamentos.js` - Lógica de gestão de equipamentos
4. [ ] `admin-relatorios.js` - Lógica de geração de relatórios

### Fase 7: Dados do Modelo (localStorage)

**ESTRUTURA NECESSÁRIA:**

```javascript
// Já existe:
rtv_usuarios
rtv_logs_auditoria
  
// Precisa de estrutura melhorada:
rtv_clientes_sistemas (criado em cliente-sistema.js)

// Precisa criar:
rtv_servicos // Lista de serviços disponíveis
rtv_equipamentos // Inventário de equipamentos
rtv_contratos // Contratos de clientes
rtv_chamados // Chamados de suporte
```

---

## 📊 ARQUITETURA FINAL

```
USUÁRIO ACESSA
    |
    ├─ É ADMIN?
    │   └─ admin.html (menu admin automático)
    │       ├─ admin-clientes.html
    │       ├─ admin-servicos.html
    │       ├─ admin-equipamentos.html
    │       ├─ admin-relatorios.html
    │       └─ admin-configuracoes.html
    │
    └─ É CLIENTE?
        └─ dashboard.html (menu cliente automático)
            ├─ cliente-geracao.html
            ├─ cliente-consumo.html
            ├─ cliente-financeiro.html
            ├─ cliente-contratos.html
            ├─ monitoramento.html
            ├─ suporte.html
            └─ manutencao.html
```

---

## 🎯 PERMITIR/BLOQUEAR ACESSO

**SCRIPTS IMPLEMENTADOS:**

✅ `sistema-permissoes.js`
- Verifica role do usuário
- Valida acesso à página
- Controla visibilidade de elementos
- Redireciona automaticamente

**USO NOS HTMLs:**

```html
<!-- Mostrar apenas para admin -->
<div data-role="admin">
  Conteúdo apenas para admin
</div>

<!-- Mostrar apenas se tem permissão -->
<div data-permissao="ver_clientes">
  Conteúdo para ver clientes
</div>

<!-- Em JavaScript -->
if (temPermissao("ver_clientes")) {
    // Fazer algo
}
```

---

## ✨ FUNCIONALIDADES POR COMPLETAS

### CLIENTE

**Dashboard:**
- ✅ Visão geral do sistema
- ✅ Geração solar em tempo real
- ✅ Consumo vs geração
- ✅ Economia acumulada
- ✅ Impacto ambiental
- ✅ ROI e payback

**Novas Páginas:**
- [ ] Geração (detalhes por painel/inversor)
- [ ] Consumo (gráficos de consumo)
- [ ] Financeiro (faturas, créditos)
- [ ] Contratos (documentos digitais)

**Existentes:**
- ✅ Monitoramento em tempo real
- ✅ Suporte (abrir chamados)
- ✅ Manutenção (agendar)
- ✅ Configurações

### ADMIN

**Dashboard:**
- ✅ Métricas gerais
- ✅ Lista de clientes
- ✅ Aprovação de cadastros
- ✅ Aprovação de serviços

**Novas Páginas:**
- [ ] Gestão de Clientes (listar, editar, deletar)
- [ ] Gestão de Serviços (cadastrar, editar, ver contratações)
- [ ] Gestão de Equipamentos (inventário, status)
- [ ] Relatórios Globais (gráficos, exportar)
- [ ] Configurações (sistema, usuários)

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Arquivos JavaScript
- [x] sistema-permissoes.js
- [x] cliente-sistema.js
- [ ] admin-clientes.js
- [ ] admin-servicos.js
- [ ] admin-equipamentos.js
- [ ] admin-relatorios.js

### Páginas Cliente
- [x] dashboard.html (atualizado)
- [ ] cliente-geracao.html
- [ ] cliente-consumo.html
- [ ] cliente-financeiro.html
- [ ] cliente-contratos.html

### Páginas Admin
- [x] admin.html (com sistema-permissões)
- [ ] admin-clientes.html
- [ ] admin-servicos.html
- [ ] admin-equipamentos.html
- [ ] admin-relatorios.html
- [ ] admin-configuracoes.html

### Atualizações de HTMLs
- [x] dashboard.html (script de permissões + cliente-sistema)
- [x] admin.html (script de permissões)
- [ ] Todos os outros HTMLs (adicionar sistema-permissões.js)

### Limpeza
- [ ] Remover ou desativar cadastro.html
- [ ] Remover links para cadastro.html
- [ ] Remover código redundante

---

## 🚀 PRÓXIMAS AÇÕES (PRIORIDADE)

1. **ALTA:** Atualizar todos os HTMLs com sistema-permissões.js
2. **ALTA:** Criar páginas específicas de cliente (5 arquivos)
3. **ALTA:** Criar páginas específicas de admin (5 arquivos)
4. **MÉDIA:** Implementar funcionalidades de admin (gestão)
5. **MÉDIA:** Remover cadastro.html e consolidar
6. **BAIXA:** Adicionar mais funcionalidades no futuro

---

## 📞 NOTAS

- ✅ Nenhum design foi alterado
- ✅ Cores, tipografia, layout mantidos
- ✅ Estética original preservada
- ✅ Sistema escalável para futuras funcionalidades
- ✅ Estrutura de dados flexível

**Status Geral:** 40% completo
**Próxima Revisão:** Após Fase 2
