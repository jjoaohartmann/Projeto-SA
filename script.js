function seedUsuariosPadrao() {
    let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    
    // Padronizar usuários existentes: garantir que todos têm id, role, aprovadoAdmin e rejeitado
    usuarios = usuarios.map((u, idx) => ({
        ...u,
        id: u.id || ('cli_auto_' + idx + '_' + Date.now()),
        role: u.role || "cliente",
        aprovadoAdmin: u.aprovadoAdmin ?? false,
        rejeitado: u.rejeitado ?? false,
        dataCadastro: u.dataCadastro || new Date().toLocaleDateString('pt-BR')
    }));
    
    // Garantir que existe um admin
    const temAdmin = usuarios.some((u) => u.role === "admin");
    if (!temAdmin) {
        usuarios.push({
            id: 'admin_1',
            nome: "Administrador RTV",
            email: "admin@rtvsolar.com",
            senha: "admin123",
            role: "admin",
            aprovadoAdmin: true,
            rejeitado: false
        });
    }
    
    // Clientes de exemplo
    const clientesExemplo = [
        {
            id: 'cli_1',
            nome: "João Silva",
            email: "joao.silva@email.com",
            telefone: "(48) 99123-4567",
            endereco: "Rua A, 123 - Brusque, SC",
            cpf: "123.456.789-00",
            servico: "energia-solar",
            senha: "senha123",
            role: "cliente",
            aprovadoAdmin: true,
            rejeitado: false,
            servicosAdquiridos: ["energia-solar"],
            dataCadastro: "15/03/2024",
            dataAprovacao: "16/03/2024"
        },
        {
            id: 'cli_2',
            nome: "Maria Santos",
            email: "maria.santos@email.com",
            telefone: "(48) 98765-4321",
            endereco: "Rua B, 456 - Brusque, SC",
            cpf: "987.654.321-00",
            servico: "hibrido",
            senha: "senha123",
            role: "cliente",
            aprovadoAdmin: true,
            rejeitado: false,
            servicosAdquiridos: ["hibrido"],
            dataCadastro: "20/04/2024",
            dataAprovacao: "21/04/2024"
        },
        {
            id: 'cli_3',
            nome: "Pedro Costa",
            email: "pedro.costa@email.com",
            telefone: "(48) 99876-5432",
            endereco: "Rua C, 789 - Brusque, SC",
            cpf: "456.789.123-00",
            servico: "assinatura",
            senha: "senha123",
            role: "cliente",
            aprovadoAdmin: false,
            rejeitado: false,
            servicosAdquiridos: [],
            dataCadastro: "10/01/2025",
            dataAprovacao: null
        },
        {
            id: 'cli_4',
            nome: "Ana Oliveira",
            email: "ana.oliveira@email.com",
            telefone: "(48) 98765-1234",
            endereco: "Rua D, 321 - Brusque, SC",
            cpf: "321.654.987-00",
            servico: "energia-solar",
            senha: "senha123",
            role: "cliente",
            aprovadoAdmin: false,
            rejeitado: false,
            servicosAdquiridos: [],
            dataCadastro: "05/01/2025",
            dataAprovacao: null
        }
    ];
    
    // Adicionar clientes de exemplo se não existem
    clientesExemplo.forEach(clienteExemplo => {
        if (!usuarios.some(u => u.id === clienteExemplo.id)) {
            usuarios.push(clienteExemplo);
        }
    });
    
    localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
}

function obterUsuarioLogado() {
    const raw = localStorage.getItem("rtv_usuario_logado");
    if (!raw) return null;
    let u = JSON.parse(raw);
    const usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    const found = usuarios.find((x) => x.email === u.email);
    if (found && found.role) {
        u.role = found.role;
    } else if (!u.role) {
        u.role = "cliente";
    }
    localStorage.setItem("rtv_usuario_logado", JSON.stringify(u));
    return u;
}

function registrarAuditoria(acao) {
    let logs = JSON.parse(localStorage.getItem("rtv_logs_auditoria")) || [];
    const sessao = obterUsuarioLogado();
    logs.unshift({
        data: new Date().toLocaleString('pt-BR'),
        acao: acao,
        ip: "192.168.1.100 (Mock)",
        user: sessao && sessao.nome ? sessao.nome : "Sistema"
    });
    if (logs.length > 50) logs.pop();
    localStorage.setItem("rtv_logs_auditoria", JSON.stringify(logs));
}

let auditoriaPaginaAtual = 0;

function renderPainelAdminResumo() {
    const tbody = document.getElementById("tabela-admin-chamados");
    if (!tbody) return;

    const chamados = JSON.parse(localStorage.getItem("rtv_chamados")) || [];
    if (chamados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:#888;">Nenhum chamado registado pelos clientes.</td></tr>`;
    } else {
        tbody.innerHTML = chamados.map((c) => `
            <tr>
                <td>${c.id}</td>
                <td>${c.categoria}</td>
                <td>${c.data}</td>
                <td><span class="badge aberto">Em Análise</span></td>
                <td>${c.descricao ? String(c.descricao).slice(0, 80) + (String(c.descricao).length > 80 ? "…" : "") : "—"}</td>
            </tr>
        `).join("");
    }

    const usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
    const numClientes = usuarios.filter((u) => (u.role || "cliente") !== "admin").length;
    const elC = document.getElementById("admin-metric-clientes");
    const elT = document.getElementById("admin-metric-chamados");
    if (elC) elC.textContent = String(numClientes);
    if (elT) elT.textContent = String(chamados.length);

    const logs = JSON.parse(localStorage.getItem("rtv_logs_auditoria")) || [];
    const elL = document.getElementById("admin-metric-logs");
    if (elL) elL.textContent = String(logs.length);
}

