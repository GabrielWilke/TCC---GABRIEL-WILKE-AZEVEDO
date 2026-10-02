describe('Cadastro de Produto', () => {
  const tenantGuid = Cypress.env('tenantGuid');
  const siteGuid = Cypress.env('siteGuid');

  beforeEach(() => {
    cy.loginHomol();
  });

  it('Crud cadastro de Produto: Cadastrar, Editar e Deletar', () => {
    cy.apiRequest({
      method: 'POST',
      endpoint: 'product',
      qs: { tenantGuid, siteGuid },
      body: {
        "Sku": "12748399568",
        "Gtin": "000023674240",
        "Description": "Descricao",
        "Category": "Categoria",
        "Fields": []
      }
    }).then((resPost) => {
      expect(resPost.status).to.be.oneOf([200, 201]);
      const guidGerado = resPost.body.data[0].Guid;
      cy.log('1. Produto Cadastrado! GUID: ' + guidGerado);

      cy.apiRequest({
        method: 'PUT',
        endpoint: 'product',
        path: guidGerado,
        qs: { tenantGuid, siteGuid },
        body: {
          "Category": "Categoria1234",
          "Description": "Descricao2345",
          "EpcPrefix": "",
          "ExternalSites": [],
          "ExternalSitesGuids": [],
          "Fields": [],
          "Gtin": "00000023674240",
          "Guid": guidGerado,
          "Sku": "12748399568",
          "changedByUserName": "root",
          "SitesGuid": []
        }
      }).then((resPut) => {
        expect(resPut.body.status.Code).to.eq(200);
        cy.log('2. Produto editado com sucesso!');

        cy.apiRequest({
          method: 'DELETE',
          endpoint: 'product',
          path: guidGerado,
          qs: { tenantGuid, siteGuid }
        }).then((resDelete) => {
          cy.expectSuccess(resDelete, [200, 204]);
          cy.log('3. Produto deletado com sucesso!');
        });
      });
    });
  });

  it('Get/Listagem', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'product',
      qs: { tenantGuid }
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 204]);
    });
  });

  it('Get/Listagem com order by', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'product',
      qs: {
        pageSize: 50,
        currentPage: 0,
        orderBys: '-CreatedDate',
        tenantGuid,
        siteGuid
      }
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 204]);
    });
  });
});
