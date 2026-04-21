# 🎨 Guia Rápido: Integração UI com APIs Admin

## 📋 Visão Geral

Step-by-step para integrar as AdminAPIs em seus arquivos HTML e criar componentes reutilizáveis.

---

## 🔧 Padrão de Integração

### Passo 1: Importar API no HTML

```html
<!-- admin-clientes.html -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Seu conteúdo aqui -->
    
    <!-- Scripts na ordem correta -->
    <script src="script.js"></script>           <!-- Funções base -->
    <script src="admin-clientes.js"></script>   <!-- API do módulo -->
    <script src="pages/admin-clientes-ui.js"></script> <!-- UI específica -->
</body>
</html>
```

### Passo 2: Criar Arquivo UI Específico

```javascript
// pages/admin-clientes-ui.js

// Ao carregar página
document.addEventListener('DOMContentLoaded', async () => {
    verificarPermissao('gerenciar_clientes');
    await carregarClientes();
});

// Função para carregar dados
async function carregarClientes(filtros = {}) {
    mostrarCarregando(true);
    
    try {
        const clientes = await AdminClientesAPI.obterClientes(filtros);
        renderizarTabela(clientes);
        ocultarCarregando();
    } catch (erro) {
        mostrarErro('Erro ao carregar clientes: ' + erro);
    }
}

// Renderizar tabela
function renderizarTabela(clientes) {
    const tbody = document.querySelector('tbody');
    
    tbody.innerHTML = clientes.map(cliente => `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td><span class="badge ${cliente.status}">${cliente.status}</span></td>
            <td>
                <button class="btn-sm" onclick="abrirModalAprovar('${cliente.id}')">
                    ✓ Aprovar
                </button>
                <button class="btn-sm-danger" onclick="abrirModalRejeitar('${cliente.id}')">
                    ✗ Rejeitar
                </button>
                <button class="btn-sm-warning" onclick="abrirModalSuspender('${cliente.id}')">
                    ⏸ Suspender
                </button>
            </td>
        </tr>
    `).join('');
}
```

---

## 🎯 Componentes Reutilizáveis

### 1. Modal de Ação

```html
<!-- Modal genérico -->
<div id="modal-acao" class="modal">
    <div class="modal-content">
        <span class="close" onclick="fecharModal()">&times;</span>
        <h2 id="modal-titulo">Ação</h2>
        <p id="modal-descricao"></p>
        
        <form id="form-acao">
            <div class="form-group">
                <label id="label-motivo">Motivo</label>
                <textarea id="motivo" required></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary">Confirmar</button>
            <button type="button" class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
        </form>
    </div>
</div>

<style>
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
}

.modal.ativa { display: flex; }

.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 400px;
    border-radius: 8px;
}

.close {
    color: #aaa;
    cursor: pointer;
    font-size: 28px;
}

.close:hover { color: black; }
</style>
```

### 2. Loading State

```html
<!-- Componente de carregamento -->
<div id="loading" class="loading hidden">
    <div class="spinner"></div>
    <p>Carregando...</p>
</div>

<style>
.loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 999;
}

.loading.hidden { display: none; }

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2A8C82;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
```

### 3. Toast Notifications

```javascript
// Crear toast notifications
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.remove(); }, 3000);
}

// Uso
mostrarNotificacao('✅ Cliente aprovado!', 'sucesso');
mostrarNotificacao('❌ Erro ao salvar', 'erro');
mostrarNotificacao('⚠️ Atenção', 'aviso');
```

---

## 📊 Exemplo Completo: Admin Clientes

### HTML

