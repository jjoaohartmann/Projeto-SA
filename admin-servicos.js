// ==========================================
// GERENCIADOR DE SERVIÇOS (ADMIN)
// ==========================================

/**
 * API para gerenciamento de serviços no painel administrativo
 */

const AdminServicosAPI = {

    /**
     * Estrutura padrão de um serviço
     */
    ESTRUTURA_SERVICO: {
        id: "",
        nome: "",
        descricao: "",
        preco: 0,
        precoInstalacao: 0,
        potenciaMax: 0,
        potenciaMin: 0,
        incluso: [],
        categoria: "", // "instalacao", "manutencao", "consultoria"
        status: "ativo", // "ativo", "inativo", "descontinuado"
        dataCriacao: "",
        ultimaAtualizacao: ""
    },

    /**
     * Obter todos os serviços com filtros
     */
    obterServicos(filtros = {}) {
        let servicos = JSON.parse(localStorage.getItem("rtv_servicos")) || [];
        
        if (filtros.status) {
            servicos = servicos.filter(s => s.status === filtros.status);
        }
        
        if (filtros.categoria) {
            servicos = servicos.filter(s => s.categoria === filtros.categoria);
        }
        
        if (filtros.busca) {
            const termo = filtros.busca.toLowerCase();
            servicos = servicos.filter(s => s.nome.toLowerCase().includes(termo));
        }
        
        return servicos;
    },

    /**
     * Criar novo serviço
     */
    criarServico(dadosServico) {
        const novoServico = {
            ...this.ESTRUTURA_SERVICO,
            ...dadosServico,
            id: "srv_" + Date.now(),
            dataCriacao: new Date().toLocaleString('pt-BR'),
            ultimaAtualizacao: new Date().toLocaleString('pt-BR')
        };
        
        let servicos = JSON.parse(localStorage.getItem("rtv_servicos")) || [];
        servicos.push(novoServico);
        localStorage.setItem("rtv_servicos", JSON.stringify(servicos));
        
        registrarAuditoria("SERVICO_CRIADO", {
            servicoId: novoServico.id,
            nome: novoServico.nome,
            preco: novoServico.preco,
            adminId: obterUsuarioLogado().id
        });
        
        return novoServico;
    },

    /**
     * Atualizar serviço
     */
    atualizarServico(servicoId, dadosAtualizacao) {
        let servicos = JSON.parse(localStorage.getItem("rtv_servicos")) || [];
        const idx = servicos.findIndex(s => s.id === servicoId);
        
        if (idx >= 0) {
            servicos[idx] = {
                ...servicos[idx],
                ...dadosAtualizacao,
                ultimaAtualizacao: new Date().toLocaleString('pt-BR')
            };
            localStorage.setItem("rtv_servicos", JSON.stringify(servicos));
            
            registrarAuditoria("SERVICO_ATUALIZADO", {
                servicoId,
                campos: Object.keys(dadosAtualizacao),
                adminId: obterUsuarioLogado().id
            });
            
            return servicos[idx];
        }
        return null;
    },

    /**
     * Deletar serviço
     */
    deletarServico(servicoId) {
        let servicos = JSON.parse(localStorage.getItem("rtv_servicos")) || [];
        const servico = servicos.find(s => s.id === servicoId);
        
        servicos = servicos.filter(s => s.id !== servicoId);
        localStorage.setItem("rtv_servicos", JSON.stringify(servicos));
        
        registrarAuditoria("SERVICO_DELETADO", {
            servicoId,
            nome: servico?.nome,
            adminId: obterUsuarioLogado().id
        });
        
        return true;
    },

    /**
     * Obter receita por serviço
     */
    obterReceitaPorServico(periodo = "mes") {
        const contratos = JSON.parse(localStorage.getItem("rtv_contratos")) || [];
        const servicos = this.obterServicos();
        
        const receita = {};
        
        servicos.forEach(servico => {
            const contratosServico = contratos.filter(c => c.servicoId === servico.id);
            receita[servico.nome] = {
                quantidade: contratosServico.length,
                receitaBruta: contratosServico.reduce((sum, c) => sum + c.valor, 0),
                receitaLiquida: contratosServico.reduce((sum, c) => sum + (c.valor * 0.8), 0)
            };
        });
        
        return receita;
    },

    /**
     * Obter estatísticas de serviços
     */
    obterEstatisticas() {
        const servicos = this.obterServicos({ status: "ativo" });
        const contratos = JSON.parse(localStorage.getItem("rtv_contratos")) || [];
        
        const totalReceita = contratos.reduce((sum, c) => sum + c.valor, 0);
        
        return {
            totalServicosAtivos: servicos.length,
            totalContratos: contratos.length,
            receítaTotal: totalReceita,
            recebitaMedia: (totalReceita / contratos.length).toFixed(2),
            servicoTop: servicos.reduce((max, s) => {
                const receitaS = contratos.filter(c => c.servicoId === s.id)
                    .reduce((sum, c) => sum + c.valor, 0);
                return receitaS > (max.receita || 0) ? { nome: s.nome, receita: receitaS } : max;
            }, {})
        };
    },

    /**
     * Aplicar desconto em um serviço
     */
    aplicarDesconto(servicoId, percentualDesconto, dataExpiracao = null) {
        const preco = this.obterServicos().find(s => s.id === servicoId)?.preco || 0;
        const desconto = {
            id: "desc_" + Date.now(),
            servicoId,
            percentual: percentualDesconto,
            precoComDesconto: preco * (1 - percentualDesconto / 100),
            dataInicio: new Date().toLocaleString('pt-BR'),
            dataExpiracao,
            ativo: true
        };
        
        let descontos = JSON.parse(localStorage.getItem("rtv_descontos_servicos")) || [];
        descontos.push(desconto);
        localStorage.setItem("rtv_descontos_servicos", JSON.stringify(descontos));
        
        registrarAuditoria("DESCONTO_CRIADO", {
            servicoId,
            percentual: percentualDesconto,
            adminId: obterUsuarioLogado().id
        });
        
        return desconto;
    }
};

// Expor API globalmente
window.AdminServicosAPI = AdminServicosAPI;
