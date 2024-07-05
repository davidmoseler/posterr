/// <reference types="cypress" />

Cypress.Commands.add("resetDatabase", () => {
  cy.request('DELETE', 'localhost:5000/cypress/cleanup').as('cleanup')
})
