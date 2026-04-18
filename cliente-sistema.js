// ==========================================
// GERENCIADOR DE DADOS DE CLIENTES (SISTEMA SOLAR)
// ==========================================

/**
 * Estrutura de dados de um sistema solar do cliente
 */
const ESTRUTURA_SISTEMA_SOLAR = {
    clienteId: "",
    dataDaInstalacao: "",
    
    // Equipamentos
    equipamentos: {
        paineis: {
            quantidade: 0,
            potencia: 0, // watts
            marca: "",
            modelo: ""
        },
        inversor: {
            modelo: "",
            potencia: 0,
            status: "online"
        },
        medidor: {
            modelo: "",
            status: "online"
        },
        bateria: {
            presente: false,
            capacidade: 0 // kWh
        }
    },
    
    // Métricas de hoje
    metricas_dia: {
        geracaoAgora: 3.8,
        geracaoHoje: 38.2,
        geracaoMedia: 30.5,
        
        consumoAgora: 1.2,
        consumoHoje: 14.5,
        consumoMedia: 12.3,
        
        economiaHoje: 412.50,
        co2Evitado: 185 // kg
    },
    
    // Métricas acumuladas
    metricas_acumuladas: {
        geracaoMes: 1150,
        geracaoAno: 13800,
        
        consumoMes: 340,
        consumoAno: 4200,
        
        economiaMes: 2875.00,
        economiaAno: 34500.00,
        
        co2EviradoMes: 1245, // kg
        co2EviradoAno: 14940, // kg
        
        creditosTotais: 127.5, // kWh
        creditos utilizados: 0 // kWh
    },
    
    // ROI e Payback
    financeiro: {
        investimentoInicial: 20000,
        paybackEstimado: 6.2, // anos
        roi: 16.2, // % ao ano
        custoInstalacao: 1500
    },
    
    // Performance
    performance: {
        eficienciaGlobal: 96.8, // %
        scoring: "A+",
        alertas: []
    }
};

/**
 * Obter dados do sistema solar do cliente logado
 */
function obterSistemaCliente() {
    const usuario = obterUsuarioLogado();
    if (!usuario || !usuario.id) return null;
    
    let clientes = JSON.parse(localStorage.getItem("rtv_clientes_sistemas")) || [];
    let sistema = clientes.find(s => s.clienteId === usuario.id);
    
    // Se não existe, criar um novo
    if (!sistema) {
        sistema = JSON.parse(JSON.stringify(ESTRUTURA_SISTEMA_SOLAR));
        sistema.clienteId = usuario.id;
        sistema.dataDaInstalacao = new Date().toLocaleDateString('pt-BR');
        clientes.push(sistema);
        localStorage.setItem("rtv_clientes_sistemas", JSON.stringify(clientes));
    }
    
    return sistema;
}

/**
 * Salvar dados do sistema solar do cliente
 */
function salvarSistemaCliente(sistema) {
    let clientes = JSON.parse(localStorage.getItem("rtv_clientes_sistemas")) || [];
    const idx = clientes.findIndex(s => s.clienteId === sistema.clienteId);
    
    if (idx >= 0) {
        clientes[idx] = sistema;
    } else {
        clientes.push(sistema);
    }
    
    localStorage.setItem("rtv_clientes_sistemas", JSON.stringify(clientes));
    return true;
}

/**
 * Atualizar métricas de tempo real
 */
function atualizarMetricasTempoReal() {
    const sistema = obterSistemaCliente();
    if (!sistema) return;
    
    // Simular variação de dados em tempo real
    sistema.metricas_dia.geracaoAgora = Math.random() * 4 + 0.5;
    sistema.metricas_dia.consumoAgora = Math.random() * 2 + 0.5;
    
    salvarSistemaCliente(sistema);
}

/**
 * Renderizar widgets de geração
 */
function renderizarWidgetsGeração() {
    const sistema = obterSistemaCliente();
    if (!sistema) return;
    
    const m = sistema.metricas_dia;
    const ma = sistema.metricas_acumuladas;
    
    // Geração
    const geracaoAtual = document.getElementById("geracao-atual");
    if (geracaoAtual) geracaoAtual.textContent = m.geracaoAgora.toFixed(1) + " kW";
    
    const geracaoHoje = document.getElementById("geracao-hoje");
    if (geracaoHoje) geracaoHoje.textContent = m.geracaoHoje.toFixed(1) + " kWh";
    
    const geracaoMes = document.getElementById("geracao-mes");
    if (geracaoMes) geracaoMes.textContent = ma.geracaoMes.toLocaleString('pt-BR') + " kWh";
}

