/**
 * Monta a URL completa de um endpoint configurado no .env.
 * Segmentos extras (ex.: GUID) são anexados ao caminho.
 */
function apiUrl(endpoint, { environment = 'homol', path = [] } = {}) {
  const baseUrl = Cypress.env('apiBaseUrl')[environment];
  const endpointPath = Cypress.env('endpoints')[endpoint];

  if (!baseUrl) throw new Error(`Ambiente "${environment}" não configurado no .env`);
  if (!endpointPath) throw new Error(`Endpoint "${endpoint}" não configurado no .env`);

  return [`${baseUrl}${endpointPath}`, ...[].concat(path)].join('/');
}

/**
 * cy.request apontando para um endpoint nomeado da API GPP.
 *
 * @example
 * cy.apiRequest({ method: 'DELETE', endpoint: 'printer', path: guid, qs: { tenantGuid } })
 */
Cypress.Commands.add('apiRequest', ({ endpoint, environment, path, ...options }) => {
  return cy.request({
    ...options,
    url: apiUrl(endpoint, { environment, path }),
  });
});

Cypress.Commands.add('login', (environment = 'homol', credentials = Cypress.env('credentials')) => {
  return cy.apiRequest({
    method: 'POST',
    endpoint: 'login',
    environment,
    body: credentials,
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('loginHomol', () => cy.login('homol'));
Cypress.Commands.add('loginProd', () => cy.login('prod'));

Cypress.Commands.add('expectSuccess', (response, statuses = [200, 201, 204]) => {
  expect(response.status).to.be.oneOf(statuses);
  expect(response.body.status.Message).to.eq('Success!');
});

Cypress.Commands.add('validatePagination', (response, expectedPageSize = 50) => {
  const pg = response.body.pagination;

  // Garante que o objeto existe
  expect(response.body).to.have.property('pagination');

  // Valida a estrutura (Contrato)
  expect(pg).to.include.all.keys(
    'Limit', 'Offset', 'TotalRecords', 'FirstPage', 'LastPage', 'CurrentPage', 'PageSize'
  );

  // Valida Tipagem
  expect(pg.TotalRecords).to.be.a('number');
  expect(pg.CurrentPage).to.be.a('number');

  // Valida consistência de valores
  if (expectedPageSize) {
    expect(pg.PageSize).to.eq(expectedPageSize);
  }
});
