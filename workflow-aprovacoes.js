// ==========================================
// SISTEMA DE WORKFLOW E APROVAÇÕES
// ==========================================

/**
 * Gerencia solicitações, aprovações e fluxos entre Cliente e Admin
 * Estados: pendente, em_analise, aprovado, rejeitado, concluído
 */

const WorkflowAPI = {
    /**
     * Criar nova solicitação do cliente
     */
    criarSolicitacao: function(tipo, dados) {
        let solicitacoes = JSON.parse(localStorage.getItem("rtv_solicitacoes")) || [];
        
        const solicitacao = {
            id: "#" + Math.floor(Math.random() * 900000 + 100000),
            tipo: tipo, // "contrato", "bateria", "assinatura", "manutencao", "orcamento"
            cliente_email: this.obterClienteLogado().email,
            cliente_nome: this.obterClienteLogado().nome,
            dados: dados,
            status: "pendente", // pendente, em_analise, aprovado, rejeitado, concluído
            data_criacao: new Date().toLocaleString('pt-BR'),
            data_atualizacao: new Date().toLocaleString('pt-BR'),
            observacoes: ""
        };
        
        solicitacoes.unshift(solicitacao);
        localStorage.setItem("rtv_solicitacoes", JSON.stringify(solicitacoes));
        
        this.registrarLog("Solicitação criada", `${tipo}: ${solicitacao.id}`);
        return solicitacao;
    },

    /**
     * Obter solicitações do cliente logado
     */
    obterSolicitacoesCliente: function(email) {
        let solicitacoes = JSON.parse(localStorage.getItem("rtv_solicitacoes")) || [];
        return solicitacoes.filter(s => s.cliente_email === email);
    },

    /**
     * Obter todas as solicitações (admin)
     */
    obterTodasSolicitacoes: function(filtro = null) {
        let solicitacoes = JSON.parse(localStorage.getItem("rtv_solicitacoes")) || [];
        if (filtro) {
            return solicitacoes.filter(s => filtro(s));
        }
        return solicitacoes;
    },

    /**
     * Atualizar status da solicitação (admin)
     */
    atualizarStatusSolicitacao: function(solicitacaoId, novoStatus, observacoes = "") {
        let solicitacoes = JSON.parse(localStorage.getItem("rtv_solicitacoes")) || [];
        const idx = solicitacoes.findIndex(s => s.id === solicitacaoId);
        
        if (idx >= 0) {
            const solicitacao = solicitacoes[idx];
            solicitacao.status = novoStatus;
            solicitacao.data_atualizacao = new Date().toLocaleString('pt-BR');
            solicitacao.observacoes = observacoes;
            
            // Se for cadastro aprovado, atualizar também o usuário no rtv_usuarios
            if (solicitacao.tipo === "cadastro" && novoStatus === "aprovado") {
                let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
                const usuarioIdx = usuarios.findIndex(u => u.email === solicitacao.cliente_email);
                
                if (usuarioIdx >= 0) {
                    usuarios[usuarioIdx].aprovadoAdmin = true;
                    usuarios[usuarioIdx].dataAprovacao = new Date().toLocaleString('pt-BR');
                    localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
                }
                
                this.registrarLog("Cadastro aprovado", `${solicitacao.cliente_email} - ${solicitacao.cliente_nome}`);
            }
            
            // Se for cadastro rejeitado, marcar como rejeitado
            if (solicitacao.tipo === "cadastro" && novoStatus === "rejeitado") {
                let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
                const usuarioIdx = usuarios.findIndex(u => u.email === solicitacao.cliente_email);
                
                if (usuarioIdx >= 0) {
                    usuarios[usuarioIdx].aprovadoAdmin = false;
                    usuarios[usuarioIdx].motivo_rejeicao = observacoes;
                    localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
                }
                
                this.registrarLog("Cadastro rejeitado", `${solicitacao.cliente_email} - ${observacoes}`);
            }
            
            localStorage.setItem("rtv_solicitacoes", JSON.stringify(solicitacoes));
            
            this.registrarLog("Solicitação atualizada", `${solicitacaoId}: ${novoStatus}`);
            return solicitacao;
        }
        return null;
    },

    /**
     * Obter solicitações pendentes (admin)
     */
    obterSolicitacoesPendentes: function() {
        return this.obterTodasSolicitacoes(s => s.status === "pendente");
    },

    /**
     * Contar solicitações pendentes
     */
    contarPendentes: function() {
        return this.obterSolicitacoesPendentes().length;
    },

    /**
     * Contar alertas do admin
     */
    contarAlertas: function() {
        const pendentes = this.contarPendentes();
        const chamados = JSON.parse(localStorage.getItem("rtv_chamados")) || [];
        const chamadosAbertos = chamados.filter(c => !c.resolvido).length;
        return pendentes + chamadosAbertos;
    },

    /**
     * Obter cliente logado
     */
    obterClienteLogado: function() {
        return JSON.parse(localStorage.getItem("rtv_usuario_logado"));
    },

    /**
     * Registrar ação no log
     */
    registrarLog: function(acao, detalhes) {
        let logs = JSON.parse(localStorage.getItem("rtv_workflow_logs")) || [];
        logs.unshift({
            timestamp: new Date().toLocaleString('pt-BR'),
            acao: acao,
            detalhes: detalhes,
            usuario: (this.obterClienteLogado() || {}).email || "sistema"
        });
        if (logs.length > 100) logs.pop();
        localStorage.setItem("rtv_workflow_logs", JSON.stringify(logs));
    }
};

// Auto-inicializar dados de exemplo se vazio
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("rtv_solicitacoes")) {
        localStorage.setItem("rtv_solicitacoes", JSON.stringify([
            {
                id: "#10045",
                tipo: "manutencao",
                cliente_email: "cliente@example.com",
                cliente_nome: "João Silva",
                dados: { data_preferida: "25/04/2026", periodo: "Manhã" },
                status: "pendente",
                data_criacao: "19/04/2026 14:30",
                data_atualizacao: "19/04/2026 14:30",
                observacoes: ""
            },
            {
                id: "#10044",
                tipo: "bateria",
                cliente_email: "cliente2@example.com",
                cliente_nome: "Maria Santos",
                dados: { tipo: "Bateria LiFePO4 15kWh", quantidade: 1 },
                status: "em_analise",
                data_criacao: "18/04/2026 10:15",
                data_atualizacao: "19/04/2026 09:20",
                observacoes: "Aguardando aprovação de orçamento"
            }
        ]));
    }
});
