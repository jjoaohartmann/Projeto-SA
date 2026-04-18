# 📚 Cheat Sheet - Referência Rápida das APIs

## 🚀 Início Rápido

```javascript
// Verificar login
const usuario = obterUsuarioLogado();
console.log(usuario); // { id, nome, email, tipo }

// Registrar ação
registrarAuditoria('ACAO_DESCRITIVA', { dados: 'aqui' });

// Usar API
AdminClientesAPI.obterClientes();
```

---

## 👥 AdminClientesAPI

```javascript
// Obter clientes com filtros
AdminClientesAPI.obterClientes({
    status: 'pendente',
    nome: 'João',
    dataInicio: '2025-01-01',
    dataFim: '2025-12-31'
});
// ✅ Retorna: Array de clientes

// Aprovar cliente
AdminClientesAPI.aprovarCliente('user_123', 'Documentação validada');
// ✅ Retorna: { sucesso: true }

// Rejeitar cliente
AdminClientesAPI.rejeitarCliente('user_123', 'Dados inconsistentes');
// ✅ Retorna: { sucesso: true }

// Suspender cliente por X dias
AdminClientesAPI.suspenderCliente('user_123', 'Atraso em pagamento', 30);
// ✅ Retorna: { sucesso: true }

// Deletar cliente
AdminClientesAPI.deletarCliente('user_123');
// ✅ Retorna: { sucesso: true }

// Atualizar dados do cliente
AdminClientesAPI.atualizarCliente('user_123', {
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '11998765432'
});
// ✅ Retorna: { sucesso: true }

// Obter estatísticas
AdminClientesAPI.obterEstatisticas();
// ✅ Retorna: { totalClientes: 150, ativos: 120, pendentes: 20, rejeitados: 10 }

// Enviar email em massa
AdminClientesAPI.enviarEmailMassa(
    ['user_1', 'user_2', 'user_3'],
    'Promoção especial',
    'Conheça nossos novos planos'
);
// ✅ Retorna: { sucesso: true, enviados: 3 }

// Exportar para CSV
AdminClientesAPI.exportarCSV({ status: 'ativo' });
// ✅ Retorna: { blob, fileName }
```

---

## 🔧 AdminServicosAPI

```javascript
// Criar novo serviço
AdminServicosAPI.criarServico({
    nome: 'Plano Solar 10kW',
    descricao: 'Sistema completo com 30 painéis',
    preco: 50000,
    precoInstalacao: 5000,
    potenciaMin: 8,
    potenciaMax: 12,
    incluso: ['painel', 'inversor', 'estrutura']
});
// ✅ Retorna: { id: 'srv_001', ...dados }

// Atualizar serviço
AdminServicosAPI.atualizarServico('srv_001', {
    preco: 45000,
    status: 'ativo'
});
// ✅ Retorna: { sucesso: true }

// Deletar serviço
AdminServicosAPI.deletarServico('srv_001');
// ✅ Retorna: { sucesso: true }

// Obter receita por período
AdminServicosAPI.obterReceitaPorServico('janeiro');
// ✅ Retorna: { 'srv_001': 150000, 'srv_002': 75000 }

// Estatísticas de serviços
AdminServicosAPI.obterEstatisticas();
// ✅ Retorna: { 
//   servicosAtivos: 5,
//   contratos: 48,
//   receita: 2400000
// }

// Aplicar desconto
AdminServicosAPI.aplicarDesconto('srv_001', 15, '2025-12-31');
// ✅ Retorna: { sucesso: true, precoFinal: 42500 }
```

---

## 🛠️ AdminEquipamentosAPI

```javascript
// Listar equipamentos com filtros
AdminEquipamentosAPI.obterEquipamentos({
    tipo: 'painel',
    status: 'ativo'
});
// ✅ Retorna: Array de equipamentos

// Estatísticas de equipamentos
AdminEquipamentosAPI.obterEstatisticas();
// ✅ Retorna: { 
//   painelSolar: 9168,
//   inversores: 142,
//   outros: 1482
// }

// Equipamentos que precisam manutenção
AdminEquipamentosAPI.obterEquipamentosManutencao();
// ✅ Retorna: Array de equipamentos com status = 'manutencao'

// Agendar manutenção
AdminEquipamentosAPI.agendarManutencao(
    'user_123',
    'painel',
    '2025-03-15',
    'Limpeza dos painéis'
);
// ✅ Retorna: { id: 'mnt_001', sucesso: true }

// Finalizar manutenção
AdminEquipamentosAPI.finalizarManutencao('mnt_001', {
    descricao: 'Limpeza realizada com sucesso',
    observacoes: 'Funcionando normalmente'
});
// ✅ Retorna: { sucesso: true }

// Registrar falha
AdminEquipamentosAPI.registrarFalha(
    'user_123',
    'inversor',
    'Não está convertendo energia',
    'alta'
);
// ✅ Retorna: { id: 'falha_001' }

// Atualizar inventário
AdminEquipamentosAPI.atualizarInventario('painel', 50, 'adicionar');
AdminEquipamentosAPI.atualizarInventario('inversor', 5, 'remover');
// ✅ Retorna: { sucesso: true }
```

