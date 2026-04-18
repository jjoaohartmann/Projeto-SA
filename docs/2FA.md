# 🔐 Autenticação em Dois Fatores (2FA)

## 📋 Visão Geral

A autenticação em dois fatores (2FA) adiciona uma camada extra de segurança exigindo dois métodos de verificação antes de permitir acesso.

---

## 🔧 Implementação

### Fase 1: Modificar Script de Login

```javascript
// script.js - Adicionar função de 2FA

function enviar2FA(usuarioId, metodo = "email") {
    const usuario = obterUsuario(usuarioId);
    const codigo = gerarCodigoTemporario(6);
    
    // Armazenar código com expiração (5 minutos)
    const tentativa2FA = {
        usuarioId,
        codigo,
        metodo,
        expiracao: Date.now() + 300000, // 5 minutos
        tentativas: 0
    };
    
    localStorage.setItem("rtv_2fa_" + usuarioId, JSON.stringify(tentativa2FA));
    
    // Simular envio (em produção, usar API)
    console.log(`[2FA] Código ${codigo} enviado para ${usuario.email}`);
    
    return { sucesso: true, tentativa: usuarioId };
}

function verificar2FA(usuarioId, codigoInserido) {
    const tentativa = JSON.parse(localStorage.getItem("rtv_2fa_" + usuarioId));
    
    if (!tentativa) {
        return { sucesso: false, erro: "2FA não iniciado" };
    }
    
    if (Date.now() > tentativa.expiracao) {
        localStorage.removeItem("rtv_2fa_" + usuarioId);
        return { sucesso: false, erro: "Código expirado" };
    }
    
    if (tentativa.tentativas >= 3) {
        localStorage.removeItem("rtv_2fa_" + usuarioId);
        return { sucesso: false, erro: "Muitas tentativas. Tente novamente mais tarde" };
    }
    
    if (tentativa.codigo === codigoInserido) {
        localStorage.removeItem("rtv_2fa_" + usuarioId);
        return { sucesso: true };
    }
    
    tentativa.tentativas++;
    localStorage.setItem("rtv_2fa_" + usuarioId, JSON.stringify(tentativa));
    return { sucesso: false, erro: "Código incorreto" };
}

function gerarCodigoTemporario(comprimento = 6) {
    return Math.floor(Math.random() * Math.pow(10, comprimento))
        .toString()
        .padStart(comprimento, '0');
}
```

### Fase 2: Criar Página de Verificação

```html
<!-- login-2fa.html -->
<div class="auth-container">
    <div class="auth-box">
        <h2>Verificação em Dois Fatores</h2>
        <p>Enviamos um código para seu email: ***@***.com</p>
        
        <form id="form-2fa">
            <div class="form-group">
                <label>Digite o código (6 dígitos)</label>
                <input type="text" id="codigo-2fa" maxlength="6" placeholder="000000" required>
            </div>
            
            <button type="submit" class="btn btn-primary">Verificar</button>
            <button type="button" class="btn-secondary" onclick="reenviarCodigo()">
                Re-enviar código
            </button>
        </form>
        
        <p id="mensagem-erro" style="color: red;"></p>
    </div>
</div>

<script>
    document.getElementById('form-2fa').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usuarioId = localStorage.getItem('rtv_2fa_usuario_atual');
        const codigo = document.getElementById('codigo-2fa').value;
        
        const resultado = verificar2FA(usuarioId, codigo);
        
        if (resultado.sucesso) {
            // Login bem-sucedido
            localStorage.removeItem('rtv_2fa_usuario_atual');
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('mensagem-erro').textContent = resultado.erro;
        }
    });
</script>
```

### Fase 3: Integrar com Login

```javascript
// Modificar fluxo de login em script.js

function fazerLogin(email, senha) {
    // ... validações ...
    
    const usuario = obterUsuarioPorEmail(email);
    
    if (usuario && usuario.senha === criptografar(senha)) {
        if (usuario.twoFactorEnabled) {
            // Ir para 2FA
            localStorage.setItem('rtv_2fa_usuario_atual', usuario.id);
            enviar2FA(usuario.id, 'email');
            window.location.href = 'login-2fa.html';
        } else {
            // Login direto (sem 2FA)
            finalizarLogin(usuario);
        }
    } else {
        mostrarErro('Credenciais inválidas');
    }
}
```

---

## 🔧 Ativar/Desativar 2FA

### Para Clientes

