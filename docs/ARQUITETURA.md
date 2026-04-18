# 🏗️ Arquitetura do Sistema

## Visão Geral

O RTV Solar é uma plataforma web full-stack que separa completamente o sistema de clientes do sistema administrativo, implementando controle de acesso baseado em papéis (RBAC).

```
┌─────────────────────────────────────────────────────────┐
│                 CAMADA DE APRESENTAÇÃO                  │
│  (HTML5 + CSS3 Dark Theme + JavaScript Vanilla)         │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│        CAMADA DE CONTROLE DE ACESSO (RBAC)              │
│              sistema-permissoes.js                      │
│  - Roles: admin, cliente                                │
│  - 26 permissões definidas                              │
│  - Data-attributes para controle DOM                    │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│          CAMADA DE NEGÓCIO & DADOS                       │
│  ├─ cliente-sistema.js (Dados solares)                 │
│  ├─ admin-clientes.js (Gestão clientela)               │
│  ├─ admin-servicos.js (Serviços)                       │
│  ├─ admin-equipamentos.js (Inventário)                 │
│  ├─ admin-relatorios.js (Analytics)                    │
│  └─ admin-configuracoes.js (Config)                    │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│              CAMADA DE PERSISTÊNCIA                      │
│              localStorage API (Client-side)             │
│  ├─ rtv_usuarios (Autenticação)                        │
│  ├─ rtv_clientes_sistemas (Dados solares)              │
│  ├─ rtv_logs_auditoria (Auditoria)                     │
│  └─ ... (15+ estruturas de dados)                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Sistema de Permissões

### Roles Definidas

#### 👤 Cliente
Permissões (12 total):
- `ver_geração_propria`
- `ver_consumo_proprio`
- `ver_financeiro_proprio`
- `editar_perfil`
- `solicitar_manutencao`
- `abrir_chamado`
- `etc...`

#### 🔧 Administrador
Permissões (14 total):
- `gerenciar_clientes`
- `gerenciar_servicos`
- `gerenciar_equipamentos`
- `gerar_relatorios`
- `gerenciar_config`
- `ver_auditoria`
- `etc...`

### Implementação

```javascript
// Data-attributes
<div data-permissao="ver_geração_propria">
  ← Só visível para quem tem essa permissão

// JavaScript
if (temPermissao("ver_geração_propria")) {
  // Executar ação
}

// Rotas Protegidas
ROTAS_PROTEGIDAS = {
  "admin.html": ["admin"],
  "dashboard.html": ["cliente", "admin"]
}
```

---

## 📁 Estrutura de Dados

### Usuários (rtv_usuarios)
```json
{
  "id": "user_123",
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "cliente",
  "status": "aprovado",
  "dataCadastro": "15/03/2024",
  "contratoValor": 25000,
  "tempoCliente": "10 meses"
}
```

### Sistema Solar (rtv_clientes_sistemas)
```json
{
  "clienteId": "user_123",
  "equipamentos": {
    "paineis": { "quantidade": 24, "potencia": 6000 },
    "inversor": { "modelo": "Huawei 10kW", "status": "online" },
    "medidor": { "modelo": "Schneider", "status": "online" },
    "bateria": { "presente": false }
  },
  "metricas_dia": {
    "geracaoAgora": 3.8,
    "consumoAgora": 1.2,
    "economiaHoje": 412.50
  },
  "financeiro": {
    "investimentoInicial": 20000,
    "paybackEstimado": 6.2,
    "roi": 16.2
  }
}
```

---

## 🎯 Fluxos Principais

### 1️⃣ Autenticação & Login
```
Login Page
    ↓
Script.js: validarLogin()
    ↓
localStorage (rtv_usuarios)
    ↓
sistema-permissoes.js: carregarPermissoes()
    ↓
Renderizar dashboard baseado em role
```

### 2️⃣ Visualização de Dados (Cliente)
```
dashboard.html
    ↓
cliente-sistema.js: obterSistemaCliente()
    ↓
