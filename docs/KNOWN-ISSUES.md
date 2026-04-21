# ⚠️ Problemas Conhecidos e Limitações

**Versão**: 1.0 | **Data**: 19/04/2026 | **Atualizado**: 19/04/2026

---

## 🎯 Por que esses problemas existem?

**Motivo simples**: O sistema é 100% frontend sem backend.

- ✅ Frontend: Completo e funcional
- ❌ Backend: Não implementado ainda
- ❌ Banco de dados: Não existe
- ❌ API: Não existe

Então certas funcionalidades não podem funcionar até backend ficar pronto.

---

## 🔴 Problemas CRÍTICOS

### P1: Dados Não Persistem Permanentemente
**O que é?**
- localStorage tem limite de ~5-10MB
- Dados desaparecem se limpar cache/cookies
- Não sincroniza entre navegadores

**Por que?**
- localStorage é apenas para navegador (não é banco de dados real)

**Impacto**: 🔴 CRÍTICO
- Dados podem ser perdidos
- Não é seguro para produção

**Solução**: ✅ Backend com PostgreSQL
- Dados persistidos em servidor
- Acesso seguro
- Sincronização em tempo real

**Quando?** Faze no Backend Phase 2

---

### P2: Senhas em Plain Text
**O que é?**
- Senhas salvas sem criptografia no localStorage
- Qualquer código JS pode ler

**Por que?**
- localStorage sem backend não permite hashing seguro (bcrypt)

**Impacto**: 🔴 CRÍTICO
- Se computador for comprometido, senhas visíveis
- Não é seguro NUNCA para produção

**Solução**: ✅ Backend com bcrypt
- Senhas criptografadas no servidor
- Cliente envia apenas hash

**Quando?** Fase 2 - Backend

---

### P3: Sem HTTPS/SSL
**O que é?**
- Dados trafegam em plain text HTTP
- Qualquer um com acesso à rede pode interceptar

**Por que?**
- HTTPS requer certificado SSL no servidor

**Impacto**: 🔴 CRÍTICO
- Senhas/dados interceptáveis em público WiFi
- Não é seguro NUNCA para produção

