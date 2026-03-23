const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Banco temporário (Reinicia ao dar deploy/sleep no Render)
let agendamentos = [];

// 📌 Status API
app.get("/", (req, res) => {
    res.send("API BARBEARIA ONLINE 🔥 - Diego Ferreira");
});

// 📌 Criar agendamento
app.post("/agendar", (req, res) => {
    const { nome, whatsapp, barber, service, price, date, time } = req.body;

    if (!barber || !service || !date || !time || !whatsapp) {
        return res.status(400).json({ erro: "Dados incompletos" });
    }

    // Verifica conflito
    const conflito = agendamentos.find(a =>
        a.barber === barber && a.date === date && a.time === time
    );

    if (conflito) {
        return res.status(400).json({ erro: "Horário já ocupado para este barbeiro" });
    }

    const novo = {
        id: Date.now(),
        nome,
        whatsapp,
        barber,
        service,
        price,
        date,
        time,
        createdAt: new Date()
    };

    agendamentos.push(novo);
    res.json({ sucesso: true, agendamento: novo });
});

// 📌 Listar agendamentos
app.get("/agendamentos", (req, res) => {
    const ordenados = agendamentos.sort(
        (a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
    );
    res.json(ordenados);
});

// 📌 Listar Produtos (Simulado)
app.get("/produtos", (req, res) => {
    res.json([
        { id: 1, nome: "Óleo de Barba Premium", preco: 45, img: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=200" },
        { id: 2, nome: "Pomada Modeladora", preco: 35, img: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200" }
    ]);
});

// 📌 Cancelar
app.delete("/agendar/:id", (req, res) => {
    const id = parseInt(req.params.id);
    agendamentos = agendamentos.filter(a => a.id !== id);
    res.json({ sucesso: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));