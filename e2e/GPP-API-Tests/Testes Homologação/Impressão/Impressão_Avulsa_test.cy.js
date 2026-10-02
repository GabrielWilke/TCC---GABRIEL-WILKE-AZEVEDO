describe('Single Print', () => {
  const tenantGuid = Cypress.env('tenantGuid');
  const siteGuid = Cypress.env('siteGuid');
  const labelGuid = Cypress.env('labelGuid');

  const productSearches = [
    { title: 'GTIN', field: 'gtin', value: '1' },
    { title: 'SKU', field: 'sku', value: '1' },
    { title: 'Description', field: 'description', value: 'd' },
    { title: 'Category', field: 'category', value: 'c' }
  ];

  beforeEach(() => {
    cy.loginHomol();
  });

  productSearches.forEach(({ title, field, value }) => {
    it(`Product search by ${title}`, () => {
      cy.apiRequest({
        method: 'GET',
        endpoint: 'productListByField',
        qs: {
          pageSize: 10,
          currentPage: 1,
          tenantGuid,
          siteGuid,
          Field: field,
          Value: value
        }
      }).then((response) => {
        cy.expectSuccess(response, [200, 201]);
      });
    });
  });

  it('Label list', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'label',
      qs: {
        Behavior: 'ITEM',
        CurrentPage: 1,
        PageSize: 200,
        tenantGuid,
        siteGuid
      }
    }).then((response) => {
      cy.expectSuccess(response, [200, 201]);
    });
  });

  it('Printer list', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'printerListByLabel',
      path: labelGuid,
      qs: {
        Behavior: 'ITEM',
        CurrentPage: 1,
        PageSize: 200,
        tenantGuid,
        siteGuid
      }
    }).then((response) => {
      cy.expectSuccess(response, [200, 201]);
    });
  });
});
