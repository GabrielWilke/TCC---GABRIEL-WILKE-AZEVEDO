describe('User Register', () => {
  const tenantGuid = Cypress.env('tenantGuid');

  beforeEach(() => {
    cy.loginHomol();
  });

  it('User CRUD: Register, Edit and Delete', () => {
    const uniqueId = Date.now();
    const username = `Cypress_${uniqueId}`;
    const email = `cypress_${uniqueId}@beontag.com`;

    cy.apiRequest({
      method: 'POST',
      endpoint: 'user',
      qs: { tenantGuid },
      body: {
        "Attributes": {
          "tokenType": "HUMAN",
          "ProfilesToSave": []
        },
        "Email": email,
        "Name": "Test User Cypress",
        "Username": username,
        "Password": "123"
      }
    }).then((resPost) => {
      expect(resPost.status).to.be.oneOf([200, 201]);
      const userGuid = resPost.body.data[0].Guid;
      cy.log('1. User Created! GUID: ' + userGuid);

      cy.apiRequest({
        method: 'PUT',
        endpoint: 'user',
        path: userGuid,
        qs: { tenantGuid },
        body: {
          "Guid": userGuid,
          "Name": "Test User Cypress Modified",
          "Email": email,
          "Username": username,
          "Attributes": {
            "tokenType": "HUMAN"
          }
        }
      }).then((resPut) => {
        expect(resPut.body.status.Code).to.eq(200);
        cy.log('2. User edited successfully!');

        cy.apiRequest({
          method: 'DELETE',
          endpoint: 'user',
          path: userGuid,
          qs: { tenantGuid }
        }).then((resDelete) => {
          cy.expectSuccess(resDelete, [200, 204]);
          cy.log('3. User deleted successfully!');
        });
      });
    });
  });

  it('Get/List All Users', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'user',
      qs: { tenantGuid }
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 204]);
    });
  });
});
