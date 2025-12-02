const fs = require("fs");
const pdf = require("pdf-parse");

async function extrairTexto(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  return data.text;
}

function parsearQuestoes(questoesTexto, gabaritoTexto) {
  const linhasQuestoes = questoesTexto
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);
  const linhasGabarito = gabaritoTexto
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  // Mapear gabarito: ex: "01 A" -> {1: 1, 2: 2, ...}
  const gabaritoMap = {};
  linhasGabarito.forEach((linha) => {
    const match = linha.match(/^(\d+)\s+([A-D])$/);
    if (match) {
      const num = parseInt(match[1]);
      const letra = match[2];
      gabaritoMap[num] =
        letra === "A" ? 1 : letra === "B" ? 2 : letra === "C" ? 3 : 4;
    }
  });

  const questoes = [];
  let i = 0;
  let idAtual = 759; // Próximo ID após 758

  while (i < linhasQuestoes.length) {
    if (linhasQuestoes[i].startsWith("QUESTÃO")) {
      const match = linhasQuestoes[i].match(/QUESTÃO\s+(\d+)/);
      if (!match) {
        i++;
        continue;
      }
      const numQuestao = parseInt(match[1]);

      // Enunciado: linhas após até encontrar alternativas
      let enunciado = "";
      i++;
      while (
        i < linhasQuestoes.length &&
        !linhasQuestoes[i].match(/^[A-D]\)/)
      ) {
        enunciado += linhasQuestoes[i] + "\n";
        i++;
      }
      enunciado = enunciado.trim();
      if (!enunciado.endsWith(":")) enunciado += ":";

      // Alternativas: A), B), etc.
      const alternativas = [];
      for (let alt = 0; alt < 4; alt++) {
        if (i < linhasQuestoes.length && linhasQuestoes[i].match(/^[A-D]\)/)) {
          const texto = linhasQuestoes[i].replace(/^[A-D]\)\s*/, "");
          alternativas.push({ id: alt + 1, texto: texto });
          i++;
        }
      }

      // Resposta correta do gabarito
      const respostaCorreta = gabaritoMap[numQuestao] || 1; // Default se não encontrado

      questoes.push({
        id: idAtual++,
        cargo: "Agente Administrativo",
        nivel: "Médio",
        prova: "Prefeitura Municipal de Carmo do Rio Verde - GO", // Ajuste se necessário
        banca: "Instituto Verbena/UFG",
        enunciado: enunciado,
        alternativas: alternativas,
        resposta_correta: respostaCorreta,
      });
    } else {
      i++;
    }
  }

  return questoes;
}

async function main() {
  const questoesPdf = process.argv[2] || "questoes.pdf"; // Caminho do PDF de questões
  const gabaritoPdf = process.argv[3] || "gabarito.pdf"; // Caminho do PDF de gabarito

  try {
    const questoesTexto = await extrairTexto(questoesPdf);
    const gabaritoTexto = await extrairTexto(gabaritoPdf);

    const questoes = parsearQuestoes(questoesTexto, gabaritoTexto);

    // Ler o JSON existente e adicionar as novas questões
    const existingData = JSON.parse(
      fs.readFileSync("data/questoes.json", "utf8")
    );
    existingData.push(...questoes);

    // Salvar de volta
    fs.writeFileSync(
      "data/questoes.json",
      JSON.stringify(existingData, null, 2)
    );
    console.log(
      `Adicionadas ${questoes.length} questões. Total agora: ${existingData.length}`
    );
  } catch (error) {
    console.error("Erro:", error);
  }
}

main();
