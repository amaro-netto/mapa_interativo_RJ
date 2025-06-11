// Espera o HTML ser completamente carregado antes de executar qualquer código.
// Isso evita erros de tentar manipular elementos que ainda não existem.
document.addEventListener('DOMContentLoaded', () => {

    // --- ARMAZENAMENTO DE DADOS ---
    // Em um projeto real, isso poderia vir de um banco de dados ou uma API.
    // Aqui, usamos um objeto JavaScript para guardar as informações de cada bairro.
    // A chave do objeto (ex: "copacabana") DEVE ser a mesma do 'id' no SVG.
    const dadosBairros = {
        copacabana: {
            nome: "Copacabana",
            descricao: "Famosa por sua praia em forma de meia-lua, Copacabana é um dos bairros mais vibrantes do Rio, conhecido mundialmente.",
            area: "4.1 km²",
            pontos: [
                { nome: "Sede Principal", endereco: "Av. Atlântica, 1702" },
                { nome: "Filial Praia", endereco: "Rua Figueiredo de Magalhães, 55" }
            ]
        },
        tijuca: {
            nome: "Tijuca",
            descricao: "Um bairro tradicional da Zona Norte, lar do Parque Nacional da Tijuca, uma das maiores florestas urbanas do mundo.",
            area: "10.1 km²",
            pontos: [
                { nome: "Centro de Operações", endereco: "Rua Conde de Bonfim, 300" }
            ]
        },
        'barra-da-tijuca': { // IDs com hífen precisam estar entre aspas
            nome: "Barra da Tijuca",
            descricao: "Conhecida por suas longas praias, shoppings de luxo e condomínios. É um dos bairros que mais crescem na cidade.",
            area: "49.3 km²",
            pontos: [] // Este bairro não tem pontos de interesse no nosso exemplo
        },
        centro: {
            nome: "Centro",
            descricao: "O coração histórico e financeiro do Rio, com uma rica arquitetura e grande importância cultural.",
            area: "5.7 km²",
            pontos: [
                { nome: "Edifício Histórico", endereco: "Praça XV de Novembro, 1" },
                { nome: "Escritório Central", endereco: "Av. Rio Branco, 156" }
            ]
        }
    };

    // --- SELEÇÃO DE ELEMENTOS DO HTML ---
    // Guardamos os elementos que vamos manipular em constantes para fácil acesso.
    const todosOsBairros = document.querySelectorAll('.bairro'); // Pega TODOS os elementos com a classe .bairro
    const painelInfo = document.getElementById('info-painel'); // Pega o painel de informações
    let bairroSelecionadoAnteriormente = null; // Variável para guardar quem foi o último clicado

    // --- FUNÇÃO PRINCIPAL PARA ATUALIZAR O PAINEL ---
    function exibirInfoBairro(bairroId) {
        // Busca os dados do bairro clicado no nosso objeto 'dadosBairros'
        const dados = dadosBairros[bairroId];

        // Se não encontrar dados para o ID, mostra uma mensagem padrão.
        if (!dados) {
            painelInfo.innerHTML = '<h2>Informações não disponíveis.</h2>';
            return; // Encerra a função aqui
        }

        // Monta o HTML dos pontos de interesse
        let pontosHtml = '';
        if (dados.pontos.length > 0) {
            pontosHtml = '<h4>Sedes e Prédios:</h4>';
            dados.pontos.forEach(ponto => {
                pontosHtml += `
                    <div class="ponto-interesse">
                        <strong>${ponto.nome}</strong><br>
                        <span>${ponto.endereco}</span>
                    </div>
                `;
            });
        } else {
            pontosHtml = '<p>Não há sedes ou prédios registrados neste bairro.</p>';
        }

        // Atualiza o conteúdo do painel com as informações do bairro
        painelInfo.innerHTML = `
            <h2>${dados.nome}</h2>
            <p>${dados.descricao}</p>
            <strong>Área:</strong> ${dados.area}
            <hr>
            ${pontosHtml}
        `;
    }

    // --- ADICIONANDO OS "OUVINTES DE EVENTO" (EVENT LISTENERS) ---
    // Passamos por cada bairro do mapa e dizemos o que fazer quando ele for clicado.
    todosOsBairros.forEach(bairro => {
        bairro.addEventListener('click', () => {
            // Remove a classe 'selecionado' do bairro que estava selecionado antes (se houver)
            if (bairroSelecionadoAnteriormente) {
                bairroSelecionadoAnteriormente.classList.remove('selecionado');
            }
            
            // Adiciona a classe 'selecionado' ao bairro que acabou de ser clicado
            bairro.classList.add('selecionado');
            
            // Atualiza a nossa variável de controle
            bairroSelecionadoAnteriormente = bairro;

            // Chama a função para exibir as informações, passando o ID do bairro clicado
            exibirInfoBairro(bairro.id);
        });
    });
});