document.addEventListener("DOMContentLoaded", () => {
    seedUsuariosPadrao();
    renderPainelAdminResumo();
    
    // ==========================================
    // SISTEMA DE NOTIFICAÇÕES (TOAST)
    // ==========================================
    // ==========================================
    // SISTEMA DE NOTIFICAÇÕES (TOAST)
    // ==========================================
    // Cria o container de toasts na tela se não existir
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
    }

    // Função global para chamar os alertas bonitos
    window.showToast = function(mensagem, tipo = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${tipo}`;
        
        // Define o ícone com base no tipo
        let icone = "ph-info";
        if (tipo === "success") icone = "ph-check-circle";
        if (tipo === "error") icone = "ph-warning-circle";
        if (tipo === "warning") icone = "ph-warning";
        
        toast.innerHTML = `<i class="ph ${icone}"></i> <span>${mensagem}</span>`;
        toastContainer.appendChild(toast);

        // Remove o toast do HTML após a animação (4.4 segundos)
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4400);
    };

    // ==========================================
    // MODAL CUSTOMIZADO (ALERT, CONFIRM, PROMPT)
    // ==========================================
    window.CustomDialog = {
        _createModal: function(options) {
            return new Promise((resolve) => {
                // Cria o overlay
                const overlay = document.createElement('div');
                overlay.className = 'custom-modal-overlay';
                
                // Define o ícone
                let iconeClass = "ph-info";
                if (options.icon === "success") iconeClass = "ph-check-circle";
                if (options.icon === "error") iconeClass = "ph-x-circle";
                if (options.icon === "warning") iconeClass = "ph-warning";

                // html interno
                let html = `
                    <div class="custom-modal-box">
                        <i class="ph ${iconeClass} custom-modal-icon ${options.icon || 'info'}"></i>
                        <div class="custom-modal-title">${options.title || 'Atenção'}</div>
                        <div class="custom-modal-message">${options.text || ''}</div>
                `;

                if (options.type === 'prompt') {
                    html += `<input type="text" class="custom-modal-input" placeholder="${options.placeholder || ''}">`;
                }

                html += `<div class="custom-modal-actions">`;
                
                if (options.showCancelButton) {
                    html += `<button class="custom-modal-btn-cancel">${options.cancelButtonText || 'Cancelar'}</button>`;
                }
                
                const confirmClass = options.isDanger ? 'custom-modal-btn-confirm danger' : 'custom-modal-btn-confirm';
                html += `<button class="${confirmClass}">${options.confirmButtonText || 'OK'}</button>`;
                
                html += `</div></div>`;
                overlay.innerHTML = html;
                document.body.appendChild(overlay);

                // Pequeno delay para a transição do CSS
                setTimeout(() => overlay.classList.add('active'), 10);

                const input = overlay.querySelector('.custom-modal-input');
                if (input) input.focus();

                const fecharModal = (valor) => {
                    overlay.classList.remove('active');
                    setTimeout(() => {
                        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                        resolve(valor);
                    }, 300);
                };

                const btnConfirm = overlay.querySelector('.custom-modal-btn-confirm');
                btnConfirm.addEventListener('click', () => {
                    fecharModal(options.type === 'prompt' ? (input ? input.value : '') : true);
                });

                const btnCancel = overlay.querySelector('.custom-modal-btn-cancel');
                if (btnCancel) {
                    btnCancel.addEventListener('click', () => {
                        fecharModal(options.type === 'prompt' ? null : false);
                    });
                }
            });
        },
        alert: function(title, text, icon = 'info') {
            return this._createModal({ title, text, icon, type: 'alert', showCancelButton: false });
        },
        confirm: function(title, text, icon = 'warning', confirmText = 'Confirmar', isDanger = false) {
            return this._createModal({ title, text, icon, type: 'confirm', showCancelButton: true, confirmButtonText: confirmText, isDanger });
        },
        prompt: function(title, text, placeholder = '') {
            return this._createModal({ title, text, icon: 'info', type: 'prompt', showCancelButton: true, placeholder });
        }
    };

    // Substitui o alert original pelo customizado ou pelo Toast
    window.alert = function(msg) {
        // Usa o custom alert para alerts nativos
        showToast(msg, "info");
    };

    document.querySelectorAll(".social-login .btn-social").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            showToast("Integração social em preparação — utilize e-mail e senha.", "error");
        });
    });

    // Ações genéricas para itens "mock" (sem navegação real)
    document.addEventListener("click", (e) => {
        const target = e.target;
        const anchor = target && target.closest ? target.closest("a") : null;
        if (anchor && anchor.getAttribute("href") === "#") {
            const id = anchor.getAttribute("id");
            if (id === "btn-logout" || id === "btn-notificacoes") return;
            if (anchor.classList.contains("js-servicos-no-toast") || anchor.classList.contains("js-manutencao-no-toast")) return;
            e.preventDefault();
            const label = (anchor.textContent || "Ação").trim();
            showToast(`${label}: Funcionalidade requer pacote adicional`, "info");
            registrarAuditoria(`Ação restrita acessada: ${label}`);
        }
    });

    // ==========================================
    // EFEITO NO HEADER E BACK TO TOP (SCROLL)
    // ==========================================
    const navbar = document.querySelector(".nav-bar");
    
    // Criar botão Back to Top
    const backToTop = document.createElement("div");
    backToTop.className = "back-to-top";
    backToTop.innerHTML = '<i class="ph ph-caret-up"></i>';
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            if (navbar) navbar.classList.add("scrolled");
        } else {
            if (navbar) navbar.classList.remove("scrolled");
        }

        if (window.scrollY > 300) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    // ==========================================
    // LOADER GLOBAL
    // ==========================================
    const globalLoader = document.createElement("div");
    globalLoader.className = "global-loader";
    globalLoader.innerHTML = '<div class="spinner"></div><div style="color:var(--verde-agua); font-weight:bold;">Processando...</div>';
    document.body.appendChild(globalLoader);
    
    window.showLoader = function() {
        globalLoader.classList.add("active");
    };
    
    window.hideLoader = function() {
        globalLoader.classList.remove("active");
    };
    // Fim Loader Global

    // ==========================================
    // MOSTRAR / OCULTAR SENHA
    // ==========================================
    const toggleSenhaBtn = document.getElementById("toggle-senha");
    const inputSenha = document.getElementById("senha");

    if (toggleSenhaBtn && inputSenha) {
        toggleSenhaBtn.addEventListener("click", () => {
            const tipoAtual = inputSenha.getAttribute("type");
            if (tipoAtual === "password") {
                inputSenha.setAttribute("type", "text");
                toggleSenhaBtn.classList.replace("ph-eye", "ph-eye-slash");
            } else {
                inputSenha.setAttribute("type", "password");
                toggleSenhaBtn.classList.replace("ph-eye-slash", "ph-eye");
            }
        });
    }

    const toggleSenhaAdminBtn = document.getElementById("toggle-senha-admin");
    const inputSenhaAdmin = document.getElementById("senha-admin");
    if (toggleSenhaAdminBtn && inputSenhaAdmin) {
        toggleSenhaAdminBtn.addEventListener("click", () => {
            const tipoAtual = inputSenhaAdmin.getAttribute("type");
            if (tipoAtual === "password") {
                inputSenhaAdmin.setAttribute("type", "text");
                toggleSenhaAdminBtn.classList.replace("ph-eye", "ph-eye-slash");
            } else {
                inputSenhaAdmin.setAttribute("type", "password");
                toggleSenhaAdminBtn.classList.replace("ph-eye-slash", "ph-eye");
            }
        });
    }

    // ==========================================
    // MENU HAMBÚRGUER
    // ==========================================
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".topic");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".topic li a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
            });
        });
    }

    // ==========================================
    // SISTEMA DE AUTENTICAÇÃO (LOCALSTORAGE)
    // ==========================================
    const formCadastro = document.getElementById("form-cadastro");
    const formLogin = document.getElementById("form-login");
    const formLoginAdmin = document.getElementById("form-login-admin");
    const btnLogout = document.getElementById("btn-logout");

    // Lógica de Cadastro
    if (formCadastro) {
        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value;

            let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];

            if (usuarios.some(u => u.email === email)) {
                showToast("Este e-mail já está cadastrado!", "error");
                return;
            }

            const novoCliente = {
                id: 'cli_' + Date.now(),
                nome,
                email,
                senha,
                role: "cliente",
                aprovadoAdmin: false,
                rejeitado: false,
                dataCadastro: new Date().toLocaleDateString('pt-BR')
            };
            usuarios.push(novoCliente);
            localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
            localStorage.setItem("rtv_usuario_logado", JSON.stringify({ nome, email, role: "cliente" }));
            
            showToast("Cadastro realizado! Entrando...", "success");
            
            // Redireciona após 1.5s para o usuário ler o toast
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
        });
    }

    // Lógica de Login
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value;

            let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
            const usuarioValido = usuarios.find(u => u.email === email && u.senha === senha);

            if (!usuarioValido) {
                showToast("E-mail ou senha incorretos.", "error");
                return;
            }

            const role = usuarioValido.role || "cliente";
            if (role === "admin") {
                showToast("Esta conta é de administrador. Use o acesso da equipa RTV.", "error");
                return;
            }

            // Verificar se o cliente foi aprovado pelo admin
            if (!usuarioValido.aprovadoAdmin) {
                showToast("Sua conta está sob análise. Você receberá um e-mail quando for aprovado.", "error");
                return;
            }

            localStorage.setItem("rtv_usuario_logado", JSON.stringify({
                nome: usuarioValido.nome,
                email: usuarioValido.email,
                role: "cliente"
            }));
            showToast(`Bem-vindo de volta, ${usuarioValido.nome}!`, "success");
            
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1200);
        });
    }

    if (formLoginAdmin) {
        formLoginAdmin.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email-admin").value.trim();
            const senha = document.getElementById("senha-admin").value;

            let usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
            const usuarioValido = usuarios.find((u) => u.email === email && u.senha === senha);

            if (!usuarioValido || (usuarioValido.role || "cliente") !== "admin") {
                showToast("Credenciais inválidas ou sem perfil de administrador.", "error");
                return;
            }

            localStorage.setItem("rtv_usuario_logado", JSON.stringify({
                nome: usuarioValido.nome,
                email: usuarioValido.email,
                role: "admin"
            }));
            showToast(`Bem-vindo, ${usuarioValido.nome}.`, "success");
            setTimeout(() => { window.location.href = "admin.html"; }, 900);
        });
    }

    // ==========================================
    // PROTEÇÃO DO PAINEL & SAUDAÇÃO DINÂMICA
    // ==========================================
    const nomeUsuarioDisplay = document.getElementById("nome-usuario-display");
    const textoSaudacao = document.querySelector(".boas-vindas h2");
    
    if (document.body.classList.contains("pagina-admin")) {
        const usuarioAdmin = obterUsuarioLogado();
        if (!usuarioAdmin || usuarioAdmin.role !== "admin") {
            window.location.href = "login-admin.html";
        } else {
            const h2Admin = document.getElementById("saudacao-admin");
            if (h2Admin) {
                h2Admin.innerHTML = `Área administrativa — <span style="color: var(--verde-agua);">${usuarioAdmin.nome}</span>`;
            }
        }
    }

    if (document.body.classList.contains("pagina-painel") && !document.body.classList.contains("pagina-admin")) {
        const usuarioLogado = obterUsuarioLogado();

        if (!usuarioLogado) {
            window.location.href = "login.html";
        } else {
            document.querySelectorAll(".sidebar-link-admin").forEach((el) => {
                el.style.display = (usuarioLogado.role === "admin") ? "flex" : "none";
            });

            if (textoSaudacao && nomeUsuarioDisplay) {
                const horaAtual = new Date().getHours();
                let saudacao = "Boa noite";
                if (horaAtual >= 5 && horaAtual < 12) saudacao = "Bom dia";
                else if (horaAtual >= 12 && horaAtual < 18) saudacao = "Boa tarde";

                textoSaudacao.innerHTML = `${saudacao}, <span id="nome-usuario-display" style="color: var(--verde-agua);">${usuarioLogado.nome}</span>!`;
            }
        }
    }

    // Lógica de Logout
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("rtv_usuario_logado");
            window.location.href = document.body.classList.contains("pagina-admin") ? "login-admin.html" : "login.html";
        });
    }

    // Configurações (botões mock)
    const btnSalvarPerfil = document.getElementById("btn-salvar-perfil");
    if (btnSalvarPerfil) {
        btnSalvarPerfil.addEventListener("click", () => {
            showToast("Alterações salvas com sucesso.", "success");
            registrarAuditoria("Configurações: perfil atualizado");
        });
    }

    const btnAlterarSenha = document.getElementById("btn-alterar-senha");
    if (btnAlterarSenha) {
        btnAlterarSenha.addEventListener("click", () => {
            showToast("Senha alterada com sucesso.", "success");
            registrarAuditoria("Configurações: senha alterada");
        });
    }

    // Dispositivos (botão mock)
    const btnNovoDispositivo = document.getElementById("btn-novo-dispositivo");
    if (btnNovoDispositivo) {
        btnNovoDispositivo.addEventListener("click", () => {
            // Se a página de dispositivos tiver modal, abre o fluxo real
            const overlay = document.getElementById("modal-dispositivo-overlay");
            if (overlay) {
                abrirModalDispositivo();
                return;
            }
            showToast("O limite de dispositivos para este plano foi atingido.", "warning");
            registrarAuditoria("Dispositivos: limite atingido");
        });
    }
});

// ==========================================
// LÓGICA DO DASHBOARD & BANCO DE DADOS LOCAL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Verifica Saudação no Dashboard
    const h2Saudacao = document.getElementById("saudacao-dash");
    if (h2Saudacao) {
        const usuarioLogado = obterUsuarioLogado();
        if (usuarioLogado) {
            const horaAtual = new Date().getHours();
            let saudacao = "Boa noite";
            if (horaAtual >= 5 && horaAtual < 12) saudacao = "Bom dia";
            else if (horaAtual >= 12 && horaAtual < 18) saudacao = "Boa tarde";
            
            h2Saudacao.innerHTML = `${saudacao}, <span style="color: var(--verde-agua);">${usuarioLogado.nome}</span>!`;
        }
    }

    // Inicializar Gráfico (Chart.js) no Dashboard
    const ctx = document.getElementById('energiaChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [
                    {
                        label: 'Geração (kWh)',
                        data: [15, 19, 17, 22, 20, 18, 10],
                        backgroundColor: '#2A8C82', // verde-agua
                        borderRadius: 5
                    },
                    {
                        label: 'Consumo (kWh)',
                        data: [12, 14, 13, 15, 14, 16, 18],
                        backgroundColor: '#F4A222', // amarelo-vivo
                        borderRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#aaa' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#aaa' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff' } }
                }
            }
        });
    }

    // ==========================================
    // SISTEMA DE CHAMADOS (CRUD SIMULADO)
    // ==========================================
    const formChamado = document.getElementById("form-novo-chamado");
    const tabelaChamados = document.getElementById("tabela-chamados");

    // Função global para UI do chamado
    window.abrirModalChamado = function() {
        const area = document.getElementById("form-chamado-area");
        if (area) area.style.display = "block";
    }
    window.fecharModalChamado = function() {
        const area = document.getElementById("form-chamado-area");
        if (area) area.style.display = "none";
    }

    if (formChamado && tabelaChamados) {
        // Carregar chamados do Banco de Dados Local
        function carregarChamados() {
            let chamados = JSON.parse(localStorage.getItem("rtv_chamados")) || [];
            const usuarioAtual = obterUsuarioLogado();
            // Filtrar chamados do usuário logado (clientes vêem apenas os seus)
            if (usuarioAtual && usuarioAtual.role !== 'admin') {
                chamados = chamados.filter(c =>
                    c.usuarioId === usuarioAtual.id ||
                    c.usuarioEmail === usuarioAtual.email ||
                    (!c.usuarioId && !c.usuarioEmail)
                );
            }
            if (chamados.length === 0) {
                tabelaChamados.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#888; padding:20px;">Nenhum chamado encontrado. Clique em "Abrir Novo Chamado" para criar um.</td></tr>';
                return;
            }
            let html = "";
            chamados.forEach(c => {
                const statusClass = (c.status === 'resolvido' || c.status === 'fechado') ? 'resolvido' : 'aberto';
                const statusLabel = (c.status === 'resolvido' || c.status === 'fechado') ? 'Resolvido' : 'Em Análise';
                html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.categoria}</td>
                    <td>${c.data}</td>
                    <td><span class="badge ${statusClass}">${statusLabel}</span></td>
                    <td><a href="#" class="link-detalhes-chamado" data-chamado-id="${c.id}" style="color: var(--verde-agua);">Ver Detalhes</a></td>
                </tr>`;
            });
            tabelaChamados.innerHTML = html;
        }

        carregarChamados();

        // Salvar Novo Chamado
        formChamado.addEventListener("submit", (e) => {
            e.preventDefault();
            const categoria = document.getElementById("cat-chamado").value;
            const descricao = document.getElementById("desc-chamado").value;
            if (!descricao.trim()) {
                showToast("Descreva o problema antes de enviar.", "error");
                return;
            }
            const usuarioAtual = obterUsuarioLogado();
            let chamados = JSON.parse(localStorage.getItem("rtv_chamados")) || [];

            const novoChamado = {
                id: "#" + Math.floor(Math.random() * 90000 + 10000),
                categoria: categoria,
                descricao: descricao,
                data: new Date().toLocaleDateString('pt-BR'),
                status: 'aberto',
                usuarioId: usuarioAtual ? (usuarioAtual.id || usuarioAtual.email) : null,
                usuarioEmail: usuarioAtual ? usuarioAtual.email : null,
                usuarioNome: usuarioAtual ? usuarioAtual.nome : 'Desconhecido'
            };

            chamados.unshift(novoChamado);
            localStorage.setItem("rtv_chamados", JSON.stringify(chamados));

            showToast("Chamado aberto com sucesso!", "success");
            fecharModalChamado();
            formChamado.reset();
            carregarChamados();
            renderPainelAdminResumo();
            registrarAuditoria(`Chamado aberto: ${novoChamado.id} (${novoChamado.categoria})`);
        });
    }
});

