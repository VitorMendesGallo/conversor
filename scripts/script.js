const botaoConverter = document.getElementById("botao-converter");
const iconeBotaoConverter = document.getElementById("icone-botao-converter");
const moedaSelecionada = document.getElementById("moeda");
const valorInserido = document.getElementById("valor-selecionado");
const resultadoSaida = document.getElementById("resultado");
const botaoLimpar = document.getElementById("botao-limpar");
const ulCotacoes = document.getElementById("lista-cotacoes");
const dadosDaConsulta = document.getElementById("ultima-consulta");

const moedas = [
  { nome: "Dólar", codigo: "USD", value: "dolar" },
  { nome: "Euro", codigo: "EUR", value: "euro" },
  { nome: "Libra", codigo: "GBP", value: "libra" },
  { nome: "Bitcoin", codigo: "BTC", value: "bitcoin" },
  { nome: "Peso Argentino", codigo: "ARS", value: "peso_argentino" },
  { nome: "Iene", codigo: "JPY", value: "iene" },
  { nome: "Franco Suíço", codigo: "CHF", value: "franco_suico" }, 
  { nome: "Dólar Canadense", codigo: "CAD", value: "dolar_canadense" },
  { nome: "Dólar Australiano", codigo: "AUD", value: "dolar_australiano" },
  { nome: "Yuan Chinês", codigo: "CNY", value: "yuan_chines" },
  { nome: "Won Sul-Coreano", codigo: "KRW", value: "won_sul_coreano" },
];

botaoConverter.disabled = true;

let taxasCambio = {};

document.addEventListener("DOMContentLoaded", async () => {
  moedaSelecionada.innerHTML =
    `<option value="" disabled selected>Selecione uma moeda</option>` +
    moedas.map((m) => `<option value="${m.value}">${m.nome}</option>`).join("");

  moedaSelecionada.selectedIndex = 0;

  if (valorInserido) {
    valorInserido.value = "";
  }

  taxasCambio = await buscarCotacoes();

  if (taxasCambio) {
    console.log("Taxas de câmbio carregadas com sucesso.");
  } else {
    console.error("Falha ao carregar as taxas de câmbio.");
  }

  carregarCotacoesAtualizadas();
});

botaoConverter.addEventListener("click", () => {
  iconeBotaoConverter.classList.add("spinning");
  botaoConverter.disabled = true;

  setTimeout(() => {
    iconeBotaoConverter.classList.remove("spinning");
    botaoConverter.disabled = false;
  }, 1200);

  if (!taxasCambio.dolar) {
    console.log("Aguardando o carregamento das taxas...");
    return;
  }

  fazerConversao();
});

valorInserido.addEventListener("keyup", () => {
  if (
    parseFloat(valorInserido.value) <= 0 ||
    !parseFloat(valorInserido.value)
  ) {
    botaoConverter.disabled = true;
    botaoConverter.style.cursor = "not-allowed";
    botaoConverter.style.backgroundColor = "var(--cor-destaque)";
  } else {
    botaoConverter.disabled = false;
    botaoConverter.style.cursor = "pointer";
    botaoConverter.style.backgroundColor = "var(--cor-principal)";
  }
});

botaoLimpar.addEventListener("click", () => {
  valorInserido.value = "";
  resultadoSaida.value = "0,00 R$";
  botaoConverter.disabled = true;
  botaoConverter.style.cursor = "not-allowed";
  botaoConverter.style.backgroundColor = "var(--cor-destaque)";
  moedaSelecionada.selectedIndex = 0;
});

async function buscarCotacoes() {
  const pares = moedas.map((m) => `${m.codigo}-BRL`).join(",");
  const apiUrl = `https://economia.awesomeapi.com.br/json/last/${pares}`;

  try {
    const resposta = await fetch(apiUrl);

    const dados = await resposta.json();

    const cotacoes = {};
    moedas.forEach((m) => {
      const key = `${m.codigo}BRL`;
      cotacoes[m.value] = parseFloat(dados[key].bid);
    });

    console.log("Taxas de câmbio atualizadas:", cotacoes);
    return cotacoes;
  } catch (error) {
    console.error("Erro ao buscar as cotações:", error);
    return null;
  }
}

function fazerConversao() {
  const valorMoeda = parseFloat(valorInserido.value);
  const moeda = moedaSelecionada.value;

  if (taxasCambio[moeda]) {
    const resultado = valorMoeda * taxasCambio[moeda];
    resultadoSaida.value = resultado.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } else {
    alert("Selecione uma moeda válida.");
    resultadoSaida.value = "0,00 R$";
  }
}

function carregarCotacoesAtualizadas() {
  ulCotacoes.innerHTML = moedas
    .map(
      (m) =>
        `<li class="item-cotacao">${m.nome}: R$ ${
          taxasCambio[m.value]?.toFixed(4) || "..."
        }</li>`
    )
    .join("");

  const dataAtual = new Date();

  const dataFormatada = dataAtual
    .toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(",", " às");

  dadosDaConsulta.textContent = `Última consulta: ${dataFormatada}`;
}
