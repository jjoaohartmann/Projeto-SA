// ==========================================
// GERENCIADOR DE EQUIPAMENTOS (ADMIN)
// ==========================================

/**
 * API para gerenciamento de equipamentos no painel administrativo
 */

const AdminEquipamentosAPI = {

    /**
     * Obter todos os equipamentos com filtros
     */
    obterEquipamentos(filtros = {}) {
        let sistemas = JSON.parse(localStorage.getItem("rtv_clientes_sistemas")) || [];
        let equipamentos = [];
        
        // Extrair todos os equipamentos de todos os sistemas
        sistemas.forEach(sistema => {
            if (sistema.equipamentos) {
                equipamentos.push({
                    clienteId: sistema.clienteId,
                    tipo: "paineis",
                    quantity: sistema.equipamentos.paineis.quantidade,
                    modelo: sistema.equipamentos.paineis.modelo,
                    marca: sistema.equipamentos.paineis.marca,
                    potencia: sistema.equipamentos.paineis.potencia,
                    status: "online"
                });
                
                equipamentos.push({
                    clienteId: sistema.clienteId,
                    tipo: "inversor",
                    modelo: sistema.equipamentos.inversor.modelo,
                    potencia: sistema.equipamentos.inversor.potencia,
                    status: sistema.equipamentos.inversor.status
                });
                
                equipamentos.push({
                    clienteId: sistema.clienteId,
                    tipo: "medidor",
                    modelo: sistema.equipamentos.medidor.modelo,
                    status: sistema.equipamentos.medidor.status
                });
                
                if (sistema.equipamentos.bateria.presente) {
                    equipamentos.push({
                        clienteId: sistema.clienteId,
                        tipo: "bateria",
                        capacidade: sistema.equipamentos.bateria.capacidade,
                        status: "online"
                    });
                }
            }
        });
        
        // Aplicar filtros
        if (filtros.tipo) {
            equipamentos = equipamentos.filter(e => e.tipo === filtros.tipo);
        }
        
        if (filtros.status) {
            equipamentos = equipamentos.filter(e => e.status === filtros.status);
        }
        
        return equipamentos;
    },

    /**
     * Obter estatísticas de equipamentos
     */
    obterEstatisticas() {
        const equipamentos = this.obterEquipamentos();
        
        const estatisticas = {
            paineis: equipamentos.filter(e => e.tipo === "paineis"),
            inversores: equipamentos.filter(e => e.tipo === "inversor"),
            medidores: equipamentos.filter(e => e.tipo === "medidor"),
            baterias: equipamentos.filter(e => e.tipo === "bateria")
        };
        
        return {
            paineis: {
                quantidade: estatisticas.paineis.reduce((sum, p) => sum + (p.quantity || 1), 0),
                online: estatisticas.paineis.filter(p => p.status === "online").length,
                marcasPrincipais: [...new Set(estatisticas.paineis.map(p => p.marca))].length
            },
            inversores: {
                quantidade: estatisticas.inversores.length,
                online: estatisticas.inversores.filter(i => i.status === "online").length
            },
            medidores: {
                quantidade: estatisticas.medidores.length,
                online: estatisticas.medidores.filter(m => m.status === "online").length
            },
            baterias: {
                quantidade: estatisticas.baterias.length,
                capacidadeTotal: estatisticas.baterias.reduce((sum, b) => sum + (b.capacidade || 0), 0),
                online: estatisticas.baterias.filter(b => b.status === "online").length
            }
        };
    },

    /**
     * Obter equipamentos que precisam manutenção
     */
    obterEquipamentosManutencao() {
        const sistemas = JSON.parse(localStorage.getItem("rtv_clientes_sistemas")) || [];
        const equipamentosManutencao = [];
        
        sistemas.forEach(sistema => {
            // Simular lógica de detecção de manutenção necessária
            if (Math.random() > 0.8) { // 20% de chance de precisar manutenção
                equipamentosManutencao.push({
                    clienteId: sistema.clienteId,
                    tipo: "paineis",
                    motivo: "Limpeza necessária - lastro baixo detectado",
                    urgencia: "alta"
                });
            }
        });
        
        return equipamentosManutencao;
    },

    /**
     * Agendar manutenção para equipamento
     */
    agendarManutencao(clienteId, tipoEquipamento, data, observacoes = "") {
        const manutencao = {
            id: "manut_" + Date.now(),
            clienteId,
            tipoEquipamento,
            data,
            observacoes,
            status: "agendado",
            dataAgendamento: new Date().toLocaleString('pt-BR'),
            tecnico: obterUsuarioLogado().nome
        };
        
        let manutencoes = JSON.parse(localStorage.getItem("rtv_manutencoes")) || [];
        manutencoes.push(manutencao);
        localStorage.setItem("rtv_manutencoes", JSON.stringify(manutencoes));
        
        registrarAuditoria("MANUTENCAO_AGENDADA", {
            clienteId,
            tipoEquipamento,
            data,
            adminId: obterUsuarioLogado().id
        });
        
        return manutencao;
    },

    /**
     * Finalizar manutenção
     */
    finalizarManutencao(manutencaoId, relatorio = "") {
        let manutencoes = JSON.parse(localStorage.getItem("rtv_manutencoes")) || [];
        const idx = manutencoes.findIndex(m => m.id === manutencaoId);
        
        if (idx >= 0) {
            manutencoes[idx].status = "concluído";
            manutencoes[idx].dataConlusao = new Date().toLocaleString('pt-BR');
            manutencoes[idx].relatorio = relatorio;
            localStorage.setItem("rtv_manutencoes", JSON.stringify(manutencoes));
            
            registrarAuditoria("MANUTENCAO_CONCLUIDA", {
                manutencaoId,
                relatorio,
                adminId: obterUsuarioLogado().id
            });
            
            return true;
        }
        return false;
    },

    /**
     * Registrar falha de equipamento
     */
    registrarFalha(clienteId, tipoEquipamento, descricao, severidade = "media") {
        const falha = {
            id: "falha_" + Date.now(),
            clienteId,
            tipoEquipamento,
            descricao,
            severidade, // "baixa", "media", "alta", "crítica"
            status: "aberto",
            dataRegistro: new Date().toLocaleString('pt-BR'),
            reportadoPor: obterUsuarioLogado().id
        };
        
        let falhas = JSON.parse(localStorage.getItem("rtv_falhas")) || [];
        falhas.push(falha);
        localStorage.setItem("rtv_falhas", JSON.stringify(falhas));
        
        registrarAuditoria("FALHA_REGISTRADA", {
            clienteId,
            tipoEquipamento,
            severidade,
            adminId: obterUsuarioLogado().id
        });
        
        return falha;
    },

    /**
     * Atualizar inventário de equipamentos
     */
    atualizarInventario(tipoEquipamento, quantidade, operacao = "adicionar") {
        let inventario = JSON.parse(localStorage.getItem("rtv_inventario")) || {};
        
        if (!inventario[tipoEquipamento]) {
            inventario[tipoEquipamento] = 0;
        }
        
        if (operacao === "adicionar") {
            inventario[tipoEquipamento] += quantidade;
        } else if (operacao === "remover") {
            inventario[tipoEquipamento] -= quantidade;
        }
        
        localStorage.setItem("rtv_inventario", JSON.stringify(inventario));
        
        registrarAuditoria("INVENTARIO_ATUALIZADO", {
            tipoEquipamento,
            quantidade,
            operacao,
            adminId: obterUsuarioLogado().id
        });
        
        return inventario[tipoEquipamento];
    }
};

// Expor API globalmente
window.AdminEquipamentosAPI = AdminEquipamentosAPI;
