const fs = require("fs");

// INSTRUÇÕES:
// 1. Configure os dados da prova abaixo
// 2. Cole as questões no formato especificado
// 3. Cole o gabarito
// 4. Execute: node adicionar_questoes_lote.js

// ============ CONFIGURAÇÃO DA PROVA ============
const CONFIG = {
  cargo: "Secretário Auxiliar",
  nivel: "Fundamental",
  prova: "Ministério Público de Goiás - Comarca de Jataí",
  banca: "Não informada",
};

// ============ QUESTÕES ============
// Formato: Cada questão começa com o número seguido de hífen
// Exemplo:
// 15 - Enunciado da questão?
// a) Alternativa 1
// b) Alternativa 2
// ...

const QUESTOES_TEXTO = `



`;

// ============ GABARITO ============
// Formato: número letra (ex: 15 A)
// Ou: número espaço número (ex: 15 1)
const GABARITO_TEXTO = `



`;

// ============ PROCESSAMENTO ============

function parseQuestoes(texto) {
  const questoes = [];
  const linhas = texto.trim().split("\n");

  let questaoAtual = null;
  let alternativaId = 1;

  for (let linha of linhas) {
    linha = linha.trim();
    if (!linha) continue;

    // Nova questão com enunciado na mesma linha: "01)", "01 -", "Questão 01 - Texto"
    const matchQuestaoComTexto = linha.match(
      /^(?:Quest[aã]o\s+)?(\d+)\s*[-\)]\s*(.+)/i
    );
    if (matchQuestaoComTexto) {
      if (questaoAtual) {
        questoes.push(questaoAtual);
      }
      questaoAtual = {
        numero: parseInt(matchQuestaoComTexto[1]),
        enunciado: matchQuestaoComTexto[2],
        alternativas: [],
      };
      alternativaId = 1;
      continue;
    }

    // Nova questão sozinha na linha: "Questão 01" ou "Questao 01"
    const matchQuestaoSozinha = linha.match(/^Quest[aã]o\s+(\d+)$/i);
    if (matchQuestaoSozinha) {
      if (questaoAtual) {
        questoes.push(questaoAtual);
      }
      questaoAtual = {
        numero: parseInt(matchQuestaoSozinha[1]),
        enunciado: "",
        alternativas: [],
      };
      alternativaId = 1;
      continue;
    }

    // Alternativa (começa com a), b), etc) - só aceita se ainda não tiver 5
    const matchAlternativa = linha.match(/^[a-e]\)\s*(.+)/i);
    if (
      matchAlternativa &&
      questaoAtual &&
      questaoAtual.alternativas.length < 5
    ) {
      questaoAtual.alternativas.push({
        id: alternativaId++,
        texto: matchAlternativa[1],
      });
      continue;
    }

    // Continuação do texto
    if (questaoAtual) {
      if (questaoAtual.alternativas.length === 0) {
        // Continuação do enunciado
        // Verifica se a linha é um item especial (I, II, III, IV, V com hífen ou parêntese, ou parêntese de lista)
        const isItemEspecial =
          /^(I|II|III|IV|V)\s*[\)\-–—]/.test(linha) ||
          /^\s*\(\s*\)\s/.test(linha);

        if (questaoAtual.enunciado === "") {
          questaoAtual.enunciado = linha;
        } else if (isItemEspecial) {
          // Itens especiais: adiciona quebra de linha
          questaoAtual.enunciado += "\n" + linha;
        } else {
          // Texto normal: junta com espaço
          questaoAtual.enunciado += " " + linha;
        }
      } else if (questaoAtual.alternativas.length < 5) {
        // Continuação da última alternativa
        const ultimaAlternativa =
          questaoAtual.alternativas[questaoAtual.alternativas.length - 1];
        ultimaAlternativa.texto += " " + linha;
      }
      // Se já tiver 5 alternativas completas, ignora linhas extras
    }
  }

  if (questaoAtual) {
    questoes.push(questaoAtual);
  }

  // Formatar enunciados com itens numerados romanos e parênteses vazios
  questoes.forEach((questao) => {
    if (questao.enunciado) {
      // Adiciona \n\n antes do primeiro item (I - ou I))
      questao.enunciado = questao.enunciado.replace(
        /(\s|^)(I\s*[\)\-–—])/g,
        "\n\n$2"
      );
      // Adiciona \n antes dos demais itens (II, III, IV, V com - ou ))
      questao.enunciado = questao.enunciado.replace(
        /(\s|^)((?:II|III|IV|V)\s*[\)\-–—])/g,
        "\n$2"
      );

      // Adiciona \n\n após o último item romano se houver texto que não seja item
      // Detecta padrão: linha com item romano seguida de linha que não é item romano
      questao.enunciado = questao.enunciado.replace(
        /\n((?!I{1,3}V?|I?V)\S)/g,
        function (match, nextChar, offset, string) {
          // Verifica se a linha anterior termina com um item romano
          const beforeText = string.substring(0, offset);
          const lastLine = beforeText.split("\n").pop();
          if (/^(I|II|III|IV|V)\s*[\)\-–—]/.test(lastLine)) {
            return "\n\n" + nextChar;
          }
          return match;
        }
      );

      // Formatar parênteses vazios () que iniciam itens de lista
      // Procura por padrões como "( ) texto" no início de linha ou após quebra
      const temParentesesLista =
        questao.enunciado.match(/(?:^|\n)\s*\(\s*\)\s/);
      if (temParentesesLista) {
        // Adiciona \n\n antes do primeiro () de lista e \n antes dos demais
        let primeiroEncontrado = false;
        questao.enunciado = questao.enunciado.replace(
          /(^|\n)(\s*)\(\s*\)\s/g,
          (match, inicio, espacos) => {
            if (!primeiroEncontrado) {
              primeiroEncontrado = true;
              return inicio + "\n() ";
            }
            return inicio + "() ";
          }
        );
      }

      // Remove múltiplas quebras de linha seguidas (mais de 2)
      questao.enunciado = questao.enunciado.replace(/\n{3,}/g, "\n\n");
      // Remove espaços em branco no início
      questao.enunciado = questao.enunciado.trim();
    }
  });

  return questoes;
}

