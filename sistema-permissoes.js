// ==========================================
// SISTEMA DE PERMISSÕES E ROLES - RTV SOLAR
// ==========================================

/**
 * DEFINIÇÃO DE ROLES E PERMISSÕES
 */
const ROLES_CONFIG = {
    "admin": {
        nome: "Administrador",
        descricao: "Acesso completo ao sistema",
        permissoes: [
            // Clientes
            "ver_clientes",
            "criar_cliente",
            "editar_cliente",
            "deletar_cliente",
            "aprovar_cliente",
            "rejeitar_cliente",
            
            // Chamados
            "ver_todos_chamados",
            "gerenciar_chamados",
            "atribuir_chamados",
            
            // Serviços
            "gerenciar_servicos",
            "aprovar_servicos",
            
            // Sistema
            "acessar_admin",
            "gerenciar_usuarios",
            "ver_auditoria",
            "gerenciar_equipamentos",
            "ver_relatorios_globais"
        ]
    },
    "cliente": {
        nome: "Cliente",
        descricao: "Acesso ao próprio sistema de energia",
        permissoes: [
            // Dashboard
            "ver_dashboard_proprio",
            "ver_geração_propria",
            "ver_consumo_proprio",
            
            // Dados pessoais
            "ver_perfil",
            "editar_perfil",
            "ver_contratos_proprios",
            "ver_orcamentos_proprios",
            
            // Chamados
            "abrir_chamado",
            "ver_chamados_proprios",
            "responder_chamado",
            
            // Relatórios
            "ver_relatorio_proprio",
            "exportar_relatorio",
            
            // Equipamentos
            "ver_equipamentos_proprios",
            "ver_monitoramento_proprio",
            
            // Suporte
            "agendar_manutencao",
            "solicitar_limpeza"
        ]
    }
};

/**
 * DEFINIÇÃO DE MENUS POR ROLE
 */
const MENUS_CONFIG = {
    "admin": [
        { id: "dashboard", url: "admin.html", nome: "Painel Admin", icone: "ph-squares-four" },
        { id: "clientes", url: "admin-clientes.html", nome: "Gestão de Clientes", icone: "ph-users" },
        { id: "servicos", url: "admin-servicos.html", nome: "Gestão de Serviços", icone: "ph-package" },
        { id: "chamados", url: "suporte.html", nome: "Suporte & Chamados", icone: "ph-headset" },
        { id: "equipamentos", url: "admin-equipamentos.html", nome: "Gestão de Equipamentos", icone: "ph-cpu" },
        { id: "relatorios", url: "admin-relatorios.html", nome: "Relatórios Globais", icone: "ph-chart-line-up" },
        { id: "auditoria", url: "auditoria.html", nome: "Logs e Auditoria", icone: "ph-shield-check" },
        { id: "configuracoes", url: "admin-configuracoes.html", nome: "Configurações", icone: "ph-gear" }
    ],
    "cliente": [
        { id: "dashboard", url: "dashboard.html", nome: "Visão Geral", icone: "ph-squares-four" },
        { id: "monitoramento", url: "monitoramento.html", nome: "Monitoramento", icone: "ph-activity" },
        { id: "geração", url: "cliente-geracao.html", nome: "Geração Solar", icone: "ph-lightning" },
        { id: "consumo", url: "cliente-consumo.html", nome: "Consumo", icone: "ph-lightning-charge" },
        { id: "financeiro", url: "cliente-financeiro.html", nome: "Financeiro", icone: "ph-currency-dollar" },
        { id: "contratos", url: "cliente-contratos.html", nome: "Contratos", icone: "ph-document" },
        { id: "chamados", url: "suporte.html", nome: "Suporte", icone: "ph-headset" },
        { id: "manutencao", url: "manutencao.html", nome: "Manutenção", icone: "ph-wrench" },
        { id: "configuracoes", url: "configuracoes.html", nome: "Configurações", icone: "ph-gear" }
    ]
};

/**
 * ROTAS PROTEGIDAS (por role)
 */
const ROTAS_PROTEGIDAS = {
    "admin.html": ["admin"],
    "admin-clientes.html": ["admin"],
    "admin-servicos.html": ["admin"],
    "admin-equipamentos.html": ["admin"],
    "admin-relatorios.html": ["admin"],
    "admin-configuracoes.html": ["admin"],
    
    "dashboard.html": ["cliente", "admin"],
    "monitoramento.html": ["cliente", "admin"],
    "dispositivos.html": ["cliente", "admin"],
    "analytics.html": ["cliente", "admin"],
    "relatorios.html": ["cliente", "admin"],
    "suporte.html": ["cliente", "admin"],
    "manutencao.html": ["cliente", "admin"],
    "auditoria.html": ["admin"],
    "configuracoes.html": ["cliente", "admin"],
    
    "cliente-geracao.html": ["cliente"],
    "cliente-consumo.html": ["cliente"],
    "cliente-financeiro.html": ["cliente"],
    "cliente-contratos.html": ["cliente"]
};

