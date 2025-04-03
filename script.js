function coordenadaCidade(cidade) {
    return fetch(`https://nominatim.openstreetmap.org/search?city=${cidade}&format=json`)
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

function verificarClima() {
    let cidade = document.getElementById("cidade").value.trim();
    if (!cidade) {
        alert("Informe o nome cidade para realizar a verificação");
        return;
    }

    document.getElementById("resultado").style.display = "none";
    document.getElementById('erro').textContent = '';

    coordenadaCidade(cidade)
        .then(coordenadas => {
            const { latitude, longitude } = coordenadas;

            const url = "https://api.open-meteo.com/v1/forecast";
            const parametros = {
                latitude: latitude,
                longitude: longitude,
                current_weather: true,
                temperature_unit: 'celsius'
            };

            const parametrosQuery = new URLSearchParams(parametros).toString();
            const api = `${url}?${parametrosQuery}`;

            fetch(api)
                .then(response => response.json())
                .then(data => {
                    if (data.current_weather) {
                        let temperatura = data.current_weather.temperature;
                        document.getElementById('temperatura').textContent = `Temperatura atual: ${temperatura}°C`;
                        document.getElementById('resultado').style.display = 'block';
                    } else {
                        document.getElementById('erro').textContent = 'Não foi possível obter a temperatura atual.';
                    }
                })
                .catch(error => {
                    document.getElementById('erro').textContent = 'Erro ao obter dados meteorológicos: ' + error.message;
                });
        })
        .catch(error => {
            document.getElementById('erro').textContent = 'Erro ao obter as coordenadas: ' + error.message;
        });
}


