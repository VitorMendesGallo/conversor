const botaoConverter = document.getElementById("botao-converter");
const iconeBotaoConverter = document.getElementById("icone-botao-converter");
const opcoesMoeda = document.getElementsByName("moedas");
const valorReaisInput = document.getElementById("valor-reais");
const resultadoInput = document.getElementById("resultado");
const botaoLimpar = document.getElementById("botao-limpar");

botaoConverter.disabled = true;

let taxasCambio = {};

document.addEventListener("DOMContentLoaded", async () => {
  taxasCambio = await buscarCotacoes();
  if (taxasCambio) {
    console.log("Taxas de câmbio carregadas com sucesso.");
  } else {
    console.error("Falha ao carregar as taxas de câmbio.");
  }

  console.log("Taxas de câmbio:", taxasCambio);

});

botaoConverter.addEventListener("click", () => {
  iconeBotaoConverter.classList.add("spinning");
  botaoConverter.disabled = true;

  setTimeout(() => {
    iconeBotaoConverter.classList.remove("spinning");
    botaoConverter.disabled = false;
  }, 1200);

  if (!taxasCambio.dolar) {
    console.log('Aguardando o carregamento das taxas...');
    return;
  }

  if (opcoesMoeda[0].checked) {
    converterParaDolar();
  } else if (opcoesMoeda[1].checked) {
    converterParaEuro();
  } else if (opcoesMoeda[2].checked) {
    converterParaLibra();
  } else if (opcoesMoeda[3].checked) {
    converterParaBitcoin();
  }
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
  resultadoInput.value = "R$ 0,00";
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



