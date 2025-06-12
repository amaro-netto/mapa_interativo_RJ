document.addEventListener('DOMContentLoaded', () => {

    // --- MONTAGEM DO BANCO DE DADOS COMPLETO ---
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
    
    console.log("Dados de todos os municípios carregados:", dadosMunicipios);

    // --- SELEÇÃO DOS ELEMENTOS PRINCIPAIS ---
    const mapaContainer = document.getElementById('mapa-container'); // O container DIV do mapa
    const mapaObjeto = document.getElementById('mapa-objeto');     // A tag <object> que carrega o SVG
    const painelInfo = document.getElementById('info-painel');      // O painel de informações
    const btnVoltar = document.getElementById('btn-voltar');        // O botão de voltar

    // --- LÓGICA PRINCIPAL ---
    
    // Espera o SVG ser completamente carregado dentro da tag <object>
    mapaObjeto.addEventListener('load', () => {
        
        console.log("Mapa SVG carregado com sucesso!");

        const svgDoc = mapaObjeto.contentDocument;
        if (!svgDoc) {
            console.error("Erro: Não foi possível acessar o conteúdo do SVG.");
            return;
        }

        const svgMapa = svgDoc.documentElement;
        const todasAsRegioes = svgDoc.querySelectorAll('.regiao');
        const todosOsBairros = svgDoc.querySelectorAll('.bairro');
        
        console.log(`Encontradas ${todasAsRegioes.length} regiões e ${todosOsBairros.length} municípios.`);

        const viewBoxOriginal = svgMapa.getAttribute('viewBox');
        let elementoSelecionado = null;

        // --- FUNÇÕES AUXILIARES ---

        const zoomNaRegiao = (regiaoElement) => {
            const bbox = regiaoElement.getBBox();
            const padding = 20;
            const novoViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + (padding * 2)} ${bbox.height + (padding * 2)}`;
            
            svgMapa.setAttribute('viewBox', novoViewBox);
            
            // A classe de zoom é adicionada ao CONTAINER, não ao objeto
            mapaContainer.classList.add('zoom-ativo');
            regiaoElement.classList.add('foco');
            
            btnVoltar.classList.remove('hidden');
            console.log(`Zoom na região: ${regiaoElement.id}`);
        };

        const resetarZoom = () => {
            svgMapa.setAttribute('viewBox', viewBoxOriginal);
            mapaContainer.classList.remove('zoom-ativo');
            
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
            console.log("Zoom resetado.");
        };

        const exibirInfoMunicipio = (municipioElement) => {
            const municipioId = municipioElement.dataset.id || municipioElement.id;
            const dados = dadosMunicipios[municipioId];

            if (elementoSelecionado) {
                elementoSelecionado.classList.remove('selecionado');
            }

            municipioElement.classList.add('selecionado');
            elementoSelecionado = municipioElement;
            console.log(`Exibindo informações de: ${municipioId}`);

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
            regiao.addEventListener('click', (event) => {
                // CORREÇÃO: Usamos mapaContainer, que está acessível aqui.
                if (mapaContainer.classList.contains('zoom-ativo')) return;
                event.stopPropagation();
                zoomNaRegiao(regiao);
            });
        });

        todosOsBairros.forEach(bairro => {
            bairro.addEventListener('click', (event) => {
                 // CORREÇÃO: Usamos mapaContainer, que está acessível aqui.
                if (!mapaContainer.classList.contains('zoom-ativo')) return;
                event.stopPropagation();
                exibirInfoMunicipio(bairro);
            });
        });
        
        btnVoltar.addEventListener('click', resetarZoom);

        console.log("Tudo pronto! O mapa está interativo.");
    });

    mapaObjeto.addEventListener('error', () => {
        console.error("ERRO: O arquivo 'mapa.svg' não pôde ser carregado. Verifique o nome e o caminho do arquivo no seu index.html.");
    });
});