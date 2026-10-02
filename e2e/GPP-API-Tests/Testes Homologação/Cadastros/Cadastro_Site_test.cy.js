describe('Site Register', () => {
  const tenantGuid = Cypress.env('tenantGuid');
  const siteGuid = Cypress.env('siteGuid');

  beforeEach(() => {
    cy.loginHomol();
  });

  it('Site CRUD: Register, Edit and Delete', () => {
    cy.apiRequest({
      method: 'POST',
      endpoint: 'site',
      qs: { tenantGuid, siteGuid },
      body: {
        "Attributes": { "cnpj": "1222" },
        "Name": "Cypress Test CRUD",
        "Type": "INTERN",
        "GuidShortcut": "2222"
      }
    }).then((resPost) => {
      expect(resPost.status).to.be.oneOf([200, 201]);
      const generatedGuid = resPost.body.data[0].Guid;
      cy.log('1. Site Registered! GUID: ' + generatedGuid);

      cy.apiRequest({
        method: 'PUT',
        endpoint: 'site',
        qs: { tenantGuid, siteGuid },
        body: {
          "Guid": generatedGuid,
          "Name": "Cypress Test Modified",
          "Type": "INTERN"
        }
      }).then((resPut) => {
        expect(resPut.body.status.Code).to.eq(200);
        cy.log('2. Site edited successfully!');

        cy.apiRequest({
          method: 'DELETE',
          endpoint: 'site',
          path: generatedGuid,
          qs: { tenantGuid }
        }).then((resDelete) => {
          cy.expectSuccess(resDelete, [200, 204]);
          cy.log('3. Site deleted successfully!');
        });
      });
    });
  });

  it('Get/List + OrderBy', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'site',
      qs: {
        pageSize: 50,
        currentPage: 0,
        orderBys: '-Name',
        tenantGuid,
        siteGuid
      }
    }).then((res) => {
      cy.expectSuccess(res, [200, 204]);
    });
  });
});