// ==========================================
// DISPOSITIVOS (CRUD LOCAL + MODAIS)
// ==========================================
function obterDispositivos() {
    let dispositivos = JSON.parse(localStorage.getItem("rtv_dispositivos")) || [];
    if (!Array.isArray(dispositivos) || dispositivos.length === 0) {
        dispositivos = [
            { internalId: cryptoRandomId(), id: "INV-X1", mac: "00:1A:2B:...", tipo: "Inversor Central", local: "Telhado Sul", firmware: "v2.1.4", status: "online" },
            { internalId: cryptoRandomId(), id: "MED-01", mac: "00:1C:3F:...", tipo: "Medidor Bidirecional", local: "Quadro Elétrico", firmware: "v1.0.8", status: "offline" },
            { internalId: cryptoRandomId(), id: "STR-A", mac: "Sensores", tipo: "Monitor de String", local: "Placa 1 a 12", firmware: "v3.0.0", status: "online" }
        ];
        localStorage.setItem("rtv_dispositivos", JSON.stringify(dispositivos));
    }
    return dispositivos;
}

function salvarDispositivos(dispositivos) {
    localStorage.setItem("rtv_dispositivos", JSON.stringify(dispositivos));
}

function cryptoRandomId() {
    if (window.crypto && crypto.getRandomValues) {
        const arr = new Uint32Array(2);
        crypto.getRandomValues(arr);
        return `${arr[0].toString(16)}${arr[1].toString(16)}`;
    }
    return String(Date.now()) + String(Math.floor(Math.random() * 100000));
}

