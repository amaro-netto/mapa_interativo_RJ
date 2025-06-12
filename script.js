document.addEventListener('DOMContentLoaded', () => {

    // --- BANCO DE DADOS DOS MUNICÍPIOS ---
    // A chave (ex: "mage") deve ser IGUAL ao 'id' do município no SVG.
    // Para municípios com várias partes (ilhas), usamos o 'data-id'.
    const dadosMunicipios = {
        // Região 01
        japeri: { nome: "Japeri", descricao: "Japeri é um município da Baixada Fluminense, conhecido por sua estação de trem histórica e áreas de preservação ambiental." },
        duque_de_caxias: { nome: "Duque de Caxias", descricao: "Um dos mais populosos e economicamente importantes municípios da Baixada Fluminense, com uma grande refinaria de petróleo." },
        nova_iguaçu: { nome: "Nova Iguaçu", descricao: "Conhecido por sua vasta área territorial e forte centro comercial." },
        mesquita: { nome: "Mesquita", descricao: "Município da Baixada Fluminense, desmembrado de Nova Iguaçu." },
        nilopolis: { nome: "Nilópolis", descricao: "Famoso por ser o berço da escola de samba Beija-Flor." },
        sao_joao_de_meriti: { nome: "São João de Meriti", descricao: "Conhecido como o 'formigueiro das Américas' devido à sua alta densidade demográfica." },
        belford_roxo: { nome: "Belford Roxo", descricao: "Município da Baixada Fluminense com uma rica história ligada à expansão ferroviária." },
        queimados: { nome: "Queimados", descricao: "Cidade com crescente desenvolvimento industrial na Baixada Fluminense." },

        // Região 02
        mage: { nome: "Magé", descricao: "Município histórico da Baixada Fluminense, com rica herança do período colonial e belezas naturais." },
        guapimirim: { nome: "Guapimirim", descricao: "Famoso por abrigar parte do Parque Nacional da Serra dos Órgãos, sendo um destino de ecoturismo." },
        itaborai: { nome: "Itaboraí", descricao: "Conhecido pelo Complexo Petroquímico do Rio de Janeiro (COMPERJ)." },
        tangua: { nome: "Tanguá", descricao: "Conhecido por suas plantações de laranja e por ser um município tranquilo da região metropolitana." },

        // Região 03
        rio_bonito: { nome: "Rio Bonito", descricao: "Município com forte vocação agropecuária e que serve como um importante entroncamento rodoviário." },
        marica: { nome: "Maricá", descricao: "Conhecida por suas lagoas, praias e pela política de renda básica de cidadania." },
        saquarema: { nome: "Saquarema", descricao: "Considerada a 'Capital Nacional do Surf', com praias famosas por suas ondas." },
        silva_jardim: { nome: "Silva Jardim", descricao: "Lar da Reserva Biológica Poço das Antas, principal refúgio do mico-leão-dourado." },
        casimiro_de_abreu: { nome: "Casimiro de Abreu", descricao: "Terra do poeta que lhe dá nome, famosa pelo turismo rural e de aventura." },
        
        // Região 04
        quatis: { nome: "Quatis", descricao: "Pequeno e acolhedor município no Vale do Paraíba Fluminense." },
        itatiaia: { nome: "Itatiaia", descricao: "Sede do Parque Nacional do Itatiaia, o primeiro parque nacional do Brasil, famoso por suas montanhas e trilhas." },
        resende: { nome: "Resende", descricao: "Importante polo industrial, militar (sede da AMAN) e universitário." },
        rio_claro: { nome: "Rio Claro", descricao: "Conhecido por suas fazendas históricas do ciclo do café e belezas naturais." },
        barra_mansa: { nome: "Barra Mansa", descricao: "Importante centro siderúrgico e ferroviário no sul do estado." },
        pirai: { nome: "Piraí", descricao: "Cidade histórica do Vale do Café, conhecida também pela Represa de Ribeirão das Lajes." },
        porto_real: { nome: "Porto Real", descricao: "Única colônia finlandesa no Brasil, com forte influência cultural e industrial." },
        pinheiral: { nome: "Pinheiral", descricao: "Município com forte tradição na pecuária leiteira e agricultura." },
        volta_redonda: { nome: "Volta Redonda", descricao: "Conhecida como a 'Cidade do Aço' por abrigar a Companhia Siderúrgica Nacional (CSN)." },
        
        // Região 09
        seropedica: { nome: "Seropédica", descricao: "Município conhecido por abrigar a Universidade Federal Rural do Rio de Janeiro (UFRRJ)." },
        itaguai: { nome: "Itaguaí", descricao: "Local de grande importância com o Porto de Itaguaí, um dos maiores do país." },
        mangaratiba: { nome: "Mangaratiba", descricao: "Belo município da Costa Verde, com praias, ilhas e resorts." },
        angra: { nome: "Angra dos Reis", descricao: "Famosa por suas 365 ilhas, incluindo a Ilha Grande, e usinas nucleares." },
        paraty: { nome: "Paraty", descricao: "Cidade histórica colonial, Patrimônio Mundial da UNESCO, conhecida por sua arquitetura, cultura e natureza exuberante." },

        // Adicione aqui as informações para todos os outros bairros que você nomear...
    };

    const mapaObjeto = document.getElementById('mapa-objeto');
    const painelInfo = document.getElementById('info-painel');
    const btnVoltar = document.getElementById('btn-voltar');

    // Espera o SVG ser completamente carregado dentro da tag <object>
    mapaObjeto.addEventListener('load', () => {
        const svgDoc = mapaObjeto.contentDocument;
        const svgMapa = svgDoc.documentElement;
        
        const viewBoxOriginal = svgMapa.getAttribute('viewBox');
        let bairroSelecionadoAnteriormente = null;

        const todasAsRegioes = svgDoc.querySelectorAll('.regiao');
        const todosOsBairros = svgDoc.querySelectorAll('.bairro');

        // Função para dar zoom em uma região
        const zoomNaRegiao = (regiaoElement) => {
            const bbox = regiaoElement.getBBox();
            const padding = 20;
            const novoViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + (padding * 2)} ${bbox.height + (padding * 2)}`;
            
            svgMapa.setAttribute('viewBox', novoViewBox);
            mapaContainer.classList.add('zoom-ativo');
            regiaoElement.classList.add('foco');
            btnVoltar.classList.remove('hidden');
        };

        // Função para resetar o zoom
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
        };

        // Função para exibir as informações de um município
        const exibirInfoMunicipio = (municipioElement) => {
            // Lógica inteligente: usa o 'data-id' para grupos de ilhas, ou o 'id' normal
            const municipioId = municipioElement.dataset.id || municipioElement.id;
            const dados = dadosMunicipios[municipioId];

            if (bairroSelecionadoAnteriormente) {
                bairroSelecionadoAnteriormente.classList.remove('selecionado');
            }
            municipioElement.classList.add('selecionado');
            bairroSelecionadoAnteriormente = municipioElement;

            if (dados) {
                painelInfo.innerHTML = `
                    <h2>${dados.nome}</h2>
                    <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                `;
            } else {
                painelInfo.innerHTML = `
                    <h2>${municipioId.replace(/_/g, " ")}</h2>
                    <p>Dados para este município ainda não cadastrados.</p>
                `;
            }
        };

        // --- EVENTOS DE CLIQUE ---

        // 1. Adiciona listener de clique para CADA REGIÃO
        todasAsRegioes.forEach(regiao => {
            regiao.addEventListener('click', (event) => {
                if (mapaContainer.classList.contains('zoom-ativo')) return;
                event.stopPropagation();
                zoomNaRegiao(regiao);
            });
        });

        // 2. Adiciona listener de clique para CADA BAIRRO/MUNICÍPIO
        todosOsBairros.forEach(bairro => {
            bairro.addEventListener('click', (event) => {
                // Só funciona se o zoom estiver ativo
                if (!mapaContainer.classList.contains('zoom-ativo')) return;
                event.stopPropagation();
                exibirInfoMunicipio(bairro);
            });
        });
        
        // 3. Adiciona listener para o botão de voltar
        btnVoltar.addEventListener('click', resetarZoom);
    });
});