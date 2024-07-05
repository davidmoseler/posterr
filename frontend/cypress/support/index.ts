import './commands'

beforeEach(() => {
  cy.resetDatabase()
})

after(() => {
  cy.resetDatabase()
})
