# 🔐 Sistema de Aprovação de Clientes - RTV Solar

## 📋 Resumo das Alterações

Um sistema completo de aprovação de cadastros foi implementado na plataforma RTV Solar, separando completamente os painéis do administrador e do cliente, com fluxo de aprovação obrigatória.

---

## 🎯 Funcionalidades Principais

### 1. **Registro de Novo Cliente** (`registro.html`)
- Novo formulário de cadastro completo
- Campos: Nome, E-mail, Telefone, Endereço, CPF/CNPJ, Serviço de Interesse, Senha
- Status inicial: **Aguardando Aprovação**
- Clientes são armazenados com `aprovadoAdmin: false`

### 2. **Painel Isolado do Admininstrador** (`admin.html`)
Novas seções adicionadas:
- **Métricas de Aprovações**
  - Clientes Pendentes: Quantidade aguardando análise
  - Clientes Aprovados: Quantidade ativa
  - Total de Clientes: Soma geral

- **Tabela de Aprovações**
  - Lista de clientes aguardando aprovação
  - Ações: [Aprovar] [Rejeitar]
  - Motivo de rejeição pode ser adicionado

- **Tabela de Clientes Aprovados**
  - Lista dos clientes com acesso ativo
  - Data de aprovação registrada

- **Aprovação de Serviços**
  - Serviços solicitados pelos clientes
  - Ações: [Aprovar]
  - Status da solicitação em tempo real

### 3. **Painel Isolado do Cliente** (`dashboard.html`)
- Clientes NÃO APROVADOS veem mensagem de bloqueio
- Clientes APROVADOS veem o painel completo
- Acesso restrito apenas após aprovação do admin

### 4. **Proteção de Login**
Verificações implementadas:
- Login cliente: Verifica se `aprovadoAdmin === true`
- Login admin: Só permite acesso com role = "admin"
- Mensagens claras para aprouação pendente

### 5. **Simulador Expresso Corrigido** (`index.html`)
- **CSS Melhorado**: Layout responsivo com Flexbox
- **Cálculo Funcional**: Calcula economia ao vivo
- **Fórmula**: 85% de economia anual (configurável)
- **Responsividade**: Funcionando em mobile, tablet e desktop

---

## 🔄 Fluxo de Aprovação

```
1. CLIENTE NOVO
   └─ Preenche registro.html
   └─ Dados salvos em localStorage (aprovadoAdmin: false)
   └─ Recebe mensagem: "Cadastro realizado, aguardando aprovação"
   └─ Tenta fazer login → Acesso bloqueado

2. ADMINISTRADOR
   └─ Acessa admin.html
   └─ Visualiza painel de aprovações
   └─ Clica "Aprovar" ou "Rejeitar" para cada cliente

3. CLIENTE APROVADO
   └─ Recebe confirmação (futura: por e-mail)
   └─ Consegue fazer login normalmente
   └─ Acessa dashboard.html completo
   └─ Pode solicitar serviços

4. ADMIN REVISA SERVIÇOS
   └─ Visualiza "Aprovação de Serviços Adquiridos"
   └─ Aprova ou rejeita pedidos de serviço
   └─ Cliente recebe confirmação
```

---

## 📁 Arquivos Criados/Modificados

### ✅ Novos Arquivos
| Arquivo | Descrição |
|---------|-----------|
| `registro.html` | Página de cadastro para novos clientes |
| `sistema-aprovacoes.js` | Toda a lógica de aprovações |

### 📝 Arquivos Modificados
| Arquivo | Alterações |
|---------|-----------|
| `index.html` | Adicionado botão "Criar Conta", script do simulador |
| `login.html` | Adicionado link para registro, verificação de aprovação |
| `admin.html` | Adicionadas 3 seções de aprovação, importado sistema-aprovacoes.js |
| `dashboard.html` | Importado sistema-aprovacoes.js, proteção de acesso |
| `login-admin.html` | Importado sistema-aprovacoes.js |
| `style.css` | Melhorado CSS do calculadora-box, adicionados estilos de select e badges |
| `script.js` | Adicionada verificação de aprovação no login do cliente |

---

## 🛠️ Como Testar

