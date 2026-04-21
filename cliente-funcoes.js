// ==========================================
// FUNÇÕES DO CLIENTE - SOLICITAÇÕES E STATUS
// ==========================================

/**
 * Renderiza as solicitações do cliente logado
 */
function renderizarSolicitacoesCliente() {
    const tbody = document.getElementById("tabela-solicitacoes-cliente");
    if (!tbody) return;

    const usuario = WorkflowAPI.obterClienteLogado();
    if (!usuario) return;

    const solicitacoes = WorkflowAPI.obterSolicitacoesCliente(usuario.email);
    
    if (solicitacoes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="color: #888; text-align: center;">Você ainda não tem solicitações. <a href="suporte.html" style="color: var(--verde-agua);">Criar uma</a></td></tr>`;
        return;
    }

    tbody.innerHTML = solicitacoes.map(s => {
        const tipoClassificacao = {
            "contrato": "Novo Contrato",
            "bateria": "Solicitar Bateria",
            "assinatura": "Energia por Assinatura",
            "manutencao": "Manutenção",
            "orcamento": "Orçamento"
        };
        const tipoLabel = tipoClassificacao[s.tipo] || s.tipo;

        // Definir cor do status
        let badgeClass = "aberto";
        let statusLabel = s.status.charAt(0).toUpperCase() + s.status.slice(1);
        if (s.status === "aprovado") {
            badgeClass = "online";
            statusLabel = "✓ Aprovado";
        } else if (s.status === "rejeitado") {
            badgeClass = "offline";
            statusLabel = "✗ Rejeitado";
        } else if (s.status === "em_analise") {
            badgeClass = "aberto";
            statusLabel = "Em Análise";
        } else if (s.status === "concluído") {
            badgeClass = "online";
            statusLabel = "✓ Concluído";
        } else if (s.status === "pendente") {
            badgeClass = "alerta";
            statusLabel = "⏱ Pendente";
        }
        
        return `
            <tr>
                <td><strong>${s.id}</strong></td>
                <td>${tipoLabel}</td>
                <td>${s.data_criacao}</td>
                <td><span class="badge ${badgeClass}">${statusLabel}</span></td>
                <td>${s.observacoes ? s.observacoes.substring(0, 50) + "..." : "—"}</td>
            </tr>
        `;
    }).join("");
}

/**
 * Criar nova solicitação do cliente
 */
function criarSolicitacaoCliente(tipo, dados) {
    if (!WorkflowAPI.obterClienteLogado()) {
        if (typeof showToast === "function") {
            showToast("Você precisa estar logado para fazer solicitações.", "error");
        }
        return;
    }

    const solicitacao = WorkflowAPI.criarSolicitacao(tipo, dados);
    
    if (typeof showToast === "function") {
        showToast(`Solicitação ${solicitacao.id} criada com sucesso! Aguarde aprovação do administrador.`, "success");
    }

    renderizarSolicitacoesCliente();
    return solicitacao;
}

/**
 * Inicialização das funcionalidades do cliente
 */
document.addEventListener("DOMContentLoaded", () => {
    // Se é página de painel cliente (mas NÃO admin), renderizar solicitações
    if (document.body.classList.contains("pagina-painel") && !document.body.classList.contains("pagina-admin")) {
        renderizarSolicitacoesCliente();

        // Atualizar a cada 10 segundos
        setInterval(() => {
            renderizarSolicitacoesCliente();
        }, 10000);
    }

    // Handlers para criar novas solicitações
    document.addEventListener("click", (e) => {
       const btnNovaManutencao = e.target.closest(".btn-nova-manutencao");
        if (btnNovaManutencao) {
            e.preventDefault();
            criarSolicitacaoCliente("manutencao", { tipo: "Manutenção geral" });
        }

        const btnNovaAssinatura = e.target.closest(".btn-nova-assinatura");
        if (btnNovaAssinatura) {
            e.preventDefault();
            criarSolicitacaoCliente("assinatura", { tipo: "Energia por Assinatura" });
        }

        const btnNovaBateria = e.target.closest(".btn-nova-bateria");
        if (btnNovaBateria) {
            e.preventDefault();
            criarSolicitacaoCliente("bateria", { tipo: "Bateria para armazenamento" });
        }

        const btnNovoContrato = e.target.closest(".btn-novo-contrato");
        if (btnNovoContrato) {
            e.preventDefault();
            criarSolicitacaoCliente("contrato", { tipo: "Novo contrato ou alteração" });
        }

        const btnSolicitarOrcamento = e.target.closest(".btn-solicitar-orcamento");
        if (btnSolicitarOrcamento) {
            e.preventDefault();
            criarSolicitacaoCliente("orcamento", { tipo: "Solicitação de orçamento" });
        }

        // BOTÕES DE SERVICOS.HTML
        const btnServicosOrcamento = e.target.closest(".js-servicos-orcamento");
        if (btnServicosOrcamento) {
            e.preventDefault();
            const servico = btnServicosOrcamento.dataset.servico || "Serviço";
            criarSolicitacaoCliente("orcamento", { 
                tipo: `Orçamento - ${servico}`,
                servico: servico 
            });
        }

        const btnServicosSimulador = e.target.closest(".js-servicos-simulador-assinatura");
        if (btnServicosSimulador) {
            e.preventDefault();
            if (typeof showToast === "function") {
                showToast("Simulador de assinatura aberto. Configure seu plano ideal.", "info");
            }
        }

        const btnAgendarContato = e.target.closest("#btn-servicos-agendar-contato");
        if (btnAgendarContato) {
            e.preventDefault();
            criarSolicitacaoCliente("contato", { tipo: "Agendar contato com consultor" });
        }

        const btnSimulador = e.target.closest("#btn-servicos-abrir-simulador");
        if (btnSimulador) {
            e.preventDefault();
            if (typeof showToast === "function") {
                showToast("Simulador de economia aberto. Selecione as soluções e compare.", "info");
            }
        }

        // BOTÕES DE MANUTENCAO.HTML
        const btnNovoChamado = e.target.closest("button");
        if (btnNovoChamado && btnNovoChamado.textContent.includes("Novo Chamado") && 
            !e.target.closest(".btn-nova-manutencao")) {
            e.preventDefault();
            criarSolicitacaoCliente("manutencao", { tipo: "Novo chamado de suporte" });
        }

        const btnAgendarVisita = e.target.closest("button");
        if (btnAgendarVisita && btnAgendarVisita.textContent.includes("Agendar Visita")) {
            e.preventDefault();
            criarSolicitacaoCliente("manutencao", { tipo: "Agendar visita técnica" });
        }
    });
});
