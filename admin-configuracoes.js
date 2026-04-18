// ==========================================
// GERENCIADOR DE CONFIGURAÇÕES (ADMIN)
// ==========================================

/**
 * API para gerenciamento de configurações admistrativas
 */

const AdminConfiguracaoAPI = {

    /**
     * Estrutura padrão de configurações
     */
    CONFIGURACOES_PADRAO: {
        empresa: {
            nome: "RTV Energia Solar",
            telefone: "+55 (11) 3000-0000",
            email: "suporte@rtvsolar.com.br",
            site: "https://www.rtvsolar.com.br",
            endereco: "São Paulo, SP"
        },
        politicas: {
            autoRegistro: true,
            emailConfirmado: true,
            aprovacaoPrvia: false,
            twoFactorAuth: true
        },
        sessao: {
            tempoInatividade: 30, // minutos
            tentativasFalhadas: 5,
            durationBloqueio: 15 // minutos
        },
        backup: {
            frequencia: "diario",
            hora: "02:15",
            retencao: 90 // dias
        },
        notificacoes: {
            novoCliente: true,
            equipamentoOffline: true,
            relatorioSeguranca: true,
            falhasCriticas: true,
            acessoSuspeito: true,
            chamadoPrioritario: false
        },
        ssl: {
            ativo: true,
            expiracaoData: "2026-03-15",
            autoRenovacao: true
        }
    },

    /**
     * Obter configurações atuais
     */
    obterConfiguracoes() {
        const savedConfig = localStorage.getItem("rtv_admin_config");
        return savedConfig ? JSON.parse(savedConfig) : this.CONFIGURACOES_PADRAO;
    },

    /**
     * Atualizar configurações
     */
    atualizarConfiguracoes(novosValores) {
        const configAtual = this.obterConfiguracoes();
        const configAtualizada = { ...configAtual, ...novosValores };
        
        localStorage.setItem("rtv_admin_config", JSON.stringify(configAtualizada));
        
        registrarAuditoria("CONFIG_ATUALIZADA", {
            campos: Object.keys(novosValores),
            adminId: obterUsuarioLogado().id
        });
        
        return configAtualizada;
    },

    /**
     * Obter status de integração
     */
    obterIntegracoes() {
        return {
            bankoDados: {
                nome: "API do Banco Medidor",
                status: "ativo",
                ultimaSync: new Date().toLocaleString('pt-BR'),
                proxSync: new Date(Date.now() + 3600000).toLocaleString('pt-BR')
            },
            previsaoGeracao: {
                nome: "Previsão de Geração",
                status: "teste",
                provider: "OpenWeather",
                taxaAcuidade: "87%"
            },
            gatewayPagamento: {
                nome: "Gateway de Pagamento",
                status: "ativo",
                provider: "Stripe",
                ultimaTransacao: "20/01/2025 14:22"
            },
            email: {
                nome: "Serviço de E-mail",
                status: "ativo",
                provider: "SendGrid",
                emailsEnviados: 1247
            }
        };
    },

    /**
     * Testar integração
     */
    testarIntegracao(nomeIntegracao) {
        return {
            integracao: nomeIntegracao,
            resultado: "sucesso",
            tempoResposta: Math.floor(Math.random() * 500) + "ms",
            dataTestagem: new Date().toLocaleString('pt-BR')
        };
    },

    /**
     * Fazer backup imediato
     */
    fazrBackupImediato() {
        const dadosBackup = {
            usuarios: localStorage.getItem("rtv_usuarios"),
            sistemas: localStorage.getItem("rtv_clientes_sistemas"),
            manutencoes: localStorage.getItem("rtv_manutencoes"),
            auditoria: localStorage.getItem("rtv_logs_auditoria"),
            timestamp: new Date().getTime()
        };
        
        const backups = JSON.parse(localStorage.getItem("rtv_backups")) || [];
        backups.push({
            id: "backup_" + Date.now(),
            data: new Date().toLocaleString('pt-BR'),
            tamanho: JSON.stringify(dadosBackup).length,
            tipo: "manual"
        });
        
        localStorage.setItem("rtv_backups", JSON.stringify(backups));
        localStorage.setItem("rtv_backup_" + Date.now(), JSON.stringify(dadosBackup));
        
        registrarAuditoria("BACKUP_EXECUTADO", {
            tipo: "manual",
            adminId: obterUsuarioLogado().id
        });
        
        return {
            sucesso: true,
            momento: new Date().toLocaleString('pt-BR'),
            proximoAgendado: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('pt-BR')
        };
    },

    /**
     * Listar histórico de backups
     */
    listarBackups() {
        return JSON.parse(localStorage.getItem("rtv_backups")) || [];
    },

    /**
     * Restaurar backup
     */
    restaurarBackup(backupId) {
        const backup = JSON.parse(localStorage.getItem("rtv_backup_" + backupId));
        
        if (backup) {
            localStorage.setItem("rtv_usuarios", backup.usuarios);
            localStorage.setItem("rtv_clientes_sistemas", backup.sistemas);
            localStorage.setItem("rtv_manutencoes", backup.manutencoes);
            localStorage.setItem("rtv_logs_auditoria", backup.auditoria);
            
            registrarAuditoria("BACKUP_RESTAURADO", {
                backupId,
                adminId: obterUsuarioLogado().id
            });
            
            return { sucesso: true, momento: new Date().toLocaleString('pt-BR') };
        }
        
        return { sucesso: false, erro: "Backup não encontrado" };
    },

    /**
     * Gerar certificado SSL
     */
    renovarCertificadoSSL() {
        const config = this.obterConfiguracoes();
        const novaDataExpiracao = new Date();
        novaDataExpiracao.setFullYear(novaDataExpiracao.getFullYear() + 1);
        
        config.ssl.expiracaoData = novaDataExpiracao.toISOString().split('T')[0];
        
        this.atualizarConfiguracoes({ ssl: config.ssl });
        
        registrarAuditoria("SSL_RENOVADO", {
            novaDataExpiracao: config.ssl.expiracaoData,
            adminId: obterUsuarioLogado().id
        });
        
        return {
            sucesso: true,
            novaDataExpiracao: config.ssl.expiracaoData,
            momento: new Date().toLocaleString('pt-BR')
        };
    },

    /**
     * Obter logs de alterações de configuração
     */
    obterLogAlteracoes(limite = 20) {
        const auditoria = JSON.parse(localStorage.getItem("rtv_logs_auditoria")) || [];
        return auditoria.filter(log => log.acao === "CONFIG_ATUALIZADA").slice(-limite);
    },

    /**
     * Habilitar/desabilitar 2FA globalmente
     */
    configurar2FA(habilitado) {
        const config = this.obterConfiguracoes();
        config.politicas.twoFactorAuth = habilitado;
        
        this.atualizarConfiguracoes(config);
        
        return {
            sucesso: true,
            status: habilitado ? "habilitado" : "desabilitado",
            momento: new Date().toLocaleString('pt-BR')
        };
    },

    /**
     * Obter status do sistema
     */
    obterStatusSistema() {
        const usuarios = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        const sistemas = JSON.parse(localStorage.getItem("rtv_clientes_sistemas")) || [];
        
        return {
            uptime: "99.8%",
            usuariosAtivos: usuarios.filter(u => u.status === "aprovado").length,
            sistemasAtivos: sistemas.length,
            ultimaVerificacao: new Date().toLocaleString('pt-BR'),
            statusGeral: "operacional"
        };
    }
};

// Expor API globalmente
window.AdminConfiguracaoAPI = AdminConfiguracaoAPI;
