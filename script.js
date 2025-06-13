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

    // As funções relacionadas ao clima e nome no mapa foram removidas para simplificar o projeto.

    const carregarMapaRegiao = (regiaoId) => {
        if (!regiaoId) return;
        mapaObjeto.data = `svgs/${regiaoId}.svg`;
        btnVoltar.classList.remove('hidden');
    };

    const resetarParaMapaGeral = () => {
        const svgElement = mapaObjeto.contentDocument ? mapaObjeto.contentDocument.querySelector('svg') : null;

        // Limpeza de elementos de nome no mapa (mantido caso houvesse resquícios de versões anteriores)
        if (svgElement) {
            const nomesMunicipiosNoMapa = svgElement.querySelectorAll('.nome-municipio-mapa');
            nomesMunicipiosNoMapa.forEach(nome => nome.remove());
        }

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
            // Limpeza de elementos de nome no mapa (mantido caso houvesse resquícios de versões anteriores)
            const svgDoc = mapaObjeto.contentDocument;
            if (svgDoc) {
                const nomesAnteriores = svgDoc.querySelectorAll('.nome-municipio-mapa');
                nomesAnteriores.forEach(nome => nome.remove());
            }
        }
        municipioElement.classList.add('selecionado');
        elementoSelecionado = municipioElement;

        // HTML do painel de informações - APENAS DESCRIÇÃO E O NOVO CONTAINER
        if (dados && typeof dados.lat !== 'undefined' && typeof dados.lon !== 'undefined') {
            painelInfo.innerHTML = `
                <h2>${dados.nome}</h2>
                <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                <div id="conteudo-adicional-municipio">
                    <p>Espaço para conteúdo adicional.)</p>
                </div>
            `;
            // As chamadas para buscarClimaAtual e exibirNomeNoMapa foram removidas.

        } else {
            let nomeFormatado = municipioId.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            painelInfo.innerHTML = `
                <h2>${nomeFormatado}</h2>
                <p>Dados para este município (incluindo coordenadas) ainda não cadastrados ou incompletos.</p>
                <div id="conteudo-adicional-municipio">
                    <p>Nenhum dado adicional disponível para este município.</p>
                </div>
            `;
            // Limpeza de elementos de nome no mapa (mantido caso houvesse resquícios de versões anteriores)
            const svgDoc = mapaObjeto.contentDocument;
            if (svgDoc) {
                const nomesAnteriores = svgDoc.querySelectorAll('.nome-municipio-mapa');
                nomesAnteriores.forEach(nome => nome.remove());
            }
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

        // Limpar eventos anteriores para evitar duplicação em recargas
        svgDoc.querySelectorAll('.regiao, .bairro').forEach(el => {
            el.onclick = null; 
            // Não há addEventListener específico para remover aqui se não foram adicionados
        });


        const regioesNoMapa = svgDoc.querySelectorAll('.regiao');
        if (regioesNoMapa.length > 0) {
            regioesNoMapa.forEach(regiao => {
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
                bairro.addEventListener('click', (e) => {
                    e.stopPropagation();
                    exibirInfoMunicipio(bairro);
                });
            });
        }
    });
    
    btnVoltar.addEventListener('click', resetarParaMapaGeral);
});