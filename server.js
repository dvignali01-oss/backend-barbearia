const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Banco temporário
let agendamentos = [];

// 📌 Criar agendamento
app.post("/agendar", (req, res) => {
    const { nome, barber, service, price, date, time } = req.body;

    // Validação
    if (!barber || !service || !date || !time) {
        return res.status(400).json({ erro: "Dados incompletos" });
    }

    // Verifica conflito (mesmo barbeiro, data e hora)
    const conflito = agendamentos.find(a =>
        a.barber === barber &&
        a.date === date &&
        a.time === time
    );

    if (conflito) {
        return res.status(400).json({ erro: "Horário já ocupado para esse barbeiro" });
    }

    const novo = {
        id: Date.now(),
        nome: nome || "Cliente",
        barber,
        service,
        price,
        date,
        time,
        createdAt: new Date()
    };

    agendamentos.push(novo);

    res.json({
        sucesso: true,
        agendamento: novo
    });
});

// 📌 Listar agendamentos
app.get("/agendamentos", (req, res) => {
    const ordenados = agendamentos.sort(
        (a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
    );

    res.json(ordenados);
});

// 📌 Cancelar
app.delete("/agendar/:id", (req, res) => {
    const id = parseInt(req.params.id);

    agendamentos = agendamentos.filter(a => a.id !== id);

    res.json({ sucesso: true });
});

// 📌 Status API
app.get("/", (req, res) => {
    res.send("API BARBEARIA ONLINE 🔥");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando...");
});