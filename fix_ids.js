const fs = require("fs");

// IDs a serem removidos
const idsParaRemover = [503, 507, 508, 510, 511, 512, 513, 523, 524, 525, 527];

console.log("Removendo questões e corrigindo IDs...");

// Lê o arquivo JSON
let data = JSON.parse(fs.readFileSync("data/questoes.json", "utf8"));

console.log(`Total de questões antes: ${data.length}`);

// Remove as questões com os IDs especificados
data = data.filter((questao) => !idsParaRemover.includes(questao.id));

console.log(`Questões removidas: ${idsParaRemover.length}`);
console.log(`Total de questões após remoção: ${data.length}`);

// Reordena os IDs sequencialmente
data.forEach((questao, index) => {
  questao.id = index + 1;
});

// Salva o arquivo com IDs corrigidos
fs.writeFileSync("data/questoes.json", JSON.stringify(data, null, 2), "utf8");

console.log(`✓ IDs corrigidos com sucesso!`);
console.log(`✓ IDs agora vão de 1 a ${data.length}`);
