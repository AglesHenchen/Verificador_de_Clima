function coordenadaCidade(pais, estado, cidade) {
    return fetch(`https://nominatim.openstreetmap.org/search?city=${cidade}&state=${estado}&country=${pais}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data && data[0]) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;
                return { latitude, longitude };
            } else {
                throw new Error("Cidade informada não foi encontrada.");
            }
        });
}

function procurarCoordenadas(latitude, longitude) {
    return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                const cidade = data.address.city || data.address.town || data.address.village;
                return cidade;
            } else {
                throw new Error('Endereço não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar cidade:', error);
            return null;
        });
}

async function verificarClima() {
    let pais_input = document.getElementById("pais").value.trim();
    let estado_input = document.getElementById("estado").value.trim();
    let cidade_input = document.getElementById("cidade").value.trim();

    if (!pais_input || !estado_input || !cidade_input) {
        alert("Necessário preencher todos os campos para realizar a verificação");
        return;
    }

    document.getElementById("resultado").style.display = "none";
    document.getElementById("erro").style.display = "none";

    try {
        const coordenadas = await coordenadaCidade(pais_input, estado_input, cidade_input);
        const { latitude, longitude } = coordenadas;

        const cidade_resultado = await procurarCoordenadas(latitude, longitude);

        const parametros = {
            latitude: latitude,
            longitude: longitude,
            current_weather: true,
            temperature_unit: 'celsius'
        };

        const parametrosQuery = new URLSearchParams(parametros).toString();
        const api = `https://api.open-meteo.com/v1/forecast?${parametrosQuery}`;

        const response = await fetch(api);
        const data = await response.json();

        if (data.current_weather) {
            let temperatura = data.current_weather.temperature;
            if (temperatura <= 20) { 
                //frio
                document.getElementById("resultado").style.display = "block";
                document.getElementById("resultado").style.padding = "5px";
                document.getElementById("resultado").style.backgroundColor = "rgb(140, 178, 247)";
                document.getElementById("temperatura").innerHTML = `${cidade_resultado} <br>`;
                document.getElementById("temperatura").innerHTML += `${parseInt(temperatura)} °C <br>`;
                document.getElementById("temperatura").innerHTML += `❄️`;
            }
            else if (temperatura >= 30) {
                //quente
                document.getElementById("resultado").style.display = "block";
                document.getElementById("resultado").style.padding = "5px";
                document.getElementById("resultado").style.backgroundColor = "rgb(247, 179, 140)";
                document.getElementById("temperatura").innerHTML = `${cidade_resultado} <br>`;
                document.getElementById("temperatura").innerHTML += `${parseInt(temperatura)} °C <br>`;
                document.getElementById("temperatura").innerHTML += `☀️`;
            }
            else {
                //ameno
                document.getElementById("resultado").style.display = "block";
                document.getElementById("resultado").style.padding = "5px";
                document.getElementById("resultado").style.backgroundColor = "rgb(208, 214, 216)";
                document.getElementById("temperatura").innerHTML = `${cidade_resultado} <br>`;
                document.getElementById("temperatura").innerHTML += `${parseInt(temperatura)} °C <br>`;
                document.getElementById("temperatura").innerHTML += `⛅️`;
            }

        } else {
            document.getElementById("erro").style.display = "block";
            document.getElementById("erro").innerHTML = "Não foi possível obter a temperatura atual.";
        }
    } catch (error) {
        document.getElementById("erro").style.display = "block";
        document.getElementById("erro").innerHTML = "Erro: " + error.message;
    }
}
