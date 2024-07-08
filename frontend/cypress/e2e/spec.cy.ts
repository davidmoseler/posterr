import '../support/commands'

describe('home page', () => {
  it('can create a new post', () => {
    cy.resetDatabase()

    cy.visit('/')

    cy.get('textarea[placeholder="What is happening?!"]').type('Cypress created a new post')
    cy.get('button:contains("Post")').click();

    cy.contains('.post', 'Cypress created a new post')
  })

  it('is ordered by latest', () => {
    cy.visit('/')

    cy.get('.post').eq(0).contains('Cypress created a new post')
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

  it('is still ordered by latest after repost', () => {
    cy.visit('/')

    cy.get('.post').eq(0).contains('John Doe created a new post')

    cy.get('.post').eq(0).contains('You reposted')
  })

  it('can search', () => {
    cy.visit('/')

    cy.get('input[placeholder="Search"]').type('Cypress{enter}')

    cy.get('.post:contains("John Doe created a new post")').should('not.exist');

    cy.get('.post:contains("Cypress")').eq(0).contains('created a new post')
  })

  it('can sort by trending', () => {
    cy.visit('/')

    cy.get('input[placeholder="Search"]').type('Cypress{enter}')

    cy.get('button:contains("Robert Denzer")').click();

    cy.get('.post:contains("Cypress created a new post")').find('[data-testid="repost"]').click();

    cy.get('button:contains("Sheila Doe")').click();

    cy.get('.post:contains("Cypress created a new post")').find('[data-testid="repost"]').click();

    cy.get('button:contains("Trending")').click();

    cy.get('.post').eq(0).contains('Cypress created a new post')
  })

  it('displays up to 15 posts at first', () => {
    cy.resetDatabase()

    cy.visit('/')

    const users = ['You', 'John Doe', 'Robert Denzer', 'Sheila Doe'];

    let i = 1;
    users.forEach((user) => {
      cy.get('button:contains("'+user+'")').click();
      [...Array(5).keys()].forEach((n) => {
        cy.get('textarea[placeholder="What is happening?!"]').type('Post number ' + i)
        cy.get('button:contains("Post")').click();
        i++;
      });
    })

    cy.get('.post').should('have.length', 15)
  })

  it('displays remaining posts after scrolling down', () => {
    // Serious library issues with cypress scrolling prevented me from implementing this test

    // cy.visit('/')

    // cy.scrollTo(1000000,1000000, {duration: "1000"})

    // cy.get('.post').should('have.length', 20)
  })

})
