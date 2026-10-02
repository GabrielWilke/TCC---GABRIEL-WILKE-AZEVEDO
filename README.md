# Robot Portal Global — Testes de API GPP (Cypress)

Testes automatizados da API GPP da Beontag (ambiente de homologação), com um painel web para escolher os testes, executá-los e consultar o histórico.

## Requisitos

| Ferramenta | Versão |
|---|---|
| [Node.js](https://nodejs.org/) | 20 ou superior (mínimo 18.17) |
| npm | o que acompanha o Node |
| Acesso à rede | à API de homologação (`api-gpp-homol.beontag.com`) |

O Cypress (v13) é instalado junto com as dependências do projeto, não precisa instalar à parte.

## Instalação

```bash
npm install
```

Em seguida, crie o arquivo `.env` a partir do modelo e preencha os valores:

```bash
cp .env.example .env        # Linux/macOS
copy .env.example .env      # Windows
```

> O `.env` contém credenciais e **não deve ser versionado** (já está no `.gitignore`).

## Configuração (`.env`)

Toda URL, endpoint, credencial e massa de dados fica no `.env`. Nenhum teste tem URL escrita no código.

| Variável | Para que serve |
|---|---|
| `PORT` | Porta do painel web (padrão `3000`) |
| `API_BASE_URL_HOMOL` / `API_BASE_URL_PROD` | URL base da API em cada ambiente |
| `ENDPOINT_*` | Caminho de cada recurso (`/v2/login`, `/v2/printer`, …) |
| `API_USERNAME` / `API_PASSWORD` | Usuário usado no login dos testes |
| `TENANT_GUID` / `SITE_GUID` / `LABEL_GUID` | Massa de dados usada nas requisições |

Se alguma variável estiver faltando, o Cypress não inicia e informa qual é.

## Como rodar

### Pelo painel web

```bash
npm start
```

Acesse <http://localhost:3000>. No painel é possível:

- ver todos os testes disponíveis;
- selecionar um ou mais testes e executá-los;
- ver o resultado da execução;
- consultar o histórico das últimas 50 execuções (salvo em `history.json`).

### Pela linha de comando

| Comando | O que faz |
|---|---|
| `npx cypress open` | Abre a interface do Cypress para rodar e depurar testes |
| `npx cypress run` | Roda todos os testes em modo headless |
| `npx cypress run --spec "e2e/**/Login/*.cy.js"` | Roda apenas uma pasta ou arquivo |
| `npm run test:login` | Roda só os testes de login |
| `npm run test:others` | Roda todos, exceto login |
| `npm run test:smart` | Roda login primeiro e, se passar, os demais |
| `npm run test:all` | Limpa relatórios, roda tudo e gera relatório HTML (Windows) |
| `npm run test:all-linux` | Mesmo que o anterior, para Linux/macOS |

O relatório HTML gerado pelo `test:all` fica em `cypress/reports/index.html`.

> **Atenção:** os testes de cadastro **criam, editam e apagam registros reais** no ambiente de homologação.

## Estrutura do projeto

```
├── e2e/GPP-API-Tests/Testes Homologação/
│   ├── Login/          # login válido e inválido
│   ├── Cadastros/      # CRUD de impressora, leitor, produto, site e usuário
│   └── Impressão/      # buscas usadas na impressão avulsa
├── support/
│   ├── commands.js     # comandos customizados (apiRequest, login, expectSuccess…)
│   └── e2e.js
├── fixtures/           # dados de exemplo
├── public/index.html   # painel web
├── server.js           # servidor do painel (Express)
├── cypress.config.js   # configuração do Cypress, lê o .env
├── .env.example        # modelo de configuração
└── history.json        # histórico de execuções do painel
```

## Escrevendo novos testes

1. Se o endpoint ainda não existir, adicione-o ao `.env` e ao `.env.example` (ex.: `ENDPOINT_LABEL=/v2/label`) e mapeie-o em `env.endpoints` no `cypress.config.js`.
2. Crie o arquivo `*.cy.js` dentro de `e2e/GPP-API-Tests/Testes Homologação/`. Ele aparece no painel automaticamente.
3. Use os comandos customizados:

```js
describe('Printer', () => {
  const tenantGuid = Cypress.env('tenantGuid');

  beforeEach(() => {
    cy.loginHomol();                    // login com as credenciais do .env
  });

  it('lista impressoras', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'printer',              // nome do endpoint em env.endpoints
      path: 'algum-guid',               // opcional: anexado ao final da URL
      qs: { tenantGuid }
    }).then((res) => {
      cy.expectSuccess(res);            // status 2xx + status.Message "Success!"
    });
  });
});
```

| Comando | Descrição |
|---|---|
| `cy.apiRequest({ endpoint, path?, environment?, ...opções do cy.request })` | Faz a requisição montando a URL a partir do `.env`. `environment` é `homol` (padrão) ou `prod` |
| `cy.login(environment?)` | Faz login; a sessão (cookie `RBSESS`) vale para as requisições seguintes |
| `cy.loginHomol()` / `cy.loginProd()` | Atalhos para `cy.login('homol')` / `cy.login('prod')` |
| `cy.expectSuccess(response, statuses?)` | Valida o status HTTP e a mensagem `Success!` |
| `cy.validatePagination(response, pageSize?)` | Valida o objeto `pagination` da resposta |

## API do painel

O `server.js` expõe as rotas usadas pela página:

| Rota | Descrição |
|---|---|
| `GET /api/tests` | Lista os arquivos de teste disponíveis |
| `POST /api/run` | Executa os testes enviados em `{ "specs": ["Login/Login_test.cy.js"] }` |
| `GET /api/history` | Retorna o histórico de execuções |

Por segurança, o `/api/run` só aceita arquivos de teste que existem na pasta.

## Problemas comuns

**`Error: Invalid or incompatible cached data (cachedDataRejected)` ao rodar o Cypress**
Acontece no terminal integrado do VS Code, que define a variável `ELECTRON_RUN_AS_NODE`. Remova-a antes de rodar:

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE   # PowerShell
```
```bash
unset ELECTRON_RUN_AS_NODE             # bash
```

**`Variável de ambiente "X" não definida`**
O `.env` não existe ou está incompleto. Compare com o `.env.example`.

**Testes falhando com status `503`**
A API de homologação está fora do ar. Não é problema nos testes.
