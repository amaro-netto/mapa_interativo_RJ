document.addEventListener('DOMContentLoaded', () => {

    // --- BANCO DE DADOS DOS MUNICÍPIOS ---
    const dadosMunicipios = {
        // Região 01
        japeri: { nome: "Japeri", descricao: "Descrição de Japeri..." },
        duque_de_caxias: { nome: "Duque de Caxias", descricao: "Descrição de Duque de Caxias..." },
        nova_iguaçu: { nome: "Nova Iguaçu", descricao: "Descrição de Nova Iguaçu..." },
        mesquita: { nome: "Mesquita", descricao: "Descrição de Mesquita..." },
        nilopolis: { nome: "Nilópolis", descricao: "Descrição de Nilópolis..." },
        sao_joao_de_meriti: { nome: "São João de Meriti", descricao: "Descrição de São João de Meriti..." },
        belford_roxo: { nome: "Belford Roxo", descricao: "Descrição de Belford Roxo..." },
        queimados: { nome: "Queimados", descricao: "Descrição de Queimados..." },

        // Região 02
        mage: { nome: "Magé", descricao: "Descrição de Magé..." },
        guapimirim: { nome: "Guapimirim", descricao: "Descrição de Guapimirim..." },
        itaborai: { nome: "Itaboraí", descricao: "Descrição de Itaboraí..." },
        tangua: { nome: "Tanguá", descricao: "Descrição de Tanguá..." },
        niteroi: { nome: "Niterói", descricao: "Descrição de Niterói..." },
        sao_goncalo: { nome: "São Gonçalo", descricao: "Descrição de São Gonçalo..." },

        // Região 03
        rio_bonito: { nome: "Rio Bonito", descricao: "Descrição de Rio Bonito..." },
        marica: { nome: "Maricá", descricao: "Descrição de Maricá..." },
        saquarema: { nome: "Saquarema", descricao: "Descrição de Saquarema..." },
        silva_jardim: { nome: "Silva Jardim", descricao: "Descrição de Silva Jardim..." },
        casimiro_de_abreu: { nome: "Casimiro de Abreu", descricao: "Descrição de Casimiro de Abreu..." },

        // Região 04
        quatis: { nome: "Quatis", descricao: "Descrição de Quatis..." },
        itatiaia: { nome: "Itatiaia", descricao: "Descrição de Itatiaia..." },
        resende: { nome: "Resende", descricao: "Descrição de Resende..." },
        rio_claro: { nome: "Rio Claro", descricao: "Descrição de Rio Claro..." },
        barra_mansa: { nome: "Barra Mansa", descricao: "Descrição de Barra Mansa..." },
        pirai: { nome: "Piraí", descricao: "Descrição de Piraí..." },
        porto_real: { nome: "Porto Real", descricao: "Descrição de Porto Real..." },
        pinheiral: { nome: "Pinheiral", descricao: "Descrição de Pinheiral..." },
        volta_redonda: { nome: "Volta Redonda", descricao: "Descrição de Volta Redonda..." },

        // Região 06
        com_levy_gasparian: { nome: "Comendador Levy Gasparian", descricao: "Descrição de Comendador Levy Gasparian..."},
        paty_do_alferes: { nome: "Paty do Alferes", descricao: "Descrição de Paty do Alferes..."},
        petropolis: { nome: "Petrópolis", descricao: "Descrição de Petrópolis..."},
        tres_rios: { nome: "Três Rios", descricao: "Descrição de Três Rios..."},
        paraiba_do_sul: { nome: "Paraíba do Sul", descricao: "Descrição de Paraíba do Sul..."},
        areal: { nome: "Areal", descricao: "Descrição de Areal..."},
        miguel_pereira: { nome: "Miguel Pereira", descricao: "Descrição de Miguel Pereira..."},

        // Região 07
        itaperuna: { nome: "Itaperuna", descricao: "Descrição de Itaperuna..." },
        miracema: { nome: "Miracema", descricao: "Descrição de Miracema..." },
        bom_jesus_de_itabapoana: { nome: "Bom Jesus de Itabapoana", descricao: "Descrição de Bom Jesus de Itabapoana..." },
        santo_antonio_de_padua: { nome: "Santo Antônio de Pádua", descricao: "Descrição de Santo Antônio de Pádua..." },
        itaocara: { nome: "Itaocara", descricao: "Descrição de Itaocara..." },
        varre_sai: { nome: "Varre-Sai", descricao: "Descrição de Varre-Sai..." },
        porciuncula: { nome: "Porciúncula", descricao: "Descrição de Porciúncula..." },
        cambuci: { nome: "Cambuci", descricao: "Descrição de Cambuci..." },
        laje_de_muriae: { nome: "Laje de Muriaé", descricao: "Descrição de Laje de Muriaé..." },
        aperibe: { nome: "Aperibé", descricao: "Descrição de Aperibé..." },
        sao_joao_de_uba: { nome: "São João de Ubá", descricao: "Descrição de São João de Ubá..."},
        natividade: { nome: "Natividade", descricao: "Descrição de Natividade..."},

        // Região 09
        seropedica: { nome: "Seropédica", descricao: "Descrição de Seropédica..." },
        itaguai: { nome: "Itaguaí", descricao: "Descrição de Itaguaí..." },
        mangaratiba: { nome: "Mangaratiba", descricao: "Descrição de Mangaratiba..." },
        angra: { nome: "Angra dos Reis", descricao: "Descrição de Angra dos Reis..." },
        paraty: { nome: "Paraty", descricao: "Descrição de Paraty..." },
    };

    const mapaContainer = document.getElementById('mapa-container');
    const mapaObjeto = document.getElementById('mapa-objeto');
    const painelInfo = document.getElementById('info-painel');
    const btnVoltar = document.getElementById('btn-voltar');

    mapaObjeto.addEventListener('load', () => {
        const svgDoc = mapaObjeto.contentDocument;
        const svgMapa = svgDoc.documentElement;
        
        const viewBoxOriginal = svgMapa.getAttribute('viewBox');
        let bairroSelecionadoAnteriormente = null;

        const todasAsRegioes = svgDoc.querySelectorAll('.regiao');
        const todosOsBairros = svgDoc.querySelectorAll('.bairro');

        const zoomNaRegiao = (regiaoElement) => {
            const bbox = regiaoElement.getBBox();
            const padding = 20;
            const novoViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + (padding * 2)} ${bbox.height + (padding * 2)}`;
            
            svgMapa.setAttribute('viewBox', novoViewBox);
            mapaContainer.classList.add('zoom-ativo');
            regiaoElement.classList.add('foco');
            btnVoltar.classList.remove('hidden');
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
    });
});