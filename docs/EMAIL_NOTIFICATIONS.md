# 📧 Sistema de Notificações por Email

## 📋 Visão Geral

Sistema centralizado para envio de emails automáticos com templates personalizados para diferentes eventos.

---

## 🏗️ Arquitetura

```
Evento (aprovação de cliente)
    ↓
Trigger (registrarAuditoria)
    ↓
Email Service
    ├─ Validação
    ├─ Template rendering
    └─ Envio via provider
    ↓
Queue (opcional)
    ↓
Provider (SendGrid, Mailgun, etc)
    ↓
Inbox do Usuário
```

---

## 🚀 Implementação Frontend

### 1. Criar Email Service

```javascript
// email-notifications.js

const EmailNotificationService = {
    // Configurações
    config: {
        provedor: 'sendgrid', // 'sendgrid', 'mailgun', 'aws-ses'
        apiKey: localStorage.getItem('email_api_key'),
        emailOrigem: 'notificacoes@rtvsolar.com.br',
        urlBase: 'https://rtvsolar.com.br'
    },
    
    // Templates de Email
    templates: {
        cliente_aprovado: {
            assunto: '✅ Seu cadastro foi aprovado!',
            template: 'CLIENTE_APROVADO'
        },
        cliente_rejeitado: {
            assunto: '❌ Seu cadastro foi rejeitado',
            template: 'CLIENTE_REJEITADO'
        },
        ordem_criada: {
            assunto: '📋 Nova ordem de serviço criada',
            template: 'ORDEM_CRIADA'
        },
        manutencao_agendada: {
            assunto: '🔧 Manutenção agendada',
            template: 'MANUTENCAO_AGENDADA'
        },
        relatorio_disponivel: {
            assunto: '📊 Seu relatório está pronto',
            template: 'RELATORIO_DISPONIVEL'
        },
        alerta_equipamento: {
            assunto: '⚠️ Alerta: Problema detectado',
            template: 'ALERTA_EQUIPAMENTO'
        },
        recuperacao_senha: {
            assunto: '🔐 Recuperar sua senha',
            template: 'RECUPERACAO_SENHA'
        },
        convite_cliente: {
            assunto: '👋 Bem-vindo ao RTV Solar',
            template: 'CONVITE_CLIENTE'
        }
    },
    
    // Enviar email genérico
    async enviar(opcoes) {
        const { destinatario, assunto, html, texto } = opcoes;
        
        try {
            const response = await fetch('/api/emails/enviar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('rtv_token')}`
                },
                body: JSON.stringify({
                    destinatario,
                    assunto,
                    html,
                    texto
                })
            });
            
            if (!response.ok) throw new Error('Erro ao enviar email');
            
            console.log(`✅ Email enviado para ${destinatario}`);
            return await response.json();
        } catch (erro) {
            console.error('❌ Erro ao enviar email:', erro);
            return { erro: erro.message };
        }
    },
    
    // Enviar com template
    async enviarComTemplate(tipoTemplate, dados) {
        const template = this.templates[tipoTemplate];
        if (!template) {
            console.error(`❌ Template não encontrado: ${tipoTemplate}`);
            return;
        }
        
        // Renderizar template com dados
        const html = this.renderizarTemplate(template.template, dados);
        
        return this.enviar({
            destinatario: dados.email,
            assunto: template.assunto,
            html
        });
    },
    
    // Renderizar template
    renderizarTemplate(nome, dados) {
        const templates = this.gerarTemplates();
        return templates[nome]?.(dados) || '<p>Template não encontrado</p>';
    },
    
    // Gerar todos os templates
    gerarTemplates() {
        return {
            CLIENTE_APROVADO: (dados) => `
                <h2>Bem-vindo ao RTV Solar, ${dados.nomeCliente}! ✅</h2>
                <p>Seu cadastro foi aprovado com sucesso.</p>
                <p><strong>Próximos passos:</strong></p>
                <ol>
                    <li>Faça login em <a href="${this.config.urlBase}/login.html">rtvsolar.com.br</a></li>
                    <li>Escolha um plano solar</li>
                    <li>Agende uma visita técnica</li>
                </ol>
                <p>Dúvidas? Contate nosso suporte: suporte@rtvsolar.com.br</p>
            `,
            
            CLIENTE_REJEITADO: (dados) => `
                <h2>Status do seu cadastro</h2>
                <p>Infelizmente, seu cadastro foi rejeitado.</p>
                <p><strong>Motivo:</strong> ${dados.motivo}</p>
                <p><strong>O que fazer agora:</strong></p>
                <ul>
                    <li>Corrija os documentos conforme indicado</li>
                    <li>Envie novamente para análise</li>
                    <li>Ou entre em contato conosco</li>
                </ul>
                <p>Email: suporte@rtvsolar.com.br | Telefone: (11) 98765-4321</p>
            `,
            
            ORDEM_CRIADA: (dados) => `
                <h2>📋 Sua ordem de serviço foi criada</h2>
                <p>Ordem #${dados.numeroOrdem}</p>
                <p><strong>Serviço:</strong> ${dados.nomeServico}</p>
                <p><strong>Data:</strong> ${dados.data}</p>
                <p><strong>Técnico:</strong> ${dados.nomeTecnico}</p>
                <p><a href="${this.config.urlBase}/servicos.html">Ver detalhes</a></p>
            `,
            
            MANUTENCAO_AGENDADA: (dados) => `
                <h2>🔧 Sua manutenção foi agendada</h2>
                <p>Equipamento: ${dados.equipamento}</p>
                <p>Data: ${dados.data}</p>
                <p>Horário: ${dados.horario}</p>
                <p>Técnico: ${dados.tecnico}</p>
                <p>${dados.obs}</p>
            `,
            
            RELATORIO_DISPONIVEL: (dados) => `
                <h2>📊 Seu relatório está pronto!</h2>
                <p>Período: ${dados.periodo}</p>
                <p>Energia gerada: ${dados.energiaGerada} kWh</p>
                <p>Economia: R$ ${dados.economia}</p>
                <p><a href="${this.config.urlBase}/relatorios.html">Baixar relatório</a></p>
            `,
            
            ALERTA_EQUIPAMENTO: (dados) => `
                <h2>⚠️ Alerta de equipamento</h2>
                <p>Equipamento: ${dados.equipamento}</p>
                <p>Status: ${dados.status}</p>
                <p>Descrição: ${dados.descricao}</p>
                <p>Severidade: ${dados.severidade}</p>
                <p>Ação recomendada: ${dados.acaoRecomendada}</p>
            `,
            
            RECUPERACAO_SENHA: (dados) => `
                <h2>🔐 Recuperar sua senha</h2>
                <p>Clique no link abaixo para redefinir sua senha:</p>
                <p><a href="${this.config.urlBase}/recuperar-senha.html?token=${dados.token}">Redefinir senha</a></p>
                <p><small>Este link expira em 24 horas</small></p>
                <p><strong>⚠️ Não compartilhe este link com ninguém!</strong></p>
            `,
            
            CONVITE_CLIENTE: (dados) => `
                <h2>👋 Bem-vindo ao RTV Solar!</h2>
                <p>Oi ${dados.nomeCliente},</p>
                <p>Você foi convidado para criar uma conta em nossa plataforma.</p>
                <p><a href="${this.config.urlBase}/registro.html?convite=${dados.codigo}">Criar conta agora</a></p>
                <p>Código: ${dados.codigo}</p>
            `
        };
    }
};
```

### 2. Integrar com AdminClientesAPI

```javascript
// Modificar admin-clientes.js

