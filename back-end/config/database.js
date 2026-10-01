const mysql = require("mysql2");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

// Criando um Pool de conexões em vez de uma conexão única
const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "doe_se",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testa a conexão ao iniciar
connection.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err.message);
    return;
  }
  console.log("✅ Conectado ao banco de dados MySQL com sucesso!");
  conn.release(); // Libera a conexão de teste de volta para o pool
});

module.exports = connection;