---

## 📊 AdminRelatoriosAPI

```javascript
// Gerar relatório de clientes
AdminRelatoriosAPI.gerarRelatórioClientes(
    { status: 'ativo' },
    'pdf'
);
// ✅ Retorna: { filename, url, dados }

// Gerar relatório financeiro
AdminRelatoriosAPI.gerarRelatórioFinanceiro('janeiro', 2025);
// ✅ Retorna: {
//   periodo: 'janeiro/2025',
//   receita: { total: 100000, media: 5000 },
//   despesas: { total: 20000, media: 1000 },
//   lucro: { total: 80000, margem: '80%' }
// }

// Gerar relatório de energia
AdminRelatoriosAPI.gerarRelatórioEnergia('janeiro');
// ✅ Retorna: {
//   period: 'janeiro',
//   gerada: 15000,
//   consumida: 14500,
//   excedente: 500,
//   co2Evitado: 7500,
//   economia: 100000
// }

// Gerar relatório de performance
AdminRelatoriosAPI.gerarRelatórioPerformance();
// ✅ Retorna: {
//   uptime: '99.8%',
//   eficiencia: '95%',
//   alertas: 12,
//   mediaTempoResposta: '45ms'
// }

// Converter para PDF
AdminRelatoriosAPI.converterParaPDF({
    titulo: 'Relatório de Energia',
    dados: [ /* ... */ ]
});
// ✅ Retorna: { blob, fileName }

// Agendar relatório automático
AdminRelatoriosAPI.agendarRelatórioAutomático(
    'financeiro',
    'mensal',
    ['admin@rtvsolar.com.br']
);
// ✅ Retorna: { id: 'agenda_001', sucesso: true }

// Listar relatórios agendados
AdminRelatoriosAPI.listarRelatóriosAgendados();
// ✅ Retorna: Array de agendamentos
```

---

## ⚙️ AdminConfiguracaoAPI

```javascript
// Obter todas as configurações
AdminConfiguracaoAPI.obterConfiguracoes();
// ✅ Retorna: {
//   empresa: { nome, email, telefone, ... },
//   politicas: { ... },
//   sessao: { timeout, ... },
//   backup: { ... },
//   notificacoes: { ... },
//   ssl: { ... }
// }

// Atualizar configurações
AdminConfiguracaoAPI.atualizarConfiguracoes({
    empresa: { nome: 'RTV Solar' },
    politicas: { minSenha: 12 }
});
// ✅ Retorna: { sucesso: true }

// Obter integrações
AdminConfiguracaoAPI.obterIntegracoes();
// ✅ Retorna: [
//   { nome: 'SendGrid', status: 'conectado' },
//   { nome: 'Google Analytics', status: 'conectado' },
//   { nome: 'Stripe', status: 'desconectado' },
//   { nome: 'AWS', status: 'conectado' }
// ]

// Testar integração
AdminConfiguracaoAPI.testarIntegracao('SendGrid');
// ✅ Retorna: { conectado: true, latencia: '123ms' }

// Fazer backup
AdminConfiguracaoAPI.fazrBackupImediato();
// ✅ Retorna: { id: 'backup_001', tamanho: '250MB', data: '2025-03-15' }

// Restaurar backup
AdminConfiguracaoAPI.restaurarBackup('backup_001');
// ✅ Retorna: { sucesso: true, msg: 'Restaurado' }

// Renovar certificado SSL
AdminConfiguracaoAPI.renovarCertificadoSSL();
// ✅ Retorna: { sucesso: true, validade: '2026-03-15' }

// Configurar 2FA
AdminConfiguracaoAPI.configurar2FA(true); // habilitar para todos os usuários
// ✅ Retorna: { sucesso: true }

// Ver log de alterações
AdminConfiguracaoAPI.obterLogAlteracoes(100);
// ✅ Retorna: Array com últimas 100 mudanças

// Status do sistema
AdminConfiguracaoAPI.obterStatusSistema();
// ✅ Retorna: {
//   uptime: '99.99%',
//   usuariosAtivos: 24,
//   sistemasOperacionais: 5,
//   saude: 'ótima'
// }
```

---

## 🔧 Funções Base (script.js)

```javascript
// Obter usuário logado
obterUsuarioLogado();
// ✅ Retorna: { id, nome, email, tipo, ... }

// Verificar permissão
verificarPermissao('gerenciar_clientes');
// ✅ Retorna: true/false (também restringe visibilidade)

// Registrar auditoria
registrarAuditoria('ACAO_DESCRITIVA', {
    clienteId: 'user_123',
    dados: 'informação'
});
// ✅ Registra em localStorage

// Fazer logout
fazerLogout();
// ✅ Limpa sessão e redireciona

// Buscar usuário
obterUsuarioPorEmail('usuario@example.com');
// ✅ Retorna: objeto do usuário

// Atualizar usuário
atualizarUsuario('user_123', {
    nome: 'Novo Nome',
    email: 'novo@email.com'
});
// ✅ Retorna: { sucesso: true }
```

---

## 📧 EmailNotificationService

