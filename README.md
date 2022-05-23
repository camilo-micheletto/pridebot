# pridebot

## 💻 Construido com
- [NodeJS](https://nodejs.dev/) - Servidor de Javascript
- [Express.JS](https://expressjs.com/pt-br/) - Framework pra NodeJS
- [@slack/bolt](https://api.slack.com/bolt) - Framework para criação de Slack Apps
- [google-spreadsheet](https://theoephraim.github.io/node-google-spreadsheet/#/) - Lib wrapper para a [Google Sheets API](https://theoephraim.github.io/node-google-spreadsheet/#/)

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

* Ter a versão do node `>=v14.19.1` instalada

## 🚀 Instalando Pridebot

Para usar o pridebot localmente, siga as seguintes etapas:

Instale as dependências
```
npm i
```

Crie um arquivo .env 
```
touch .env
```

Preencha o arquivo .env com as chaves nescessárias:
```
SLACK_SIGNING_SECRET= <hash>
SLACK_BOT_TOKEN= <xoxb-key>
SLACK_APP_TOKEN= <xapp-key>

GOOGLE_KEY= <private-key>
GOOGLE_SHEET= <sheet-hash>
GOOGLE_EMAIL= <google-api-user-email>
```

Para configurar as keys referentes ao bot do slack, você precisa configurar o bot em seu workspace conforme a documentação do [bolt nas sessões Create an app e Tokens and installing apps](https://slack.dev/bolt-js/tutorial/getting-started#create-an-app).

Pra configurar as keys do google sheets basta seguir [esse tutorial de Google API pra Node](https://jvvoliveira.medium.com/manipulando-google-sheets-com-node-js-4a551c68b270)


## ☕ Usando Pridebot

Hoje o Pridebot consome as informações de uma planilha Google pra que pessoas da empresa possam contribuir facilmente com pouco conhecimento técnico.

A API do google sheets espera **3 cabeçalhos** que você pode configurar em `services/gsServices.js`:
| termos | explicacao | sugestao |
| --- | --- | --- |
| Termos a serem corrigidos, aceita patterns de regex | explicação do porque precisamos substituir esses termos | sugestões de palavras novas pra utilizar |

A resposta do bot foi feita usando o [Block Kit builder](https://app.slack.com/block-kit-builder), com ela você pode construir respostas customizadas contento botões e até call to actions.


## 📝 Licença

Esse projeto está sob licença MIT. Veja o arquivo [LICENÇA](LICENSE.md) para mais detalhes.

[⬆ Voltar ao topo](#pridebot)<br>