function renderTabelaDispositivos() {
    const tbody = document.getElementById("tabela-dispositivos");
    if (!tbody) return;

    const dispositivos = obterDispositivos();
    tbody.innerHTML = dispositivos.map((d) => {
        const badgeClass = d.status === "online" ? "online" : "offline";
        const statusLabel = d.status === "online" ? "Ativo" : "Sem Sinal";
        const acaoLabel = d.status === "online" ? "Configurar" : "Reiniciar";
        const corAcao = d.status === "online" ? "var(--verde-agua)" : "var(--amarelo-vivo)";
        const acao = d.status === "online" ? "configurar" : "reiniciar";

        return `
            <tr>
                <td>${d.id} (${d.mac})</td>
                <td>${d.tipo}</td>
                <td>${d.local}</td>
                <td>${d.firmware}</td>
                <td><span class="badge ${badgeClass}">${statusLabel}</span></td>
                <td>
                    <a href="#" class="link-acao-dispositivo" data-acao="${acao}" data-id="${d.internalId}" style="color:${corAcao};">${acaoLabel}</a>
                </td>
            </tr>
        `;
    }).join("");
}

function abrirModalDispositivo(internalId) {
    const overlay = document.getElementById("modal-dispositivo-overlay");
    const form = document.getElementById("form-dispositivo");
    if (!overlay || !form) return;

    const titulo = document.getElementById("modal-dispositivo-titulo");
    const inputInternalId = document.getElementById("disp-internal-id");
    const inputId = document.getElementById("disp-id");
    const inputMac = document.getElementById("disp-mac");
    const inputTipo = document.getElementById("disp-tipo");
    const inputLocal = document.getElementById("disp-local");
    const inputFirmware = document.getElementById("disp-firmware");
    const inputStatus = document.getElementById("disp-status");

    const dispositivos = obterDispositivos();
    const existente = internalId ? dispositivos.find((d) => d.internalId === internalId) : null;

    if (existente) {
        if (titulo) titulo.textContent = "Configurar Dispositivo";
        inputInternalId.value = existente.internalId;
        inputId.value = existente.id;
        inputMac.value = existente.mac;
        inputTipo.value = existente.tipo;
        inputLocal.value = existente.local;
        inputFirmware.value = existente.firmware;
        inputStatus.value = existente.status;
    } else {
        if (titulo) titulo.textContent = "Novo Dispositivo";
        inputInternalId.value = "";
        inputId.value = "";
        inputMac.value = "";
        inputTipo.value = "Inversor Central";
        inputLocal.value = "";
        inputFirmware.value = "v1.0.0";
        inputStatus.value = "online";
    }

    overlay.style.display = "block";
}

