# 🔴 REFERÊNCIA TÉCNICA - VALORES HARDCODED E ELEMENTOS PROBLEMÁTICOS

## Índice
- [Valores Hardcoded por Página](#valores-hardcoded-por-página)
- [IDs HTML/CSS Problemáticos](#ids-htmlcss-problemáticos)
- [Funções JavaScript Não Utilizadas](#funções-javascript-não-utilizadas)
- [Elementos com data-permissao Ignorado](#elementos-com-data-permissao-ignorado)
- [Canvas Vazios (Gráficos)](#canvas-vazios-gráficos)

---

## Valores Hardcoded por Página

### dashboard.html

**Cards de Geração (linhas 90-100):**
```html
<div class="valor" id="geracao-atual">3.8 kW</div>       <!-- HARDCODED -->
<div class="valor" id="geracao-hoje">38.2 kWh</div>     <!-- HARDCODED -->
<div class="valor" id="geracao-mes">1.150 kWh</div>     <!-- HARDCODED -->
```

**Cards de Consumo (linhas 100-115):**
```html
<div class="valor" id="consumo-atual">1.2 kW</div>      <!-- HARDCODED -->
<div class="valor" id="consumo-hoje">14.5 kWh</div>     <!-- HARDCODED -->
<div class="valor" id="consumo-mes">340 kWh</div>       <!-- HARDCODED -->
```

**Cards de Economia (linhas 115-130):**
```html
<div class="valor" id="economia-mes">R$ 412,50</div>              <!-- HARDCODED -->
<div class="valor" id="economia-acumulada">R$ 2.875,00</div>       <!-- HARDCODED -->
<div class="valor" id="creditos-disponiveis">127.5 kWh</div>       <!-- HARDCODED -->
```

**Cards de Impacto (linhas 130-145):**
```html
<div class="valor" id="co2-evitado">185 kg</div>        <!-- HARDCODED -->
<div class="valor" id="arvores-equiv">8</div>           <!-- HARDCODED -->
<div class="valor" id="eficiencia-global">96.8%</div>    <!-- HARDCODED -->
<div class="valor" id="payback-estimado">6.2 anos</div> <!-- HARDCODED -->
```

**Weather Widget (linhas 50-60):**
```html
<h4 id="clima-temp">28°C</h4>                    <!-- HARDCODED -->
<p id="clima-cond">Ensolarado (Alta Geração)</p> <!-- HARDCODED -->
```

**RTV Intelligence (linhas 195-215):**
```html
Recomendação: "Desloque o uso de máquinas pesadas para entre 11h e 14h..."
Anomalia: "Consumo atípico noturno (Ar-condicionado Sala 2)"
<!-- TUDO FAKE - NÃO HÁ DADOS REAL -->
```

**Tabelas Hardcoded:**
```html
<!-- Sensores e Equipamentos (linhas 235-245) -->
Inversor RTV-X1        → Online
Painel String A        → Online
Medidor Geral          → Falha (Error #203)  <!-- Fake error code -->

<!-- Fila de Operações (linhas 245-260) -->
Limpeza de Placas      → Em 2 dias
Ticket #10024          → Aguardando Peça

<!-- Atividade Recente (linhas 260-275) -->
10:45 - Login realizado (IP: 192...)  <!-- IP FAKE -->
09:30 - Backup automático do banco
08:15 - Perda de ping (Medidor Geral)  <!-- Fake alert -->
```

---

### cliente-consumo.html

**Cards de Resumo (linhas 85-110):**
```html
<div class="valor" id="consumo-atual">1.2 kW</div>      <!-- HARDCODED -->
<div class="valor" id="consumo-hoje">14.5 kWh</div>     <!-- HARDCODED -->
<div class="valor" id="consumo-mes">340 kWh</div>       <!-- HARDCODED -->
<div class="valor" id="consumo-media">12.3 kWh</div>    <!-- HARDCODED -->
```

**Comparativo (linhas 165-190):**
```html
<p><strong>Consumo Este Mês:</strong> <span style="color: #ff9500;">340 kWh</span></p>
<p><strong>Mês Anterior:</strong> <span style="color: #999;">365 kWh</span></p>
<p><strong>Diferença:</strong> <span style="color: #27c93f;">-25 kWh (-6.8%)</span></p>
```

**Dispositivos de Maior Consumo (linhas 200-230):**
```html
Ar Condicionado  → 45% - Principal
Chuveiro Elétrico → 18% - Secundário
Geladeira        → 12% - Contínuo
Iluminação       → 8%  - Variável
<!-- PERCENTUAIS HARDCODED -->
```

---

### cliente-geracao.html

**Cards de Resumo (linhas 60-90):**
```html
<div class="valor" id="geracao-atual">3.8 kW</div>      <!-- HARDCODED -->
<div class="valor" id="geracao-hoje">38.2 kWh</div>     <!-- HARDCODED -->
<div class="valor" id="geracao-mes">1.150 kWh</div>     <!-- HARDCODED -->
<div class="valor" id="geracao-media">30.5 kWh</div>    <!-- HARDCODED -->
```

**Status de Equipamentos (linhas 145-190):**
```html
<div class="valor" id="paineis-qty">24</div>                      <!-- HARDCODED -->
<div class="valor" id="inversor-modelo">Huawei 10kW</div>         <!-- HARDCODED -->
<div class="valor" id="medidor-modelo">Schneider</div>             <!-- HARDCODED -->
<div class="valor" id="bateria-status">Não instalada</div>        <!-- HARDCODED -->
```

**Performance (linhas 195-215):**
```html
<p><strong>Eficiência Global:</strong> <span id="eficiencia-global" style="color: #27c93f;">96.8%</span></p>
<p><strong>Scoring do Sistema:</strong> <span id="scoring" style="color: var(--amarelo-vivo); font-weight: bold;">A+</span></p>
<p><strong>Dias Sem Falha:</strong> <span id="dias-sem-falha" style="color: #27c93f;">147</span> dias</p>
```

**Previsão Próximos Dias (linhas 220-230):**
```html
<p><strong>Hoje:</strong> <span style="color: #27c93f;">38.2 kWh</span> (Ensolarado)</p>
<p><strong>Amanhã:</strong> <span style="color: var(--amarelo-vivo);">35.5 kWh</span> (Parcialmente Nublado)</p>
<p><strong>Próximo:</strong> <span style="color: #ff9500;">22.0 kWh</span> (Nublado)</p>
```

---

### cliente-financeiro.html

**Cards de Resumo (linhas 60-90):**
```html
<div class="valor" id="economia-mes">R$ 412,50</div>              <!-- HARDCODED -->
<div class="valor" id="economia-acumulada">R$ 2.875,00</div>       <!-- HARDCODED -->
<div class="valor" id="payback-estimado">6.2 anos</div>            <!-- HARDCODED -->
<div class="valor" id="roi-anualizado">16.2%</div>                <!-- HARDCODED -->
```

**Investimento Inicial (linhas 95-120):**
```html
<p><strong>Custo do Sistema:</strong> <span style="color: #ff5f56;">R$ 20.000,00</span></p>
<p><strong>Instalação:</strong> <span style="color: #ff5f56;">R$ 1.500,00</span></p>
<p><strong>Total Investido:</strong> <span style="color: #ff5f56; font-size: 18px;">R$ 21.500,00</span></p>
```

**Tempo de Retorno (linhas 125-150):**
```html
<p><strong>Payback:</strong> <span style="color: #27c93f; font-size: 18px;">6.2 anos</span></p>
<p>Com tarifa média de R$ 850/mês, seu sistema se pagará em aproximadamente 6 anos e 2 meses.</p>
```

**Créditos (linhas 220-245):**
```html
<p><strong>Créditos Gerais:</strong> <span style="color: var(--amarelo-vivo); font-size: 20px;">127.5 kWh</span></p>
<p><strong>Próximo vencimento:</strong> 03/01/2025</p>
```

**Fatura Atual (linhas 250-270):**
```html
<p><strong>Mês:</strong> <span>Janeiro/2025</span></p>
<p><strong>Energia Consumida:</strong> <span style="color: #ff9500;">340 kWh</span></p>
<p><strong>Compensação:</strong> <span style="color: #27c93f;">-127.5 kWh</span></p>
<p><strong>Custo Final:</strong> <span style="color: #999;">R$ 0,00 (Geração compensa consumo)</span></p>
```

**Histórico de Faturas (linhas 280-320):**
```html
<tr>
  <td>Janeiro/2025</td>
  <td>340</td>
  <td>1.150</td>
  <td>R$ 412,50</td>
  <td>✓ Pago</td>
</tr>
<tr>
  <td>Dezembro/2024</td>
  <td>365</td>
  <td>950</td>
  <td>R$ 375,00</td>
  <td>✓ Pago</td>
</tr>
```

---

### cliente-contratos.html

**Cards de Resumo (linhas 60-95):**
```html
<div class="valor">Ativo</div>          <!-- Status: HARDCODED -->
<span class="status positivo">Válido até 2027</span>
Período: 60 meses, 25 anos, etc.
```

**Contratos (linhas 115-200):**
```html
<!-- CONTRATO 1 -->
<h4>Contrato de Serviço de Energia Solar</h4>
Assinado em: 15/03/2024
Validade: 36 meses
Status: ✓ Ativo
Descrição: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
<!-- ^^^ LOREM IPSUM FAKE ^^^ -->

<!-- CONTRATO 2 -->
<h4>Acordo de Compensação de Energia</h4>
Assinado em: 15/03/2024
Validade: 60 meses
Status: ✓ Ativo
Descrição: "Define os termos de compensação de energia gerada..."
<!-- DESCRIÇÃO GENÉRICA -->

<!-- CONTRATO 3 -->
<h4>Termo de Garantia de Equipamentos</h4>
Emitido em: 15/03/2024
Validade: 25 anos
Status: ✓ Vigente
<!-- COBERTURA FAKE -->

<!-- CONTRATO 4 -->
<h4>Plano de Manutenção Preventiva</h4>
Vigência: 2024-2025
Frequência: 2 visitas/ano
Status: ✓ Ativo
```

**Informações Legais (linhas 215-250):**
```html
<p><strong>Cliente:</strong> <span id="cliente-nome">João Silva</span></p>
<p><strong>CPF/CNPJ:</strong> <span id="cliente-cpf">123.456.789-00</span></p>
<p><strong>Data de Ativação:</strong> <span>15/03/2024</span></p>
<p><strong>Próxima Revisão:</strong> <span style="color: var(--amarelo-vivo);">15/03/2027</span></p>
```

---

### relatorios.html

**Cards de Resumo (linhas 40-75):**
```html
<div class="valor">542 kWh</div>        <!-- HARDCODED -->
<div class="valor">R$ 487,80</div>      <!-- HARDCODED -->
<div class="valor">98.2%</div>          <!-- HARDCODED -->
```

**Histórico Mensal (linhas 80-120):**
```html
<tr><td>Março 2026</td><td>510 kWh</td><td>R$ 459,00</td><td>Concluído</td></tr>
<tr><td>Fevereiro 2026</td><td>490 kWh</td><td>R$ 441,00</td><td>Concluído</td></tr>
<tr><td>Janeiro 2026</td><td>550 kWh</td><td>R$ 495,00</td><td>Concluído</td></tr>
<!-- TODOS COM VALORES FIXOS -->
```

---

### suporte.html

**Chamados Exemplo (linhas 100-140):**
```html
<tr>
  <td>#10024</td>
  <td>Inversor Offline</td>
  <td>15/04/2026</td>
  <td>Em Análise</td>
</tr>
<tr>
  <td>#09871</td>
  <td>Manutenção Preventiva</td>
  <td>10/01/2026</td>
  <td>Resolvido</td>
</tr>
<!-- MISTURADO COM DADOS DO LOCALSTORAGE -->
```

---

### admin-clientes.html

**Estatísticas (linhas 60-95):**
```html
<div class="valor" id="total-clientes">147</div>          <!-- HARDCODED -->
<div class="valor" id="clientes-aprovados">142</div>      <!-- HARDCODED -->
<div class="valor" id="clientes-pendentes">5</div>        <!-- HARDCODED -->
<div class="valor" id="clientes-rejeitos">3</div>         <!-- HARDCODED -->
```

**Clientes Exemplo (linhas 140-180):**
```html
<tr>
  <td>João Silva</td>
  <td>joao.silva@email.com</td>
  <td>10kW - Ativo</td>
  <td>Aprovado</td>
  <td>15/03/2024</td>
</tr>
<!-- TODOS OS CLIENTES SÃO HARDCODED, NÃO VÊEM DO LOCALSTORAGE -->
```

---

### admin-servicos.html

**Estatísticas (linhas 60-95):**
```html
<div class="valor" id="servicos-ativos">12</div>          <!-- HARDCODED -->
<div class="valor" id="receita-mensal">R$ 45.2K</div>     <!-- HARDCODED -->
<div class="valor" id="crescimento">+18%</div>            <!-- HARDCODED -->
<div class="valor" id="subscritores">127</div>            <!-- HARDCODED -->
```

**Pacotes de Serviços (linhas 100-200):**
```html
<!-- SERVIÇO 1 -->
Instalação Padrão
Até 10kW
R$ 25.000                   <!-- HARDCODED -->
Contratos: 45               <!-- HARDCODED -->
Receita: R$ 1.125.000       <!-- HARDCODED -->

<!-- SERVIÇO 2 -->
Instalação Premium
Até 20kW + Bateria
R$ 55.000                   <!-- HARDCODED -->
Contratos: 28               <!-- HARDCODED -->
Receita: R$ 1.540.000       <!-- HARDCODED -->
```

---

## IDs HTML/CSS Problemáticos

### Element IDs que NUNCA têm valores atualizados

```javascript
// GERAÇÃO
"geracao-atual"        // Renderizado mas nunca atualizado com dados reais
"geracao-hoje"         // Renderizado mas nunca atualizado com dados reais
"geracao-mes"          // Renderizado mas nunca atualizado com dados reais
"geracao-media"        // Renderizado mas nunca atualizado com dados reais

// CONSUMO
"consumo-atual"        // Renderizado mas nunca atualizado com dados reais
"consumo-hoje"         // Renderizado mas nunca atualizado com dados reais
"consumo-mes"          // Renderizado mas nunca atualizado com dados reais
"consumo-media"        // Renderizado mas nunca atualizado com dados reais

// ECONOMIA
"economia-mes"         // Renderizado mas nunca atualizado com dados reais
"economia-acumulada"   // Renderizado mas nunca atualizado com dados reais
"economia-header"      // Renderizado mas nunca atualizado com dados reais

// AMBIENTE
"co2-evitado"         // Renderizado mas nunca atualizado com dados reais
"arvores-equiv"       // Renderizado mas nunca atualizado com dados reais
"eficiencia-global"   // Renderizado mas nunca atualizado com dados reais

// CLIMA
"clima-temp"          // Renderizado mas nunca atualizado com dados reais
"clima-cond"          // Renderizado mas nunca atualizado com dados reais

// FINANCEIRO
"payback-estimado"    // Renderizado mas nunca atualizado com dados reais
"roi-anualizado"      // Renderizado mas nunca atualizado com dados reais

// EQUIPAMENTOS
"paineis-qty"         // Renderizado mas nunca atualizado com dados reais
"inversor-modelo"     // Renderizado mas nunca atualizado com dados reais
"medidor-modelo"      // Renderizado mas nunca atualizado com dados reais
"bateria-status"      // Renderizado mas nunca atualizado com dados reais

// ADMIN
"total-clientes"      // HARDCODED em HTML
"clientes-aprovados"  // HARDCODED em HTML
"clientes-pendentes"  // HARDCODED em HTML
"servicos-ativos"     // HARDCODED em HTML
"receita-mensal"      // HARDCODED em HTML
```

---

## Funções JavaScript Não Utilizadas

### Em cliente-sistema.js

```javascript
/**
 * DEFINIDA MAS NUNCA CHAMADA
 */
function renderizarWidgetsGeração() {
    // Linhas 100-130
    // Função existe mas:
    // 1. Não é chamada em lugar nenhum
    // 2. Procura .getElementById() de IDs que existem
    // 3. MAS nunca modifica o valor com dados reais
}

function renderizarWidgetsConsumo() {
    // Linhas 135-165
    // Función existe mas nunca chamada
}

function renderizarWidgetsEconomia() {
    // Linhas 170-200
    // Función existe mas nunca chamada
}

function renderizarWidgetsAmbiente() {
    // Linhas 205-235
    // Función existe mas nunca chamada
}

function atualizarMetricasTempoReal() {
    // Linhas 80-95
    // Simula dados random MAS nunca é chamada
    // Definida em cliente-consumo.html setInterval() MAS nunca em arquivo de script
}
```

### Em sistema-permissoes.js

```javascript
/**
 * DEFINIDA MAS NUNCA VERIFICADA
 */
function temPermissao(permissao) {
    // Linhas 120-125
    // Função existe mas nunca chamada
}

function temAlgumaPermissao(permissoes) {
    // Linhas 130-135
    // Função existe mas nunca chamada
}

function temTodasPermissoes(permissoes) {
    // Linhas 140-145
    // Função existe mas nunca chamada
}

function ehAdmin() {
    // Linhas 160-165
    // Função existe. Usada:
    // - No script geral para mostrar/ocultar admin links
    // - MAS nenhuma verificação de backend
}

function ehCliente() {
    // Linhas 170-175
    // Função existe mas nunca usada
}

function renderMenuDinamico() {
    // Linhas 200-210
    // Função existe mas nunca chamada
}
```

### Em script.js

```javascript
/**
 * DEFINIDA MAS NUNCA CHAMADA
 */
function inicializarGraficosConsumo() {
    // cliente-consumo.html linhas 200+
    // Função chamada no addEventListener mas VAZIA:
    // if (ctx) { ... }
    // Sem implementação de Chart.js
}

function inicializarGraficosGeracao() {
    // cliente-geracao.html linhas 200+
    // Função chamada mas VAZIA
    // if (sistema) return; // Retorna imediatamente!
}

function gerarRelatorio() {
    // NÃO EXISTE - button onclick=window.print()
}

function exportarPDF() {
    // NÃO EXISTE
}

function enviarEmail() {
    // NÃO EXISTE - documentação promete email notifications
}
```

---

## Elementos com data-permissao Ignorado

### dashboard.html

```html
<!-- LINHA 90 onwards: Todos esses cards têm data-permissao MAS nunca verificado -->

<div class="dash-card mini" data-permissao="ver_geração_propria">
  <!-- ^^^ data-permissao="ver_geração_propria" IGNORADO ^^^ -->
  ...
</div>

<div class="dash-card mini" data-permissao="ver_consumo_proprio">
  <!-- ^^^ data-permissao="ver_consumo_proprio" IGNORADO ^^^ -->
  ...
</div>

<!-- SIDEBAR LINK -->
<a href="admin-clientes.html" class="sidebar-link-admin" style="display: none;">
  <!-- ^^^ MOSTRADO/OCULTADO COM style="display: none" HARDCODED ^^^ -->
  <!-- DEVERIA SER VERIFICADO COM temPermissao("ver_clientes") -->
</a>
```

### cliente-consumo.html

```html
<div class="dash-card mini" data-permissao="ver_consumo_proprio">
  <!-- data-permissao NUNCA VERIFICADO -->
</div>
```

### cliente-geracao.html

```html
<div class="dash-card mini" data-permissao="ver_geração_propria">
  <!-- data-permissao NUNCA VERIFICADO -->
</div>
```

### cliente-financeiro.html

```html
<div class="dash-card mini" data-permissao="ver_consumo_proprio">
  <!-- data-permissao NUNCA VERIFICADO -->
</div>
```

---

## Canvas Vazios (Gráficos)

### cliente-consumo.html

```html
<!-- LINHA 145-200 -->
<canvas id="chart-consumo-horaria" style="max-height: 300px;"></canvas>
<!-- ^^^ Canvas vazio - inicializarGraficosConsumo() não implementa ^^^ -->

<canvas id="chart-consumo-semana" style="max-height: 250px;"></canvas>
<!-- ^^^ Canvas vazio - inicializarGraficosConsumo() não implementa ^^^ -->

<canvas id="chart-cons-vs-ger" style="max-height: 250px;"></canvas>
<!-- ^^^ Canvas vazio - inicializarGraficosConsumo() não implementa ^^^ -->
```

### cliente-geracao.html

```html
<!-- LINHA 170-230 -->
<canvas id="chart-geracao-horaria" style="max-height: 300px;"></canvas>
<!-- ^^^ Canvas vazio - inicializarGraficosGeracao() não implementa ^^^ -->

<canvas id="chart-geracao-semana" style="max-height: 250px;"></canvas>
<!-- ^^^ Canvas vazio -->

<canvas id="chart-geracao-ano" style="max-height: 250px;"></canvas>
<!-- ^^^ Canvas vazio -->
```

### cliente-financeiro.html

```html
<!-- LINHA 145-200 -->
<canvas id="chart-economia-acumulada" style="max-height: 300px;"></canvas>
<!-- ^^^ Canvas vazio -->

<canvas id="chart-economia-anual" style="max-height: 250px;"></canvas>
<!-- ^^^ Canvas vazio -->

<canvas id="chart-custo-vs-economia" style="max-height: 250px;"></canvas>
<!-- ^^^ Canvas vazio -->

<canvas id="chart-projecao-futura" style="max-height: 250px;"></canvas>
<!-- ^^^ Canvas vazio -->
```

### dashboard.html

```html
<!-- LINHA 110-125 -->
<canvas id="chartPrincipal"></canvas>
<!-- ^^^ Este FUNCIONA parcialmente:
     - Renderiza dados hardcoded de semana: [15, 19, 17, 22, 20, 18, 10]
     - Não é real-time
     - Não se atualiza  
 -->
```

---

## Resumo de Contagem

| Categoria | Quantidade | Status |
|-----------|-----------|--------|
| Valores Hardcoded | 50+ | 🔴 CRÍTICO |
| IDs HTML sem atualização | 30+ | 🔴 CRÍTICO |
| Funções JS não utilizadas | 12+ | 🟡 ALTO |
| Canvas vazios | 7 | 🔴 CRÍTICO |
| data-permissao ignorados | 15+ | 🔴 CRÍTICO |
| Botões com toast fake | 50+ | 🟡 ALTO |
| Scripts admin faltando | 4 | 🔴 CRÍTICO |

---

## Quick Fix Priority

### 🔴 Imediato (1-2h cada)
1. Cria `admin-clientes.js` com `renderPainelAdminClientes()`
2. Remove elementos claros fake: RTV Intelligence, IPs fake, alerts fake
3. Comenta funções não utilizadas ao invés de deletar

### 🟡 Curto Prazo (4-6h cada)
1. Implementar gráficos com dados simulados (Chart.js)
2. Conectar formulários a API mock
3. Implementar RBAC validation no cliente

### 🔴 Prioritário (Backend)
1. Setup backend com dados reais
2. Conectar todas as páginas a API
3. Remover localStorage de produção

