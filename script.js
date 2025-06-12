document.addEventListener('DOMContentLoaded', () => {

    // Junta todos os objetos de dados dos seus arquivos da pasta /data
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
    
    // Seleção dos elementos da página
    const mapaObjeto = document.getElementById('mapa-objeto');
    const painelInfo = document.getElementById('info-painel');
    const btnVoltar = document.getElementById('btn-voltar');

    let elementoSelecionado = null;
    let eventosAtivos = null; // Controla os eventos de clique dos municípios

    // Função para carregar o mapa de uma região específica
    const carregarMapaRegiao = (regiaoId) => {
        if (!regiaoId) return;
        mapaObjeto.data = `svgs/${regiaoId}.svg`;
        btnVoltar.classList.remove('hidden');
    };

    // Função para voltar ao mapa geral
    const resetarParaMapaGeral = () => {
        mapaObjeto.data = 'svgs/mapa-geral.svg';
        btnVoltar.classList.add('hidden');
        painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
        if (elementoSelecionado) {
            elementoSelecionado.classList.remove('selecionado');
            elementoSelecionado = null;
        }
    };

    // Função para exibir informações do município
    const exibirInfoMunicipio = (municipioElement) => {
        const municipioId = municipioElement.dataset.id || municipioElement.id;
        const dados = dadosMunicipios[municipioId];

        if (elementoSelecionado) elementoSelecionado.classList.remove('selecionado');
        municipioElement.classList.add('selecionado');
        elementoSelecionado = municipioElement;

        if (dados) {
            painelInfo.innerHTML = `<h2>${dados.nome}</h2><p>${dados.descricao || "Nenhuma descrição disponível."}</p>`;
        } else {
            let nomeFormatado = municipioId.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            painelInfo.innerHTML = `<h2>${nomeFormatado}</h2><p>Dados para este município ainda não cadastrados.</p>`;
        }
    };

    // Evento principal: roda toda vez que um novo SVG é carregado no <object>
    mapaObjeto.addEventListener('load', () => {
        const svgDoc = mapaObjeto.contentDocument;
        if (!svgDoc) return;

        // Se eventos de clique antigos existirem (de um mapa de região anterior), eles são removidos.
        if (eventosAtivos) eventosAtivos.abort();
        eventosAtivos = new AbortController();

        // Procura por regiões ou municípios no SVG que acabou de carregar
        const regioesNoMapa = svgDoc.querySelectorAll('.regiao');
        const municipiosNoMapa = svgDoc.querySelectorAll('.bairro');

        // Se encontrou regiões, significa que estamos no mapa geral.
        if (regioesNoMapa.length > 0) {
            regioesNoMapa.forEach(regiao => {
                regiao.addEventListener('click', () => carregarMapaRegiao(regiao.id));
            });
        }

        // Se encontrou municípios, significa que estamos em um mapa de região.
        if (municipiosNoMapa.length > 0) {
            municipiosNoMapa.forEach(bairro => {
                bairro.addEventListener('click', (e) => {
                    e.stopPropagation();
                    exibirInfoMunicipio(bairro);
                }, { signal: eventosAtivos.signal }); // Adiciona um evento que pode ser "abortado"
            });
        }
    });
    
    // Evento do botão de voltar
    btnVoltar.addEventListener('click', resetarParaMapaGeral);
});