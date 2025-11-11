const fs = require("fs");

// Ler o arquivo de questões
const questoes = JSON.parse(fs.readFileSync("./data/questoes.json", "utf8"));

console.log("\n=== FORMATANDO QUESTÕES ===");
console.log("Total de questões:", questoes.length);

let questoesFormatadas = 0;

questoes.forEach((questao) => {
  let enunciadoOriginal = questao.enunciado;
  let enunciado = questao.enunciado;
  let modificado = false;

  // Padrão 1: Adicionar \n\n antes de sequências I, II, III, IV (se não tiver quebra antes)
  // Detecta quando tem I - , II - , III - , IV - no início de linha ou após texto
  enunciado = enunciado.replace(/([^\n])\s*(I\s*[-–—])/g, "$1\n\n$2");

  // Padrão 2: Adicionar \n entre itens I, II, III, IV consecutivos
  enunciado = enunciado.replace(/(I\s*[-–—][^\n]+?)(\s*II\s*[-–—])/g, "$1\n$2");
  enunciado = enunciado.replace(
    /(II\s*[-–—][^\n]+?)(\s*III\s*[-–—])/g,
    "$1\n$2"
  );
  enunciado = enunciado.replace(
    /(III\s*[-–—][^\n]+?)(\s*IV\s*[-–—])/g,
    "$1\n$2"
  );
  enunciado = enunciado.replace(/(IV\s*[-–—][^\n]+?)(\s*V\s*[-–—])/g, "$1\n$2");

  // Padrão 3: Adicionar \n\n antes de textos conclusivos comuns
  const textosFinais = [
    "A sequência correta é:",
    "A seqüência correta é:",
    "Está correto apenas",
    "Estão corretas:",
    "Estão corretos:",
    "Quais estão corretas?",
    "Quais estão corretos?",
    "Assinale a alternativa correta",
    "Marque a alternativa correta",
    "É correto afirmar que:",
    "Pode-se afirmar que:",
    "Analise as afirmações",
  ];

  textosFinais.forEach((texto) => {
    // Adiciona \n\n antes do texto se não houver quebras suficientes
    const regex = new RegExp(
      `([^\\n]|\\n(?!\\n))\\s*(${texto.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )})`,
      "gi"
    );
    enunciado = enunciado.replace(regex, "$1\n\n$2");
  });

  // Padrão 4: Adicionar \n\n antes de textos citados (indicadores comuns)
  const indicadoresTexto = [
    "Texto adaptado:",
    "Texto retirado",
    "Trecho retirado",
    "(Adaptado)",
    "Fonte:",
    "Disponível em:",
  ];

  indicadoresTexto.forEach((indicador) => {
    const regex = new RegExp(
      `([^\\n]|\\n(?!\\n))\\s*(${indicador.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )})`,
      "gi"
    );
    enunciado = enunciado.replace(regex, "$1\n\n$2");
  });

  // Padrão 5: Limpar múltiplas quebras de linha consecutivas (mais de 2)
  enunciado = enunciado.replace(/\n{3,}/g, "\n\n");

  // Padrão 6: Remover espaços no início e fim
  enunciado = enunciado.trim();

  // Verificar se houve mudança
  if (enunciado !== enunciadoOriginal) {
    questao.enunciado = enunciado;
    questoesFormatadas++;
  }
});

// Salvar arquivo
fs.writeFileSync(
  "./data/questoes.json",
  JSON.stringify(questoes, null, 2),
  "utf8"
);

console.log("\n=== CONCLUÍDO ===");
console.log(`${questoesFormatadas} questões foram reformatadas`);
console.log("Arquivo salvo com sucesso!");
console.log("\n");
