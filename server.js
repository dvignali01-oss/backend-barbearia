const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let database = {
    agendamentos: [],
    pedidos: []
};

// 📌 Criar Agendamento ou Pedido
app.post("/checkout", (req, res) => {
    const data = req.body;
    const id = Date.now();
    
    const novoRegistro = {
        id,
        ...data,
        status: "Pendente",
        pixKey: "dvignali01@gmail.com", // Sua chave real
        timestamp: new Date()
    };

    if (data.type === 'agendamento') {
        database.agendamentos.push(novoRegistro);
    } else {
        database.pedidos.push(novoRegistro);
    }

    res.json({ sucesso: true, id, pix: novoRegistro.pixKey });
});

app.get("/meus-dados/:whatsapp", (req, res) => {
    const whatsapp = req.params.whatsapp;
    const agendados = database.agendamentos.filter(a => a.whatsapp === whatsapp);
    const compras = database.pedidos.filter(p => p.whatsapp === whatsapp);
    res.json({ agendados, compras });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Elite API Online"));