### Teste 1: Criar Novo Cliente
1. Acesse `registro.html`
2. Preencha o formulário
3. Clique "Criar Conta e Solicitar Aprovação"
4. Sistema mostra: "Cadastro realizado! Aguardando aprovação do administrador."

### Teste 2: Bloquear Acesso de Não Aprovado
1. Tente fazer login em `login.html` com o novo cliente
2. Receba mensagem: "Sua conta está sob análise..."

### Teste 3: Aprovar Cliente (Como Admin)
1. Acesse `login-admin.html`
2. Use: **admin@rtvsolar.com** / **admin123**
3. Vá para admin.html
4. Procure a seção "Aprovações de Clientes"
5. Clique "Aprovar" no cliente desejado
6. Cliente agora tem acesso ao painel

### Teste 4: Simulador Expresso
1. Na home (index.html)
2. Role até "Simulador Expresso RTV"
3. Digite uma valor em reais (ex: 500)
4. Veja a economia calculada em tempo real

---

## 💾 Dados Armazenados (localStorage)

### rtv_usuarios
```javascript
{
  id: "cli_1634567890",
  nome: "João Silva",
  email: "joao@email.com",
  telefone: "(48) 99999-9999",
  endereco: "Rua X, 123, Blumenau",
  cpf: "123.456.789-00",
  servico: "energia-solar",
  senha: "abc123",
  role: "cliente",
  aprovadoAdmin: false,        // <-- Controla acesso
  servicosAdquiridos: [],      // <-- Serviços solicitados
  dataCadastro: "18/04/2026 14:30:00",
  dataAprovacao: null          // <-- Preenchido ao aprovar
}
```

### rtv_logs_auditoria
```javascript
{
  data: "18/04/2026 14:30:00",
  acao: "APROVAÇÃO: Cliente João Silva (joao@email.com) foi aprovado.",
  ip: "192.168.1.100 (Mock)",
  user: "Administrador RTV"
}
```

---

## 🎨 Melhorias de CSS

### 1. Calculadora-Box Responsiva
- Desktop: Layout horizontal (input | resultado)
- Mobile: Layout vertical com full width
- Padding ajustado para mobile
- Border esquerdo em desktop, superior em mobile

### 2. Novo Estilos de Badges
- `.badge.positivo` (verde)
- `.badge.alerta` (amarelo)
- `.badge.negativo` (vermelho)

### 3. Select Styling
- Mesmo design do input
- Cores personalizadas
- Funcionamento em dark mode

---

## 🔐 Segurança

### Implementado
✅ Verificação de aprovação no login  
✅ Proteção de painel admin (só role="admin")  
✅ Bloqueio de acesso a dashboard sem aprovação  
✅ Auditoria de ações  
✅ Separação clara de papéis  

### Recomendações Futuras
⚠️ Usar backend real (Node.js/PHP) ao invés de localStorage  
⚠️ Implementar autenticação segura (JWT/OAuth)  
⚠️ Enviar e-mail de confirmação de aprovação  
⚠️ Implementar 2FA  
⚠️ Criptografar senhas com hash seguro  

---

## 📞 Credenciais de Teste

**Admin:**
- E-mail: `admin@rtvsolar.com`
- Senha: `admin123`

**Cliente Teste (Pré-aprovado):**
- Você pode criar através do registro

---

## 📊 Futuras Implementações

- [ ] Notificação por E-mail de aprovação
- [ ] Dashboard com gráficos de aprovações
- [ ] Geração de relatórios PDF
- [ ] Integração com gateway de pagamento
- [ ] Sistema de renovação de serviços
- [ ] Mais campos customizáveis no cadastro
- [ ] Integração com WhatsApp para notificações
- [ ] Auto-aprovação com critérios pré-definidos

---

## ❓ Dúvidas Frequentes

**P: Como resetar as aprovações?**  
R: Abra DevTools (F12) → Console → `localStorage.clear()` → Refresh

**P: Como criar mais usuários admin?**  
R: No localStorage, altere `role: "admin"` em um usuário existente

**P: O simulador funciona com valores negativos?**  
R: Não, o formulário só aceita números positivos

**P: Posso mudar a fórmula de economia?**  
R: Sim! Em `index.html`, no script, altere `0.85` para outro percentual

---

**Sistema desenvolvido em 18/04/2026 para RTV Solar**
