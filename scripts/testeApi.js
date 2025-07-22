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

buscarCotacoes();