const AdminClientesAPI = {
    async aprovarCliente(id, motivo) {
        // ... código existente ...
        
        // Enviar email de aprovação
        const cliente = clientes.find(c => c.id === id);
        if (cliente && cliente.email) {
            await EmailNotificationService.enviarComTemplate('cliente_aprovado', {
                nomeCliente: cliente.nome,
                email: cliente.email
            });
        }
        
        return { sucesso: true };
    },
    
    async rejeitarCliente(id, motivo) {
        // ... código existente ...
        
        // Enviar email de rejeição
        const cliente = clientes.find(c => c.id === id);
        if (cliente && cliente.email) {
            await EmailNotificationService.enviarComTemplate('cliente_rejeitado', {
                nomeCliente: cliente.nome,
                email: cliente.email,
                motivo
            });
        }
        
        return { sucesso: true };
    },
    
    async enviarEmailMassa(ids, assunto, mensagem) {
        const clientes = JSON.parse(localStorage.getItem('rtv_usuarios') || '[]')
            .filter(u => ids.includes(u.id) && u.email);
        
        for (const cliente of clientes) {
            await EmailNotificationService.enviar({
                destinatario: cliente.email,
                assunto,
                html: `<p>${mensagem}</p>`
            });
        }
        
        registrarAuditoria('EMAIL_MASSA_ENVIADO', {
            quantidade: clientes.length,
            assunto
        });
    }
};
```

---

## 🔧 Backend (Node.js)

### 1. Rota de Email

```javascript
// routes/emails.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const emailService = require('../services/emailService');

