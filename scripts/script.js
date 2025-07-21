const botaoConverter = document.getElementById("botao-converter");
const iconeBotaoConverter = document.getElementById("icone-botao-converter");

botaoConverter.addEventListener("click", () => {
    iconeBotaoConverter.classList.add("spinning");
    botaoConverter.disabled = true;

    setTimeout(() => {
        iconeBotaoConverter.classList.remove("spinning");
        botaoConverter.disabled = false;
    }, 1200); 
});
