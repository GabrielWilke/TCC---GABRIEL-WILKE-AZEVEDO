describe('Reader Register', () => {
  const tenantGuid = Cypress.env('tenantGuid');
  const siteGuid = Cypress.env('siteGuid');

  beforeEach(() => {
    cy.loginHomol();
  });

  it('Reader CRUD: Register, Edit and Delete', () => {
    cy.apiRequest({
      method: 'POST',
      endpoint: 'reader',
      qs: { tenantGuid, siteGuid },
      body: {
        "Attributes": [],
        "IncludeFastId": true,
        "RfidReaderImpinjAntenna1Enable": true,
        "RfidReaderImpinjAntenna1IsMaxRxSensitivity": false,
        "RfidReaderImpinjAntenna1MaxTxPower": false,
        "RfidReaderImpinjAntenna2Enable": true,
        "RfidReaderImpinjAntenna2isMaxRxSensitivity": false,
        "RfidReaderImpinjAntenna2MaxTxPower": false,
        "RfidReaderImpinjAntenna3Enable": true,
        "RfidReaderImpinjAntenna3isMaxRxSensitivity": false,
        "RfidReaderImpinjAntenna3MaxTxPower": false,
        "RfidReaderImpinjAntenna4Enable": true,
        "RfidReaderImpinjAntenna4isMaxRxSensitivity": false,
        "RfidReaderImpinjAntenna4MaxTxPower": false,
        "RfidReaderAcuraAntennaEnable": false,
        "RfidReaderAcuraLockTag": false,
        "RfidReaderAcuraAntennaPotencyWriter": 0,
        "RfidReaderAcuraAntennaPotencyReader": 0,
        "RfidReaderImpinjAntenna1TxPowerInDbm": 11,
        "RfidReaderImpinjAntenna2TxPowerInDbm": 11.75,
        "RfidReaderImpinjAntenna3TxPowerInDbm": 11.25,
        "RfidReaderImpinjAntenna4TxPowerInDbm": 12.75,
        "RfidReaderImpinjAntenna1RxSensitivityInDbm": -85,
        "RfidReaderImpinjAntenna2RxSensitivityInDbm": -85,
        "RfidReaderImpinjAntenna3RxSensitivityInDbm": -86,
        "RfidReaderImpinjAntenna4RxSensitivityInDbm": -80,
        "Name": "RB Test Reader",
        "IpAddress": "14.14.14.14",
        "ReaderType": "IMPINJ",
        "ListMode": "UNIQUE",
        "LimitListBehavior": "CLEAR",
        "RfidReaderImpinjMode": "MaxMiller",
        "RfidReaderImpinjSearchMode": "DualTarget",
        "RfidReaderImpinjSession": "0",
        "RfidReaderImpinjTagPopulationEstimate": 32,
        "EventAntenna1": "",
        "EventAntenna2": "",
        "EventAntenna3": "",
        "EventAntenna4": ""
      }
    }).then((resPost) => {
      expect(resPost.status).to.be.oneOf([200, 201]);
      const generatedGuid = resPost.body.data[0].Guid;
      cy.log('1. Reader Registered! GUID: ' + generatedGuid);

      cy.apiRequest({
        method: 'PUT',
        endpoint: 'reader',
        qs: { tenantGuid, siteGuid },
        body: {
          "Attributes": [],
          "Guid": generatedGuid,
          "IdentificationServer": null,
          "IncludeFastId": true,
          "IpAddress": "14.14.14.14",
          "LimitListBehavior": "STOP",
          "LimitListSize": null,
          "ListMode": "NORMAL",
          "Name": "RB Test Reader 2",
          "PortNumber": null,
          "ReaderType": "IMPINJ",
          "RfidReaderAcuraAntennaEnable": false,
          "RfidReaderAcuraAntennaPotencyReader": 0,
          "RfidReaderAcuraAntennaPotencyWriter": 0,
          "RfidReaderAcuraLockTag": false,
          "RfidReaderImpinjAntenna1Enable": true,
          "RfidReaderImpinjAntenna1IsMaxRxSensitivity": false,
          "RfidReaderImpinjAntenna1MaxTxPower": false,
          "RfidReaderImpinjAntenna1RxSensitivityInDbm": -78,
          "RfidReaderImpinjAntenna1TxPowerInDbm": 14.75,
          "RfidReaderImpinjAntenna2Enable": true,
          "RfidReaderImpinjAntenna2IsMaxRxSensitivity": false,
          "RfidReaderImpinjAntenna2MaxTxPower": false,
          "RfidReaderImpinjAntenna2RxSensitivityInDbm": -85,
          "RfidReaderImpinjAntenna2TxPowerInDbm": 11.75,
          "RfidReaderImpinjAntenna3Enable": true,
          "RfidReaderImpinjAntenna3IsMaxRxSensitivity": false,
          "RfidReaderImpinjAntenna3MaxTxPower": false,
          "RfidReaderImpinjAntenna3RxSensitivityInDbm": -86,
          "RfidReaderImpinjAntenna3TxPowerInDbm": 11.25,
          "RfidReaderImpinjAntenna4Enable": true,
          "RfidReaderImpinjAntenna4IsMaxRxSensitivity": false,
          "RfidReaderImpinjAntenna4MaxTxPower": false,
          "RfidReaderImpinjAntenna4RxSensitivityInDbm": -80,
          "RfidReaderImpinjAntenna4TxPowerInDbm": 12.75,
          "RfidReaderImpinjMode": "MaxThroughput",
          "RfidReaderImpinjSearchMode": "DualTarget",
          "RfidReaderImpinjSession": "0",
          "RfidReaderImpinjTagPopulationEstimate": 32,
          "ServerId": null,
          "ServerIpAddress": null,
          "SiteGuid": "ed6f7ea0-d36c-41f1-b618-93b0d86939ac",
          "SiteName": "SITE AMORA",
          "SourceConfig": null,
          "TenantGuid": "51c4d3a7-9133-4435-98e4-ab68d1b508d5",
          "TenantName": "AMORA",
          "RfidReaderImpinjAntenna2isMaxRxSensitivity": false,
          "RfidReaderImpinjAntenna3isMaxRxSensitivity": false,
          "RfidReaderImpinjAntenna4isMaxRxSensitivity": false
        }
      }).then((resPut) => {
        expect(resPut.body.status.Code).to.eq(200);
        cy.log('2. Reader edited successfully!');

        cy.apiRequest({
          method: 'DELETE',
          endpoint: 'reader',
          path: generatedGuid,
          qs: { tenantGuid, siteGuid }
        }).then((resDelete) => {
          cy.expectSuccess(resDelete, [200, 204]);
          cy.log('3. Reader deleted successfully!');
        });
      });
    });
  });

  it('Get/List Readers', () => {
    cy.apiRequest({
      method: 'GET',
      endpoint: 'reader',
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