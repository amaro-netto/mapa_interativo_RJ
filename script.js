// Espera o HTML principal da página ser carregado para começar a rodar o script.
document.addEventListener('DOMContentLoaded', () => {

    // --- BANCO DE DADOS (em formato de objeto JavaScript) ---
    // Aqui guardamos as informações de cada bairro. 
    // A chave (ex: "mage") deve ser EXATAMENTE IGUAL ao 'id' que você deu ao bairro no arquivo SVG.
    const dadosBairros = {
        // Região 01
        japeri: {
            nome: "Japeri",
            descricao: "Japeri é um município da Baixada Fluminense, conhecido por sua estação de trem histórica e áreas de preservação ambiental."
        },
        duque_de_caxias: {
            nome: "Duque de Caxias",
            descricao: "Um dos mais populosos e economicamente importantes municípios da Baixada Fluminense, com uma grande refinaria de petróleo."
        },
        // Adicionei os outros que você nomeou para você ver funcionando!
        nova_iguaçu: { nome: "Nova Iguaçu", descricao: "Descrição de Nova Iguaçu..." },
        mesquita: { nome: "Mesquita", descricao: "Descrição de Mesquita..." },
        nilopolis: { nome: "Nilópolis", descricao: "Descrição de Nilópolis..." },
        sao_joao_de_meriti: { nome: "São João de Meriti", descricao: "Descrição de São João de Meriti..." },
        belford_roxo: { nome: "Belford Roxo", descricao: "Descrição de Belford Roxo..." },
        queimados: { nome: "Queimados", descricao: "Descrição de Queimados..." },

        // Região 02
        mage: {
            nome: "Magé",
            descricao: "Município histórico da Baixada Fluminense, com rica herança do período colonial e belezas naturais."
        },
        guapimirim: { nome: "Guapimirim", descricao: "Famoso por abrigar parte do Parque Nacional da Serra dos Órgãos, sendo um destino de ecoturismo." },
        itaborai: { nome: "Itaboraí", descricao: "Conhecido pelo Complexo Petroquímico do Rio de Janeiro (COMPERJ)." },
        tangua: { nome: "Tanguá", descricao: "Conhecido por suas plantações de laranja e por ser um município tranquilo da região metropolitana." },
        
        // Região 03
        rio_bonito: {
            nome: "Rio Bonito",
            descricao: "Município com forte vocação agropecuária e que serve como um importante entroncamento rodoviário."
        },
        
        // Adicione aqui as informações para todos os outros bairros que você nomeou...
    };

    // --- SELEÇÃO DOS ELEMENTOS PRINCIPAIS ---
    const mapaObjeto = document.getElementById('mapa-objeto');
    const painelInfo = document.getElementById('info-painel');
    const btnVoltar = document.getElementById('btn-voltar');

    // --- LÓGICA DO MAPA ---

    // O mapa é carregado de um arquivo externo (<object>), então precisamos esperar o evento 'load'
    mapaObjeto.addEventListener('load', () => {
        
        // Agora que o mapa carregou, podemos acessar seu conteúdo
        const svgDoc = mapaObjeto.contentDocument;
        const svgMapa = svgDoc.getElementById('mapa-rio');
        const todasAsRegioes = svgDoc.querySelectorAll('.regiao');

        // Guarda o viewBox original para poder resetar o zoom
        const viewBoxOriginal = svgMapa.getAttribute('viewBox');
        let bairroSelecionadoAnteriormente = null;

        // --- FUNÇÕES AUXILIARES ---

        // Função para dar zoom em uma região
        const zoomNaRegiao = (regiaoElement) => {
            // Pega as dimensões e a posição do grupo da região
            const bbox = regiaoElement.getBBox();

            // Adiciona uma margem (padding) para a região não ficar colada nas bordas
            const padding = 20;
            const novoViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + (padding * 2)} ${bbox.height + (padding * 2)}`;
            
            // Aplica o novo viewBox ao SVG, criando o efeito de zoom
            svgMapa.setAttribute('viewBox', novoViewBox);
            
            // Adiciona classes para o CSS controlar a visibilidade e os cliques
            mapaObjeto.classList.add('zoom-ativo');
            regiaoElement.classList.add('foco');
            
            // Mostra o botão de voltar
            btnVoltar.classList.remove('hidden');
        };

        // Função para resetar o zoom e voltar à visão geral
        const resetarZoom = () => {
            svgMapa.setAttribute('viewBox', viewBoxOriginal);
            mapaObjeto.classList.remove('zoom-ativo');
            
            // Limpa a classe 'foco' de qualquer região que a tenha
            const regiaoEmFoco = svgDoc.querySelector('.regiao.foco');
            if (regiaoEmFoco) {
                regiaoEmFoco.classList.remove('foco');
            }

            // Esconde o botão de voltar
            btnVoltar.classList.add('hidden');

            // Reseta o painel de informações
            painelInfo.innerHTML = '<h2>Selecione uma Região</h2><p>Clique em uma área do mapa para começar a explorar.</p>';

            // Remove a seleção de qualquer bairro
            if (bairroSelecionadoAnteriormente) {
                bairroSelecionadoAnteriormente.classList.remove('selecionado');
                bairroSelecionadoAnteriormente = null;
            }
        };

        // Função para exibir as informações de um bairro clicado
        const exibirInfoBairro = (bairroElement) => {
            const bairroId = bairroElement.id;
            const dados = dadosBairros[bairroId];

            // Remove a seleção do bairro anterior
            if (bairroSelecionadoAnteriormente) {
                bairroSelecionadoAnteriormente.classList.remove('selecionado');
            }

            // Adiciona a classe de seleção ao bairro atual e o armazena
            bairroElement.classList.add('selecionado');
            bairroSelecionadoAnteriormente = bairroElement;

            if (dados) {
                painelInfo.innerHTML = `
                    <h2>${dados.nome}</h2>
                    <p>${dados.descricao || "Nenhuma descrição disponível."}</p>
                    `;
            } else {
                painelInfo.innerHTML = `
                    <h2>${bairroId.replace(/_/g, " ")}</h2>
                    <p>Informações não disponíveis para este município.</p>
                `;
            }
        };


        // --- EVENTOS DE CLIQUE ---

        // 1. Adiciona um listener de clique para CADA REGIÃO
        todasAsRegioes.forEach(regiao => {
            regiao.addEventListener('click', (event) => {
                // Se já estivermos com zoom, não faz nada (o CSS já ajuda com isso)
                if (mapaObjeto.classList.contains('zoom-ativo')) return;

                // Para o clique de se propagar para o mapa e chamar outros eventos
                event.stopPropagation();
                
                zoomNaRegiao(regiao);
            });

            // Adiciona um listener para cada bairro DENTRO da região
            const bairrosDaRegiao = regiao.querySelectorAll('.bairro');
            bairrosDaRegiao.forEach(bairro => {
                bairro.addEventListener('click', (event) => {
                    // Para o clique de se propagar para a região
                    event.stopPropagation();
                    exibirInfoBairro(bairro);
                });
            });
        });

        // 2. Adiciona o listener para o botão de voltar
        btnVoltar.addEventListener('click', resetarZoom);

    });
});