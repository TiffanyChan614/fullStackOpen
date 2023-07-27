describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    }
    const user2 = {
      name: 'Tiffany Chan',
      username: 'tiffany',
      password: '12345678',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user2)
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

    describe('and one note exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Test title',
          author: 'Test author',
          url: 'Test url',
          likes: 1,
        })
      })

      it('user can like a blog', function () {
        cy.contains('Test title').get('#view').click()
        cy.contains('Test title').get('#like').click()
        cy.contains('.blog', 'Test title').contains('likes 2')
      })

      it('user who created a blog can delete it', function () {
        cy.contains('Test title').get('#view').click()
        cy.contains('Test title').get('#remove').click()
        cy.contains('.blog', 'Test title').should('not.exist')
      })
    })
  })

  describe('When logged in as another user', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.contains('Matti Luukkainen logged in')

      cy.createBlog({
        title: 'Test title',
        author: 'Test author',
        url: 'Test url',
        likes: 1,
      })

      cy.contains('.blog', 'Test title')
      cy.get('#logout').click()
      cy.contains('username')
      cy.login({ username: 'tiffany', password: '12345678' })
    })

    it('A blog cannot be deleted by another user', function () {
      cy.contains('.blog', 'Test title').get('#view').click()
      cy.contains('.blog', 'Test title').get('#remove').should('not.exist')
    })
  })

  describe.only('When logged in and there are multiple blogs', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.contains('Matti Luukkainen logged in')

      cy.createBlog({
        title: 'Test with most likes',
        author: 'Test author 1',
        url: 'Test url 1',
        likes: 5,
      })
      cy.createBlog({
        title: 'Test with least likes',
        author: 'Test author 2',
        url: 'Test url 2',
        likes: 2,
      })
      cy.createBlog({
        title: 'Test with second most likes',
        author: 'Test author 3',
        url: 'Test url 3',
        likes: 3,
      })
    })

    it('blogs are ordered according to likes', function () {
      cy.get('.blog').eq(0).should('contain', 'Test with most likes')
      cy.get('.blog').eq(1).should('contain', 'Test with second most likes')
      cy.get('.blog').eq(2).should('contain', 'Test with least likes')
    })
  })
})
