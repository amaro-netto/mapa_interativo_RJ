document.addEventListener('DOMContentLoaded', () => {

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

    let elementoSelecionado = null;
    let initialViewBox = null; // Armazenará a viewBox inicial do mapa geral

    // --- FUNÇÕES AUXILIARES ---

    const buscarClimaEPrevisao = async (nomeCidade, lat, lon) => {
        const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
        const weatherWidget = document.querySelector("#info-painel #weather-widget");
        const alertsWidget = document.querySelector("#info-painel #alerts-widget");

        if (!weatherWidget) return;

        const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric&lang=pt_br`;

        try {
            const resposta = await fetch(apiUrl);
            if (!resposta.ok) throw new Error('Dados do clima não encontrados pela API.');
            
            const dadosClima = await resposta.json();

            const current = dadosClima.current;
            const tempAtual = Math.round(current.temp);
            const descAtual = current.weather[0].description;
            const iconeAtual = current.weather[0].icon;
            const urlIconeAtual = `https://openweathermap.org/img/wn/${iconeAtual}@2x.png`;

            const tomorrow = dadosClima.daily[1];
            const tempMinAmanha = Math.round(tomorrow.temp.min);
            const tempMaxAmanha = Math.round(tomorrow.temp.max);
            const descAmanha = tomorrow.weather[0].description;
            const iconeAmanha = tomorrow.weather[0].icon;
            const urlIconeAmanha = `https://openweathermap.org/img/wn/${iconeAmanha}@2x.png`;

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
                    alertsWidget.innerHTML = '';
                }
            }

        } catch (erro) {
            console.error("Erro no widget de clima/previsão:", erro);
            weatherWidget.innerHTML = `<p style="font-size: 0.8em; color: #777;">Não foi possível carregar o clima e previsão.</p>`;
            if (alertsWidget) alertsWidget.innerHTML = '';
        }
    };

    const carregarMapaRegiao = (regiaoId) => {
        if (!regiaoId) return;
        mapaObjeto.data = `svgs/${regiaoId}.svg`;
        btnVoltar.classList.remove('hidden');
    };

    const resetarParaMapaGeral = () => {
        // Se houver uma viewBox inicial salva, restaura ela com animação
        if (initialViewBox) {
            const svgElement = mapaObjeto.contentDocument.querySelector('svg');
            if (svgElement) {
                animateViewBox(svgElement, initialViewBox, 300); // Anima de volta
                // Define um timeout para carregar o mapa-geral.svg DEPOIS da animação
                setTimeout(() => {
                    mapaObjeto.data = 'svgs/mapa-geral.svg';
                    btnVoltar.classList.add('hidden');
                    painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
                    if (elementoSelecionado) {
                        elementoSelecionado.classList.remove('selecionado');
                        elementoSelecionado = null;
                    }
                }, 300); // Tempo da animação
            } else {
                // Fallback: se não encontrar o SVG, carrega direto (sem animação de retorno)
                mapaObjeto.data = 'svgs/mapa-geral.svg';
                btnVoltar.classList.add('hidden');
                painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
                if (elementoSelecionado) {
                    elementoSelecionado.classList.remove('selecionado');
                    elementoSelecionado = null;
                }
            }
        } else {
            // Caso initialViewBox não esteja definido (primeiro carregamento), carrega direto
            mapaObjeto.data = 'svgs/mapa-geral.svg';
            btnVoltar.classList.add('hidden');
            painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
            if (elementoSelecionado) {
                elementoSelecionado.classList.remove('selecionado');
                elementoSelecionado = null;
            }
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
            buscarClimaEPrevisao(dados.nome, dados.lat, dados.lon);
        } else {
            let nomeFormatado = municipioId.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            painelInfo.innerHTML = `
                <h2>${nomeFormatado}</h2>
                <p>Dados para este município (incluindo coordenadas) ainda não cadastrados.</p>
            `;
        }
    };

    // Função para animar a viewBox (x, y, width, height)
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

    mapaObjeto.addEventListener('load', () => {
        const svgDoc = mapaObjeto.contentDocument;
        if (!svgDoc) {
            console.error("Não foi possível carregar o documento SVG.");
            return;
        }

        const svgElement = svgDoc.querySelector('svg');
        if (!svgElement) {
            console.error("Elemento SVG não encontrado dentro do objeto.");
            return;
        }

        // Salva a viewBox inicial do mapa geral no primeiro carregamento
        // ou quando resetamos para o mapa geral.
        if (svgElement.id === 'mapa-geral' && !initialViewBox) {
            initialViewBox = svgElement.getAttribute('viewBox');
        }

        // --- Adiciona listeners para REGIOES (se for o mapa geral) ---
        const regioesNoMapa = svgDoc.querySelectorAll('.regiao');
        if (regioesNoMapa.length > 0) { // Estamos no mapa geral
            regioesNoMapa.forEach(regiao => {
                regiao.onclick = null; // Limpa listeners anteriores para evitar duplicação

                regiao.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    const regiaoId = regiao.id;

                    // Remove opacidade das outras regiões durante o zoom
                    const outrasRegioes = svgDoc.querySelectorAll('.regiao:not(#' + regiaoId + ')');
                    outrasRegioes.forEach(other => {
                        other.style.opacity = 0; // Torna transparente imediatamente
                    });

                    // Pega o bounding box da região clicada
                    const bbox = regiao.getBBox(); // Retorna {x, y, width, height}
                    
                    // Calcula a nova viewBox para centralizar a região
                    const padding = 50; // Adiciona um padding ao redor da região
                    const newX = bbox.x - padding;
                    const newY = bbox.y - padding;
                    const newWidth = bbox.width + (padding * 2);
                    const newHeight = bbox.height + (padding * 2);
                    
                    const targetViewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;

                    // Anima a viewBox do SVG
                    animateViewBox(svgElement, targetViewBox, 300); // 300ms de duração da animação

                    // Após a animação, carrega o mapa da região detalhada
                    setTimeout(() => {
                        carregarMapaRegiao(regiaoId);
                    }, 300); // Tempo igual à duração da animação da viewBox
                });
            });
        }

        // --- Adiciona listeners para MUNICIPIOS (se for um mapa de região) ---
        const municipiosNoMapa = svgDoc.querySelectorAll('.bairro');
        if (municipiosNoMapa.length > 0) { // Estamos em um mapa de região
            municipiosNoMapa.forEach(bairro => {
                bairro.onclick = null; // Limpa listeners anteriores para evitar duplicação
                bairro.addEventListener('click', (e) => {
                    e.stopPropagation();
                    exibirInfoMunicipio(bairro);
                });
            });
        }
    });
    
    btnVoltar.addEventListener('click', resetarParaMapaGeral);
});