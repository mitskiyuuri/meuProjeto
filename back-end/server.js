const express = require("express");
const cors = require("cors"); // Importante: adicione o cors!
const path = require("path");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
require("./config/database");

const app = express();

// 1. Middlewares principais
app.use(cors()); // Libera o acesso para o front-end conversar com o back-end
app.use(express.json()); // Permite receber JSON no body da requisição
app.use(express.urlencoded({ extended: true }));

// 2. Pasta estática para servir fotos enviadas (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. Importação das Rotas
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const solicitacaoRoutes = require("./routes/solicitacaoRoutes");
const comentarioRoutes = require("./routes/comentarioRoutes");

// 4. Registro das Rotas na Aplicação
app.use("/usuarios", userRoutes);
app.use("/itens", itemRoutes);
app.use("/solicitacoes", solicitacaoRoutes);
app.use("/comentarios", comentarioRoutes);

// 5. Rota de teste
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// 6. Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado e rodando na porta ${PORT}!`);
});
