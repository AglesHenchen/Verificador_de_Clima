function verificarClima() {
    let cidade = document.getElementById(cidade).value.trim();
    if (!cidade) {
        alert("Informe o nome cidade para realizar a verificação");
        return;
    }

    document.getElementById("resultado").style.display = "none";
    document.getElementById("erro").sytle.display = "none"

}

function coordenadaCidade() {
    let cidade = document.getElementById(cidade).value.trim();
    return fetch(` https://nominatim.openstreetmap.org/search?city=${city}&format=json`)
        .then(response => response.json)
        .then(data => {
            if(data[0]) {
                let latitude = data[0].lat;
                let longitude = data[0].lon;
                return {latitude, longitude};
            } else {
                throw new Error("Cidade informada não foi encontrada.");
            }
        });
}