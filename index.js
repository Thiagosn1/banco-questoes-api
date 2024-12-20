const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const QUESTOES_JSON_PATH =
  process.env.QUESTOES_JSON_PATH || path.join(DATA_DIR, "questoes.json");
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "questoes.db");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

function atualizarQuestoesJSON() {
  try {
    const questoes = JSON.parse(fs.readFileSync(QUESTOES_JSON_PATH, "utf8"));

    const questoesReindexadas = questoes.map((questao, index) => ({
      ...questao,
      id: (index + 1).toString(),
    }));

    fs.writeFileSync(
      QUESTOES_JSON_PATH,
      JSON.stringify(questoesReindexadas, null, 2)
    );

    console.log("Questões reindexadas com sucesso");
    return questoesReindexadas;
  } catch (error) {
    console.error("Erro ao atualizar questões:", error);
    return [];
  }
}

// Função para sincronizar questões
function syncQuestoes(db, novasQuestoes) {
  db.all("SELECT COUNT(*) as total FROM questoes", [], (err, result) => {
    if (err) {
      console.error("Erro ao contar questões no banco:", err);
      return;
    }

    const questoesNoBanco = result[0].total;
    console.log("=== Status da Sincronização ===");
    console.log(`Questões no banco antes da sincronização: ${questoesNoBanco}`);
    console.log(`Questões no JSON para sincronizar: ${novasQuestoes.length}`);
    console.log("============================");

    db.run("DELETE FROM questoes", [], (err) => {
      if (err) {
        console.error("Erro ao limpar tabela:", err);
        return;
      }

      const stmt = db.prepare(`
        INSERT INTO questoes (cargo, nivel, prova, banca, enunciado, alternativas, resposta_correta)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      novasQuestoes.forEach((questao, index) => {
        stmt.run(
          questao.cargo,
          questao.nivel,
          questao.prova,
          questao.banca,
          questao.enunciado,
          JSON.stringify(questao.alternativas),
          questao.resposta_correta,
          (err) => {
            if (err)
              console.error(`Erro ao inserir questão ${index + 1}:`, err);
          }
        );
      });

      stmt.finalize(() => {
        db.get("SELECT COUNT(*) as count FROM questoes", [], (err, row) => {
          if (err) {
            console.error("Erro ao contar questões após sincronização:", err);
            return;
          }
          console.log("=== Resultado da Sincronização ===");
          console.log(
            `Total de questões sincronizadas: ${row ? row.count : 0}`
          );
          console.log("================================");
        });
      });
    });
  });
}

let questoesIniciais = atualizarQuestoesJSON();
console.log("=== Carregamento Inicial ===");
console.log(`Encontradas ${questoesIniciais.length} questões no arquivo JSON`);
console.log("==========================");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
    return;
  }

  console.log("Conectado ao banco SQLite");

  db.run(
    `CREATE TABLE IF NOT EXISTS questoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cargo TEXT,
      nivel TEXT,
      prova TEXT, 
      banca TEXT,
      enunciado TEXT,
      alternativas TEXT,
      resposta_correta INTEGER
    )`,
    (err) => {
      if (err) {
        console.error("Erro ao criar tabela:", err);
        return;
      }

      syncQuestoes(db, questoesIniciais);

      fs.watch(QUESTOES_JSON_PATH, (eventType) => {
        if (eventType === "change") {
          console.log("\n=== Atualização Detectada ===");
          console.log("Arquivo questoes.json modificado, atualizando banco...");
          console.log("===========================");
          const questoesAtualizadas = atualizarQuestoesJSON();
          syncQuestoes(db, questoesAtualizadas);
        }
      });
    }
  );
});

app.get("/", (req, res) => {
  res.json({
    message: "API de Questões de Concurso",
    endpoints: {
      "GET /api/questoes": "Lista todas as questões",
      "GET /api/questoes/:id": "Retorna uma questão específica",
      "POST /api/questoes": "Adiciona uma nova questão",
      "GET /api/status": "Verifica o status da API",
      "GET /api/ping": "Verifica se a API está ativa",
    },
    status: "online",
  });
});

app.get("/api/status", (req, res) => {
  db.get("SELECT COUNT(*) as total FROM questoes", [], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro ao verificar status do banco" });
    }
    res.json({
      status: "online",
      timestamp: new Date().toISOString(),
      database: "connected",
      totalQuestoes: result.total,
      version: "1.0.0",
    });
  });
});

app.get("/api/ping", (req, res) => {
  res.json({ status: "API está ativa", timestamp: new Date().toISOString() });
});

app.get("/api/questoes", (req, res) => {
  console.log("Buscando todas as questões...");
  db.all("SELECT * FROM questoes", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar questões:", err);
      return res.status(500).json({ error: "Erro ao buscar questões" });
    }

    const questoes = rows.map((row) => ({
      ...row,
      alternativas: JSON.parse(row.alternativas),
    }));

    console.log(`Retornando ${questoes.length} questões`);
    res.json(questoes);
  });
});

app.get("/api/questoes/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Buscando questão ID: ${id}`);

  db.get("SELECT * FROM questoes WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Erro ao buscar questão:", err);
      return res.status(500).json({ error: "Erro ao buscar questão" });
    }

    if (!row) {
      console.log(`Questão ID ${id} não encontrada`);
      return res.status(404).json({ error: "Questão não encontrada" });
    }

    row.alternativas = JSON.parse(row.alternativas);
    console.log(`Questão ID ${id} encontrada e retornada`);
    res.json(row);
  });
});

app.post("/api/questoes", (req, res) => {
  const {
    cargo,
    nivel,
    prova,
    banca,
    enunciado,
    alternativas,
    resposta_correta,
  } = req.body;

  if (
    !cargo ||
    !nivel ||
    !prova ||
    !banca ||
    !enunciado ||
    !alternativas ||
    !resposta_correta
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  console.log("Adicionando nova questão...");
  db.run(
    "INSERT INTO questoes (cargo, nivel, prova, banca, enunciado, alternativas, resposta_correta) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      cargo,
      nivel,
      prova,
      banca,
      enunciado,
      JSON.stringify(alternativas),
      resposta_correta,
    ],
    function (err) {
      if (err) {
        console.error("Erro ao inserir questão:", err);
        return res.status(500).json({ error: "Erro ao inserir questão" });
      }

      console.log(`Nova questão adicionada com ID: ${this.lastID}`);
      res.status(201).json({
        id: this.lastID,
        cargo,
        nivel,
        prova,
        enunciado,
        alternativas,
        resposta_correta,
      });
    }
  );
});

app.use((err, req, res, next) => {
  console.error("Erro na aplicação:", err.stack);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: err.message,
  });
});

app.use((req, res) => {
  console.log(`Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Rota não encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promessa não tratada:", reason);
});