router.post('/enviar', verificarToken, async (req, res) => {
    try {
        const { destinatario, assunto, html, template, dados } = req.body;
        
        // Usar SendGrid API
        const resultado = await emailService.enviarEmail({
            to: destinatario,
            subject: assunto,
            html: html || await emailService.renderizarTemplate(template, dados)
        });
        
        // Log na auditoria
        await pool.query(
            `INSERT INTO logs_auditoria (admin_id, acao, dados_depois)
             VALUES ($1, $2, $3)`,
            [req.usuario.id, 'EMAIL_ENVIADO', JSON.stringify({
                destinatario,
                assunto,
                template
            })]
        );
        
        res.json({ sucesso: true, messageId: resultado.id });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
```

### 2. Email Service com SendGrid

```javascript
// services/emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailService = {
    async enviarEmail(opcoes) {
        try {
            const msg = {
                to: opcoes.to,
                from: 'notificacoes@rtvsolar.com.br',
                subject: opcoes.subject,
                html: opcoes.html
            };
            
            const resultado = await sgMail.send(msg);
            console.log(`✅ Email enviado: ${resultado[0].statusCode}`);
            return { id: resultado[0].headers['x-message-id'] };
        } catch (erro) {
            console.error('❌ Erro SendGrid:', erro);
            throw erro;
        }
    },
    
    async renderizarTemplate(nome, dados) {
        // Implementação similar ao frontend
        // Retorna HTML renderizado
        return `<p>${dados.conteudo}</p>`;
    }
};

module.exports = emailService;
```

---

## 📊 Eventos que Disparam Emails

### Clientes
- ✅ Cadastro aprovado
- ✅ Cadastro rejeitado
- ✅ Convite para plataforma
- ✅ Recuperação de senha
- ✅ Email de confirmação

### Serviços
- ✅ Ordem criada
- ✅ Ordem completada
- ✅ Mensagem de suporte recebida
- ✅ Contato respondido

### Equipamentos
- ✅ Manutenção agendada
- ✅ Manutenção completada
- ✅ Alerta de falha
- ✅ Status offline

### Reportes
- ✅ Relatório gerado
- ✅ Relatório agendado
- ✅ Análise de performance

---

## 🎨 Customização de Templates

### Adicionar Novo Template

```javascript
// Adicionar em EmailNotificationService.templates
templates: {
    novo_evento: {
        assunto: '📌 Novo Evento',
        template: 'NOVO_EVENTO'
    }
},

// Adicionar renderização em gerarTemplates()
NOVO_EVENTO: (dados) => `
    <h2>Seu evento: ${dados.nome}</h2>
    <p>Data: ${dados.data}</p>
    <p>Descrição: ${dados.descricao}</p>
`
```

---

## ⚙️ Configuração SendGrid

### 1. Criar Conta
- Ir em [sendgrid.com](https://sendgrid.com)
- Registrar e verificar email

### 2. Gerar API Key
- Settings → API Keys
- Create API Key (Full Access)
- Copiar e adicionar ao `.env`

### 3. Configurar Sender
- Settings → Sender authentication
- Verificar domínio ou email unique

### 4. Instalar em Node.js
```bash
npm install @sendgrid/mail
```

### 5. Setup .env
```
SENDGRID_API_KEY=SG.sua_chave_aqui
SENDGRID_FROM_EMAIL=notificacoes@rtvsolar.com.br
```

---

## 📊 Painel de Logs de Email

```html
<!-- admin-emails.html -->
<div class="panel-emails">
    <h2>📧 Histórico de Emails</h2>
    
    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Destinatário</th>
                <th>Assunto</th>
                <th>Status</th>
                <th>Template</th>
            </tr>
        </thead>
        <tbody id="logs-emails">
            <!-- preenchido por JS -->
        </tbody>
    </table>
</div>

<script>
    async function carregarLogsEmails() {
        const logs = JSON.parse(localStorage.getItem('logs_emails') || '[]');
        
        const html = logs.map(log => `
            <tr>
                <td>${new Date(log.data).toLocaleString('pt-BR')}</td>
                <td>${log.destinatario}</td>
                <td>${log.assunto}</td>
                <td>${log.status === 'sucesso' ? '✅' : '❌'}</td>
                <td>${log.template}</td>
            </tr>
        `).join('');
        
        document.getElementById('logs-emails').innerHTML = html;
    }
    
    carregarLogsEmails();
</script>
```

---

## 🧪 Testes

```bash
# Testar SendGrid
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer YOUR_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@rtvsolar.com.br"},"subject":"Test","content":[{"type":"text/html","value":"<h1>Test</h1>"}]}'
```

---

## 📞 Próximos Passos

- [ ] Setup SendGrid API
- [ ] Criar templates de email
- [ ] Integrar com todos os eventos
- [ ] Testar entrega
- [ ] Monitor de bounces/complaints
- [ ] Sistema de preferências de email (cliente pode controlar)

---

**Versão**: 1.0  
**Providers suportados**: SendGrid, Mailgun, AWS SES  
**Status**: Pronto para implementação
