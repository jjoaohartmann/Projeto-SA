// ==========================================
// GERENCIADOR DE CLIENTES (ADMIN)
// ==========================================

/**
 * API para gerenciamento de clientes no painel administrativo
 */

const AdminClientesAPI = {
    
    /**
     * Obter todos os clientes com filtros
     */
    obterClientes(filtros = {}) {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        
        // Filtrar apenas clientes (não admin)
        clientes = clientes.filter(u => u.role === "cliente");
        
        // Aplicar filtros
        if (filtros.status) {
            clientes = clientes.filter(u => u.status === filtros.status);
        }
        
        if (filtros.busca) {
            const termo = filtros.busca.toLowerCase();
            clientes = clientes.filter(u => 
                u.nome.toLowerCase().includes(termo) ||
                u.email.toLowerCase().includes(termo) ||
                u.cpf.includes(termo)
            );
        }
        
        if (filtros.dataInicio && filtros.dataFim) {
            clientes = clientes.filter(u => {
                const data = new Date(u.dataCadastro);
                return data >= new Date(filtros.dataInicio) && 
                       data <= new Date(filtros.dataFim);
            });
        }
        
        return clientes;
    },

    /**
     * Obter detalhe de um cliente
     */
    obterCliente(clienteId) {
        const clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        return clientes.find(c => c.id === clienteId);
    },

    /**
     * Aprovar cliente para acesso
     */
    aprovarCliente(clienteId, motivo = "") {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        const idx = clientes.findIndex(c => c.id === clienteId);
        
        if (idx >= 0) {
            clientes[idx].status = "aprovado";
            clientes[idx].dataAprovacao = new Date().toLocaleString('pt-BR');
            clientes[idx].motivoAprovacao = motivo;
            localStorage.setItem("rtv_usuarios", JSON.stringify(clientes));
            
            // Registrar ação na auditoria
            registrarAuditoria("CLIENTE_APROVADO", {
                clienteId,
                motivo,
                adminId: obterUsuarioLogado().id
            });
            
            return true;
        }
        return false;
    },

    /**
     * Rejeitar cliente
     */
    rejeitarCliente(clienteId, motivo = "") {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        const idx = clientes.findIndex(c => c.id === clienteId);
        
        if (idx >= 0) {
            clientes[idx].status = "rejeitado";
            clientes[idx].dataRejeicao = new Date().toLocaleString('pt-BR');
            clientes[idx].motivoRejeicao = motivo;
            localStorage.setItem("rtv_usuarios", JSON.stringify(clientes));
            
            // Registrar na auditoria
            registrarAuditoria("CLIENTE_REJEITADO", {
                clienteId,
                motivo,
                adminId: obterUsuarioLogado().id
            });
            
            return true;
        }
        return false;
    },

    /**
     * Suspender cliente
     */
    suspenderCliente(clienteId, motivo = "", dias = 30) {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        const idx = clientes.findIndex(c => c.id === clienteId);
        
        if (idx >= 0) {
            const dataSuspensao = new Date();
            const dataReinicio = new Date(dataSuspensao.getTime() + dias * 24 * 60 * 60 * 1000);
            
            clientes[idx].status = "suspenso";
            clientes[idx].dataSuspensao = dataSuspensao.toLocaleString('pt-BR');
            clientes[idx].dataReinicio = dataReinicio.toLocaleString('pt-BR');
            clientes[idx].motivoSuspensao = motivo;
            localStorage.setItem("rtv_usuarios", JSON.stringify(clientes));
            
            registrarAuditoria("CLIENTE_SUSPENSO", {
                clienteId,
                motivo,
                dias,
                adminId: obterUsuarioLogado().id
            });
            
            return true;
        }
        return false;
    },

    /**
     * Deletar cliente
     */
    deletarCliente(clienteId) {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        const clienteParaDeleta = clientes.find(c => c.id === clienteId);
        
        clientes = clientes.filter(c => c.id !== clienteId);
        localStorage.setItem("rtv_usuarios", JSON.stringify(clientes));
        
        // Deletar sistema solar associado
        let sistemas = JSON.parse(localStorage.getItem("rtv_clientes_sistemas")) || [];
        sistemas = sistemas.filter(s => s.clienteId !== clienteId);
        localStorage.setItem("rtv_clientes_sistemas", JSON.stringify(sistemas));
        
        registrarAuditoria("CLIENTE_DELETADO", {
            clienteId,
            cliente: clienteParaDeleta.nome,
            adminId: obterUsuarioLogado().id
        });
        
        return true;
    },

    /**
     * Atualizar informações do cliente
     */
    atualizarCliente(clienteId, dadosAtualizacao) {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        const idx = clientes.findIndex(c => c.id === clienteId);
        
        if (idx >= 0) {
            clientes[idx] = { ...clientes[idx], ...dadosAtualizacao };
            localStorage.setItem("rtv_usuarios", JSON.stringify(clientes));
            
            registrarAuditoria("CLIENTE_ATUALIZADO", {
                clienteId,
                campos: Object.keys(dadosAtualizacao),
                adminId: obterUsuarioLogado().id
            });
            
            return true;
        }
        return false;
    },

    /**
     * Obter estatísticas de clientes
     */
    obterEstatisticas() {
        const clientes = this.obterClientes();
        
        return {
            totalClientes: clientes.length,
            aprovados: clientes.filter(c => c.status === "aprovado").length,
            pendentes: clientes.filter(c => c.status === "pendente").length,
            rejeitados: clientes.filter(c => c.status === "rejeitado").length,
            suspensos: clientes.filter(c => c.status === "suspenso").length,
            totalReceita: clientes.reduce((sum, c) => sum + (c.contratoValor || 0), 0),
            clientesAtivos: clientes.filter(c => c.status === "aprovado").length,
            taxaAprovacao: (clientes.filter(c => c.status === "aprovado").length / clientes.length * 100).toFixed(1) + "%"
        };
    },

    /**
     * Enviar e-mail em massa para clientes
     */
    enviarEmailMassa(clienteIds, assunto, mensagem) {
        const clientes = this.obterClientes().filter(c => clienteIds.includes(c.id));
        
        clientes.forEach(cliente => {
            // Simular envio de e-mail (em produção, seria por API)
            registrarAuditoria("EMAIL_ENVIADO", {
                destinatario: cliente.email,
                assunto,
                clienteId: cliente.id,
                adminId: obterUsuarioLogado().id
            });
        });
        
        return {
            sucesso: true,
            totalEnviados: clientes.length,
            momento: new Date().toLocaleString('pt-BR')
        };
    },

    /**
     * Exportar lista de clientes para CSV
     */
    exportarCSV(filtros = {}) {
        const clientes = this.obterClientes(filtros);
        
        let csv = "Nome,E-mail,CPF,Status,Data Cadastro,Valor Contrato\n";
        
        clientes.forEach(c => {
            csv += `"${c.nome}","${c.email}","${c.cpf}","${c.status}","${c.dataCadastro}","R$ ${c.contratoValor || 0}"\n`;
        });
        
        return csv;
    }
};

// Expor API globalmente
window.AdminClientesAPI = AdminClientesAPI;