```javascript
// Enviar email simples
EmailNotificationService.enviar({
    destinatario: 'usuario@example.com',
    assunto: 'Olá!',
    html: '<h1>Bem-vindo</h1>'
});
// ✅ Retorna: Promise

// Enviar com template
EmailNotificationService.enviarComTemplate('cliente_aprovado', {
    nomeCliente: 'João Silva',
    email: 'joao@example.com'
});
// ✅ Retorna: Promise

// Templates disponíveis
// - cliente_aprovado
// - cliente_rejeitado
// - ordem_criada
// - manutencao_agendada
// - relatorio_disponivel
// - alerta_equipamento
// - recuperacao_senha
// - convite_cliente
```

---

## 🧪 Exemplos de Uso Combinado

### Cenário 1: Aprovar Cliente e Enviar Email

```javascript
async function fluxoAprovacaoCliente(clienteId, motivo) {
    // 1. Aprovar no sistema
    await AdminClientesAPI.aprovarCliente(clienteId, motivo);
    
    // 2. Obter dados do cliente
    const cliente = AdminClientesAPI.obterClientes()
        .find(c => c.id === clienteId);
    
    // 3. Enviar email de aprovação
    await EmailNotificationService.enviarComTemplate('cliente_aprovado', {
        nomeCliente: cliente.nome,
        email: cliente.email
    });
    
    // 4. Mostrar feedback
    console.log('✅ Cliente aprovado e email enviado');
}
```

### Cenário 2: Gerar Relatório e Agendar para Próximo Mês

```javascript
async function fluxoRelatorioRecorrente() {
    // 1. Gerar relatório do mês atual
    const relatorio = AdminRelatoriosAPI.gerarRelatórioFinanceiro('janeiro', 2025);
    
    // 2. Agendar para o próximo mês
    AdminRelatoriosAPI.agendarRelatórioAutomático(
        'financeiro',
        'mensal',
        ['admin@rtvsolar.com.br']
    );
    
    // 3. Registrar ação
    registrarAuditoria('RELATORIO_FINANCEIRO_GERADO', {
        periodo: 'janeiro/2025',
        receita: relatorio.receita.total
    });
}
```

### Cenário 3: Agendar Manutenção com Notificação

```javascript
async function agendarManutencaoComNotificacao(clienteId, data) {
    // 1. Agendar
    const resultado = AdminEquipamentosAPI.agendarManutencao(
        clienteId,
        'painel',
        data,
        'Manutenção preventiva'
    );
    
    // 2. Enviar notificação
    if (resultado.sucesso) {
        const cliente = AdminClientesAPI.obterClientes()
            .find(c => c.id === clienteId);
        
        await EmailNotificationService.enviarComTemplate('manutencao_agendada', {
            email: cliente.email,
            equipamento: 'Painel Solar',
            data: data,
            tecnico: 'Técnico designado'
        });
    }
}
```

---

## ⚠️ Erros Comuns

```javascript
// ❌ ERRADO: Esquecer de aguardar a Promise
AdminClientesAPI.obterClientes().length; // undefined

// ✅ CORRETO: Usar async/await
const clientes = await AdminClientesAPI.obterClientes();
console.log(clientes.length);

// ❌ ERRADO: Acessar dados que não existem
const email = usuario.email; // pode ser undefined

// ✅ CORRETO: Verificar existência
const email = usuario?.email || 'email@padrão.com';

// ❌ ERRADO: Registrar auditoria sem verificação
registrarAuditoria('ACAO_ADMIN', {...});

// ✅ CORRETO: Verificar permissão primeiro
if (obterUsuarioLogado().tipo === 'admin') {
    registrarAuditoria('ACAO_ADMIN', {...});
}
```

---

## 🚀 Dicas de Performance

```javascript
// ✅ Cache de dados frequentes
let clientesCache = null;
async function obterClientesCached() {
    if (!clientesCache) {
        clientesCache = await AdminClientesAPI.obterClientes();
    }
    return clientesCache;
}

// ✅ Debounce em busca
let timeoutBusca;
function buscarComDebounce(termo) {
    clearTimeout(timeoutBusca);
    timeoutBusca = setTimeout(() => {
        AdminClientesAPI.obterClientes({ nome: termo });
    }, 300);
}

// ✅ Tratar erros com fallback
async function obterDadosComFallback() {
    try {
        return await AdminClientesAPI.obterClientes();
    } catch (erro) {
        return JSON.parse(localStorage.getItem('rtv_usuarios') || '[]');
    }
}
```

---

## 📞 Suporte

- Dúvidas sobre APIs? Veja [docs/ARQUITETURA.md](ARQUITETURA.md)
- Integração com UI? Veja [docs/UI_INTEGRATION.md](UI_INTEGRATION.md)
- Backend? Veja [docs/BACKEND_API.md](BACKEND_API.md)
- 2FA? Veja [docs/2FA.md](2FA.md)
- Email? Veja [docs/EMAIL_NOTIFICATIONS.md](EMAIL_NOTIFICATIONS.md)

---

**Última atualização**: 18/04/2026  
**Versão**: 1.0  
**Status**: ✅ Pronto para Desenvolvimento
