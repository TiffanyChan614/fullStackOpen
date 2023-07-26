describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
  })

  it('login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#submit').should('be.visible')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#submit').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#submit').click()

      cy.get('.notification').contains('Wrong username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.contains('New blog').click()
      cy.get('#title').type('Test title')
      cy.get('#author').type('Test author')
      cy.get('#url').type('Test url')
      cy.get('#likes').type('0')
      cy.get('#create').click()

      cy.contains('Test title')
    })
  })
})
