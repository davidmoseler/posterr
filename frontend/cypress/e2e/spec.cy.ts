import '../support/commands'

describe('home page', () => {
  it('can create a new post', () => {
    cy.resetDatabase()

    cy.visit('/')

    cy.get('textarea[placeholder="What is happening?!"]').type('Cypress created a new post')
    cy.get('button:contains("Post")').click();

    cy.contains('.post', 'Cypress created a new post')
  })

  it('can repost', () => {
    cy.visit('/')

    cy.get('button:contains("John Doe")').click();

    cy.get('textarea[placeholder="What is happening?!"]').type('John Doe created a new post')
    cy.get('button:contains("Post")').click();

    cy.get('button:contains("You")').click();

    cy.get('.post:contains("John Doe created a new post")').find('[data-testid="repost"]').click();

    cy.get('.post:contains("John Doe created a new post")').eq(0).contains('reposted')
  })

})
