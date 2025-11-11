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
  prova: "Ministério Público de Goiás - Comarca de Ceres",
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

31) Sobre a Rosa dos Ventos e os
pontos cardeais e colaterais, julgue
verdadeiras (V) ou falsas (F) as
proposições.
I - Os pontos colaterais são nornordeste (NNE), nor-noroeste (NNW),
sul-sudeste (SSE), sul-sudoeste
(SSW), lés-nordeste (ENE), léssudeste (ESE), oés-sudeste (WSE) e
oés-sudoeste (WSW).
II - Os pontos cardeais são Norte (N),
Sul (S), Leste (E) e Oeste (W).
III - Nordeste (NE), Sudeste (SE) não
são pontos colaterais.
IV - Noroeste (NW) e Sudoeste (SW)
são pontos colaterais.
A seqüência correta é:
a) F V F V.
b) F V V F.
c) V V F V.
d) F V F F.
e)VVVF.
32) Sobre as regiões do IBGE, marque
a alternativa correta:
a) Atualmente as regiões oficiais são
Centro-Oeste, Norte, Nordeste e
Sudeste.
b) A região Centro-Oeste possui dois
estados mais um distrito federal:
Distrito Federal, Goiás e Mato Grosso
do Sul.
c) A região Nordeste possui oito
estados: Alagoas, Bahia, Ceará,
Maranhão, Paraíba, Sergipe, Rio
Grande do Norte e Piauí.
d) O Norte é uma região composta por
sete estados: Acre, Amapá,
Amazonas, Pará, Rondônia, Roraima e
Tocantins.
e) O estado do Espírito Santo não faz
parte da região Sudeste, que abrange
Minas Gerais, Rio de Janeiro e São
Paulo.
33) A característica fundamental é que
ele não é mais somente um agricultor
ou um pecuarista: ele combina
atividades agropecuárias com outras
atividades não agrícolas dentro ou fora
de seu estabelecimento, tanto nos
ramos tradicionais urbano-industriais
como nas novas atividades que vêm
se desenvolvendo no meio rural, como
lazer, turismo, conservação da
natureza, moradia e prestação de
serviços pessoais.
Essa nova forma de organização
social do trabalho é denominada:
a) Terceirização.
b) Agroextrativismo coletivo.
c) Grilhagem...
d) Agronegócio.
e) Cooperativismo.
37) Marque a alternativa CORRETA:
a) O Windows 8 traz um recurso
denominado de Notas Autoadesivas,
que toma possível ao usuário
adicionar lembretes relativos às suas
tarefas diárias na área de trabalho.
Para ter acesso a esse recurso, o
usuário deverá fazer a busca por
"notas" no Menu Iniciar e selecionar a
opção correspondente.
b) Ao ser instalado, o Windows 8 cria
um repositório com diversos tipos de
drivers dos mais variados dispositivos,
por isso, após sua instalação, não é
permitido atualizar esses drivers, seja
de modo manual ou automático, uma
vez que esse procedimento poderá
provocar inconsistências no sistema
operacional.
c) A Internet é a maior rede de
computadores existente na atualidade,
sendo destinada, exclusivamente, a
estabelecer a conexão entre
computadores denominados de
servidores e clientes.
d) O programa Internet Explore da
Microsoft é um programa nativo no
MS-Windows 7. Em sua configuração
padrão possui o dispositivo de
pesquisa Google.
e) No Windows 7, para que sejam
exibidos, além do ícone e do nome, a
data de modificação, o tipo e o
tamanho dos arquivos, deve-se clicar
com o botão direito do mouse sobre a
área de exibição, selecionar a opção
Relatório - Exibir.
38) No Windows 7, um dos possíveis
acessos ao gerenciador de tarefas, por
meio do teclado, consiste em apertar
simultaneamente o conjunto de teclas:
a) Ctrl + Alt + End.
b) Alt + Shift.
c) Ctrl + Alt + Insert.
d) Shift + Esc.
e) Ctrl + Shift + Esc.
39) Acerca da organização e da
segurança da informação em meio
eletrônico, julgue os próximos itens e
escolha a opção correta:
a) Confidencialidade, um dos
princípios básicos da segurança da
informação, tem como característica
garantir que uma informação não seja
alterada durante o seu trânsito entre o
emissor e o destinatário.
b) Os worms são pouco ofensivos,
pois referem-se ao envio automático
de mensagens indesejadas de correio
eletrônico a um grande número de
destinatários, que não as solicitaram
ou que tiveram seus endereços
eletrônicos copiados de um sítio pirata.
c) Em um ambiente computacional, a
perda das informações por estragos
causados por vírus, invasões
indevidas ou intempéries pode ser
amenizada por meio da realização de
cópias de segurança (backup)
periódicas das informações, as quais
podem ser feitas da máquina do
usuário, de servidores e de todos os
demais dispositivos de
armazenamento, local ou remoto, de
dados.
d) Ao utilizar o meio eletrônico para
enviar mensagens sigilosas é
importante que o emissor faça uma
cópia para seu e-mail pessoal.
e) Trojans ou cavalos de troia são
programas capazes de multiplicar-se
mediante a infecção de outros
programas maiores. Eles não tem o
objetivo de controlar o sistema, porem
tendem a causar efeitos indesejados.
Já os worms causam efeitos altamente
destrutivos e irreparáveis. Ao contrario
dos trojans, os worms utilizam o e-mail
como principal canal de disseminação,
mas não possuem a capacidade de
produzir copias de si mesmos ou de
algumas de suas partes.
40) Considere as diferenças entre
software, hardware e sistemas
operacionais. Pode-se dizer que é um
sistema operacional:
a) Internet Explorer, Chrome, Mozilla
Firefox.
b) Documento de texto do Word.
c) Planilhas do Excel.
d) O Monitor que mostra as
informações na tela.
e) Windows - conjunto de programas.
41) Sobre a instituição Ministério
Público, é correto afirmar:
a) São princípios institucionais do
Ministério Público a unidade, a
divisibilidade e a independência
funcional.
b) O Ministério Público do Distrito
Federal e Territórios faz parte dos
Ministérios Públicos dos Estados.
c) A inamovibilidade, salvo por motivo
de interesse público, mediante decisão
do órgão colegiado competente do
Ministério Público, pelo voto da maioria
absoluta de seus membros,
assegurada ampla defesa, é garantia
do membro do Ministério Público.
d) É vedado ao membro do Ministério
Público exercer, ainda que em
disponibilidade, qualquer outra função
pública, sem qualquer exceção.
e) É função do Ministério Público
exercer a representação judicial e a
consultoria jurídica de entidades
públicas.
V - propor ao Poder Legislativo a
criação e a extinção de seus cargos e
de seus serviços auxiliares, bem como
a fixação e o reajustedos vencimentos
e vantagens dos seus membros e de
seus servidores.
As assertivas corretas são:
a) Apenas a I;
b) I. III. IV e V;
c) I, II. III. IV e V;
d) Apenas a II;
e) Apenas a III e IV.
43) De acordo com a Lei
Complementar Estadual n° 25, de 06
de julho de 1998, compete ao
Procurador-Geral de Justiça:
a) aprovar o Plano Estratégico
Institucional e os Planos Gerais de
Atuação, nos termos regimentais.
b) aprovar a proposta orçamentária
anual do Ministério Público, bem como
os projetos de criação, modificação e
extinção de cargos e serviços
auxiliares.
c) convocar reunião extraordinária,
mediante requerimento de 1/3 (um
terço) dos seus integrantes, na forma
do regimento interno.
d) eleger, dar posse e exercício ao
Corregedor-Geral do Ministério
Público.
e) encaminhar ao Poder Legislativo os
projetos de lei de iniciativa do
Ministério Público.
45) Sobre as promotorias de justiça,
regulamentas na Lei Complementar
Estadual n° 25, de 06 de julho de
1998, é INCORRETO afirmar:
a) As Promotorias de Justiça são
órgãos de administração do Ministério
Público com pelo menos 1 (um) cargo
de Promotor de Justiça e serviços
auxiliares necessários ao desempenho
das funções que lhes forem cometidas
na forma desta Lei.
b) As Promotorias de Justiça serão
integradas por Promotores de Justiça
encarregados de exercer as funções
institucionais do Ministério Público e
tomar as medidas judiciais e
extrajudiciais necessárias à
consecução do Plano Estratégico
Institucional e seus desdobramentos.
c) As Promotorias de Justiça poderão
ser especializadas, criminais, cíveis,
cumulativas ou gerais.
d) Cada Promotoria de Justiça deverá
manter os livros, pastas e arquivos
obrigatórios, sem necessidade de
manter o registro e controle dos
procedimentos e expedientes findos.
e) Compete às promotorias de Justiça
a elaboração dos Planos Operacionais
de Atuação alinhados ao Plano
Estratégico Institucional e ao Plano
Geral de Atuação.
46. São deveres do funcionário
público, segundo Estatuto dos
Servidores Civis do Estado de Goiás:
a) receber, a qualquer título ou
pretexto, auxílios ou contribuições de
pessoas físicas, entidades públicas ou
privadas.
b) participar de sociedade comercial,
na forma de lei.
c) residir na localidade onde for lotado
para exercer as atribuições inerentes
ao seu cargo, ou em localidade
vizinha, se disto não resultar
inconveniência para o serviço público.
d) guardar sigilo sobre os assuntos de
natureza confidencial, salvo nos casos
em que o superior ou chefe imediato
permitir.
e) obediência às ordens superiores,
inclusive as manifestamente ilegais.
48) Sobre as Promotorias de Justiça,
segundo a Lei Complementar Estadual
n° 25, de 06 de julho de 1998, assinale
a alternativa correta:
a) As Promotorias de Justiça são
órgãos de administração do Ministério
Público com no mínimo de 2 (dois)
cargos de Promotor de Justiça e
serviços auxiliares necessários ao
desempenho das funções que lhes
forem cometidas na forma desta Lei.
b) As Promotorias de Justiça serão
organizadas por ato do Chefe do
Poder Executivo Estadual, mediante
proposta aprovada por maioria
absoluta dos membros da Assembléia
Legislativa.
c) Consideram-se promotorias
especializadas, aquelas cujos cargos
que as integram têm suas funções
definidas pelo Procurador Geral de
Justiça e pelo Conselho Superior do
Ministério Público.
d) Os serviços auxiliares das
Promotorias de Justiça destinar-se-ão
a dar suporte administrativo
necessário ao seu funcionamento e ao
desempenho das funções dos
Promotores de Justiça e serão
instituídos e organizados por ato do
Procurador-Geral de Justiça, ficando
assegurado a cada Promotoria de
Justiça da Capital um cargo de
assessor.
e) Nas Comarcas com mais de 5
(cinco) Promotorias de Justiça será
escolhido Promotor de Justiça para
exercer as funções de Coordenador.
49) De acordo com a Lei
Complementar no 25, de 06 de julho
de 1998, são órgãos de execução e
auxiliares do Ministério Público,
respectivamente:
a) a Escola Superior do Ministério
Público e o Conselho Superior do
Ministério Público
b) o Colégio de Procuradores de
Justiça e os Centros de Apoio
Operacional;
c) os Centros de Apoio Operacional e
o Conselho Superior do Ministério
Público;
d) os Procuradores de Justiça e os
Promotores de Justiça;
e) a Escola Superior do Ministério
Público e os Estagiários.
50) Conforme previsão da Lei Estadual
n.14.810/2004, que institui o Plano de
Carreira dos Servidores do Ministério
Público do Estado de Goiás, na
avaliação dos servidores são
apreciados os seguintes fatores:
a) profissional,
antigüidade;
b) antigüidade, profissional e
desempenho;
c) assiduidade, qualidade e
produtividade;
d) conhecimento do trabalho,
comunicação e relacionamento;
e) profissional, desempenho e
capacidade de realização.

