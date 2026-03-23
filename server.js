const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Banco de dados em memória (limpa se o Render hibernar)
let atendimentos = [];

// Rota de Health Check
app.get('/', (req, res) => {
    res.send('Elite Blackcut API Running 🚀');
});

// Rota Principal de Checkout
app.post('/checkout', (req, res) => {
    const { membro, whatsapp, tipo, detalhes } = req.body;

    console.log(`--- NOVO PEDIDO: ${tipo.toUpperCase()} ---`);
    console.log(`Cliente: ${membro} (${whatsapp})`);
    console.log(`Detalhes:`, detalhes);

    // Aqui você integraria com e-mail ou WhatsApp API futuramente
    atendimentos.push({ data: new Date(), ...req.body });

    res.status(200).json({
        sucesso: true,
        mensagem: "Pedido processado com sucesso!",
        protocolo: Math.floor(Math.random() * 900000)
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
