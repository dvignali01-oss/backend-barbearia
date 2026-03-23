const express = require('express');
const cors = require('cors');

const app = express();

// Configurações de Middleware
app.use(cors());
app.use(express.json());

// Identidade Visual Elite Collective
const COLORS = {
    navy: "#050a14",
    red: "#c1121f",
    gold: "#d4af37",
    white: "#fdf0d5"
};

// Banco de dados temporário (Memória)
let stats = {
    totalReservas: 0,
    totalVendas: 0,
    receitaEstimada: 0,
    logs: []
};

// --- PAINEL ADMINISTRATIVO MOBILE-FIRST (Rota '/') ---
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Elite Collective | API Console</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body { background: ${COLORS.navy}; color: ${COLORS.white}; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
                .container { width: 100%; max-width: 400px; }
                .header { text-align: center; border-bottom: 2px solid ${COLORS.red}; padding-bottom: 20px; margin-bottom: 25px; }
                .logo-icon { font-size: 3rem; color: ${COLORS.red}; text-shadow: 0 0 15px rgba(193, 18, 31, 0.4); }
                h1 { font-size: 1.4rem; letter-spacing: 2px; margin: 10px 0 5px; }
                .status-pulse { display: inline-block; width: 10px; height: 10px; background: #27ae60; border-radius: 50%; box-shadow: 0 0 10px #27ae60; margin-right: 8px; animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
                
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
                .card { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 15px; border-left: 4px solid ${COLORS.red}; }
                .card i { color: ${COLORS.red}; font-size: 1.2rem; margin-bottom: 8px; }
                .card span { display: block; font-size: 1.2rem; font-weight: bold; }
                .card label { font-size: 0.65rem; text-transform: uppercase; opacity: 0.6; letter-spacing: 1px; }
                
                .log-box { background: #000; border-radius: 12px; padding: 15px; font-family: 'Courier New', monospace; font-size: 0.75rem; border: 1px solid rgba(255,255,255,0.1); height: 150px; overflow-y: auto; }
                .log-entry { margin-bottom: 5px; border-bottom: 1px solid #111; padding-bottom: 5px; }
                .log-time { color: ${COLORS.red}; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <i class="fas fa-cut logo-icon"></i>
                    <h1>ELITE <span style="color:${COLORS.red}">CORE</span></h1>
                    <div style="font-size: 0.8rem; opacity: 0.7;"><span class="status-pulse"></span>SISTEMA OPERACIONAL</div>
                </div>

                <div class="grid">
                    <div class="card"><i class="fas fa-calendar-check"></i><span>${stats.totalReservas}</span><label>Agendamentos</label></div>
                    <div class="card"><i class="fas fa-shopping-bag"></i><span>${stats.totalVendas}</span><label>Vendas Loja</label></div>
                    <div class="card" style="grid-column: span 2; border-left-color: ${COLORS.gold};">
                        <i class="fas fa-wallet" style="color:${COLORS.gold}"></i>
                        <span style="color:${COLORS.gold}">R$ ${stats.receitaEstimada.toFixed(2)}</span>
                        <label>Volume Processado</label>
                    </div>
                </div>

                <div style="text-align:left; margin-bottom: 10px; font-size: 0.7rem; font-weight: bold; opacity: 0.6;">RECENT ACTIVITY:</div>
                <div class="log-box">
                    ${stats.logs.length === 0 ? '<div style="opacity:0.3">Aguardando requisições...</div>' : stats.logs.map(log => `
                        <div class="log-entry">
                            <span class="log-time">[${log.hora}]</span> ${log.msg}
                        </div>
                    `).reverse().join('')}
                </div>
                
                <p style="font-size: 0.6rem; text-align:center; margin-top: 20px; opacity: 0.4;">Elite Collective API v2.0 - Render Optimized</p>
            </div>
        </body>
        </html>
    `);
});

// --- LOGICA DE CHECKOUT ---
app.post('/checkout', (req, res) => {
    try {
        const { nome, whatsapp, type, items, details } = req.body;
        const horaAtual = new Date().toLocaleTimeString('pt-BR');

        let valorTotal = 0;
        let logMsg = "";

        if (type === 'agendamento') {
            const precos = { 'Corte Premium': 60, 'Barba Terapia': 45, 'Combo Elite': 95 };
            valorTotal = precos[details.service] || 0;
            stats.totalReservas++;
            logMsg = `Reserva: ${nome} (${details.service})`;
        } else {
            valorTotal = items.reduce((acc, item) => acc + (item.preco || 0), 0);
            stats.totalVendas++;
            logMsg = `Venda: ${nome} (${items.length} itens)`;
        }

        stats.receitaEstimada += valorTotal;
        
        // Adiciona ao Log visual
        stats.logs.push({ hora: horaAtual, msg: logMsg });
        if(stats.logs.length > 20) stats.logs.shift();

        // Geração do PIX (Payload Estático para teste)
        const chavePix = "dvignali01@gmail.com";
        const pixPayload = `00020126580014br.gov.bcb.pix0136${chavePix}520400005303986540${valorTotal.toFixed(2)}5802BR5916EliteCollective6009SaoPaulo62070503***6304ABCD`;

        res.status(200).json({
            sucesso: true,
            pix: pixPayload,
            valor: valorTotal,
            mensagem: "Processado pelo Elite Core"
        });

    } catch (error) {
        console.error("Erro no checkout:", error);
        res.status(500).json({ sucesso: false, erro: "Falha no motor da API" });
    }
});

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    -------------------------------------------
    ELITE COLLECTIVE - BACKEND INICIADO
    Porta: ${PORT}
    Status: Pronto para agendamentos
    -------------------------------------------
    `);
});
