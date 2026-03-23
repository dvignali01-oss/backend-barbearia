const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let agendamentos = [];

// 📌 Rota Principal
app.get("/", (req, res) => {
    res.send("<h1>ELITE COLLECTIVE API 💈</h1>");
});

// 📌 Criar Agendamento
app.post("/agendar", (req, res) => {
    const { nome, whatsapp, barber, service, price, date, time, plan } = req.body;

    const conflito = agendamentos.find(a => a.barber === barber && a.date === date && a.time === time);
    if (conflito) return res.status(400).json({ erro: "Horário já ocupado" });

    const novo = {
        id: Date.now(),
        nome, whatsapp, barber, service, price, date, time,
        status: plan ? "Membro Premium" : "Aguardando",
        createdAt: new Date()
    };

    agendamentos.push(novo);
    res.json({ sucesso: true, agendamento: novo });
});

// 📌 Listar
app.get("/agendamentos", (req, res) => res.json(agendamentos));

// 📌 Cancelar
app.delete("/agendar/:id", (req, res) => {
    agendamentos = agendamentos.filter(a => a.id !== parseInt(req.params.id));
    res.json({ sucesso: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));