```javascript
// Na página de configurações do cliente

function ativar2FA() {
    const usuario = obterUsuarioLogado();
    
    // Enviar código de verificação
    const codigo = gerarCodigoTemporario(6);
    localStorage.setItem('rtv_2fa_setup_' + usuario.id, JSON.stringify({
        codigo,
        expiracao: Date.now() + 600000 // 10 minutos
    }));
    
    alert('Código de 6 dígitos enviado para: ' + usuario.email);
    
    // Solicitar confirmação
    const codigoInserido = prompt('Digite o código de 6 dígitos:');
    
    if (codigoInserido === codigo) {
        usuario.twoFactorEnabled = true;
        atualizarUsuario(usuario.id, { twoFactorEnabled: true });
        localStorage.removeItem('rtv_2fa_setup_' + usuario.id);
        alert('✅ 2FA ativado com sucesso!');
    } else {
        alert('❌ Código inválido');
    }
}

function desativar2FA(senhaConfirmacao) {
    const usuario = obterUsuarioLogado();
    
    // Verificar senha para segurança
    if (criptografar(senhaConfirmacao) === usuario.senha) {
        usuario.twoFactorEnabled = false;
        atualizarUsuario(usuario.id, { twoFactorEnabled: false });
        alert('✅ 2FA desativado');
    } else {
        alert('❌ Senha incorreta');
    }
}
```

### Para Admins

```javascript
// em admin-configuracoes.html

// Botão para ativar 2FA globalmente
document.getElementById('btn-habilitar-2fa')?.addEventListener('click', () => {
    const resultado = AdminConfiguracaoAPI.configurar2FA(true);
    alert('✅ 2FA habilitado para todos os usuários');
});

document.getElementById('btn-desabilitar-2fa')?.addEventListener('click', () => {
    if (confirm('⚠️ Desabilitar 2FA para todos?')) {
        const resultado = AdminConfiguracaoAPI.configurar2FA(false);
        alert('✅ 2FA desabilitado');
    }
});
```

---

## 🔐 Métodos de Entrega

### 1. Email (Padrão)
- ✅ Implementado automaticamente
- 📧 Código enviado para email cadastrado
- ⏱️ Válido por 5 minutos
- 🔄 Pode ser reenviado

### 2. SMS (Futuro)
```javascript
function enviar2FAsms(usuarioId) {
    // Integracom com serviço SMS (Twilio, AWS SNS, etc)
    const usuario = obterUsuario(usuarioId);
    const codigo = gerarCodigoTemporario(6);
    
    // Chamada API
    fetch('/api/sms/enviar', {
        method: 'POST',
        body: JSON.stringify({
            telefone: usuario.telefone,
            codigo: codigo
        })
    });
}
```

### 3. App Mobile (Futuro)
- Usar Google Authenticator
- Microsoft Authenticator
- Authy

---

## 📊 Fluxo Completo

```
Login Page
    ↓ (inserir email/senha)
    ↓
Validar Credenciais
    ↓
Tem 2FA ativado?
    ├─ SIM → Enviar Código
    │        ↓
    │        login-2fa.html
    │        ↓
    │        Verificar Código
    │        ↓
    │        Código Correto?
    │        ├─ SIM → Finalizar Login
    │        └─ NÃO → Exibir Erro
    │
    └─ NÃO → Finalizar Login Direto
```

---

## 🛡️ Boas Práticas

✅ **DO:**
- ✅ Sempre usar HTTPS em produção
- ✅ Expirar códigos após 5 minutos
- ✅ Limitar tentativas (máximo 3)
- ✅ Registrar tentativas falhadas
- ✅ Usar gerador aleatório criptográfico
- ✅ Permitir backup codes como fallback

❌ **DON'T:**
- ❌ Enviar códigos via SMS sem HTTPS
- ❌ Armazenar códigos em texto puro
- ❌ Reutilizar códigos
- ❌ Enviar via email de forma insegura
- ❌ Permitir unlimited tentativas

---

## 📞 Suporte 2FA

**Se você perdeu acesso:**
1. Entre em contato com suporte@rtvsolar.com.br
2. Forneça email e CPF
3. Admin pode desabilitar 2FA temporariamente

**Recuperar Acesso:**
1. Verificação de email
2. Verificação de identidade
3. Reenabilitação de 2FA

---

**Versão**: 1.0  
**Status**: Pronto para Implementação  
**Última atualização**: 18/04/2026
