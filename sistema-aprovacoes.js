// ==========================================
// SISTEMA DE APROVAÇÕES DE CLIENTES
// ==========================================

/**
 * Função para obter todos os clientes pendentes de aprovação
 */
function obterClientesPendentes() {
    const usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    return usuarios.filter(u => u.role === "cliente" && u.aprovadoAdmin === false);
}

/**
 * Função para obter todos os clientes aprovados
 */
function obterClientesAprovados() {
    const usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    return usuarios.filter(u => u.role === "cliente" && u.aprovadoAdmin === true);
}

/**
 * Função para aprovar um cliente cadastrado
 */
function aprovarCliente(clienteId) {
    let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    let cliente = usuarios.find(u => u.id === clienteId);
    
    if (!cliente) {
        showToast("Cliente não encontrado.", "error");
        return false;
    }

    cliente.aprovadoAdmin = true;
    cliente.dataAprovacao = new Date().toLocaleString('pt-BR');
    localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
    
    registrarAuditoria(`APROVAÇÃO: Cliente ${cliente.nome} (${cliente.email}) foi aprovado.`);
    showToast(`Cliente ${cliente.nome} aprovado com sucesso!`, "success");
    
    return true;
}

/**
 * Função para rejeitar um cliente
 */
function rejeitarCliente(clienteId, motivo = "") {
    let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    const idx = usuarios.findIndex(u => u.id === clienteId);
    
    if (idx === -1) {
        showToast("Cliente não encontrado.", "error");
        return false;
    }

    const cliente = usuarios[idx];
    registrarAuditoria(`REJEIÇÃO: Cliente ${cliente.nome} (${cliente.email}) foi rejeitado. Motivo: ${motivo || "Não especificado"}`);
    
    usuarios.splice(idx, 1);
    localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
    
    showToast(`Cliente ${cliente.nome} foi rejeitado.`, "success");
    return true;
}

/**
 * Função para renderizar painel de aprovações no admin
 */
function renderPainelAprovacoes() {
    const containerPendentes = document.getElementById("tabela-clientes-pendentes");
    const containerAprovados = document.getElementById("tabela-clientes-aprovados");
    
    if (!containerPendentes && !containerAprovados) return;

    // Clientes Pendentes
    if (containerPendentes) {
        const clientesPendentes = obterClientesPendentes();
        
        if (clientesPendentes.length === 0) {
            containerPendentes.innerHTML = `
                <tr>
                    <td colspan="7" style="color:#888; text-align: center; padding: 20px;">
                        <i class="ph ph-check-circle" style="font-size: 32px; color: #27c93f; margin-bottom: 10px; display: block;"></i>
                        Todos os clientes foram aprovados!
                    </td>
                </tr>
            `;
        } else {
            containerPendentes.innerHTML = clientesPendentes.map(cliente => `
                <tr style="border-left: 4px solid var(--amarelo-vivo);">
                    <td>${cliente.nome}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefone || "-"}</td>
                    <td>${cliente.servico || "-"}</td>
                    <td>${cliente.dataCadastro || "-"}</td>
                    <td>
                        <span class="badge" style="background-color: var(--amarelo-vivo); color: #000;">Pendente</span>
                    </td>
                    <td style="text-align: center;">
                        <button class="btn-acao-cliente" data-acao="aprovar" data-cliente-id="${cliente.id}" style="background: #27c93f; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; margin-right: 5px;">
                            Aprovar
                        </button>
                        <button class="btn-acao-cliente" data-acao="rejeitar" data-cliente-id="${cliente.id}" style="background: #ff5f56; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">
                            Rejeitar
                        </button>
                    </td>
                </tr>
            `).join("");
        }
    }

    // Clientes Aprovados
    if (containerAprovados) {
        const clientesAprovados = obterClientesAprovados();
        
        if (clientesAprovados.length === 0) {
            containerAprovados.innerHTML = `
                <tr>
                    <td colspan="6" style="color:#888; text-align: center; padding: 20px;">Nenhum cliente aprovado ainda.</td>
                </tr>
            `;
        } else {
            containerAprovados.innerHTML = clientesAprovados.map(cliente => `
                <tr style="border-left: 4px solid #27c93f;">
                    <td>${cliente.nome}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefone || "-"}</td>
                    <td>${cliente.servico || "-"}</td>
                    <td>${cliente.dataAprovacao || "-"}</td>
                    <td>
                        <span class="badge" style="background-color: #27c93f; color: white;">Aprovado</span>
                    </td>
                </tr>
            `).join("");
        }
    }

    // Atualizar contadores
    atualizarMetricasAprovacoes();
}

/**
 * Função para atualizar métricas de aprovações
 */
function atualizarMetricasAprovacoes() {
    const elPendentes = document.getElementById("metrica-clientes-pendentes");
    const elAprovados = document.getElementById("metrica-clientes-aprovados");
    const elTotal = document.getElementById("metrica-clientes-total");

    const clientesPendentes = obterClientesPendentes();
    const clientesAprovados = obterClientesAprovados();
    const total = clientesPendentes.length + clientesAprovados.length;

    if (elPendentes) elPendentes.textContent = clientesPendentes.length;
    if (elAprovados) elAprovados.textContent = clientesAprovados.length;
    if (elTotal) elTotal.textContent = total;
}

/**
 * Função para bloquear cliente não aprovado
 */
