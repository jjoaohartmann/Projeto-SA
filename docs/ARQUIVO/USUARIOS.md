# 👥 Guia de Usuários

## 📋 Índice

1. [Cliente Regular](#cliente-regular)
2. [Administrador](#administrador)
3. [Troubleshooting](#troubleshooting)

---

## 👤 Cliente Regular

### ✅ O que você pode fazer

#### Dashboard
- Visualizar status geral do sistema solar
- Ver geração em tempo real (kW)
- Acompanhar consumo de energia
- Visualizar economia gerada
- Monitorar impacto ambiental (CO₂)

#### Geração Solar (cliente-geracao.html)
- 📊 Gráficos: por hora, por semana, anualmente
- 🔌 Status dos equipamentos (painéis, inversor, medidor, bateria)
- ⚡ Performance e eficiência global
- 💡 Dicas de otimização

#### Consumo (cliente-consumo.html)
- 📈 Análise detalhada de uso
- 🎯 Comparação com meta mensal
- 🔌 Breakdown por dispositivo (AC, chuveiro, geladeira, etc)
- 💬 Recomendações de economia

#### Financeiro (cliente-financeiro.html)
- 💰 Economia gerada (mensal/anual)
- 📊 Payback estimado (6.2 anos)
- 📈 ROI (16.2% ao ano)
- 🎫 Créditos disponíveis
- 📋 Histórico de faturas

#### Contratos (cliente-contratos.html)
- 📄 Acesso a todos os contratos
- ✍️ Termo de garantia (25 anos para painéis)
- 📅 Acordo de compensação (60 meses)
- 📥 Download de documentos

#### Suporte & Agendamentos
- 📞 Abrir chamados de suporte
- 🔧 Agendar manutenção
- 📧 Receber atualizações
- 💬 Chat com suporte

### ❌ O que você NÃO pode fazer

- ❌ Acessar painel administrativo
- ❌ Visualizar dados de outros clientes
- ❌ Alterar configurações do sistema
- ❌ Gerar relatórios globais
- ❌ Gerenciar usuários

---

## 🔧 Administrador

### ✅ O que você pode fazer

#### Gestão de Clientes (admin-clientes.html)
- 👥 Visualizar todos os 147 clientes
- ✅ Aprovar novos clientes
- ❌ Rejeitar aprovações
- 🔇 Suspender clientes (30 dias)
- 🗑️ Deletar clientes
- 📊 Exportar lista em CSV
- 📧 Enviar e-mail em massa
- 🔍 Filtrar por status, potência, data

#### Gestão de Serviços (admin-servicos.html)
- 📦 Criar novos pacotes de serviço
- 💵 Definir preços e instalação
- 📈 Acompanhar receita por serviço
- 🏷️ Aplicar descontos
- 📊 Visualizar número de contratos

#### Gestão de Equipamentos (admin-equipamentos.html)
- 🔌 Monitorar 9.168 painéis (98.5% online)
- 💾 Controlar 142 inversores
- 📈 Gerenciar 1.482 outros equipamentos
- 🔧 Agendar manutenção
- 📋 Registrar falhas e necessidades
- 📦 Atualizar inventário

#### Relatórios (admin-relatorios.html)
- 📊 Relatório de clientes
- 💼 Análise financeira (receita/despesa)
- ⚡ Relatório de energia (geração/consumo)
- ⚙️ Performance operacional
- 📥 Exportar como PDF
- 📅 Agendar geração automática

#### Configurações (admin-configuracoes.html)
- ⚙️ Informações da empresa
- 🔐 Políticas de acesso
- 🕐 Limite de sessão
- 🔌 Integrações externas
- 💾 Backup automático
- 🔒 Certificado SSL
- 📬 Preferências de notificação
- 🔑 Habilitar/desabilitar 2FA

#### Auditoria
- 📋 Ver logs de todas as ações
- 🔍 Rastrear alterações específicas
- 👤 Identificar quem fez o quê e quando

---

## 🆘 Troubleshooting

### 🔴 Problema: Não consigo fazer login

**Solução:**
1. Verifique se a conta foi aprovada (admin precisa aprovar)
2. Limpe o cache do navegador (Ctrl+F5)
3. Verifique se localStorage está habilitado
4. Tente outro navegador

### 🔴 Problema: Não vejo meus dados

**Solução:**
1. Faça logout e login novamente
2. Verifique se tem permissão (data-permissao)
3. Abra o DevTools (F12) e verifique console
4. Verifique localStorage: DevTools → Application → Storage

### 🔴 Problema: Meus widgets não atualizam

**Solução:**
1. Os widgets atualizam a cada 30 segundos automaticamente
2. Recarregue a página (F5) para forçar atualização
3. Certifique-se de estar logado
4. Verifique conexão de internet

### 🔴 Problema: Não consigo baixar relatório

**Solução:**
1. Use navegador Chrome (mais compatível)
2. Verifique se popup blocker está desabilitado
3. Permita downloads do site
4. Tente novamente após limpar cache

### 🔴 Problema: Email de recuperação não chegou

**Solução:**
1. Verifique pasta SPAM
2. Aguarde 5 minutos
3. Solicite reenvio
4. Verifique email cadastrado está correto
5. Contate suporte@rtvsolar.com.br

---

## 📞 Contato & Suporte

- **Telefone**: +55 (11) 3000-0000
- **E-mail**: suporte@rtvsolar.com.br
- **Chat**: Disponível no dashboard
- **Horário**: Seg-Sex, 9am-6pm
- **WhatsApp**: Acesse pelo site

---

**Versão**: 1.0  
**Última atualização**: 18/04/2026
