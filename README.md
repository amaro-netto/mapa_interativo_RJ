# 🗺️ Template de Mapa Interativo - Dashboard Geoespacial

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) [![Status](https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-yellow?style=for-the-badge&logo=apache-spark)](https://github.com)

> **Nota:** Este projeto é um módulo front-end desenvolvido para servir como uma camada de visualização e interação para um sistema de gestão de dados mais amplo. Ele foi construído como um modelo robusto e extensível, pronto para ser adaptado para diversas aplicações de Business Intelligence e controle operacional.

---

## 📄 Visão Geral do Projeto

Este projeto é uma interface de mapa interativo do estado do Rio de Janeiro, projetada para ser a porta de entrada visual para um sistema de dados complexo. A aplicação permite que usuários explorem o estado em múltiplos níveis — de macrorregiões a municípios — para consultar informações específicas de cada localidade de forma intuitiva.

A ideia central é fornecer um *template* funcional que possa ser facilmente integrado a um backend e a um banco de dados, permitindo que diferentes departamentos (TI, Contabilidade, Operações, etc.) visualizem seus dados de forma geoespacial.

![Screenshot do Projeto](https://github.com/user-attachments/assets/fed41392-dbef-46ac-809e-3c21a6b5018f)

## ✨ Funcionalidades Atuais (Fase 1)

* **Mapa Vetorial (SVG) Otimizado:** Utiliza um mapa SVG detalhado, com caminhos simplificados para garantir performance e carregamento rápido.
* **Navegação em Múltiplos Níveis:** O usuário pode clicar em uma região para dar um zoom suave e focar nos municípios que a compõem.
* **Interatividade Total:**
    * Regiões e municípios destacam-se com o passar do mouse.
    * Cliques em regiões ativam o zoom e isolam a área de interesse.
    * Cliques em municípios exibem dados específicos em um painel lateral.
* **Estrutura de Dados Modular:** As informações de cada região são carregadas de arquivos `.js` separados (na pasta `/data`), facilitando a manutenção.
* **Layout Estável e Responsivo:** A interface se adapta a diferentes telas e o contêiner do mapa mantém sua proporção fixa, garantindo uma experiência de usuário fluida e sem quebras de layout durante as interações.

## 🛠️ Tecnologias e Ferramentas

* **Tecnologias:** HTML5, CSS3 (Flexbox), JavaScript (ES6+).
* **Ferramentas de Desenvolvimento:**
    * **Adobe Illustrator / Inkscape:** Para edição e estruturação inicial do arquivo vetorial.
    * **SVGOMG:** Ferramenta online para otimização e minificação do código SVG.
    * **Visual Studio Code + Extensão Live Server:** Ambiente de desenvolvimento para servir os arquivos localmente e evitar erros de CORS.

## 📂 Estrutura do Projeto

```

/mapa-interativo-rj/
|
|-- index.html              (A estrutura principal da página)
|-- style.css               (O estilo da página)
|-- script.js               (A lógica de interatividade e zoom)
|-- mapa.svg                (O arquivo com o desenho do mapa)
|
+-- /data/                  (Pasta para os dados de cada região)
    |-- regiao_1.js
    |-- regiao_2.js
    |-- ... (e assim por diante)

```

## 🚀 Como Executar

1.  Garanta que todos os arquivos e a pasta `/data` estejam no mesmo diretório.
2.  Se utilizar o **Visual Studio Code**, instale a extensão `Live Server`.
3.  Com a pasta do projeto aberta no VS Code, clique no botão **"Go Live"** no canto inferior direito.
4.  O projeto será aberto no seu navegador em um servidor local (ex: `http://127.0.0.1:5500`), o que é essencial para que o JavaScript possa interagir com o arquivo `mapa.svg`.

## 🔮 Potencial de Uso e Fase 2

A estrutura atual serve como uma base poderosa para inúmeras possibilidades. A **Fase 2** do projeto planeja integrar um banco de dados para transformar o mapa em um verdadeiro dashboard de Business Intelligence, exibindo dados específicos de acordo com o perfil do usuário.

#### Exemplos de Aplicação:

* **Para a Contabilidade:**
    * Visualizar quais agências/filiais existem em cada município.
    * Exibir o faturamento, custos e lucratividade de cada localidade ao clicar nela.
    * Destacar com cores diferentes as regiões com metas atingidas ou abaixo do esperado.

* **Para a TI:**
    * Controlar o inventário de equipamentos por filial.
    * Visualizar o número de chamados de suporte abertos ou atendidos por localidade.
    * Mapear a infraestrutura de rede e status de links.

* **Para Operações e Logística:**
    * Rastrear a localização de veículos da frota em tempo real.
    * Visualizar rotas de entrega e status de serviço por região.
    * Monitorar níveis de estoque em diferentes centros de distribuição.

* **Para Marketing e Vendas:**
    * Mapear o desempenho de vendas e a concentração de clientes por município.
    * Visualizar o alcance de campanhas de marketing regionais.
    * Analisar dados demográficos para planejar expansões.

* **Para Recursos Humanos:**
    * Visualizar a distribuição de colaboradores pelo estado.
    * Identificar filiais com vagas abertas ou necessidade de treinamento.

---
