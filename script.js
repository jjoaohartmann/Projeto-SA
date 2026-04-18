document.addEventListener("DOMContentLoaded", () => {
    
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
        const icone = tipo === "success" ? "ph-check-circle" : "ph-warning-circle";
        
        toast.innerHTML = `<i class="ph ${icone}"></i> <span>${mensagem}</span>`;
        toastContainer.appendChild(toast);

        // Remove o toast do HTML após a animação (4.5 segundos)
        setTimeout(() => {
            toast.remove();
        }, 4500);
    };

    // ==========================================
    // EFEITO NO HEADER (SCROLL)
    // ==========================================
    const navbar = document.querySelector(".nav-bar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

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

            usuarios.push({ nome, email, senha });
            localStorage.setItem("rtv_usuarios", JSON.stringify(usuarios));
            localStorage.setItem("rtv_usuario_logado", JSON.stringify({ nome, email }));
            
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

            if (usuarioValido) {
                localStorage.setItem("rtv_usuario_logado", JSON.stringify({ nome: usuarioValido.nome, email: usuarioValido.email }));
                showToast(`Bem-vindo de volta, ${usuarioValido.nome}!`, "success");
                
                setTimeout(() => { window.location.href = "dashboard.html"; }, 1200);
            } else {
                showToast("E-mail ou senha incorretos.", "error");
            }
        });
    }

    // ==========================================
    // PROTEÇÃO DO PAINEL & SAUDAÇÃO DINÂMICA
    // ==========================================
    const nomeUsuarioDisplay = document.getElementById("nome-usuario-display");
    const textoSaudacao = document.querySelector(".boas-vindas h2");
    
    if (document.body.classList.contains("pagina-painel")) {
        const usuarioLogado = JSON.parse(localStorage.getItem("rtv_usuario_logado"));

        if (!usuarioLogado) {
            window.location.href = "login.html"; // Expulsa se não estiver logado
        } else if (textoSaudacao && nomeUsuarioDisplay) {
            
            // Lógica de saudação por horário
            const horaAtual = new Date().getHours();
            let saudacao = "Boa noite";
            if (horaAtual >= 5 && horaAtual < 12) saudacao = "Bom dia";
            else if (horaAtual >= 12 && horaAtual < 18) saudacao = "Boa tarde";

            textoSaudacao.innerHTML = `${saudacao}, <span id="nome-usuario-display" style="color: var(--verde-agua);">${usuarioLogado.nome}</span>!`;
        }
    }

    // Lógica de Logout
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("rtv_usuario_logado");
            window.location.href = "login.html";
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
        const usuarioLogado = JSON.parse(localStorage.getItem("rtv_usuario_logado"));
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
        document.getElementById("form-chamado-area").style.display = "block";
    }
    window.fecharModalChamado = function() {
        document.getElementById("form-chamado-area").style.display = "none";
    }

    if (formChamado && tabelaChamados) {
        // Carregar chamados do Banco de Dados Local
        function carregarChamados() {
            let chamados = JSON.parse(localStorage.getItem("rtv_chamados")) || [];
            // Limpa os dados estáticos de exemplo
            let html = "";
            chamados.forEach(c => {
                html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.categoria}</td>
                    <td>${c.data}</td>
                    <td><span class="badge aberto">Em Análise</span></td>
                    <td><a href="#" style="color: var(--verde-agua);">Ver Detalhes</a></td>
                </tr>`;
            });
            // Adiciona os exemplos fixos na base da tabela para demonstração
            html += `
                <tr>
                    <td>#09871</td>
                    <td>Manutenção Preventiva</td>
                    <td>10/01/2026</td>
                    <td><span class="badge resolvido">Resolvido</span></td>
                    <td><a href="#" style="color: var(--verde-agua);">Ver Detalhes</a></td>
                </tr>
            `;
            tabelaChamados.innerHTML = html;
        }

        carregarChamados();

        // Salvar Novo Chamado
        formChamado.addEventListener("submit", (e) => {
            e.preventDefault();
            const categoria = document.getElementById("cat-chamado").value;
            const descricao = document.getElementById("desc-chamado").value;
            
            let chamados = JSON.parse(localStorage.getItem("rtv_chamados")) || [];
            
            const novoChamado = {
                id: "#" + Math.floor(Math.random() * 90000 + 10000),
                categoria: categoria,
                descricao: descricao,
                data: new Date().toLocaleDateString('pt-BR')
            };

            chamados.unshift(novoChamado); // Adiciona no início
            localStorage.setItem("rtv_chamados", JSON.stringify(chamados));
            
            showToast("Chamado aberto com sucesso!", "success");
            fecharModalChamado();
            formChamado.reset();
            carregarChamados();
        });
    }
});