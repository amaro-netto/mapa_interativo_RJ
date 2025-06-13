document.addEventListener('DOMContentLoaded', () => {

    // Combina todos os dados de municípios de todas as regiões
    const dadosMunicipios = Object.assign({},
        typeof dados_regiao_1 !== 'undefined' ? dados_regiao_1 : {},
        typeof dados_regiao_2 !== 'undefined' ? dados_regiao_2 : {},
        typeof dados_regiao_3 !== 'undefined' ? dados_regiao_3 : {},
        typeof dados_regiao_4 !== 'undefined' ? dados_regiao_4 : {},
        typeof dados_regiao_5 !== 'undefined' ? dados_regiao_5 : {},
        typeof dados_regiao_6 !== 'undefined' ? dados_regiao_6 : {},
        typeof dados_regiao_7 !== 'undefined' ? dados_regiao_7 : {},
        typeof dados_regiao_8 !== 'undefined' ? dados_regiao_8 : {},
        typeof dados_regiao_9 !== 'undefined' ? dados_regiao_9 : {},
        typeof dados_regiao_10 !== 'undefined' ? dados_regiao_10 : {},
        typeof dados_regiao_11 !== 'undefined' ? dados_regiao_11 : {},
        typeof dados_regiao_12 !== 'undefined' ? dados_regiao_12 : {},
        typeof dados_regiao_capital !== 'undefined' ? dados_regiao_capital : {}
    );
    
    const mapaObjeto = document.getElementById('mapa-objeto');
    const painelInfo = document.getElementById('info-painel');
    const btnVoltar = document.getElementById('btn-voltar');

    let elementoSelecionado = null; // Guarda o elemento (município) atualmente selecionado
    let eventosAtivos = null; // Controla os event listeners para evitar duplicação

    // --- FUNÇÕES AUXILIARES ---

    // Nova função para buscar clima com lat/lon da One Call API 3.0
    const buscarClimaEPrevisao = async (nomeCidade, lat, lon) => {
        // ATENÇÃO: Substitua pela sua chave pessoal da API.
        const apiKey = '6d566ea94a38beedcce0fa62a1f164ed'; // Sua chave do OpenWeatherMap
        const weatherWidget = document.querySelector("#info-painel #weather-widget");
        const alertsWidget = document.querySelector("#info-painel #alerts-widget");

        if (!weatherWidget) return;

        // One Call API 3.0 - Exclui dados por minuto e por hora para otimizar
        const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric&lang=pt_br`;

        try {
            const resposta = await fetch(apiUrl);
            if (!resposta.ok) throw new Error('Dados do clima não encontrados pela API.');
            
            const dadosClima = await resposta.json();

            // CLIMA ATUAL (HOJE)
            const current = dadosClima.current;
            const tempAtual = Math.round(current.temp);
            const descAtual = current.weather[0].description;
            const iconeAtual = current.weather[0].icon;
            const urlIconeAtual = `https://openweathermap.org/img/wn/${iconeAtual}@2x.png`;

            // PREVISÃO PARA AMANHÃ (daily[1] pois daily[0] é hoje)
            const tomorrow = dadosClima.daily[1]; // Pegar o dia seguinte
            const tempMinAmanha = Math.round(tomorrow.temp.min);
            const tempMaxAmanha = Math.round(tomorrow.temp.max);
            const descAmanha = tomorrow.weather[0].description;
            const iconeAmanha = tomorrow.weather[0].icon;
            const urlIconeAmanha = `https://openweathermap.org/img/wn/${iconeAmanha}@2x.png`;

            // Renderiza o clima atual e a previsão
            weatherWidget.innerHTML = `
                <h4>Clima em ${nomeCidade}</h4>
                <div class="clima-section">
                    <h5>Hoje</h5>
                    <div class="clima-info">
                        <img src="${urlIconeAtual}" alt="${descAtual}">
                        <p class="temperatura">${tempAtual}°C</p>
                        <p class="descricao">${descAtual.charAt(0).toUpperCase() + descAtual.slice(1)}</p>
                    </div>
                </div>
                <div class="clima-section">
                    <h5>Amanhã</h5>
                    <div class="clima-info">
                        <img src="${urlIconeAmanha}" alt="${descAmanha}">
                        <p class="temperatura">${tempMinAmanha}°C / ${tempMaxAmanha}°C</p>
                        <p class="descricao">${descAmanha.charAt(0).toUpperCase() + descAmanha.slice(1)}</p>
                    </div>
                </div>
            `;

            // ALERTAS METEOROLÓGICOS
            if (alertsWidget) {
                if (dadosClima.alerts && dadosClima.alerts.length > 0) {
                    alertsWidget.innerHTML = '<h4>Alertas Meteorológicos</h4>';
                    dadosClima.alerts.forEach(alert => {
                        alertsWidget.innerHTML += `
                            <div class="alerta-info">
                                <p class="alerta-evento"><strong>${alert.event}</strong></p>
                                <p class="alerta-descricao">${alert.description}</p>
                                <p class="alerta-sender">Fonte: ${alert.sender_name}</p>
                            </div>
                        `;
                    });
                } else {
                    alertsWidget.innerHTML = ''; // Limpa se não houver alertas
                }
            }

        } catch (erro) {
            console.error("Erro no widget de clima/previsão:", erro);
            weatherWidget.innerHTML = `<p style="font-size: 0.8em; color: #777;">Não foi possível carregar o clima e previsão.</p>`;
            if (alertsWidget) alertsWidget.innerHTML = ''; // Limpa alertas em caso de erro
        }
    };

    const carregarMapaRegiao = (regiaoId) => {
        if (!regiaoId) return;
        mapaObjeto.data = `svgs/${regiaoId}.svg`;
        btnVoltar.classList.remove('hidden');
    };

    const resetarParaMapaGeral = () => {
        mapaObjeto.data = 'svgs/mapa-geral.svg';
        btnVoltar.classList.add('hidden');
        painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
        if (elementoSelecionado) {
            elementoSelecionado.classList.remove('selecionado');
            elementoSelecionado = null;
        }
    };

    const exibirInfoMunicipio = (municipioElement) => {
        const municipioId = municipioElement.dataset.id || municipioElement.id;
        const dados = dadosMunicipios[municipioId];

        if (elementoSelecionado) elementoSelecionado.classList.remove('selecionado');
        municipioElement.classList.add('selecionado');
        elementoSelecionado = municipioElement;

        if (dados && dados.lat && dados.lon) {
            painelInfo.innerHTML = `
                <h2>${dados.nome}</h2>
                <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                <div id="weather-widget">Carregando clima e previsão...</div> 
                <div id="alerts-widget"></div>
            `;
            // Chama a função para buscar o clima e previsão com lat/lon
            buscarClimaEPrevisao(dados.nome, dados.lat, dados.lon);
        } else {
            let nomeFormatado = municipioId.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            painelInfo.innerHTML = `
                <h2>${nomeFormatado}</h2>
                <p>Dados para este município (incluindo coordenadas) ainda não cadastrados.</p>
            `;
        }
    };

    // --- EVENTOS DE CLIQUE ---

    mapaObjeto.addEventListener('load', () => {
        const svgDoc = mapaObjeto.contentDocument;
        if (!svgDoc) return;

        if (eventosAtivos) eventosAtivos.abort();
        eventosAtivos = new AbortController();

        const regioesNoMapa = svgDoc.querySelectorAll('.regiao');
        if (regioesNoMapa.length > 0) {
            regioesNoMapa.forEach(regiao => {
                regiao.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const regiaoId = regiao.id;

                    // Adiciona as classes para o efeito de zoom
                    regiao.classList.add('zoom-selecionado');
                    const outrasRegioes = svgDoc.querySelectorAll('.regiao:not(#' + regiaoId + ')');
                    outrasRegioes.forEach(other => {
                        other.classList.add('zoom-afastado');
                    });

                    // Após um pequeno atraso, carrega o novo mapa
                    setTimeout(() => {
                        carregarMapaRegiao(regiaoId);
                        // Limpa as classes de zoom/afastamento após a transição
                        regiao.classList.remove('zoom-selecionado');
                        outrasRegioes.forEach(other => {
                            other.classList.remove('zoom-afastado');
                        });
                    }, 300); // Deve ser igual ou ligeiramente maior que a duração da transição CSS
                }, { signal: eventosAtivos.signal });
            });
        }

        const municipiosNoMapa = svgDoc.querySelectorAll('.bairro');
        if (municipiosNoMapa.length > 0) {
            municipiosNoMapa.forEach(bairro => {
                bairro.addEventListener('click', (e) => {
                    e.stopPropagation();
                    exibirInfoMunicipio(bairro);
                }, { signal: eventosAtivos.signal });
            });
        }
    });
    
    btnVoltar.addEventListener('click', resetarParaMapaGeral);
});