function parseGabarito(texto) {
  const gabarito = {};
  const linhas = texto.trim().split("\n");

  for (let linha of linhas) {
    linha = linha.trim();
    if (!linha) continue;

    // Formato múltiplo na mesma linha: 1) B 2) C 3) D
    const matchMultiplo = linha.matchAll(/(\d+)\)\s*([A-E])/gi);
    let encontrouMultiplo = false;
    for (let match of matchMultiplo) {
      const numero = parseInt(match[1]);
      const letra = match[2].toUpperCase();
      gabarito[numero] = letra.charCodeAt(0) - 64; // A=1, B=2, etc
      encontrouMultiplo = true;
    }
    if (encontrouMultiplo) continue;

    // Formato: número letra (ex: "15 A", "15 - A", "15- A", "15-A")
    const match1 = linha.match(/^(\d+)\s*-?\s*([A-E])$/i);
    if (match1) {
      const numero = parseInt(match1[1]);
      const letra = match1[2].toUpperCase();
      gabarito[numero] = letra.charCodeAt(0) - 64; // A=1, B=2, etc
      continue;
    }

    // Formato: número número (ex: "15 1", "15 - 1")
    const match2 = linha.match(/^(\d+)\s*-?\s*(\d+)$/);
    if (match2) {
      gabarito[parseInt(match2[1])] = parseInt(match2[2]);
    }
  }

  return gabarito;
}

function adicionarQuestoes() {
  // Ler arquivo atual
  const questoes = JSON.parse(fs.readFileSync("./data/questoes.json", "utf8"));
  let proximoId = Math.max(...questoes.map((q) => q.id)) + 1;

  console.log("\n=== PROCESSANDO QUESTÕES ===");
  console.log("Total atual:", questoes.length);
  console.log("Próximo ID:", proximoId);

  // Parse das questões e gabarito
  const novasQuestoes = parseQuestoes(QUESTOES_TEXTO);
  const gabarito = parseGabarito(GABARITO_TEXTO);

  if (novasQuestoes.length === 0) {
    console.log("\n⚠ Nenhuma questão encontrada no texto!");
    console.log("Verifique o formato das questões.");
    return;
  }

  console.log("Questões encontradas:", novasQuestoes.length);
  console.log("Respostas no gabarito:", Object.keys(gabarito).length);

  // Adicionar questões
  let adicionadas = 0;
  for (let questao of novasQuestoes) {
    const respostaCorreta = gabarito[questao.numero];

    if (!respostaCorreta) {
      console.log(`⚠ Questão ${questao.numero}: gabarito não encontrado!`);
      continue;
    }

    if (questao.alternativas.length < 4 || questao.alternativas.length > 5) {
      console.log(
        `⚠ Questão ${questao.numero}: deve ter 4 ou 5 alternativas (tem ${questao.alternativas.length})`
      );
      continue;
    }

    const questaoFormatada = {
      id: proximoId,
      cargo: CONFIG.cargo,
      nivel: CONFIG.nivel,
      prova: CONFIG.prova,
      banca: CONFIG.banca,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas,
      resposta_correta: respostaCorreta,
    };

    questoes.push(questaoFormatada);
    console.log(
      `✓ Questão ${questao.numero} → ID ${proximoId} (Resposta: ${respostaCorreta})`
    );
    proximoId++;
    adicionadas++;
  }

  // Salvar arquivo
  if (adicionadas > 0) {
    fs.writeFileSync(
      "./data/questoes.json",
      JSON.stringify(questoes, null, 2),
      "utf8"
    );
    console.log("\n=== CONCLUÍDO ===");
    console.log(`${adicionadas} questões adicionadas com sucesso!`);
    console.log("Total agora:", questoes.length);
  } else {
    console.log("\n⚠ Nenhuma questão foi adicionada.");
  }
}

// Executar
if (QUESTOES_TEXTO.trim() === "" || GABARITO_TEXTO.trim() === "") {
  console.log("\n⚠ ATENÇÃO!");
  console.log(
    "Você precisa preencher QUESTOES_TEXTO e GABARITO_TEXTO no arquivo."
  );
  console.log("Edite o arquivo adicionar_questoes_lote.js e cole o conteúdo.");
} else {
  adicionarQuestoes();
}
