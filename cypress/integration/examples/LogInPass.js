describe('My First test', function () {
    beforeEach(() => {
        // reset and seed the database prior to every test
        cy.exec('php artisan migrate:fresh && php artisan db:seed')
    
        // seed a user in the DB that we can control from our tests
        // assuming it generates a random password for us
        cy.request('GET', 'http://127.0.0.1:8000/api/test/generate/user')
          .its('body')
          .as('currentUser')
      })
    it('Visit site', function () {

        const user = this.currentUser
        console.log(user)
        
        cy.visit('http://127.0.0.1:8000/signin')
        //cy.get('.navbar-nav').contains('Home').click()

        cy.get('form').within(() => {
            cy.get('input[id="email"]')
            .type(user.email)
            .should('have.value', user.email)

            cy.get('input[id="password"]')
            .type('password')
            .should('have.value', 'password')

            cy.get('button:first').click()

        })

        cy.url()
            .should('include', '/home')
    })
})