/**
 * Renderizar widgets de consumo
 */
function renderizarWidgetsConsumo() {
    const sistema = obterSistemaCliente();
    if (!sistema) return;
    
    const m = sistema.metricas_dia;
    const ma = sistema.metricas_acumuladas;
    
    // Consumo
    const consumoAtual = document.getElementById("consumo-atual");
    if (consumoAtual) consumoAtual.textContent = m.consumoAgora.toFixed(1) + " kW";
    
    const consumoHoje = document.getElementById("consumo-hoje");
    if (consumoHoje) consumoHoje.textContent = m.consumoHoje.toFixed(1) + " kWh";
    
    const consumoMes = document.getElementById("consumo-mes");
    if (consumoMes) consumoMes.textContent = ma.consumoMes.toLocaleString('pt-BR') + " kWh";
}

/**
 * Renderizar widgets de economia
 */
function renderizarWidgetsEconomia() {
    const sistema = obterSistemaCliente();
    if (!sistema) return;
    
    const m = sistema.metricas_dia;
    const ma = sistema.metricas_acumuladas;
    
    // Economia
    const economiaMes = document.getElementById("economia-mes");
    if (economiaMes) economiaMes.textContent = "R$ " + ma.economiaMes.toFixed(2).replace(".", ",");
    
    const economiaAcumulada = document.getElementById("economia-acumulada");
    if (economiaAcumulada) economiaAcumulada.textContent = "R$ " + ma.economiaAno.toFixed(2).replace(".", ",");
}

/**
 * Renderizar widgets de impacto ambiental
 */
function renderizarWidgetsAmbiente() {
    const sistema = obterSistemaCliente();
    if (!sistema) return;
    
    const ma = sistema.metricas_acumuladas;
    
    // CO2
    const co2 = document.getElementById("co2-evitado");
    if (co2) co2.textContent = ma.co2EviradoMes.toLocaleString('pt-BR') + " kg";
    
    // Árvores
    const arvores = Math.round(ma.co2EviradoMes / 23); // 1 árvore absorve ~23kg CO2/ano
    const arvoresEl = document.getElementById("arvores-equiv");
    if (arvoresEl) arvoresEl.textContent = arvores + " árvores";
}

/**
 * Renderizar widgets de performance
 */
function renderizarWidgetsPerformance() {
    const sistema = obterSistemaCliente();
    if (!sistema) return;
    
    const p = sistema.performance;
    const f = sistema.financeiro;
    
    // Eficiência
    const eficiencia = document.getElementById("eficiencia-global");
    if (eficiencia) eficiencia.textContent = p.eficienciaGlobal.toFixed(1) + "%";
    
    // Payback
    const payback = document.getElementById("payback-estimado");
    if (payback) payback.textContent = f.paybackEstimado.toFixed(1) + " anos";
    
    // Créditos
    const creditos = document.getElementById("creditos-disponiveis");
    if (creditos) creditos.textContent = ma.creditosTotais.toFixed(1) + " kWh";
}

/**
 * Renderizar todos os widgets
 */
function renderizarTodosWidgets() {
    renderizarWidgetsGeração();
    renderizarWidgetsConsumo();
    renderizarWidgetsEconomia();
    renderizarWidgetsAmbiente();
    renderizarWidgetsPerformance();
}

/**
 * Inicializar dashboard do cliente
 */
function inicializarDashboardCliente() {
    document.addEventListener("DOMContentLoaded", () => {
        // Renderizar widgets na primeira vez
        renderizarTodosWidgets();
        
        // Atualizar a cada 30 segundos (simular dados em tempo real)
        setInterval(() => {
            atualizarMetricasTempoReal();
            renderizarTodosWidgets();
        }, 30000);
    });
}

// Exportar para uso global
window.ClienteSistemaAPI = {
    obterSistemaCliente,
    salvarSistemaCliente,
    atualizarMetricasTempoReal,
    renderizarWidgetsGeração,
    renderizarWidgetsConsumo,
    renderizarWidgetsEconomia,
    renderizarWidgetsAmbiente,
    renderizarWidgetsPerformance,
    renderizarTodosWidgets,
    inicializarDashboardCliente
};

// Inicializar quando a página carregar
inicializarDashboardCliente();
