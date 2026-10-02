describe('Printer Register', () => {
  const tenantGuid = Cypress.env('tenantGuid');
  const siteGuid = Cypress.env('siteGuid');

  beforeEach(() => {
    cy.loginHomol();
  });

  it('Printer CRUD: Register, Edit and Delete', () => {
    cy.apiRequest({
      method: 'POST',
      endpoint: 'printer',
      qs: { tenantGuid, siteGuid },
      body: {
        "SiteGuid": "",
        "Name": "Cypress ZPL Printer",
        "PrinterType": "ZPL",
        "IpAddress": "10.10.12.12",
        "PortNumber": "1010",
        "DelaySpooler": 100,
        "ModelName": "Zebra ZT410",
        "DescriptionName": "test"
      }
    }).then((resPost) => {
      expect(resPost.status).to.be.oneOf([200, 201]);
      const generatedGuid = resPost.body.data[0].Guid;
      cy.log('1. Printer Registered! GUID: ' + generatedGuid);

      cy.apiRequest({
        method: 'PUT',
        endpoint: 'printer',
        qs: { tenantGuid, siteGuid },
        body: {
          "CTime": 1773755911,
          "DelaySpooler": 100,
          "DescriptionName": "test",
          "Guid": generatedGuid,
          "IpAddress": "10.10.12.12",
          "MTime": 1773661524,
          "ModelName": "Zebra ZT410",
          "Name": "Cypress ZPL Printer 2",
          "OutputFilesPath": null,
          "PortNumber": 1010,
          "PrinterType": "ZPL",
          "SiteGuid": siteGuid,
          "SiteName": "SITE AMORA",
          "TenantGuid": tenantGuid,
          "TenantName": "AMORA"
        }
      }).then((resPut) => {
        expect(resPut.body.status.Code).to.eq(200);
        cy.log('2. Printer edited successfully!');

        cy.apiRequest({
          method: 'DELETE',
          endpoint: 'printer',
          path: generatedGuid,
          qs: { tenantGuid, siteGuid }
        }).then((resDelete) => {
          cy.expectSuccess(resDelete, [200, 204]);
          cy.log('3. Printer deleted successfully!');
        });
      });
    });
  });

  it('Get/List Printers', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'printer',
      qs: { tenantGuid }
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 204]);
    });
  });
});
