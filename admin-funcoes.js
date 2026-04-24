// ==========================================
// FUNÇÕES DE ADMIN - RENDERIZAÇÃO E GERENCIAMENTO
// ==========================================

/**
 * Renderiza a tabela de solicitações pendentes no admin
 */
function renderizarSolicitacoesPendentes() {
    const tbody = document.getElementById("tabela-solicitacoes-pendentes");
    if (!tbody) return;

    const solicitacoes = WorkflowAPI.obterSolicitacoesPendentes();
    
    if (solicitacoes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="color: #888; text-align: center;">Nenhuma solicitação pendente no momento.</td></tr>`;
        return;
    }

    tbody.innerHTML = solicitacoes.map(s => {
        const tipoClassificacao = {
            "cadastro": "Cadastro de Cliente",
            "contrato": "Contrato",
            "bateria": "Bateria",
            "assinatura": "Assinatura",
            "manutencao": "Manutenção",
            "orcamento": "Orçamento"
        };
        const tipoLabel = tipoClassificacao[s.tipo] || s.tipo;
        
        return `
            <tr>
                <td><strong>${s.id}</strong></td>
                <td>${tipoLabel}</td>
                <td>${s.cliente_nome}</td>
                <td>${s.data_criacao}</td>
                <td><span class="badge aberto">Pendente</span></td>
                <td>
                    <a href="#" class="link-aprovar-solicitacao" data-sol-id="${s.id}" style="color: #27c93f; margin-right: 10px;">✓ Aprovar</a>
                    <a href="#" class="link-rejeitar-solicitacao" data-sol-id="${s.id}" style="color: #ff5f56;">✗ Rejeitar</a>
                </td>
            </tr>
        `;
    }).join("");
}

/**
 * Atualizar métricas do admin
 */
function atualizarMetricasAdmin() {
    // Total de usuários
    const usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    const totalUsuarios = usuarios.length;
    const elUsuarios = document.getElementById("total-usuarios");
    if (elUsuarios) elUsuarios.textContent = totalUsuarios;

    // Total de alertas/pendências
    const alertas = WorkflowAPI.contarAlertas();
    const elAlertas = document.getElementById("total-alertas");
    if (elAlertas) elAlertas.textContent = alertas;

    // Configurações ativas
    const elConfigs = document.getElementById("configs");
    if (elConfigs) elConfigs.textContent = "5 ativas";
}

/**
 * Aprovar solicitação
 */
async function aprovarSolicitacao(solicitacaoId) {
    const confirmado = await CustomDialog.confirm('Aprovar', 'Deseja aprovar esta solicitação?', 'success', 'Aprovar');
    if (!confirmado) return;
    
    showLoader();
    setTimeout(() => {
        WorkflowAPI.atualizarStatusSolicitacao(solicitacaoId, "aprovado", "Aprovado pelo administrador");
        
        if (typeof showToast === "function") {
            showToast("Solicitação aprovada com sucesso!", "success");
        }
        
        renderizarSolicitacoesPendentes();
        atualizarMetricasAdmin();
        hideLoader();
    }, 600);
}

/**
 * Rejeitar solicitação
 */
async function rejeitarSolicitacao(solicitacaoId) {
    const motivo = await CustomDialog.prompt("Rejeitar Solicitação", "Motivo da rejeição (opcional):", "Digite o motivo...");
    if (motivo === null) return;
    
    showLoader();
    setTimeout(() => {
        WorkflowAPI.atualizarStatusSolicitacao(solicitacaoId, "rejeitado", motivo || "Sem motivo especificado");
        
        if (typeof showToast === "function") {
            showToast("Solicitação rejeitada.", "success");
        }
        
        renderizarSolicitacoesPendentes();
        atualizarMetricasAdmin();
        hideLoader();
    }, 600);
}

/**
 * Inicialização das funcionalidades admin
 */
document.addEventListener("DOMContentLoaded", () => {
    // Se é página admin, renderizar solicitações
    if (document.body.classList.contains("pagina-admin")) {
        renderizarSolicitacoesPendentes();
        atualizarMetricasAdmin();

        // Handlers para botões de aprovação/rejeição
        document.addEventListener("click", (e) => {
            const linkAprovar = e.target.closest(".link-aprovar-solicitacao");
            if (linkAprovar) {
                e.preventDefault();
                const solId = linkAprovar.getAttribute("data-sol-id");
                aprovarSolicitacao(solId);
                return;
            }

            const linkRejeitar = e.target.closest(".link-rejeitar-solicitacao");
            if (linkRejeitar) {
                e.preventDefault();
                const solId = linkRejeitar.getAttribute("data-sol-id");
                rejeitarSolicitacao(solId);
                return;
            }
        });

        // Atualizar a cada 5 segundos
        setInterval(() => {
            atualizarMetricasAdmin();
        }, 5000);
    }
});
