
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let agendamentos = [];

app.post("/agendar", (req, res) => {
    const { nome, servico, data, hora } = req.body;

    const existe = agendamentos.find(a => a.data === data && a.hora === hora);

    if (existe) {
        return res.status(400).json({ erro: "Horário já ocupado" });
    }

    const novo = {
        id: Date.now(),
        nome,
        servico,
        data,
        hora
    };

    agendamentos.push(novo);
    res.json(novo);
});

app.get("/agendamentos", (req, res) => {
    res.json(agendamentos);
});

app.delete("/agendar/:id", (req, res) => {
    const id = parseInt(req.params.id);
    agendamentos = agendamentos.filter(a => a.id !== id);
    res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("rodando");
});