function fecharModalDispositivo() {
    const overlay = document.getElementById("modal-dispositivo-overlay");
    if (overlay) overlay.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa dispositivos se a tabela existir
    renderTabelaDispositivos();

    // Modal handlers
    const overlay = document.getElementById("modal-dispositivo-overlay");
    const fechar = document.getElementById("modal-dispositivo-fechar");
    const cancelar = document.getElementById("btn-cancelar-dispositivo");
    const form = document.getElementById("form-dispositivo");

    if (overlay && fechar) {
        fechar.addEventListener("click", (e) => {
            e.preventDefault();
            fecharModalDispositivo();
        });
    }
    if (cancelar) {
        cancelar.addEventListener("click", () => fecharModalDispositivo());
    }
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) fecharModalDispositivo();
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const dispositivos = obterDispositivos();

            const internalId = document.getElementById("disp-internal-id").value || cryptoRandomId();
            const payload = {
                internalId,
                id: document.getElementById("disp-id").value.trim(),
                mac: document.getElementById("disp-mac").value.trim(),
                tipo: document.getElementById("disp-tipo").value,
                local: document.getElementById("disp-local").value.trim(),
                firmware: document.getElementById("disp-firmware").value.trim(),
                status: document.getElementById("disp-status").value
            };

            const idx = dispositivos.findIndex((d) => d.internalId === internalId);
            if (idx >= 0) {
                dispositivos[idx] = payload;
                showToast("Dispositivo atualizado com sucesso.", "success");
                registrarAuditoria(`Dispositivos: atualizado ${payload.id}`);
            } else {
                dispositivos.unshift(payload);
                showToast("Dispositivo cadastrado com sucesso.", "success");
                registrarAuditoria(`Dispositivos: criado ${payload.id}`);
            }

            salvarDispositivos(dispositivos);
            renderTabelaDispositivos();
            fecharModalDispositivo();
        });
    }

    // Ações na tabela (configurar / reiniciar)
    document.addEventListener("click", (e) => {
        const target = e.target;
        const link = target && target.closest ? target.closest(".link-acao-dispositivo") : null;
        if (!link) return;
        e.preventDefault();

        const acao = link.getAttribute("data-acao");
        const id = link.getAttribute("data-id");
        const dispositivos = obterDispositivos();
        const disp = dispositivos.find((d) => d.internalId === id);
        if (!disp) return;

        if (acao === "configurar") {
            abrirModalDispositivo(id);
            return;
        }

        if (acao === "reiniciar") {
            // Simula reinício: marca como online e loga
            disp.status = "online";
            salvarDispositivos(dispositivos);
            renderTabelaDispositivos();
            showToast(`Reinício enviado para ${disp.id}.`, "success");
            registrarAuditoria(`Dispositivos: reinício enviado ${disp.id}`);
        }
    });
});

// ==========================================
// CHAMADOS (DETALHES)
// ==========================================
function abrirDetalheChamado(chamadoId) {
    const overlay = document.getElementById("modal-chamado-overlay");
    if (!overlay) return;

    const inputId = document.getElementById("det-chamado-id");
    const inputCat = document.getElementById("det-chamado-categoria");
    const inputData = document.getElementById("det-chamado-data");
    const inputStatus = document.getElementById("det-chamado-status");
    const inputDesc = document.getElementById("det-chamado-descricao");

    const chamados = JSON.parse(localStorage.getItem("rtv_chamados")) || [];
    const encontrado = chamados.find((c) => c.id === chamadoId);

    // fallback para exemplos fixos
    const fallback = {
        "#10024": { categoria: "Inversor Offline", data: "15/04/2026", status: "Em Análise", descricao: "Inversor relatou falha de conexão na rede local." },
        "#09871": { categoria: "Manutenção Preventiva", data: "10/01/2026", status: "Resolvido", descricao: "Limpeza de painéis e aperto de conexões." }
    };

    const c = encontrado || fallback[chamadoId] || { categoria: "-", data: "-", status: "-", descricao: "-" };

    if (inputId) inputId.value = chamadoId;
    if (inputCat) inputCat.value = c.categoria || "-";
    if (inputData) inputData.value = c.data || "-";
    if (inputStatus) inputStatus.value = encontrado ? "Em Análise" : (c.status || "-");
    if (inputDesc) inputDesc.value = c.descricao || "-";

    overlay.style.display = "block";
    registrarAuditoria(`Chamado visualizado: ${chamadoId}`);
}

function fecharDetalheChamado() {
    const overlay = document.getElementById("modal-chamado-overlay");
    if (overlay) overlay.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("modal-chamado-overlay");
    const fechar = document.getElementById("modal-chamado-fechar");
    const btnFechar = document.getElementById("btn-fechar-detalhe-chamado");

    if (fechar) {
        fechar.addEventListener("click", (e) => {
            e.preventDefault();
            fecharDetalheChamado();
        });
    }
    if (btnFechar) {
        btnFechar.addEventListener("click", () => fecharDetalheChamado());
    }
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) fecharDetalheChamado();
        });
    }

    document.addEventListener("click", (e) => {
        const target = e.target;
        const link = target && target.closest ? target.closest(".link-detalhes-chamado") : null;
        if (!link) return;
        e.preventDefault();
        const id = link.getAttribute("data-chamado-id");
        if (id) abrirDetalheChamado(id);
    });
});