`;

// ============ GABARITO ============
// Formato: número letra (ex: 15 A)
// Ou: número espaço número (ex: 15 1)
const GABARITO_TEXTO = `

31) A 32) D 33) D
37) A 38) E 39) C 40) E 
41) C 42) B 43) E
45) D 46) C
48) D 49) B 50) B

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

    // Nova questão (começa com número - ou número) )
    const matchQuestao = linha.match(/^(\d+)\s*[-\)]\s*(.+)/);
    if (matchQuestao) {
      if (questaoAtual) {
        questoes.push(questaoAtual);
      }
      questaoAtual = {
        numero: parseInt(matchQuestao[1]),
        enunciado: matchQuestao[2],
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

    // Continuação do enunciado (ou texto após as 5 alternativas)
    if (questaoAtual && questaoAtual.alternativas.length === 0) {
      questaoAtual.enunciado += "\n" + linha;
    }
    // Se já tiver 5 alternativas, ignora linhas extras (evita erro de mais de 5)
  }

  if (questaoAtual) {
    questoes.push(questaoAtual);
  }

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

    // Formato: número letra (ex: 15 A)
    const match1 = linha.match(/^(\d+)\s+([A-E])$/i);
    if (match1) {
      const numero = parseInt(match1[1]);
      const letra = match1[2].toUpperCase();
      gabarito[numero] = letra.charCodeAt(0) - 64; // A=1, B=2, etc
      continue;
    }

    // Formato: número número (ex: 15 1)
    const match2 = linha.match(/^(\d+)\s+(\d+)$/);
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

    if (questao.alternativas.length !== 5) {
      console.log(
        `⚠ Questão ${questao.numero}: não tem exatamente 5 alternativas (${questao.alternativas.length})`
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
