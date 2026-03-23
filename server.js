const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Array temporário na memória (limpa se o servidor reiniciar)
let ultimosPedidos = [];

// Rota de Teste: Acesse essa URL no navegador para ver se o site está vivo
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #d4af37;">Elite Collective API</h1>
            <p>Status: 🟢 Online e operante</p>
            <p>Pedidos processados nesta sessão: <strong>${ultimosPedidos.length}</strong></p>
        </div>
    `);
});

// Rota de Checkout
app.post('/checkout', (req, res) => {
    try {
        const { nome, whatsapp, type, items, details } = req.body;

        console.log(`--- NOVO PEDIDO RECEBIDO (${type.toUpperCase()}) ---`);
        console.log(`Cliente: ${nome} | WhatsApp: ${whatsapp}`);

        let valorTotal = 0;

        // Lógica de cálculo de valores
        if (type === 'compra' && items) {
            valorTotal = items.reduce((acc, item) => acc + (item.preco || 0), 0);
        } else if (type === 'agendamento' && details) {
            // Valores fixos baseados nos serviços do seu front-end
            const precos = {
                'Corte Premium': 60,
                'Barba Terapia': 45,
                'Combo Elite': 95
            };
            valorTotal = precos[details.service] || 0;
        }

        // Simulação de PIX Copia e Cola (BR Code estático para teste)
        // Chave: dvignali01@gmail.com
        const pixChave = "dvignali01@gmail.com";
        const pixPayload = `00020126580014br.gov.bcb.pix0136${pixChave}520400005303986540${valorTotal}.005802BR5916EliteCollective6009SaoPaulo62070503***6304ABCD`;

        // Guardamos na memória apenas para o log do servidor
        const novoPedido = {
            id: Date.now(),
            cliente: nome,
            tipo: type,
            total: valorTotal,
            data: new Date().toLocaleString('pt-BR')
        };
        ultimosPedidos.push(novoPedido);

        // Resposta para o Front-end
        res.json({
            sucesso: true,
            pix: pixPayload,
            valor: valorTotal,
            mensagem: "Pedido processado com sucesso!"
        });

    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ sucesso: false, erro: "Erro ao processar checkout" });
    }
});

// Porta dinâmica para o Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});