```html
<!-- admin-clientes.html -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Clientes</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .filtros { margin-bottom: 20px; }
        .filtros input { margin-right: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; font-weight: bold; }
        tr:hover { background-color: #f9f9f9; }
        .badge { padding: 4px 8px; border-radius: 4px; }
        .badge.ativo { background: #d4edda; color: #155724; }
        .badge.pendente { background: #fff3cd; color: #856404; }
        .badge.rejeitado { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="container" data-permissao="gerenciar_clientes">
        <h1>👥 Gerenciar Clientes</h1>
        
        <!-- Filtros -->
        <div class="filtros">
            <input type="text" id="filtro-nome" placeholder="Buscar por nome...">
            <select id="filtro-status">
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="rejeitado">Rejeitado</option>
            </select>
            <button class="btn btn-primary" onclick="aplicarFiltros()">🔍 Buscar</button>
            <button class="btn btn-secondary" onclick="exportarCSV()">📥 Exportar CSV</button>
        </div>
        
        <!-- Tabela -->
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="clientes-tbody">
                <!-- Preenchido por JavaScript -->
            </tbody>
        </table>
        
        <!-- Modals -->
        <div id="modal-aprovar" class="modal">
            <div class="modal-content">
                <span class="close" onclick="fecharModal()">&times;</span>
                <h2>Aprovar Cliente</h2>
                <form onsubmit="confirmarAprovar(event)">
                    <input type="hidden" id="cliente-id">
                    <div class="form-group">
                        <label>Nota (opcional)</label>
                        <textarea id="nota-aprovacao"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Confirmar Aprovação</button>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Carregando -->
    <div id="loading" class="loading hidden">
        <div class="spinner"></div>
        <p>Processando...</p>
    </div>
    
    <!-- Scripts -->
    <script src="../script.js"></script>
    <script src="../admin-clientes.js"></script>
    <script>
        // Carregar clientes ao iniciar
        document.addEventListener('DOMContentLoaded', async () => {
            verificarPermissao('gerenciar_clientes');
            await carregarClientes();
        });
        
        async function carregarClientes(filtros = {}) {
            mostrarCarregando(true);
            try {
                const clientes = await AdminClientesAPI.obterClientes(filtros);
                renderizarTabela(clientes);
            } catch (erro) {
                mostrarNotificacao('❌ Erro ao carregar clientes', 'erro');
            } finally {
                mostrarCarregando(false);
            }
        }
        
        function renderizarTabela(clientes) {
            const tbody = document.getElementById('clientes-tbody');
            tbody.innerHTML = clientes.map(c => `
                <tr>
                    <td>${c.nome}</td>
                    <td>${c.email}</td>
                    <td>${c.telefone || '-'}</td>
                    <td><span class="badge ${c.status}">${c.status}</span></td>
                    <td>
                        ${c.status === 'pendente' ? `
                            <button onclick="abrirModalAprovar('${c.id}')" class="btn-sm">✓</button>
                            <button onclick="abrirModalRejeitar('${c.id}')" class="btn-sm-danger">✗</button>
                        ` : ''}
                        <button onclick="abrirModalSuspender('${c.id}')" class="btn-sm-warning">⏸</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Funções de Modal
        function abrirModalAprovar(clienteId) {
            document.getElementById('cliente-id').value = clienteId;
            document.getElementById('modal-aprovar').classList.add('ativa');
        }
        
        async function confirmarAprovar(event) {
            event.preventDefault();
            const clienteId = document.getElementById('cliente-id').value;
            const nota = document.getElementById('nota-aprovacao').value;
            
            mostrarCarregando(true);
            try {
                await AdminClientesAPI.aprovarCliente(clienteId, nota);
                mostrarNotificacao('✅ Cliente aprovado!', 'sucesso');
                fecharModal();
                await carregarClientes();
            } catch (erro) {
                mostrarNotificacao('❌ Erro ao aprovar', 'erro');
            } finally {
                mostrarCarregando(false);
            }
        }
        
        function fecharModal() {
            document.getElementById('modal-aprovar').classList.remove('ativa');
        }
        
        function mostrarCarregando(mostrar) {
            const loading = document.getElementById('loading');
            if (mostrar) {
                loading.classList.remove('hidden');
            } else {
                loading.classList.add('hidden');
            }
        }
        
        function mostrarNotificacao(msg, tipo) {
            const toast = document.createElement('div');
            toast.className = `toast ${tipo}`;
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
        
        function aplicarFiltros() {
            const nome = document.getElementById('filtro-nome').value;
            const status = document.getElementById('filtro-status').value;
            carregarClientes({ nome, status });
        }
        
        async function exportarCSV() {
            const clientes = await AdminClientesAPI.obterClientes();
            AdminClientesAPI.exportarCSV(clientes);
        }
        
        // Abre modal rejeitar
        function abrirModalRejeitar(clienteId) {
            const motivo = prompt('Por que está rejeitando?');
            if (motivo) {
                rejeitarCliente(clienteId, motivo);
            }
        }
        
        async function rejeitarCliente(clienteId, motivo) {
            mostrarCarregando(true);
            try {
                await AdminClientesAPI.rejeitarCliente(clienteId, motivo);
                mostrarNotificacao('✅ Cliente rejeitado', 'sucesso');
                await carregarClientes();
            } catch (erro) {
                mostrarNotificacao('❌ Erro ao rejeitar', 'erro');
            } finally {
                mostrarCarregando(false);
            }
        }
    </script>
</body>
</html>
```

---

## 🔌 Padrão para Outras Páginas

### Admin Serviços

```javascript
// pages/admin-servicos-ui.js

async function carregarServicos() {
    const servicos = await AdminServicosAPI.obterEstatisticas();
    // renderizar gráficos de estatísticas
}

async function criarServico() {
    const dados = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        preco: parseFloat(document.getElementById('preco').value)
    };
    
    const resultado = await AdminServicosAPI.criarServico(dados);
    if (resultado.sucesso) {
        mostrarNotificacao('✅ Serviço criado!');
        await carregarServicos();
    }
}
```

### Admin Equipamentos

```javascript
// pages/admin-equipamentos-ui.js

async function carregarEquipamentos() {
    const equipamentos = await AdminEquipamentosAPI.obterEquipamentos();
    renderizarTabela(equipamentos);
}

async function agendarManutencao(clienteId) {
    const data = document.getElementById('data-manutencao').value;
    const tipo = document.getElementById('tipo-manutencao').value;
    
    const resultado = await AdminEquipamentosAPI.agendarManutencao(
        clienteId, 
        tipo, 
        data
    );
    
    if (resultado.sucesso) {
        mostrarNotificacao('✅ Manutenção agendada!');
    }
}
```

---

## ✅ Checklist de Integração

- [ ] Importar AdminClientesAPI
- [ ] Importar AdminServicosAPI
- [ ] Importar AdminEquipamentosAPI
- [ ] Importar AdminRelatoriosAPI
- [ ] Importar AdminConfiguracaoAPI
- [ ] Criar modais para ações
- [ ] Implementar loading states
- [ ] Implementar toast notifications
- [ ] Testar fluxos principais
- [ ] Validar permissões
- [ ] Testar em múltiplos navegadores

---

## 🧪 Testes Rápidos

```javascript
// Abrir console (F12) e testar:

// 1. Obter clientes
AdminClientesAPI.obterClientes()

// 2. Aprovar cliente
AdminClientesAPI.aprovarCliente('user_1', 'Documentação ok')

// 3. Gerar relatório
AdminRelatoriosAPI.gerarRelatórioFinanceiro('janeiro', 2025)

// 4. Obter equipamentos
AdminEquipamentosAPI.obterEquipamentos({ tipo: 'painel' })
```

---

**Próxima Etapa**: Implementar essas melhorias em cada página admin e testar fluxos completos!
