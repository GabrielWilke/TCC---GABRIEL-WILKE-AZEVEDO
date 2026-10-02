require('dotenv').config();
const { defineConfig } = require('cypress');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente "${name}" não definida. Confira o arquivo .env (veja .env.example).`);
  }
  return value;
}

module.exports = defineConfig({
  e2e: {
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'support/e2e.js',
    fixturesFolder: 'fixtures',
    setupNodeEvents(on) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
  env: {
    apiBaseUrl: {
      homol: requireEnv('API_BASE_URL_HOMOL'),
      prod: requireEnv('API_BASE_URL_PROD'),
    },
    endpoints: {
      login: requireEnv('ENDPOINT_LOGIN'),
      label: requireEnv('ENDPOINT_LABEL'),
      printer: requireEnv('ENDPOINT_PRINTER'),
      printerListByLabel: requireEnv('ENDPOINT_PRINTER_LIST_BY_LABEL'),
      product: requireEnv('ENDPOINT_PRODUCT'),
      productListByField: requireEnv('ENDPOINT_PRODUCT_LIST_BY_FIELD'),
      reader: requireEnv('ENDPOINT_READER'),
      site: requireEnv('ENDPOINT_SITE'),
      user: requireEnv('ENDPOINT_USER'),
    },
    credentials: {
      username: requireEnv('API_USERNAME'),
      password: requireEnv('API_PASSWORD'),
    },
    tenantGuid: requireEnv('TENANT_GUID'),
    siteGuid: requireEnv('SITE_GUID'),
    labelGuid: requireEnv('LABEL_GUID'),
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: true,
    html: false,
    json: true,
    saveJson: true,
    charts: false,
    reportFilename: 'mochawesome',
  },
});
