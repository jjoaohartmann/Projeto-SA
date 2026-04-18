// ==========================================
// GERENCIADOR DE RELATÓRIOS (ADMIN)
// ==========================================

/**
 * API para geração de relatórios administrativos
 */

const AdminRelatoriosAPI = {

    /**
     * Gerar relatório de clientes
     */
    gerarRelatórioClientes(filtros = {}, formato = "json") {
        const clientes = AdminClientesAPI.obterClientes(filtros);
        const stats = AdminClientesAPI.obterEstatisticas();
        
        const relatorio = {
            tipo: "Relatório de Clientes",
            dataGeracao: new Date().toLocaleString('pt-BR'),
            periodo: {
                inicio: filtros.dataInicio || "Início",
                fim: filtros.dataFim || "Fim"
            },
            estatisticas: stats,
            detalhes: clientes.map(c => ({
                nome: c.nome,
                email: c.email,
                cpf: c.cpf,
                status: c.status,
                dataCadastro: c.dataCadastro,
                contratoValor: c.contratoValor || 0,
                tempoCliente: c.tempoCliente || "Novo"
            }))
        };
        
        return formato === "json" ? relatorio : this.converterParaPDF(relatorio);
    },

    /**
     * Gerar relatório financeiro
     */
    gerarRelatórioFinanceiro(mes, ano) {
        const clientes = AdminClientesAPI.obterClientes({ status: "aprovado" });
        const receita = AdminServicosAPI.obterReceitaPorServico();
        
        const totalReceita = Object.values(receita).reduce((sum, r) => sum + r.receitaBruta, 0);
        const totalDespesas = totalReceita * 0.3; // Estimativa de 30% de despesas
        const lucroLiquido = totalReceita - totalDespesas;
        
        return {
            tipo: "Relatório Financeiro",
            periodo: `${mes}/${ano}`,
            dataGeracao: new Date().toLocaleString('pt-BR'),
            receita: {
                total: totalReceita,
                porServico: receita,
                clientesAtivos: clientes.length,
                receitaMedia: (totalReceita / clientes.length).toFixed(2)
            },
            despesas: {
                total: totalDespesas,
                operacional: totalDespesas * 0.7,
                tecnologia: totalDespesas * 0.2,
                marketing: totalDespesas * 0.1
            },
            lucro: {
                bruto: totalReceita,
                liquido: lucroLiquido,
                margemLiquida: ((lucroLiquido / totalReceita) * 100).toFixed(2) + "%"
            }
        };
    },

    /**
     * Gerar relatório de energia
     */
    gerarRelatórioEnergia(periodo = "mes") {
        const sistemas = JSON.parse(localStorage.getItem("rtv_clientes_sistemas")) || [];
        
        let totalGerado = 0;
        let totalConsumido = 0;
        let totalEconomia = 0;
        let totalCO2Evitado = 0;
        
        sistemas.forEach(s => {
            totalGerado += s.metricas_acumuladas?.geracaoMes || 0;
            totalConsumido += s.metricas_acumuladas?.consumoMes || 0;
            totalEconomia += s.metricas_acumuladas?.economiaMes || 0;
            totalCO2Evitado += s.metricas_acumuladas?.co2EviradoMes || 0;
        });
        
        return {
            tipo: "Relatório de Energia",
            periodo,
            dataGeracao: new Date().toLocaleString('pt-BR'),
            geracao: {
                total: totalGerado + " kWh",
                media: (totalGerado / sistemas.length).toFixed(2) + " kWh",
                sistemasAtivos: sistemas.length
            },
            consumo: {
                total: totalConsumido + " kWh",
                media: (totalConsumido / sistemas.length).toFixed(2) + " kWh"
            },
            economia: {
                valor: "R$ " + totalEconomia.toFixed(2),
                media: "R$ " + (totalEconomia / sistemas.length).toFixed(2),
                percentual: ((totalGerado - totalConsumido) / totalGerado * 100).toFixed(2) + "%"
            },
            impactoAmbiental: {
                co2Evitado: totalCO2Evitado + " kg",
                equivalenteArvores: (totalCO2Evitado / 21).toFixed(0) // ~ 21kg CO2 por árvore/ano
            }
        };
    },

    /**
     * Gerar relatório de performance
     */
    gerarRelatórioPerformance() {
        const sistemas = JSON.parse(localStorage.getItem("rtv_clientes_sistemas")) || [];
        
        const uptime = sistemas.filter(s => s.equipment?.inversor?.status === "online").length / sistemas.length * 100;
        const eficienciaMedia = sistemas.reduce((sum, s) => sum + (s.performance?.eficienciaGlobal || 0), 0) / sistemas.length;
        
        return {
            tipo: "Relatório de Performance",
            dataGeracao: new Date().toLocaleString('pt-BR'),
            uptime: uptime.toFixed(2) + "%",
            eficienciaMedia: eficienciaMedia.toFixed(2) + "%",
            sistemasOnline: sistemas.filter(s => s.performance?.alertas.length === 0).length,
            sistemasComAlertas: sistemas.filter(s => s.performance?.alertas.length > 0).length,
            alertasTotal: sistemas.reduce((sum, s) => sum + (s.performance?.alertas.length || 0), 0),
            scoring: {
                excelente: sistemas.filter(s => s.performance?.scoring === "A+").length,
                muito_bom: sistemas.filter(s => s.performance?.scoring === "A").length,
                bom: sistemas.filter(s => s.performance?.scoring === "B").length,
                regular: sistemas.filter(s => s.performance?.scoring === "C").length
            }
        };
    },

    /**
     * Exportar relatório para PDF (simulado)
     */
    converterParaPDF(relatorio) {
        // Em produção, usar biblioteca como jsPDF ou html2pdf
        const conteudo = JSON.stringify(relatorio, null, 2);
        const blob = new Blob([conteudo], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        
        return {
            url,
            nome: `relatorio_${relatorio.tipo}_${new Date().getTime()}.pdf`,
            tamanho: blob.size
        };
    },

    /**
     * Agendar geração automática de relatórios
     */
    agendarRelatórioAutomático(tipo, frequencia = "mensal", destinatarios = []) {
        const agendamento = {
            id: "agenda_" + Date.now(),
            tipo,
            frequencia, // "diario", "semanal", "mensal"
            destinatarios,
            ativo: true,
            proximaExecucao: new Date().toLocaleString('pt-BR')
        };
        
        let agendamentos = JSON.parse(localStorage.getItem("rtv_relatorios_agendados")) || [];
        agendamentos.push(agendamento);
        localStorage.setItem("rtv_relatorios_agendados", JSON.stringify(agendamentos));
        
        registrarAuditoria("RELATORIO_AGENDADO", {
            tipo,
            frequencia,
            destinatarios: destinatarios.length,
            adminId: obterUsuarioLogado().id
        });
        
        return agendamento;
    },

    /**
     * Listar relatórios agendados
     */
    listarRelatóriosAgendados() {
        return JSON.parse(localStorage.getItem("rtv_relatorios_agendados")) || [];
    }
};

// Expor API globalmente
window.AdminRelatoriosAPI = AdminRelatoriosAPI;
