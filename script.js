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
        
        const viewBoxOriginal = svgMapa.getAttribute('viewBox');
        let elementoSelecionado = null;
        let controladorDeEventos = null; // Guarda o nosso "controle remoto" de eventos

        // Função para exibir as informações de um município
        const exibirInfoMunicipio = (municipioElement) => {
            const municipioId = municipioElement.dataset.id || municipioElement.id;
            const dados = dadosMunicipios[municipioId];

            if (elementoSelecionado) {
                elementoSelecionado.classList.remove('selecionado');
            }
            municipioElement.classList.add('selecionado');
            elementoSelecionado = municipioElement;

            if (dados) {
                painelInfo.innerHTML = `<h2>${dados.nome}</h2><p>${dados.descricao || "Nenhuma descrição disponível."}</p>`;
            } else {
                let nomeFormatado = municipioId.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                painelInfo.innerHTML = `<h2>${nomeFormatado}</h2><p>Dados para este município ainda não cadastrados.</p>`;
            }
        };

        const zoomNaRegiao = (regiaoClicada) => {
            const bbox = regiaoClicada.getBBox();
            const padding = 20;
            const novoViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + (padding * 2)} ${bbox.height + (padding * 2)}`;
            
            svgMapa.setAttribute('viewBox', novoViewBox);
            
            // ================== NOVA LÓGICA DE EVENTOS ==================
            
            // 1. Se já existirem eventos de clique antigos, remove todos eles.
            if (controladorDeEventos) {
                controladorDeEventos.abort();
            }
            // 2. Cria um novo "controle remoto" para os novos eventos.
            controladorDeEventos = new AbortController();

            // 3. Adiciona eventos de clique APENAS nos municípios da região em foco.
            const bairrosDaRegiao = regiaoClicada.querySelectorAll('.bairro');
            bairrosDaRegiao.forEach(bairro => {
                bairro.addEventListener('click', (event) => {
                    event.stopPropagation();
                    exibirInfoMunicipio(bairro);
                }, { signal: controladorDeEventos.signal }); // Conecta o evento ao nosso controle.
            });
            
            mapaContainer.classList.add('mapa-zoom-ativo');
            todasAsRegioes.forEach(r => r.classList.remove('foco')); // Limpa o foco antigo
            regiaoClicada.classList.add('foco'); // Adiciona foco na nova região
            btnVoltar.classList.remove('hidden');
        };

        const resetarZoom = () => {
            svgMapa.setAttribute('viewBox', viewBoxOriginal);
            mapaContainer.classList.remove('mapa-zoom-ativo');
            
            const regiaoEmFoco = svgDoc.querySelector('.regiao.foco');
            if (regiaoEmFoco) {
                regiaoEmFoco.classList.remove('foco');
            }
            
            // ================== NOVA LÓGICA DE EVENTOS ==================
            // 4. Ao voltar, remove todos os eventos de clique dos municípios que estavam ativos.
            if (controladorDeEventos) {
                controladorDeEventos.abort();
                controladorDeEventos = null;
            }

            btnVoltar.classList.add('hidden');
            painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';
            
            if (elementoSelecionado) {
                elementoSelecionado.classList.remove('selecionado');
                elementoSelecionado = null;
            }
        };

        // --- EVENTOS DE CLIQUE INICIAIS ---
        todasAsRegioes.forEach(regiao => {
            regiao.addEventListener('click', () => {
                zoomNaRegiao(regiao);
            });
        });
        
        btnVoltar.addEventListener('click', resetarZoom);
    });
});