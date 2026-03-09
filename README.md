# Case Itau - Fundos de Investimento (Frontend)

Dashboard de gestao de fundos de investimento desenvolvido com Angular 19+ e Tailwind CSS v4.

## Sobre o Projeto

Esta aplicacao e o **frontend** do case tecnico de gestao de fundos de investimento. Ela consome a API REST desenvolvida no repositorio backend:

- **Backend (API):** [case-itau-fundos-api](https://github.com/riqueamais/case-itau-fundos-api)

### Funcionalidades

- Listagem de fundos de investimento com dashboard de estatisticas
- Cadastro de novos fundos (codigo, nome, CNPJ, tipo)
- Edicao de fundos existentes
- Exclusao de fundos com dialogo de confirmacao
- Movimentacao de patrimonio (depositos e resgates)
- Formatacao de CNPJ e valores monetarios (BRL)

### Tipos de Fundo Suportados

| Codigo | Tipo             |
| ------ | ---------------- |
| 1      | Renda Fixa       |
| 2      | Renda Variavel   |
| 3      | Multimercado     |
| 4      | Cambial          |

## Tecnologias

- **Angular 19+** com standalone components e signals
- **Tailwind CSS v4** com tema customizado (cores Itau)
- **TypeScript 5.9**
- **Axios** para requisicoes HTTP
- **Reactive Forms** com validacao

## Pre-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 10
- Backend API rodando em `https://localhost:5001`

## Instalacao

```bash
# Clone o repositorio
git clone https://github.com/riqueamais/case-itau-fundos-front.git

# Acesse a pasta
cd case-itau-fundos-front

# Instale as dependencias
npm install
```

## Executando

```bash
# Inicie o servidor de desenvolvimento
npm start
```

Acesse `http://localhost:4200` no navegador.

> **Importante:** A API backend deve estar rodando para que a aplicacao funcione corretamente. Consulte o [repositorio da API](https://github.com/riqueamais/case-itau-fundos-api) para instrucoes de execucao.

## Build

```bash
npm run build
```

Os artefatos de build serao gerados no diretorio `dist/`.

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── models/        # Interfaces e tipos (Fundo, requests)
│   │   └── services/      # Servicos HTTP (FundoService)
│   ├── features/
│   │   └── fundos/
│   │       ├── fundos-list/       # Dashboard principal com listagem
│   │       ├── fundo-form/        # Formulario de criacao/edicao
│   │       └── patrimonio-form/   # Formulario de movimentacao
│   ├── shared/
│   │   ├── components/
│   │   │   ├── header/            # Cabecalho com branding Itau
│   │   │   ├── modal/             # Modal reutilizavel
│   │   │   └── confirm-dialog/    # Dialogo de confirmacao
│   │   └── pipes/
│   │       └── cnpj.pipe.ts       # Pipe de formatacao CNPJ
│   ├── app.ts              # Componente raiz
│   ├── app.config.ts        # Configuracao (locale pt-BR, router)
│   └── app.routes.ts        # Rotas da aplicacao
├── styles.css               # Estilos globais + tema Tailwind
└── index.html               # HTML principal
```
