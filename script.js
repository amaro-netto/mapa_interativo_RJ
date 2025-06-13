document.addEventListener('DOMContentLoaded', () => {

    // Combina todos os dados de municípios de todas as regiões
    // É crucial que os arquivos data/regiao_X.js sejam carregados ANTES deste script
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
    let initialViewBox = null;     // Armazenará a viewBox inicial do mapa geral

    // --- FUNÇÕES AUXILIARES ---

    // Função para buscar clima com lat/lon da One Call API 3.0 e exibir previsão/alertas
    const buscarClimaEPrevisao = async (nomeCidade, lat, lon) => {
        // A chave da API agora é acessada da variável global OPENWEATHER_API_KEY
        // que deve ser definida no arquivo api-config.js (carregado no index.html ANTES deste script)
        if (typeof OPENWEATHER_API_KEY === 'undefined' || !OPENWEATHER_API_KEY) {
            console.error("Erro: OPENWEATHER_API_KEY não definida ou vazia. Verifique seu arquivo api-config.js.");
            const widgetClimaErro = document.querySelector("#info-painel #weather-widget");
            if (widgetClimaErro) widgetClimaErro.innerHTML = `<p style="font-size: 0.8em; color: #cc0000;">Erro na API: Chave não configurada.</p>`;
            return;
        }

        const weatherWidget = document.querySelector("#info-painel #weather-widget");
        const alertsWidget = document.querySelector("#info-painel #alerts-widget");

        if (!weatherWidget) return; // Garante que o elemento existe

        // Constrói a URL para a One Call API 3.0
        // exclude=minutely,hourly para focar nos dados diários e alertas
        const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;

        try {
            const resposta = await fetch(apiUrl);
            if (!resposta.ok) {
                // Se a resposta não for OK (ex: 401 Unauthorized, 404 Not Found), lança um erro
                const errorData = await resposta.json(); // Tenta ler a mensagem de erro da API
                throw new Error(`Dados do clima não encontrados ou erro na API (${resposta.status}): ${errorData.message || 'Erro desconhecido'}`);
            }
            
            const dadosClima = await resposta.json();

            // --- CLIMA ATUAL (HOJE) ---
            const current = dadosClima.current;
            const tempAtual = Math.round(current.temp);
            const descAtual = current.weather[0].description;
            const iconeAtual = current.weather[0].icon;
            const urlIconeAtual = `https://openweathermap.org/img/wn/${iconeAtual}@2x.png`;

            // --- PREVISÃO PARA AMANHÃ (daily[1] pois daily[0] é hoje) ---
            // Verifica se há dados diários suficientes (pelo menos para amanhã)
            const tomorrow = dadosClima.daily && dadosClima.daily.length > 1 ? dadosClima.daily[1] : null;

            let tempMinAmanha = 'N/A';
            let tempMaxAmanha = 'N/A';
            let descAmanha = 'N/A';
            let urlIconeAmanha = '';

            if (tomorrow) {
                tempMinAmanha = Math.round(tomorrow.temp.min);
                tempMaxAmanha = Math.round(tomorrow.temp.max);
                descAmanha = tomorrow.weather[0].description;
                iconeAmanha = tomorrow.weather[0].icon;
                urlIconeAmanha = `https://openweathermap.org/img/wn/${iconeAmanha}@2x.png`;
            }

            // Renderiza o clima atual e a previsão no #weather-widget
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
                        ${tomorrow ? `<img src="${urlIconeAmanha}" alt="${descAmanha}">` : ''}
                        <p class="temperatura">${tempMinAmanha}°C / ${tempMaxAmanha}°C</p>
                        <p class="descricao">${descAmanha.charAt(0).toUpperCase() + descAmanha.slice(1)}</p>
                    </div>
                </div>
            `;

            // --- ALERTAS METEOROLÓGICOS ---
            if (alertsWidget) { // Garante que o elemento alertsWidget existe no DOM
                if (dadosClima.alerts && dadosClima.alerts.length > 0) {
                    alertsWidget.innerHTML = '<h4>Alertas Meteorológicos</h4>';
                    dadosClima.alerts.forEach(alert => {
                        alertsWidget.innerHTML += `
                            <div class="alerta-info">
                                <p class="alerta-evento"><strong>${alert.event}</strong></p>
                                <p class="alerta-descricao">${alert.description}</p>
                                <p class="alerta-sender">Fonte: ${alert.sender_name}</p>
                                <p class="alerta-period">Início: ${new Date(alert.start * 1000).toLocaleString()} - Fim: ${new Date(alert.end * 1000).toLocaleString()}</p>
                            </div>
                        `;
                    });
                } else {
                    alertsWidget.innerHTML = ''; // Limpa o conteúdo se não houver alertas
                }
            }

        } catch (erro) {
            console.error("Erro ao buscar clima/previsão:", erro);
            weatherWidget.innerHTML = `<p style="font-size: 0.8em; color: #cc0000;">Não foi possível carregar o clima e previsão. ${erro.message || ''}</p>`;
            if (alertsWidget) alertsWidget.innerHTML = ''; // Limpa alertas em caso de erro
        }
    };

    // Função para carregar o SVG de uma região específica no <object>
    const carregarMapaRegiao = (regiaoId) => {
        if (!regiaoId) return;
        mapaObjeto.data = `svgs/${regiaoId}.svg`;
        btnVoltar.classList.remove('hidden'); // Exibe o botão "Voltar"
    };

    // Função para resetar para o mapa geral
    const resetarParaMapaGeral = () => {
        const svgElement = mapaObjeto.contentDocument ? mapaObjeto.contentDocument.querySelector('svg') : null;

        if (svgElement && initialViewBox) {
            // Anima a viewBox de volta ao estado inicial do mapa geral
            animateViewBox(svgElement, initialViewBox, 300); // 300ms de duração
            
            // Após a animação, carregar o mapa geral e resetar a interface
            setTimeout(() => {
                mapaObjeto.data = 'svgs/mapa-geral.svg';
                btnVoltar.classList.add('hidden'); // Esconde o botão
                painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
                if (elementoSelecionado) {
                    elementoSelecionado.classList.remove('selecionado');
                    elementoSelecionado = null;
                }
            }, 300); // Tempo igual à duração da animação
        } else {
            // Fallback: se não houver SVG ou initialViewBox, carrega direto
            mapaObjeto.data = 'svgs/mapa-geral.svg';
            btnVoltar.classList.add('hidden');
            painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
            if (elementoSelecionado) {
                elementoSelecionado.classList.remove('selecionado');
                elementoSelecionado = null;
            }
        }
    };

    // Função para exibir informações de um município no painel
    const exibirInfoMunicipio = (municipioElement) => {
        const municipioId = municipioElement.dataset.id || municipioElement.id;
        const dados = dadosMunicipios[municipioId];

        // Remove a classe 'selecionado' de qualquer elemento anteriormente selecionado
        if (elementoSelecionado) {
            elementoSelecionado.classList.remove('selecionado');
        }
        // Adiciona a classe 'selecionado' ao município clicado e guarda sua referência
        municipioElement.classList.add('selecionado');
        elementoSelecionado = municipioElement;

        if (dados && typeof dados.lat !== 'undefined' && typeof dados.lon !== 'undefined') {
            painelInfo.innerHTML = `
                <h2>${dados.nome}</h2>
                <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                <div id="weather-widget">Carregando clima e previsão...</div> 
                <div id="alerts-widget"></div>
            `;
            // Chama a função para buscar o clima e previsão usando lat/lon
            buscarClimaEPrevisao(dados.nome, dados.lat, dados.lon);
        } else {
            // Formata o ID do município para exibição se os dados não forem encontrados
            let nomeFormatado = municipioId.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            painelInfo.innerHTML = `
                <h2>${nomeFormatado}</h2>
                <p>Dados para este município (incluindo coordenadas) ainda não cadastrados ou incompletos.</p>
                <div id="weather-widget"></div> 
                <div id="alerts-widget"></div>
            `;
        }
    };

    // Função para animar a viewBox de um SVG suavemente
    // targetViewBox é uma string no formato "x y width height"
    function animateViewBox(svgElement, targetViewBox, duration) {
        const startViewBox = svgElement.getAttribute('viewBox').split(' ').map(Number);
        const target = targetViewBox.split(' ').map(Number);
        let startTime = null;

        function step(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / duration;

            if (progress < 1) {
                const animatedViewBox = startViewBox.map((startVal, i) => 
                    startVal + (target[i] - startVal) * progress
                );
                svgElement.setAttribute('viewBox', animatedViewBox.join(' '));
                requestAnimationFrame(step);
            } else {
                svgElement.setAttribute('viewBox', targetViewBox); // Garante o valor final
            }
        }
        requestAnimationFrame(step);
    }

    // --- EVENTOS PRINCIPAIS ---

    // Este evento é disparado SEMPRE que o conteúdo do <object> (o SVG) é carregado
    mapaObjeto.addEventListener('load', () => {
        const svgDoc = mapaObjeto.contentDocument; // Acessa o documento SVG carregado
        if (!svgDoc) {
            console.error("Não foi possível carregar o documento SVG.");
            return;
        }

        const svgElement = svgDoc.querySelector('svg'); // Acessa o elemento <svg> dentro do documento
        if (!svgElement) {
            console.error("Elemento SVG não encontrado dentro do objeto.");
            return;
        }

        // Salva a viewBox inicial do mapa geral no primeiro carregamento ou ao retornar
        if (svgElement.id === 'mapa-geral' && !initialViewBox) {
            initialViewBox = svgElement.getAttribute('viewBox');
        }

        // --- Adiciona listeners para REGIOES (se for o mapa geral) ---
        const regioesNoMapa = svgDoc.querySelectorAll('.regiao');
        if (regioesNoMapa.length > 0) { // Indica que estamos no mapa geral
            regioesNoMapa.forEach(regiao => {
                // Limpa listeners anteriores para evitar duplicação em recargas do mesmo SVG
                regiao.onclick = null; 

                regiao.addEventListener('click', (e) => {
                    e.stopPropagation(); // Impede que o clique se propague para elementos parentes
                    const regiaoId = regiao.id;

                    // Torna as outras regiões transparentes imediatamente para focar no zoom
                    const outrasRegioes = svgDoc.querySelectorAll('.regiao:not(#' + regiaoId + ')');
                    outrasRegioes.forEach(other => {
                        other.style.opacity = 0; 
                    });

                    // Pega o bounding box da região clicada (coordenadas e dimensões)
                    const bbox = regiao.getBBox(); 
                    
                    // Calcula a nova viewBox para centralizar a região com um padding
                    const padding = 50; // Margem ao redor da região
                    const newX = bbox.x - padding;
                    const newY = bbox.y - padding;
                    const newWidth = bbox.width + (padding * 2);
                    const newHeight = bbox.height + (padding * 2);
                    
                    const targetViewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;

                    // Anima a viewBox do elemento SVG para o zoom
                    animateViewBox(svgElement, targetViewBox, 300); // Duração da animação em ms

                    // Após a animação, carrega o SVG da região detalhada
                    setTimeout(() => {
                        carregarMapaRegiao(regiaoId);
                    }, 300); // Tempo igual à duração da animação
                });
            });
        }

        // --- Adiciona listeners para MUNICIPIOS (se for um mapa de região) ---
        const municipiosNoMapa = svgDoc.querySelectorAll('.bairro');
        if (municipiosNoMapa.length > 0) { // Indica que estamos em um mapa de região
            municipiosNoMapa.forEach(bairro => {
                // Limpa listeners anteriores para evitar duplicação em recargas do mesmo SVG
                bairro.onclick = null; 
                bairro.addEventListener('click', (e) => {
                    e.stopPropagation(); // Impede que o clique se propague
                    exibirInfoMunicipio(bairro);
                });
            });
        }
    });
    
    // Listener para o botão de voltar ao mapa geral (fora do evento 'load')
    btnVoltar.addEventListener('click', resetarParaMapaGeral);
});