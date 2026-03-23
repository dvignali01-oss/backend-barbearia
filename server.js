const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Banco temporário (Dados resetam ao reiniciar o Render)
let agendamentos = [];

// 📌 Rota de Saúde/Status
app.get("/", (req, res) => {
    res.send("<h1>ELITE BARBER API 🔥</h1><p>Status: Online</p>");
});

// 📌 Listar Produtos
app.get("/produtos", (req, res) => {
    res.json([
        { id: 101, nome: "Óleo Premium Wood", preco: 45, img: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=200" },
        { id: 102, nome: "Pomada Matte Clay", preco: 38, img: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200" },
        { id: 103, nome: "Shampoo Charcoal", preco: 52, img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200" }
    ]);
});

// 📌 Criar Agendamento com Lógica de Pagamento
app.post("/agendar", (req, res) => {
    const { nome, whatsapp, barber, service, price, date, time, paymentMethod } = req.body;

    if (!barber || !date || !time || !whatsapp) {
        return res.status(400).json({ erro: "Dados obrigatórios faltando." });
    }

    // Validação de Conflito
    const conflito = agendamentos.find(a => a.barber === barber && a.date === date && a.time === time);
    if (conflito) {
        return res.status(400).json({ erro: "Este horário já foi reservado com este barbeiro." });
    }

    const novoAgendamento = {
        id: Date.now(),
        nome,
        whatsapp,
        barber,
        service,
        price,
        date,
        time,
        statusPagamento: paymentMethod === 'pix' ? "Pendente (PIX)" : "A pagar no local",
        pixCopiaECola: paymentMethod === 'pix' ? `00020126330014BR.GOV.BCB.PIX0114${whatsapp}5204000053039865405${price}.00` : null,
        createdAt: new Date()
    };

    agendamentos.push(novoAgendamento);
    res.json({ sucesso: true, agendamento: novoAgendamento });
});

// 📌 Listar Todos Agendamentos
app.get("/agendamentos", (req, res) => {
    const ordenados = agendamentos.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));
    res.json(ordenados);
});

// 📌 Cancelar Agendamento
app.delete("/agendar/:id", (req, res) => {
    const id = parseInt(req.params.id);
    agendamentos = agendamentos.filter(a => a.id !== id);
    res.json({ sucesso: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));