/**
 * Obter permissões do usuário logado
 */
function obterPermissoesUsuario() {
    const usuario = obterUsuarioLogado();
    if (!usuario) return [];
    
    const role = usuario.role || "cliente";
    const config = ROLES_CONFIG[role];
    return config ? config.permissoes : [];
}

/**
 * Verificar se usuário tem permissão específica
 */
function temPermissao(permissao) {
    const permissoes = obterPermissoesUsuario();
    return permissoes.includes(permissao);
}

/**
 * Verificar se usuário tem alguma das permissões
 */
function temAlgumaPermissao(permissoes) {
    const userPermissoes = obterPermissoesUsuario();
    return permissoes.some(p => userPermissoes.includes(p));
}

/**
 * Verificar se usuário tem todas as permissões
 */
function temTodasPermissoes(permissoes) {
    const userPermissoes = obterPermissoesUsuario();
    return permissoes.every(p => userPermissoes.includes(p));
}

/**
 * Obter role do usuário
 */
function obterRoleUsuario() {
    const usuario = obterUsuarioLogado();
    return usuario ? (usuario.role || "cliente") : null;
}

/**
 * Verificar se é admin
 */
function ehAdmin() {
    return obterRoleUsuario() === "admin";
}

/**
 * Verificar se é cliente
 */
function ehCliente() {
    return obterRoleUsuario() === "cliente";
}

/**
 * Gerar menu dinâmico baseado no role
 */
function gerarMenuDinamico() {
    const role = obterRoleUsuario();
    if (!role) return [];
    
    return MENUS_CONFIG[role] || [];
}

/**
 * Renderizar sidebar com menu dinâmico
 */
function renderMenuDinamico() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    
    const role = obterRoleUsuario();
    const menu = gerarMenuDinamico();
    
    // Limpar sidebar
    sidebar.innerHTML = "";
    
    // Adicionar itens do menu
    menu.forEach(item => {
        const link = document.createElement("a");
        link.href = item.url;
        
        // Marcar como ativo se for a página atual
        const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
        if (item.url === paginaAtual) {
            link.classList.add("active");
        }
        
        link.innerHTML = `<i class="ph ${item.icone}"></i> ${item.nome}`;
        sidebar.appendChild(link);
    });
}

/**
 * Verificar acesso à página atual
 */
function verificarAcessoPagina() {
    const usuario = obterUsuarioLogado();
    if (!usuario) {
        // Redirecionar para login
        if (!window.location.pathname.includes("login") && 
            !window.location.pathname.includes("index") &&
            !window.location.pathname.includes("registro") &&
            !window.location.pathname.includes("servicos")) {
            window.location.href = "login.html";
        }
        return;
    }
    
    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
    const rolesPermitidos = ROTAS_PROTEGIDAS[paginaAtual];
    
    if (!rolesPermitidos) return; // Página sem proteção
    
    const role = usuario.role || "cliente";
    
    if (!rolesPermitidos.includes(role)) {
        // Redirecionar para página apropriada
        if (role === "admin") {
            window.location.href = "admin.html";
        } else if (role === "cliente") {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "login.html";
        }
    }
}

/**
 * Mostrar/esconder elementos por permissão
 */
function controlarVisibilidadeElementos() {
    const usuario = obterUsuarioLogado();
    if (!usuario) return;
    
    // Elementos com data-permissao
    document.querySelectorAll("[data-permissao]").forEach(el => {
        const permissao = el.getAttribute("data-permissao");
        if (temPermissao(permissao)) {
            el.style.display = "";
        } else {
            el.style.display = "none";
        }
    });
    
    // Elementos com data-role
    document.querySelectorAll("[data-role]").forEach(el => {
        const roles = el.getAttribute("data-role").split(",").map(r => r.trim());
        if (roles.includes(usuario.role || "cliente")) {
            el.style.display = "";
        } else {
            el.style.display = "none";
        }
    });
}

/**
 * Registrar ação importante (para auditoria)
 */
function registrarAcaoPermissao(acao, detalhes = "") {
    const usuario = obterUsuarioLogado();
    registrarAuditoria(`[${usuario.role?.toUpperCase() || "CLIENTE"}] ${acao} ${detalhes}`);
}

/**
 * Inicializar sistema de permissões
 */
function inicializarPermissoes() {
    document.addEventListener("DOMContentLoaded", () => {
        verificarAcessoPagina();
        renderMenuDinamico();
        controlarVisibilidadeElementos();
    });
}

// Chamar inicialização
inicializarPermissoes();

// Exportar para uso global
window.PermissaoAPI = {
    temPermissao,
    temAlgumaPermissao,
    temTodasPermissoes,
    obterRoleUsuario,
    ehAdmin,
    ehCliente,
    gerarMenuDinamico,
    renderMenuDinamico,
    verificarAcessoPagina,
    controlarVisibilidadeElementos,
    registrarAcaoPermissao,
    ROLES_CONFIG,
    MENUS_CONFIG
};
