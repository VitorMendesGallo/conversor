const botaoConverter = document.getElementById("botao-converter");
const iconeBotaoConverter = document.getElementById("icone-botao-converter");
const opcoesMoeda = document.getElementsByName("moedas");
const valorReaisInput = document.getElementById("valor-reais");
const resultadoSaida = document.getElementById("resultado");
const botaoLimpar = document.getElementById("botao-limpar");
const listaCotacoes = document.querySelectorAll(".item-cotacao");
const ultimaConsulta = document.getElementById("ultima-consulta");

botaoConverter.disabled = true;

let taxasCambio = {};

document.addEventListener("DOMContentLoaded", async () => {
  if (valorReaisInput) {
    valorReaisInput.value = "";
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

valorReaisInput.addEventListener("keyup", () => {
  if (
    parseFloat(valorReaisInput.value) <= 0 ||
    !parseFloat(valorReaisInput.value)
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
  valorReaisInput.value = "";
  resultadoSaida.value = "0,00";
  botaoConverter.disabled = true;
  botaoConverter.style.cursor = "not-allowed";
  botaoConverter.style.backgroundColor = "var(--cor-destaque)";
});

async function buscarCotacoes() {
  const apiUrl =
    "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL";

  try {
    const resposta = await fetch(apiUrl);

    /* Converte a resposta em um objeto JavaScript(JSON) */
    const dados = await resposta.json();

    const cotacoes = {
      dolar: parseFloat(dados.USDBRL.bid),
      euro: parseFloat(dados.EURBRL.bid),
      libra: parseFloat(dados.GBPBRL.bid),
      bitcoin: parseFloat(dados.BTCBRL.bid),
    };

    console.log("Taxas de câmbio atualizadas:", cotacoes);
    return cotacoes;
  } catch (error) {
    console.error("Erro ao buscar as cotações:", error);
    return null;
  }
}

function fazerConversao() {
  const valorReais = parseFloat(valorReaisInput.value);
  const moedaSelecionada = document.querySelector(
    'input[name="moedas"]:checked'
  ).value;
  let resultado;

  switch (moedaSelecionada) {
    case "dolar":
      resultado = valorReais / taxasCambio.dolar;
      resultadoSaida.value = resultado.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      break;
    case "euro":
      resultado = valorReais / taxasCambio.euro;
      resultadoSaida.value = resultado.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      });
      break;
    case "libra":
      resultado = valorReais / taxasCambio.libra;
      resultadoSaida.value = resultado.toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
      });
      break;
    case "bitcoin":
      resultado = valorReais / taxasCambio.bitcoin;
      console.log("Valor em Bitcoin:", resultado);
      resultadoSaida.value = resultado.toLocaleString("en-US", {
        style: "currency",
        currency: "BTC",
        minimumFractionDigits: 4,
        maximumFractionDigits: 8,
      });
      break;
    default:
      resultado = 0;
  }
}

function carregarCotacoesAtualizadas() {
  listaCotacoes[0].textContent = `Dólar: R$ ${taxasCambio.dolar.toFixed(2)}`;
  listaCotacoes[1].textContent = `Euro: R$ ${taxasCambio.euro.toFixed(2)}`;
  listaCotacoes[2].textContent = `Libra: R$ ${taxasCambio.libra.toFixed(2)}`;
  listaCotacoes[3].textContent = `Bitcoin: R$ ${taxasCambio.bitcoin.toFixed(
    2
  )}`;

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

  ultimaConsulta.textContent = `Última consulta: ${dataFormatada}`;
}