localStorage (rtv_clientes_sistemas)
    ↓
renderizarWidgets()
    ↓
Chart.js: Gráficos em tempo real
```

### 3️⃣ Gestão de Clientes (Admin)
```
admin-clientes.html
    ↓
AdminClientesAPI.obterClientes()
    ↓
localStorage (rtv_usuarios)
    ↓
Tabela com filtros/paginação
    ↓
Ações: Aprovar, Rejeitar, Suspender, Deletar
```

---

## 💾 APIs Implementadas

### AdminClientesAPI
```javascript
AdminClientesAPI.obterClientes(filtros)
AdminClientesAPI.aprovarCliente(id, motivo)
AdminClientesAPI.rejeitarCliente(id, motivo)
AdminClientesAPI.suspenderCliente(id, motivo, dias)
AdminClientesAPI.atualizarCliente(id, dados)
AdminClientesAPI.deletarCliente(id)
AdminClientesAPI.exportarCSV(filtros)
```

### AdminServicosAPI
```javascript
AdminServicosAPI.criarServico(dados)
AdminServicosAPI.atualizarServico(id, dados)
AdminServicosAPI.deletarServico(id)
AdminServicosAPI.obterReceitaPorServico(periodo)
AdminServicosAPI.aplicarDesconto(servicoId, percentual)
```

### AdminEquipamentosAPI
```javascript
AdminEquipamentosAPI.obterEquipamentos(filtros)
AdminEquipamentosAPI.agendarManutencao(clienteId, tipo, data)
AdminEquipamentosAPI.finalizarManutencao(id, relatorio)
AdminEquipamentosAPI.registrarFalha(clienteId, tipo, desc)
AdminEquipamentosAPI.atualizarInventario(tipo, qty, op)
```

### AdminRelatoriosAPI
```javascript
AdminRelatoriosAPI.gerarRelatórioClientes(filtros)
AdminRelatoriosAPI.gerarRelatórioFinanceiro(mes, ano)
AdminRelatoriosAPI.gerarRelatórioEnergia(periodo)
AdminRelatoriosAPI.gerarRelatórioPerformance()
AdminRelatoriosAPI.agendarRelatórioAutomático(tipo, freq)
```

### AdminConfiguracaoAPI
```javascript
AdminConfiguracaoAPI.obterConfiguracoes()
AdminConfiguracaoAPI.atualizarConfiguracoes(valores)
AdminConfiguracaoAPI.testarIntegracao(nome)
AdminConfiguracaoAPI.fazrBackupImediato()
AdminConfiguracaoAPI.renovarCertificadoSSL()
AdminConfiguracaoAPI.configurar2FA(habilitado)
```

---

## 🎨 Design & UX

### Tema
- **Cor Primária**: Verde Água (#2A8C82) 
- **Cor Secundária**: Amarelo Vivo (#F4A222)
- **Cor Negativa**: Vermelho (#ff5f56)
- **Fundo**: Cinza Escuro (#333333/#222222)
- **Tipografia**: System fonts (responsiva)

### Padrões
- Ícones: Phosphor Icons
- Gráficos: Chart.js
- Componentes: Custom HTML5/CSS3
- Grid: CSS Grid 12-colunas

---

## 🔄 Fluxo de Dados em Tempo Real

```
cliente-sistema.js
    ↓
obterSistemaCliente() [localStorage]
    ↓
atualizarMetricasTempoReal() [setInterval 30s]
    ↓
renderizarWidgets() [DOM]
    ↓
Chart.js atualiza gráficos
```

---

## 📊 Performance

- **Carregamento inicial**: ~1.2s (sem backend)
- **Re-render widgets**: <100ms
- **Gráficos**: <500ms (Chart.js)
- **Storage**: localStorage ~500KB
- **Memória**: <50MB

---

## 🚀 Próximos Passos

1. **Backend REST**: Node.js + Express
2. **Database**: PostgreSQL
3. **Real-time**: WebSockets
4. **Auth**: JWT + 2FA
5. **CI/CD**: GitHub Actions
