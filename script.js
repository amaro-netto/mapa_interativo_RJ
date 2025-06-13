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
    let initialViewBox = null;

    // --- FUNÇÕES AUXILIARES ---

    const buscarClimaAtual = async (nomeCidade, lat, lon) => {
        const apiKey = 'e02fa8f962ee7d6b6a353ec5b1e79b7d'; // <-- Sua chave de API AQUI!

        if (!apiKey) {
            console.error("Erro: API Key não definida. Por favor, insira sua chave OpenWeatherMap.");
            const widgetClimaErro = document.querySelector("#info-painel #weather-widget");
            if (widgetClimaErro) widgetClimaErro.innerHTML = `<p style="font-size: 0.8em; color: #cc0000;">Erro na API: Chave não configurada.</p>`;
            return;
        }

        const weatherWidget = document.querySelector("#info-painel #weather-widget");
        const alertsWidget = document.querySelector("#info-painel #alerts-widget");
        if (alertsWidget) alertsWidget.innerHTML = ''; 
        if (!alertsWidget) console.log("Alerta: #alerts-widget não encontrado no DOM. Certifique-se de que está no HTML.");

        if (!weatherWidget) return;

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

        try {
            const resposta = await fetch(apiUrl);
            if (!resposta.ok) {
                const errorData = await resposta.json();
                throw new Error(`Dados do clima não encontrados ou erro na API (${resposta.status}): ${errorData.message || 'Erro desconhecido'}`);
            }
            
            const dadosClima = await resposta.json();

            const tempAtual = Math.round(dadosClima.main.temp);
            const descAtual = dadosClima.weather[0].description;
            const iconeAtual = dadosClima.weather[0].icon;
            const urlIconeAtual = `https://openweathermap.org/img/wn/${iconeAtual}@2x.png`;

            // ALTERAÇÃO AQUI: Nova ordem e formatação
            weatherWidget.innerHTML = `
                <h4>Clima em ${nomeCidade} (Agora)</h4>
                <div class="clima-section-current">
                    <div class="clima-info">
                        <img src="${urlIconeAtual}" alt="${descAtual}">
                        <p class="descricao">${descAtual.charAt(0).toUpperCase() + descAtual.slice(1)} / </p>
                        <p class="temperatura">${tempAtual}°C</p>
                    </div>
                </div>
            `;

        } catch (erro) {
            console.error("Erro ao buscar clima atual:", erro);
            weatherWidget.innerHTML = `<p style="font-size: 0.8em; color: #cc0000;">Não foi possível carregar o clima atual. ${erro.message || ''}</p>`;
        }
    };

    const carregarMapaRegiao = (regiaoId) => {
        if (!regiaoId) return;
        mapaObjeto.data = `svgs/${regiaoId}.svg`;
        btnVoltar.classList.remove('hidden');
    };

    const resetarParaMapaGeral = () => {
        const svgElement = mapaObjeto.contentDocument ? mapaObjeto.contentDocument.querySelector('svg') : null;

        if (svgElement && initialViewBox) {
            animateViewBox(svgElement, initialViewBox, 300);
            
            setTimeout(() => {
                mapaObjeto.data = 'svgs/mapa-geral.svg';
                btnVoltar.classList.add('hidden');
                painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
                if (elementoSelecionado) {
                    elementoSelecionado.classList.remove('selecionado');
                    elementoSelecionado = null;
                }
            }, 300);
        } else {
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

        if (elementoSelecionado) {
            elementoSelecionado.classList.remove('selecionado');
        }
        municipioElement.classList.add('selecionado');
        elementoSelecionado = municipioElement;

        if (dados && typeof dados.lat !== 'undefined' && typeof dados.lon !== 'undefined') {
            painelInfo.innerHTML = `
                <h2>${dados.nome}</h2>
                <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                <div id="weather-widget">Carregando clima atual...</div> 
                <div id="alerts-widget" style="display: none;"></div>
            `;
            buscarClimaAtual(dados.nome, dados.lat, dados.lon);
        } else {
            let nomeFormatado = municipioId.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            painelInfo.innerHTML = `
                <h2>${nomeFormatado}</h2>
                <p>Dados para este município (incluindo coordenadas) ainda não cadastrados ou incompletos.</p>
                <div id="weather-widget"></div> 
                <div id="alerts-widget" style="display: none;"></div>
            `;
        }
    };

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
                svgElement.setAttribute('viewBox', targetViewBox);
            }
        }
        requestAnimationFrame(step);
    }

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

        if (svgElement.id === 'mapa-geral' && !initialViewBox) {
            initialViewBox = svgElement.getAttribute('viewBox');
        }

        const regioesNoMapa = svgDoc.querySelectorAll('.regiao');
        if (regioesNoMapa.length > 0) {
            regioesNoMapa.forEach(regiao => {
                regiao.onclick = null; 
                regiao.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const regiaoId = regiao.id;

                    const outrasRegioes = svgDoc.querySelectorAll('.regiao:not(#' + regiaoId + ')');
                    outrasRegioes.forEach(other => {
                        other.style.opacity = 0; 
                    });

                    const bbox = regiao.getBBox(); 
                    const padding = 50; 
                    const newX = bbox.x - padding;
                    const newY = bbox.y - padding;
                    const newWidth = bbox.width + (padding * 2);
                    const newHeight = bbox.height + (padding * 2);
                    
                    const targetViewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;

                    animateViewBox(svgElement, targetViewBox, 300);

                    setTimeout(() => {
                        carregarMapaRegiao(regiaoId);
                    }, 300);
                });
            });
        }

        const municipiosNoMapa = svgDoc.querySelectorAll('.bairro');
        if (municipiosNoMapa.length > 0) {
            municipiosNoMapa.forEach(bairro => {
                bairro.onclick = null;
                bairro.addEventListener('click', (e) => {
                    e.stopPropagation();
                    exibirInfoMunicipio(bairro);
                });
            });
        }
    });
    
    btnVoltar.addEventListener('click', resetarParaMapaGeral);
});