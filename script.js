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
    let eventosAtivos = null; 

    // --- FUNÇÕES AUXILIARES ---

    const buscarClima = async (nomeCidade) => {
        // ATENÇÃO: Substitua pela sua chave pessoal da API
        const apiKey = '6d566ea94a38beedcce0fa62a1f164edI'; 
        const widgetClima = document.querySelector("#info-painel #weather-widget");

        if (!widgetClima) return;

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${nomeCidade},BR&appid=${apiKey}&units=metric&lang=pt_br`;

        try {
            const resposta = await fetch(apiUrl);
            if (!resposta.ok) throw new Error('Cidade não encontrada pela API do clima.');
            
            const dadosClima = await resposta.json();
            const temperatura = Math.round(dadosClima.main.temp);
            const descricao = dadosClima.weather[0].description;
            const icone = dadosClima.weather[0].icon;
            const urlIcone = `https://openweathermap.org/img/wn/${icone}@2x.png`;

            widgetClima.innerHTML = `
                <h4>Clima Atual</h4>
                <div class="clima-info">
                    <img src="${urlIcone}" alt="${descricao}">
                    <p class="temperatura">${temperatura}°C</p>
                    <p class="descricao">${descricao.charAt(0).toUpperCase() + descricao.slice(1)}</p>
                </div>
            `;
        } catch (erro) {
            console.error("Erro no widget de clima:", erro);
            widgetClima.innerHTML = `<p style="font-size: 0.8em; color: #777;">Não foi possível carregar o clima.</p>`;
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

        if (dados) {
            painelInfo.innerHTML = `
                <h2>${dados.nome}</h2>
                <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                <div id="weather-widget">Carregando clima...</div> 
            `;
            // Chama a função para buscar o clima
            buscarClima(dados.nome);
        } else {
            let nomeFormatado = municipioId.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            painelInfo.innerHTML = `
                <h2>${nomeFormatado}</h2>
                <p>Dados para este município ainda não cadastrados.</p>
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
                regiao.addEventListener('click', () => carregarMapaRegiao(regiao.id));
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