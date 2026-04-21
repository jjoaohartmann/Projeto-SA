# 📚 RTV Solar - Documentação Completa

## Bem-vindo!

Este diretório contém toda a documentação do projeto RTV Solar - uma plataforma completa de gerenciamento de sistemas de energia solar.

### 📖 Guias Disponíveis

| Documento | Descrição |
|-----------|-----------|
| [README.md](README.md) | Visão geral do projeto e primeiros passos |
| [ARQUITETURA.md](ARQUITETURA.md) | Arquitetura técnica e design do sistema |
| [USUARIOS.md](USUARIOS.md) | Guias para usuários clientes e administradores |
| [API.md](API.md) | Documentação de APIs e integração |
| [INSTALACAO.md](INSTALACAO.md) | Instruções de instalação e configuração |
| [CONTRIBUINDO.md](CONTRIBUINDO.md) | Diretrizes para contribuidores |
| [2FA.md](2FA.md) | Implementação de autenticação em dois fatores |
| [BACKEND.md](BACKEND.md) | Guia de integração com backend |

---

### 🚀 Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/seu-repo/projeto-sa.git

# 2. Navegue até a pasta
cd Projeto-SA

# 3. Abra no navegador
open index.html

# 4. Faça login como cliente ou admin
# Cliente: email@test.com / senha123
# Admin: admin@rtvsolar.com / admin123
```

---

### 📊 Estrutura do Projeto

```
Projeto-SA/
├── 📁 docs/                    # Documentação
├── 📁 imagens/                 # Assets visuais
│
├── 💻 Páginas Públicas
│   ├── index.html              # Homepage
│   └── servicos.html           # Catálogo de serviços
│
├── 👥 Área Cliente
│   ├── dashboard.html          # Visão geral
│   ├── cliente-geracao.html    # Monitoramento solar
│   ├── cliente-consumo.html    # Análise de consumo
│   ├── cliente-financeiro.html # Painel financeiro
│   └── cliente-contratos.html  # Gestão legal
│
├── 🔧 Painel Admin
│   ├── admin.html              # Dashboard admin
│   ├── admin-clientes.html     # Gestão de clientes
│   ├── admin-servicos.html     # Gestão de serviços
│   ├── admin-equipamentos.html # Inventário
│   ├── admin-relatorios.html   # Analytics
│   └── admin-configuracoes.html # Configurações
│
├── 🛠️ Sistemas de Suporte
│   ├── sistema-permissoes.js   # RBAC global
│   ├── cliente-sistema.js      # Dados solares
│   ├── admin-clientes.js       # API clientes
│   ├── admin-servicos.js       # API serviços
│   ├── admin-equipamentos.js   # API equipamentos
│   ├── admin-relatorios.js     # API relatórios
│   ├── admin-configuracoes.js  # API config
│   └── script.js               # Core auth & UI
│
└── 🎨 style.css               # Estilos tema escuro
```

---

### 🔐 Segurança

- ✅ RBAC (Role-Based Access Control) implementado
- ✅ Autenticação via localStorage
- ✅ 2FA disponível (veja [2FA.md](2FA.md))
- ✅ Auditoria completa de ações
- ✅ Proteção de rotas por permissões

---

### 📞 Suporte

Para dúvidas ou problemas:
- 📧 suporte@rtvsolar.com.br
- 📱 +55 (11) 3000-0000
- 💬 Chat em tempo real no dashboard

---

### 📄 Licença

Este projeto está licenciado sob a RTV Solar License. Veja o arquivo LICENSE para detalhes.

---

**Última atualização:** 18/04/2026
