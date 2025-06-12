document.addEventListener('DOMContentLoaded', () => {

    // --- MONTAGEM DO BANCO DE DADOS COMPLETO ---
    // Junta todos os objetos de dados (dados_regiao_1, dados_regiao_2, etc.) em um único objeto.
    const dadosMunicipios = Object.assign({},
        dados_regiao_1,
        dados_regiao_2,
        dados_regiao_3,
        dados_regiao_4,
        dados_regiao_5,
        dados_regiao_6,
        dados_regiao_7,
        dados_regiao_8,
        dados_regiao_9,
        dados_regiao_10,
        dados_regiao_11,
        dados_regiao_12,
        dados_regiao_capital
        // Adicione aqui as variáveis de todas as suas regiões
    );
    
    console.log("Dados de todos os municípios carregados:", dadosMunicipios);

    // --- SELEÇÃO DOS ELEMENTOS PRINCIPAIS ---
    const mapaContainer = document.getElementById('mapa-container');
    const mapaObjeto = document.getElementById('mapa-objeto');
    const painelInfo = document.getElementById('info-painel');
    const btnVoltar = document.getElementById('btn-voltar');

    // --- LÓGICA PRINCIPAL ---
    
    // Espera o SVG ser completamente carregado dentro da tag <object>
    mapaObjeto.addEventListener('load', () => {
        console.log("Mapa SVG carregado com sucesso!");

        const svgDoc = mapaObjeto.contentDocument;
        if (!svgDoc) {
            console.error("Erro: Não foi possível acessar o conteúdo do SVG. Verifique se o arquivo mapa.svg está na mesma pasta e sem erros.");
            return;
        }

        const svgMapa = svgDoc.documentElement;
        const todasAsRegioes = svgDoc.querySelectorAll('.regiao');
        const todosOsBairros = svgDoc.querySelectorAll('.bairro');
        
        console.log(`Encontradas ${todasAsRegioes.length} regiões e ${todosOsBairros.length} bairros/municípios.`);

        const viewBoxOriginal = svgMapa.getAttribute('viewBox');
        let bairroSelecionadoAnteriormente = null;

        // --- FUNÇÕES AUXILIARES ---

        const zoomNaRegiao = (regiaoElement) => {
            const bbox = regiaoElement.getBBox();
            const padding = 20;
            const novoViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + (padding * 2)} ${bbox.height + (padding * 2)}`;
            
            svgMapa.setAttribute('viewBox', novoViewBox);
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
            
            if (bairroSelecionadoAnteriormente) {
                bairroSelecionadoAnteriormente.classList.remove('selecionado');
                bairroSelecionadoAnteriormente = null;
            }
            console.log("Zoom resetado.");
        };

        const exibirInfoMunicipio = (municipioElement) => {
            // Lógica para lidar com municípios de várias partes (como ilhas)
            const municipioId = municipioElement.dataset.id || municipioElement.id;
            const dados = dadosMunicipios[municipioId];

            if (bairroSelecionadoAnteriormente) {
                bairroSelecionadoAnteriormente.classList.remove('selecionado');
            }

            municipioElement.classList.add('selecionado');
            bairroSelecionadoAnteriormente = municipioElement;
            console.log(`Exibindo informações de: ${municipioId}`);

            if (dados) {
                painelInfo.innerHTML = `
                    <h2>${dados.nome}</h2>
                    <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                `;
            } else {
                painelInfo.innerHTML = `
                    <h2>${municipioId.replace(/_/g, " ").replace(/-/g, " ")}</h2>
                    <p>Dados para este município ainda não cadastrados.</p>
                `;
            }
        };

        // --- ADICIONANDO OS EVENTOS DE CLIQUE ---

        todasAsRegioes.forEach(regiao => {
            regiao.addEventListener('click', (event) => {
                if (mapaContainer.classList.contains('zoom-ativo')) return;
                event.stopPropagation();
                zoomNaRegiao(regiao);
            });
        });

        todosOsBairros.forEach(bairro => {
            bairro.addEventListener('click', (event) => {
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