// ==========================================
// ENGINE DO DASHBOARD ENTERPRISE (Mock Backend)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sistema Global de Notificações
    const btnNotif = document.getElementById("btn-notificacoes");
    const dropdownNotif = document.getElementById("notif-dropdown");
    
    if (btnNotif && dropdownNotif) {
        const mockNotificacoes = [
            { icone: "ph-warning", cor: "#ff5f56", texto: "Medidor Geral perdeu conexão às 08:15.", tempo: "Há 2 horas" },
            { icone: "ph-lightbulb", cor: "var(--amarelo-vivo)", texto: "Dica: Mova o consumo para o horário de pico solar.", tempo: "Há 4 horas" },
            { icone: "ph-check-circle", cor: "#27c93f", texto: "Relatório de Março gerado com sucesso.", tempo: "Ontem" }
        ];

        let htmlNotif = "<div style='padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.1);'><strong>Notificações Recentes</strong></div>";
        mockNotificacoes.forEach(n => {
            htmlNotif += `
                <div class="notif-item">
                    <i class="ph-fill ${n.icone}" style="color: ${n.cor}; font-size: 20px;"></i>
                    <div>
                        <div style="color: white; margin-bottom: 3px;">${n.texto}</div>
                        <div style="color: #888; font-size: 11px;">${n.tempo}</div>
                    </div>
                </div>`;
        });
        dropdownNotif.innerHTML = htmlNotif;

        btnNotif.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownNotif.classList.toggle("show");
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener("click", (e) => {
            if (!btnNotif.contains(e.target) && !dropdownNotif.contains(e.target)) {
                dropdownNotif.classList.remove("show");
            }
        });
    }

    // 2. Gráfico Enterprise (Chart.js)
    const ctxPrincipal = document.getElementById('chartPrincipal');
    if (ctxPrincipal) {
        new Chart(ctxPrincipal, {
            type: 'line',
            data: {
                labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', 'Previsão 20:00'],
                datasets: [
                    {
                        label: 'Geração Solar (kW)',
                        data: [0, 1.2, 3.5, 5.0, 4.8, 2.5, 0.2, 0],
                        borderColor: '#2A8C82',
                        backgroundColor: 'rgba(42, 140, 130, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Consumo Real (kW)',
                        data: [0.8, 1.5, 1.2, 2.0, 1.8, 3.0, 4.2, null],
                        borderColor: '#F4A222',
                        borderWidth: 2,
                        borderDash: [5, 5], // Linha tracejada para diferenciar
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Previsão de Consumo (IA)',
                        data: [null, null, null, null, null, null, 4.2, 4.5],
                        borderColor: '#ff5f56',
                        borderWidth: 2,
                        borderDash: [2, 2],
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#aaa' } },
                    x: { grid: { display: false }, ticks: { color: '#aaa' } }
                },
                plugins: { legend: { labels: { color: '#fff', usePointStyle: true } } }
            }
        });
    }

    // 3. Sistema de Log e Auditoria Automático
    if (document.body.classList.contains("pagina-admin")) {
        registrarAuditoria("Acesso à área administrativa");
    } else if (document.body.classList.contains("pagina-painel")) {
        registrarAuditoria("Acesso ao painel do cliente");
    }

    const AUDIT_PAGE_SIZE = 8;
    const tabelaAuditoria = document.getElementById("tabela-auditoria");
    const btnAuditPrev = document.getElementById("btn-audit-prev");
    const btnAuditNext = document.getElementById("btn-audit-next");
    const filtroAuditoria = document.getElementById("filtro-auditoria");

    function obterLogsAuditoriaLista() {
        const logs = JSON.parse(localStorage.getItem("rtv_logs_auditoria")) || [];
        return Array.isArray(logs) ? logs : [];
    }

    function filtrarLogsAuditoria(logs, termo) {
        if (!termo) return logs;
        const t = termo.toLowerCase();
        return logs.filter((l) =>
            String(l.data || "").toLowerCase().includes(t) ||
            String(l.user || "").toLowerCase().includes(t) ||
            String(l.acao || "").toLowerCase().includes(t) ||
            String(l.ip || "").toLowerCase().includes(t)
        );
    }

    function renderTabelaAuditoriaPaginada() {
        if (!tabelaAuditoria || !btnAuditPrev || !btnAuditNext) return;

        const termo = filtroAuditoria ? filtroAuditoria.value.trim() : "";
        const logs = obterLogsAuditoriaLista();

        if (logs.length === 0) {
            tabelaAuditoria.innerHTML = `
                <tr>
                    <td>18/04/2026 13:00</td>
                    <td>Sistema RTV</td>
                    <td>Varredura de Diagnóstico concluída</td>
                    <td>Localhost</td>
                    <td><span class="badge online">Sucesso</span></td>
                </tr>
                <tr>
                    <td>18/04/2026 08:15</td>
                    <td>Sensor #4</td>
                    <td>Timeout na porta 8080</td>
                    <td>10.0.0.45</td>
                    <td><span class="badge offline">Falha Crítica</span></td>
                </tr>
                <tr>
                    <td>17/04/2026 22:10</td>
                    <td>Utilizador Admin</td>
                    <td>Alteração na meta de consumo</td>
                    <td>187.65.XX.XX</td>
                    <td><span class="badge aberto">Registado</span></td>
                </tr>`;
            btnAuditPrev.disabled = true;
            btnAuditNext.disabled = true;
            return;
        }

        const filtrados = filtrarLogsAuditoria(logs, termo);
        if (filtrados.length === 0) {
            tabelaAuditoria.innerHTML = "<tr><td colspan=\"5\" style=\"color:#888;\">Nenhum registo corresponde ao filtro.</td></tr>";
            btnAuditPrev.disabled = true;
            btnAuditNext.disabled = true;
            return;
        }
        const totalPaginas = Math.max(1, Math.ceil(filtrados.length / AUDIT_PAGE_SIZE));
        if (auditoriaPaginaAtual > totalPaginas - 1) auditoriaPaginaAtual = totalPaginas - 1;
        if (auditoriaPaginaAtual < 0) auditoriaPaginaAtual = 0;

        const slice = filtrados.slice(
            auditoriaPaginaAtual * AUDIT_PAGE_SIZE,
            auditoriaPaginaAtual * AUDIT_PAGE_SIZE + AUDIT_PAGE_SIZE
        );

        tabelaAuditoria.innerHTML = slice.map((log) => `
            <tr>
                <td>${log.data || "-"}</td>
                <td>${log.user || "Sistema"}</td>
                <td>${log.acao || "-"}</td>
                <td>${log.ip || "-"}</td>
                <td><span class="badge aberto">Registado</span></td>
            </tr>
        `).join("");

        btnAuditPrev.disabled = auditoriaPaginaAtual <= 0;
        btnAuditNext.disabled = auditoriaPaginaAtual >= totalPaginas - 1;
    }

    if (tabelaAuditoria && btnAuditPrev && btnAuditNext) {
        renderTabelaAuditoriaPaginada();
        if (filtroAuditoria) {
            filtroAuditoria.addEventListener("input", () => {
                auditoriaPaginaAtual = 0;
                renderTabelaAuditoriaPaginada();
            });
        }
        btnAuditPrev.addEventListener("click", () => {
            auditoriaPaginaAtual = Math.max(0, auditoriaPaginaAtual - 1);
            renderTabelaAuditoriaPaginada();
        });
        btnAuditNext.addEventListener("click", () => {
            auditoriaPaginaAtual += 1;
            renderTabelaAuditoriaPaginada();
        });
    }
});

