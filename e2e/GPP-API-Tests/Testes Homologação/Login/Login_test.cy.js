describe('Login', () => {
  const credentials = Cypress.env('credentials');

  it('Should perform login and validate the access cookie', () => {
    cy.apiRequest({
      method: 'POST',
      endpoint: 'login',
      body: credentials
    }).then((response) => {
      expect(response.status).to.eq(200);

      const setCookie = response.headers['set-cookie'];
      expect(setCookie).to.exist;

      const hasRbsess = setCookie.some(cookie => cookie.includes('RBSESS'));
      expect(hasRbsess, 'The set-cookie header must contain RBSESS').to.be.true;

      cy.log('Cookie found in header!');
    });
  });

  it('Should return error when trying to login with invalid password', () => {
    cy.apiRequest({
      method: 'POST',
      endpoint: 'login',
      body: { ...credentials, password: 'wrong_password' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(403);

      cy.getCookie('RBSESS').should('be.null');
    });
  });
});