function verificarAprovacaoCliente() {
    const usuarioLogado = obterUsuarioLogado();
    
    if (!usuarioLogado || usuarioLogado.role !== "cliente") {
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    const cliente = usuarios.find(u => u.email === usuarioLogado.email);

    if (cliente && !cliente.aprovadoAdmin) {
        // Mostrar mensagem de bloqueio
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; text-align: center; background: var(--cor-fundo); color: var(--cor-texto);">
                <i class="ph ph-clock" style="font-size: 64px; color: var(--amarelo-vivo); margin-bottom: 20px;"></i>
                <h1 style="color: var(--amarelo-vivo);">Seu cadastro está sob revisão</h1>
                <p style="font-size: 16px; color: #aaa; max-width: 400px;">
                    Obrigado por se cadastrar! Seu pedido está sendo analisado pela equipe administradora da RTV Solar.
                    Você receberá uma confirmação por e-mail quando sua conta for aprovada.
                </p>
                <a href="index.html" style="margin-top: 20px; padding: 12px 24px; background: var(--verde-agua); color: white; text-decoration: none; border-radius: 8px;">
                    Voltar à Página Inicial
                </a>
            </div>
        `;
    }
}

/**
 * Função para aprovar serviços do cliente
 */
function atualizarServicoCliente(clienteId, servicoDados) {
    let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    let cliente = usuarios.find(u => u.id === clienteId);
    
    if (!cliente) {
        showToast("Cliente não encontrado.", "error");
        return false;
    }

    if (!cliente.servicosAdquiridos) {
        cliente.servicosAdquiridos = [];
    }

    const novoServico = {
        id: 'srv_' + Date.now(),
        tipo: servicoDados.tipo,
        dataPedido: new Date().toLocaleString('pt-BR'),
        dataInstalacao: servicoDados.dataInstalacao || null,
        status: 'aguardando-aprovacao', // 'aguardando-aprovacao', 'aprovado', 'instalado', 'cancelado'
        valor: servicoDados.valor,
        descricao: servicoDados.descricao
    };

    cliente.servicosAdquiridos.push(novoServico);
    localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
    
    registrarAuditoria(`Serviço solicitado: ${servicoDados.tipo} para cliente ${cliente.nome}`);
    
    return true;
}

/**
 * Função para aprovar serviço do cliente
 */
function aprovarServicoCliente(clienteId, servicoId) {
    let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    let cliente = usuarios.find(u => u.id === clienteId);
    
    if (!cliente) {
        showToast("Cliente não encontrado.", "error");
        return false;
    }

    let servico = cliente.servicosAdquiridos?.find(s => s.id === servicoId);
    if (!servico) {
        showToast("Serviço não encontrado.", "error");
        return false;
    }

    servico.status = 'aprovado';
    servico.dataAprovacaoServico = new Date().toLocaleString('pt-BR');
    localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
    
    registrarAuditoria(`Serviço aprovado: ${servico.tipo} para cliente ${cliente.nome}`);
    showToast(`Serviço ${servico.tipo} aprovado!`, "success");
    
    return true;
}

/**
 * Função para renderizar serviços pendentes de aprovação
 */
function renderServicosPendentes() {
    const container = document.getElementById("tabela-servicos-pendentes");
    if (!container) return;

    const usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    let servicosPendentes = [];

    usuarios.forEach(usuario => {
        if (usuario.servicosAdquiridos && Array.isArray(usuario.servicosAdquiridos)) {
            usuario.servicosAdquiridos.forEach(servico => {
                if (servico.status === 'aguardando-aprovacao') {
                    servicosPendentes.push({
                        clienteId: usuario.id,
                        clienteNome: usuario.nome,
                        clienteEmail: usuario.email,
                        ...servico
                    });
                }
            });
        }
    });

    if (servicosPendentes.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" style="color:#888; text-align: center; padding: 20px;">Nenhum serviço pendente de aprovação.</td>
            </tr>
        `;
    } else {
        container.innerHTML = servicosPendentes.map(srv => `
            <tr style="border-left: 4px solid var(--amarelo-vivo);">
                <td>${srv.clienteNome}</td>
                <td>${srv.clienteEmail}</td>
                <td>${srv.tipo}</td>
                <td>R$ ${srv.valor?.toFixed(2) || "0.00"}</td>
                <td>${srv.dataPedido}</td>
                <td><span class="badge" style="background-color: var(--amarelo-vivo); color: #000;">Pendente</span></td>
                <td>
                    <button class="btn-aprovar-servico" data-cliente-id="${srv.clienteId}" data-servico-id="${srv.id}" style="background: #27c93f; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">
                        Aprovar
                    </button>
                </td>
            </tr>
        `).join("");
    }
}

// Event listeners para ações do painel de aprovações
document.addEventListener("DOMContentLoaded", () => {
    // Verificar se esta é uma página de painel admin
    if (document.body.classList.contains("pagina-admin")) {
        renderPainelAprovacoes();

        // Listeners para botões de ação
        document.addEventListener("click", (e) => {
            const target = e.target;
            
            if (target.classList.contains("btn-acao-cliente")) {
                const acao = target.getAttribute("data-acao");
                const clienteId = target.getAttribute("data-cliente-id");

                if (acao === "aprovar") {
                    if (aprovarCliente(clienteId)) {
                        renderPainelAprovacoes();
                    }
                } else if (acao === "rejeitar") {
                    const motivo = prompt("Motivo da rejeição (opcional):");
                    if (rejeitarCliente(clienteId, motivo)) {
                        renderPainelAprovacoes();
                    }
                }
            }

            if (target.classList.contains("btn-aprovar-servico")) {
                const clienteId = target.getAttribute("data-cliente-id");
                const servicoId = target.getAttribute("data-servico-id");

                if (aprovarServicoCliente(clienteId, servicoId)) {
                    renderServicosPendentes();
                }
            }
        });

        renderServicosPendentes();
    }

    // Verificar aprovação do cliente ao acessar o painel
    if (document.body.classList.contains("pagina-painel") && !document.body.classList.contains("pagina-admin")) {
        verificarAprovacaoCliente();
    }
});