// ==========================================
// CALCULADORA EXPRESSA (INDEX.HTML)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const calcInput = document.getElementById("calc-input-valor");
    const calcResultado = document.getElementById("calc-resultado");

    if (calcInput && calcResultado) {
        calcInput.addEventListener("input", (e) => {
            let valorConta = parseFloat(e.target.value);
            
            // Se o campo for limpo ou o valor for muito baixo, reseta
            if (isNaN(valorConta) || valorConta <= 0) {
                calcResultado.innerText = "R$ 0,00";
                return;
            }

            // Estimativa de economia: 90% da fatura multiplicada por 12 meses
            let economiaAnual = (valorConta * 0.90) * 12;
            
            // Formata para a moeda Brasileira
            calcResultado.innerText = economiaAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        });
    }

    // Correção: Garantir que se houver elementos do painel antigo, não quebrem o JS global
    // (Limpeza de possíveis erros no console em páginas públicas)
    document.querySelectorAll('.form-interno').forEach((form) => {
        if (form.hasAttribute("data-permitir-submit")) return;
        form.addEventListener("submit", (e) => e.preventDefault());
    });

    document.querySelectorAll(".faq-pergunta").forEach((pergunta) => {
        pergunta.addEventListener("click", () => {
            const item = pergunta.closest(".faq-item");
            const resp = item && item.querySelector(".faq-resposta");
            if (!resp) return;
            const visivel = resp.style.display !== "none";
            resp.style.display = visivel ? "none" : "block";
        });
    });
});

// ==========================================
// GRÁFICOS DA PÁGINA DE ANALYTICS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Gráfico de Linha (Tendência Anual)
    const ctxAnalytics = document.getElementById('chartAnalyticsLine');
    if (ctxAnalytics) {
        new Chart(ctxAnalytics, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [
                    {
                        label: 'Geração (kWh)',
                        data: [400, 420, 380, 350, 310, 290, 305, 340, 390, 430, 450, 460],
                        borderColor: '#2A8C82',
                        backgroundColor: 'rgba(42, 140, 130, 0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Consumo (kWh)',
                        data: [350, 380, 360, 330, 300, 310, 320, 330, 350, 370, 390, 410],
                        borderColor: '#F4A222',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#aaa' } },
                    x: { grid: { display: false }, ticks: { color: '#aaa' } }
                },
                plugins: { legend: { labels: { color: '#fff' } } }
            }
        });
    }

    // Gráfico de Rosca (Distribuição de Consumo)
    const ctxDoughnut = document.getElementById('chartAnalyticsDoughnut');
    if (ctxDoughnut) {
        new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: ['Climatização', 'Eletrodomésticos', 'Iluminação', 'Outros'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: ['#2A8C82', '#F4A222', '#125b5c', '#444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#fff' } }
                },
                cutout: '75%'
            }
        });
    }
});

// ==========================================
// SERVIÇOS (PÚBLICO) — ORÇAMENTO, SIMULADOR, CONTACTO
// ==========================================
function guardarHistoricoServicos(entry) {
    let h = JSON.parse(localStorage.getItem("rtv_historico_servicos")) || [];
    h.unshift(entry);
    if (h.length > 60) h.length = 60;
    localStorage.setItem("rtv_historico_servicos", JSON.stringify(h));
}

function renderHistoricoServicosTabela() {
    const tb = document.getElementById("historico-servicos-body");
    if (!tb) return;
    const h = JSON.parse(localStorage.getItem("rtv_historico_servicos")) || [];
    if (h.length === 0) {
        tb.innerHTML = "<tr><td colspan=\"3\" style=\"color:#888;\">Ainda não existem pedidos registados neste navegador.</td></tr>";
        return;
    }
    tb.innerHTML = h.map((x) => `
        <tr>
            <td>${x.data}</td>
            <td>${x.tipo}</td>
            <td>${x.resumo}</td>
        </tr>
    `).join("");
}