**Solução**: ✅ Deploy com HTTPS
- Usar certificado SSL (Let's Encrypt grátis)
- Redirecionar HTTP → HTTPS

**Quando?** Fase 3 - Deployment

---

## 🟠 Problemas ALTOS

### P4: Sem Session Timeout
**O que é?**
- Se você sair da página, sessão continua ativa forever
- Qualquer pessoa com acesso ao computador pode entrar

**Impacto**: 🟠 ALTO
- Se esquecer computador ligado, alguém pode acessar

**Solução**: ✅ Backend com JWT + expiração
- Session expira em 30 minutos
- Requer refresh token para permanecer logado

**Quando?** Fase 2 - Backend

---

### P5: Sem 2FA (Two-Factor Authentication)
**O que é?**
- Apenas email + senha
- Se senha for vazada, conta comprometida

**Impacto**: 🟠 ALTO
- Menos segurança em produção

**Solução**: ✅ Google Authenticator + SMS via Twilio
- Código único por 30 segundos
- Mesmo com senha vazada, seguro

**Quando?** Fase 2 - Backend

---

### P6: Sem Rate Limiting
**O que é?**
- Alguém pode tentar 1000000 vezes de senha
- Sem proteção contra força bruta

**Impacto**: 🟠 ALTO
- Conta pode ser "hackeada" por tentativa

**Solução**: ✅ Backend com rate limiting
- Máximo 5 tentativas por minuto
- IP bloqueado após 10 tentativas

**Quando?** Fase 2 - Backend

---

## 🟡 Problemas MÉDIOS

### P7: Dados Compartilhados no Frontend
**O que é?**
- Qualquer cliente conseguindo acessar console (F12) pode ver dados de outros clientes

**Por que?**
- localStorage não separa por usuário sem backend real

**Impacto**: 🟡 MÉDIO
- Exposição de dados em desenvolvimento
- Teste acesso é fácil demais

**Solução**: ✅ Backend com autenticação real
- Cada cliente vê apenas dados dele
- Servidor valida acesso

**Quando?** Fase 2 - Backend

---

### P8: 169 Botões Não Funcionam
**O que é?**
- 227 botões no total
- 58 funcionam (25%)
- 169 estão vazios (não fazem nada)
- ❌ "Editar", "Deletar", "Aprovar", "Pagar fatura", etc

**Por que?**
- Faltam handlers JavaScript
- Precisam de backend para fazer mudanças

**Impacto**: 🟡 MÉDIO
- Sistema parece incompleto
- Usuário clica botão e nada acontece

**Lista completa**: Veja [PAGINAS-E-FUNCIONALIDADES.md](./PAGINAS-E-FUNCIONALIDADES.md)

**Solução**: ✅ Implementar backend + handlers JS
```javascript
// Exemplo: Botão "Deletar Cliente"
document.getElementById("btn-deletar").addEventListener("click", async () => {
    // Envia para servidor
    const response = await fetch("/api/clientes/delete", {
        method: "DELETE",
        body: JSON.stringify({ clienteId: 123 })
    });
    // Servidor deleta no banco de dados
});
```

**Quando?** Fase 2 - Backend

---

### P9: Sem Dados Reais de Energia
**O que é?**
- Gráficos mostram números aleatórios Math.random()
- Não estão conectados ao smart meter real

**Por que?**
- Precisa API do distribuidor de eletricidade (CELESC, ENEL, etc)

**Impacto**: 🟡 MÉDIO
- Dados fake para testes apenas
- Não é útil para cliente real

**Solução**: ✅ Integração com API smart meter
```javascript
// Exemplo: Buscar dados reais
const consumoReal = await fetch(
    "https://api.distribuidor.com.br/meter/12345"
);
```

**Quando?** Fase 3 - Integrações

---

### P10: Configurações Compartilhadas (Admin/Cliente)
**O que é?**
- `admin-configuracoes.html` E `configuracoes.html` não bem separadas
- Cliente pode ver opções de admin às vezes

**Impacto**: 🟡 MÉDIO
- Confusão de UI
- Cliente pode estar acessando página indevida

**Solução**: ✅ Separar versões ou filtrar elementos
```html
<!-- Separar em duas páginas -->
cliente-configuracoes.html    <!-- Apenas dados cliente -->
admin-configuracoes.html      <!-- Apenas dados admin -->

<!-- OU usar data-role em mesma página -->
<button data-role="admin">Deletar conta</button>
```

**Quando?** Fase 1 - Quick fix (possível)

---

## 🟢 Problemas BAIXOS

### P11: Sem Email de Notificação
**O que é?**
- Não envia email para confirmar cadastro
- Não envia alerta de chamado aberto
- Não envia fatura por email

**Por que?**
- Precisa serviço externo (SendGrid, Gmail, etc)

**Solução**: ✅ Integrar SendGrid
```python
# Backend (exemplo Python)
from sendgrid import SendGridAPIClient

send_email(
    to="cliente@email.com",
    subject="Seu chamado foi aberto",
    content="Seu ID: #12345"
)
```

**Quando?** Fase 2-3 - Backend

---

### P12: Sem Recuperação de Senha
**O que é?**
- Se esquecer senha, não tem "Esqueci minha senha"
- Não pode resetar

**Por que?**
- Precisa email + código temporário + backend

**Solução**: ✅ Implementar fluxo:
1. Usuário clica "Esqueci senha"
2. Envia email com link + código
3. Clica link, insere nova senha
4. Backend valida e atualiza

**Quando?** Fase 2 - Backend

---

### P13: Sem Relatórios Dinâmicos
**O que é?**
- Relatórios são pages HTML estáticas
- Não comporta filtros complexos

**Solução**: ✅ Backend com banco de dados
- Gerar relatórios sob demanda
- Filtrar por período, cliente, tipo, etc.

**Quando?** Fase 2-3 - Backend

---

### P14: Sem Multi-idioma
**O que é?**
- Sistema inteiro em Português apenas

**Solução**: ✅ i18n (internacionalização)
- Adicionar English, Spanish, outros

**Quando?** Fase 3 - Polish

---

## 📊 Matriz de Impacto x Dificuldade

| Problema | Impacto | Dificuldade | Tempo |
|----------|---------|------------|-------|
| P1: Sem persist | 🔴 | 🟠 | 1 semana |
| P2: Senhas | 🔴 | 🟠 | 3 dias |
| P3: Sem HTTPS | 🔴 | 🟢 | 1 dia |
| P4: Sem timeout | 🟠 | 🟢 | 2 dias |
| P5: Sem 2FA | 🟠 | 🟠 | 1 semana |
| P6: Rate limit | 🟠 | 🟢 | 2 dias |
| P7: Dados shared | 🟡 | 🟢 | 3 dias |
| P8: 169 botões | 🟡 | 🟠 | 2 semanas |
| P9: Dados fake | 🟡 | 🟠 | 1 semana |
| P10: Config mix | 🟡 | 🟢 | 1 dia |
| P11: Sem email | 🟡 | 🟢 | 3 dias |
| P12: Sem reset pw | 🟡 | 🟠 | 1 semana |
| P13: Relatórios | 🟡 | 🟠 | 1 semana |
| P14: Sem idioma | 🟢 | 🟡 | 2 semanas |

---

## 📅 Roadmap de Resolução

### Fase 1: Quick Fixes (Essa Semana)
- [ ] P10: Separar configurações admin/cliente
- [ ] Documentação (DONE ✅)

### Fase 2: Backend Essencial (Semanas 2-3)
- [ ] P1: PostgreSQL + persist
- [ ] P2: Bcrypt + senhas
- [ ] P4: JWT + timeout
- [ ] P6: Rate limiting
- [ ] P8: Implementar handlers
- [ ] P11: Email (SendGrid)

### Fase 3: Produção (Semanas 4-5)
- [ ] P3: HTTPS + SSL
- [ ] P9: Smart meter API
- [ ] P5: 2FA (Google Auth)
- [ ] P12: Password reset

### Fase 4: Polish (Semana 6+)
- [ ] P13: Relatórios dinâmicos
- [ ] P14: Multi-idioma
- [ ] Performance optimization
- [ ] UI/UX improvements

---

## 🚀 Próximas Ações

1. **Hoje**: Leia este documento + [SETUP.md](./SETUP.md)
2. **Amanhã**: Estude [ARQUITETURA.md](./ARQUITETURA.md)
3. **Próxima semana**: Comece [BACKEND-ROADMAP.md](./BACKEND-ROADMAP.md)

---

*Alguma dúvida? Veja [START-HERE.md](./START-HERE.md) para índice completo*
