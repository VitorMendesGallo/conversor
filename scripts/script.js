const botaoConverter = document.getElementById("botao-converter");
const iconeBotaoConverter = document.getElementById("icone-botao-converter");
const opcoesMoeda = document.getElementsByName("moedas");
const valorReaisInput = document.getElementById("valor-reais");
const resultadoInput = document.getElementById("resultado");
const botaoLimpar = document.getElementById("botao-limpar");

botaoConverter.disabled = true; 

botaoConverter.addEventListener("click", () => {
    iconeBotaoConverter.classList.add("spinning");
    botaoConverter.disabled = true;

    setTimeout(() => {
        iconeBotaoConverter.classList.remove("spinning");
        botaoConverter.disabled = false;
    }, 1200); 


    if(opcoesMoeda[0].checked) {
        converterParaDolar();
    }else if(opcoesMoeda[1].checked) {
        converterParaEuro();
    }else if(opcoesMoeda[2].checked) {
        converterParaLibra();
    }else if(opcoesMoeda[3].checked) {
        converterParaBitcoin();
    }
});

valorReaisInput.addEventListener("keyup", () => {
    
    if(parseFloat(valorReaisInput.value) <= 0 || !parseFloat(valorReaisInput.value)) {

        botaoConverter.disabled = true;
        botaoConverter.style.cursor = "not-allowed";
        botaoConverter.style.backgroundColor = "var(--cor-destaque)";

    }else{
        botaoConverter.disabled = false;
        botaoConverter.style.cursor = "pointer";
        botaoConverter.style.backgroundColor = "var(--cor-principal)";
    }

})
