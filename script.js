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
    
    const mapaContainer = document.getElementById('mapa-container');
    const mapaObjeto = document.getElementById('mapa-objeto');
    const painelInfo = document.getElementById('info-painel');
    const btnVoltar = document.getElementById('btn-voltar');

    mapaObjeto.addEventListener('load', () => {
        
        const svgDoc = mapaObjeto.contentDocument;
        if (!svgDoc) { return; }

        const svgMapa = svgDoc.documentElement;
        const todasAsRegioes = svgDoc.querySelectorAll('.regiao');
        const todosOsBairros = svgDoc.querySelectorAll('.bairro');
        
        const viewBoxOriginal = svgMapa.getAttribute('viewBox');
        let elementoSelecionado = null;

        const zoomNaRegiao = (regiaoClicada) => {
            const bbox = regiaoClicada.getBBox();
            const padding = 20;
            const novoViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + (padding * 2)} ${bbox.height + (padding * 2)}`;
            
            // 1. Aplica o zoom no SVG
            svgMapa.setAttribute('viewBox', novoViewBox);
            
            // 2. Adiciona as classes para o CSS fazer sua mágica
            mapaContainer.classList.add('mapa-zoom-ativo');
            regiaoClicada.classList.add('foco');
            
            // 3. Mostra o botão de voltar
            btnVoltar.classList.remove('hidden');
        };

        const resetarZoom = () => {
            svgMapa.setAttribute('viewBox', viewBoxOriginal);
            
            // Limpa as classes de estado
            mapaContainer.classList.remove('mapa-zoom-ativo');
            const regiaoEmFoco = svgDoc.querySelector('.regiao.foco');
            if (regiaoEmFoco) {
                regiaoEmFoco.classList.remove('foco');
            }

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

            if (elementoSelecionado) {
                elementoSelecionado.classList.remove('selecionado');
            }

            municipioElement.classList.add('selecionado');
            elementoSelecionado = municipioElement;

            if (dados) {
                painelInfo.innerHTML = `
                    <h2>${dados.nome}</h2>
                    <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                `;
            } else {
                let nomeFormatado = municipioId.replace(/[-_]/g, " ");
                nomeFormatado = nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1);
                painelInfo.innerHTML = `
                    <h2>${nomeFormatado}</h2>
                    <p>Dados para este município ainda não cadastrados.</p>
                `;
            }
        };

        // --- EVENTOS DE CLIQUE ---

        todasAsRegioes.forEach(regiao => {
            regiao.addEventListener('click', () => {
                zoomNaRegiao(regiao);
            });
        });

        todosOsBairros.forEach(bairro => {
            bairro.addEventListener('click', () => {
                exibirInfoMunicipio(bairro);
            });
        });
        
        btnVoltar.addEventListener('click', resetarZoom);
    });

    mapaObjeto.addEventListener('error', () => {
        console.error("ERRO: O arquivo 'mapa.svg' não pôde ser carregado.");
    });
});