function fecharModaisServicos() {
    ["modal-servicos-orcamento-overlay", "modal-servicos-simulador-overlay", "modal-servicos-contato-overlay"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

function abrirModalServicos(id) {
    fecharModaisServicos();
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
}

function economiaAnualSimuladorServicos(valorMensal, tipo) {
    const v = Number(valorMensal);
    if (!v || v <= 0) return { valor: 0, detalhe: "Indique o valor médio da sua fatura mensal." };
    let fator = 0.9;
    let detalhe = "Estimativa para sistema próprio (até ~90% de redução da fatura).";
    if (tipo === "hibrido") {
        fator = 0.92;
        detalhe = "Estimativa para sistema híbrido com baterias (até ~92%).";
    }
    if (tipo === "assinatura") {
        fator = 0.2;
        detalhe = "Estimativa para energia por assinatura (até ~20% de desconto na fatura).";
    }
    return { valor: v * fator * 12, detalhe };
}

document.addEventListener("DOMContentLoaded", () => {
    renderHistoricoServicosTabela();

    if (window.location.hash === "#ferramentas-simulador") {
        requestAnimationFrame(() => {
            const alvo = document.getElementById("ferramentas-simulador");
            if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    function atualizarPainelSimuladorServicos() {
        const inp = document.getElementById("sim-valor-fatura");
        const sel = document.getElementById("sim-tipo-solucao");
        const out = document.getElementById("sim-resultado");
        const det = document.getElementById("sim-detalhe");
        if (!inp || !sel || !out || !det) return;
        const r = economiaAnualSimuladorServicos(inp.value, sel.value);
        out.textContent = r.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        det.textContent = r.detalhe;
    }

    document.querySelectorAll(".js-servicos-orcamento").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            const servico = el.getAttribute("data-servico") || "";
            const hid = document.getElementById("orcamento-servico");
            if (hid) hid.value = servico;
            abrirModalServicos("modal-servicos-orcamento-overlay");
        });
    });

    const simAssin = document.querySelector(".js-servicos-simulador-assinatura");
    if (simAssin) {
        simAssin.addEventListener("click", (e) => {
            e.preventDefault();
            const sel = document.getElementById("sim-tipo-solucao");
            if (sel) sel.value = "assinatura";
            abrirModalServicos("modal-servicos-simulador-overlay");
            atualizarPainelSimuladorServicos();
        });
    }

    const btnSim = document.getElementById("btn-servicos-abrir-simulador");
    if (btnSim) {
        btnSim.addEventListener("click", (e) => {
            e.preventDefault();
            abrirModalServicos("modal-servicos-simulador-overlay");
            atualizarPainelSimuladorServicos();
        });
    }

    const btnCont = document.getElementById("btn-servicos-agendar-contato");
    if (btnCont) {
        btnCont.addEventListener("click", (e) => {
            e.preventDefault();
            abrirModalServicos("modal-servicos-contato-overlay");
        });
    }

    const fecharIds = ["modal-orcamento-fechar", "modal-simulador-fechar", "modal-contato-fechar"];
    fecharIds.forEach((fid) => {
        const a = document.getElementById(fid);
        if (a) {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                fecharModaisServicos();
            });
        }
    });

    const btnOrcCancel = document.getElementById("btn-orcamento-cancelar");
    if (btnOrcCancel) btnOrcCancel.addEventListener("click", fecharModaisServicos);

    const btnContCancel = document.getElementById("btn-contato-cancelar");
    if (btnContCancel) btnContCancel.addEventListener("click", fecharModaisServicos);

    [
        "modal-servicos-orcamento-overlay",
        "modal-servicos-simulador-overlay",
        "modal-servicos-contato-overlay"
    ].forEach((mid) => {
        const m = document.getElementById(mid);
        if (m) {
            m.addEventListener("click", (e) => {
                if (e.target === m) fecharModaisServicos();
            });
        }
    });

    const simValor = document.getElementById("sim-valor-fatura");
    const simTipo = document.getElementById("sim-tipo-solucao");
    if (simValor) simValor.addEventListener("input", atualizarPainelSimuladorServicos);
    if (simTipo) simTipo.addEventListener("change", atualizarPainelSimuladorServicos);

    const btnSimUpd = document.getElementById("btn-sim-atualizar");
    if (btnSimUpd) btnSimUpd.addEventListener("click", atualizarPainelSimuladorServicos);

    const btnSimGuardar = document.getElementById("btn-sim-guardar");
    if (btnSimGuardar) {
        btnSimGuardar.addEventListener("click", () => {
            if (typeof showToast !== "function") return;
            const inp = document.getElementById("sim-valor-fatura");
            const sel = document.getElementById("sim-tipo-solucao");
            if (!inp || !sel) return;
            const v = parseFloat(inp.value);
            if (!v || v <= 0) {
                showToast("Indique um valor de fatura válido.", "error");
                return;
            }
            const r = economiaAnualSimuladorServicos(v, sel.value);
            const labelTipo = sel.options[sel.selectedIndex].text;
            guardarHistoricoServicos({
                data: new Date().toLocaleString("pt-PT"),
                tipo: "Simulação",
                resumo: `${labelTipo} — ${r.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /ano`
            });
            renderHistoricoServicosTabela();
            showToast("Simulação guardada no histórico local.", "success");
        });
    }

    const formOrc = document.getElementById("form-servicos-orcamento");
    if (formOrc) {
        formOrc.addEventListener("submit", (e) => {
            e.preventDefault();
            if (typeof showToast !== "function") return;
            const nome = document.getElementById("orcamento-nome").value.trim();
            const email = document.getElementById("orcamento-email").value.trim();
            const tel = document.getElementById("orcamento-telefone").value.trim();
            const fat = document.getElementById("orcamento-fatura").value;
            const serv = (document.getElementById("orcamento-servico") || {}).value || "";
            if (!nome || !email || !tel || !fat) {
                showToast("Preencha todos os campos obrigatórios.", "error");
                return;
            }
            guardarHistoricoServicos({
                data: new Date().toLocaleString("pt-PT"),
                tipo: "Orçamento",
                resumo: `${serv} — ${nome} (${email})`
            });
            renderHistoricoServicosTabela();
            fecharModaisServicos();
            formOrc.reset();
            const hid = document.getElementById("orcamento-servico");
            if (hid) hid.value = "";
            showToast("Pedido de orçamento registado. A equipa RTV entrará em contacto.", "success");
        });
    }

    const formCont = document.getElementById("form-servicos-contato");
    if (formCont) {
        formCont.addEventListener("submit", (e) => {
            e.preventDefault();
            if (typeof showToast !== "function") return;
            const nome = document.getElementById("contato-nome").value.trim();
            const email = document.getElementById("contato-email").value.trim();
            const tel = document.getElementById("contato-telefone").value.trim();
            const msg = document.getElementById("contato-mensagem").value.trim();
            if (!nome || !email || !tel || !msg) {
                showToast("Preencha todos os campos obrigatórios.", "error");
                return;
            }
            const data = document.getElementById("contato-data").value;
            const periodo = document.getElementById("contato-periodo").value;
            guardarHistoricoServicos({
                data: new Date().toLocaleString("pt-PT"),
                tipo: "Contacto",
                resumo: `${nome} — ${data} (${periodo})`
            });
            renderHistoricoServicosTabela();
            fecharModaisServicos();
            formCont.reset();
            showToast("Pedido de contacto enviado. Obrigado!", "success");
        });
    }
});

// ==========================================
// MANUTENÇÃO — AGENDAR VISITA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("modal-manutencao-overlay");
    const btnOpen = document.getElementById("btn-agendar-manutencao");
    const btnFechar = document.getElementById("modal-manutencao-fechar");
    const btnCancel = document.getElementById("btn-manutencao-cancelar");
    const form = document.getElementById("form-manutencao-visita");

    function fechar() {
        if (overlay) overlay.style.display = "none";
    }

    if (btnOpen && overlay) {
        btnOpen.addEventListener("click", () => {
            overlay.style.display = "block";
        });
    }
    if (btnFechar) {
        btnFechar.addEventListener("click", (e) => {
            e.preventDefault();
            fechar();
        });
    }
    if (btnCancel) btnCancel.addEventListener("click", fechar);
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) fechar();
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (typeof showToast !== "function") return;
            const data = document.getElementById("manut-data").value;
            if (!data) {
                showToast("Escolha uma data.", "error");
                return;
            }
            let pedidos = JSON.parse(localStorage.getItem("rtv_manutencao_pedidos")) || [];
            pedidos.unshift({
                dataPedido: new Date().toLocaleString("pt-PT"),
                dataPreferida: data,
                periodo: document.getElementById("manut-periodo").value,
                obs: (document.getElementById("manut-obs") || {}).value || ""
            });
            localStorage.setItem("rtv_manutencao_pedidos", JSON.stringify(pedidos));
            fechar();
            form.reset();
            showToast("Pedido de visita registado com sucesso.", "success");
            registrarAuditoria(`Manutenção: pedido de visita (${data})`);
        });
    }
});