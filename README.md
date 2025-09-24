# Registro de Experimentos - Frontend

Este projeto é uma aplicação web desenvolvida com **React**, **TypeScript** e **Vite** para facilitar o gerenciamento de experimentos científicos, utilizando personagens fictícios da API do Rick and Morty como exemplo. O objetivo é oferecer uma interface intuitiva para pesquisadores e equipes de laboratório organizarem protocolos, agendamentos e registros de experimentos de forma visual e prática.

## Utilidade do Projeto

A aplicação foi criada para ajudar equipes de pesquisa a:

- **Registrar experimentos**: Permite cadastrar protocolos experimentais e associá-los a personagens (representando amostras ou pacientes fictícios).
- **Visualizar dados**: Oferece diferentes formas de visualização dos experimentos, como lista, calendário e agendamento, facilitando o acompanhamento das atividades do laboratório.
- **Agendar protocolos**: Possibilita marcar datas e horários para execução de protocolos, evitando conflitos e melhorando a organização do fluxo de trabalho.
- **Buscar e filtrar personagens**: Ajuda a encontrar rapidamente amostras ou pacientes fictícios para associar aos experimentos.
- **Simular cenários reais**: Utilizando dados da Rick and Morty API, o sistema serve como um ambiente de demonstração para equipes que desejam testar funcionalidades antes de aplicar em dados reais.

Este projeto pode ser adaptado para diferentes áreas da saúde, biologia, veterinária ou qualquer contexto que envolva registro e agendamento de experimentos.

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)
- CSS Modules

## Funcionalidades

- Visualização dos experimentos em formato de **lista**, **calendário** ou **agendamento**
- Busca por personagens
- Agendamento de protocolos para personagens
- Visualização dos protocolos agendados por data

## Como rodar o projeto

1. Instale as dependências:
   ```npm install ```

2. Inicie o servidor de desenvolvimento:
   ```npm run dev```

3. Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera a versão de produção
- `npm run preview` — executa o preview da build
- `npm run lint` — executa o ESLint

## Observações

- Os dados são obtidos da [Rick and Morty API](https://rickandmortyapi.com/).
- O projeto é apenas frontend e não possui integração com backend próprio.