describe('My First test', function () {
    it('Visit site', function () {

        const temp = Math.floor(Math.random() * 100)
        cy.visit('http://127.0.0.1:8000/signin')
        //cy.get('.navbar-nav').contains('Home').click()

        cy.get('form').within(() => {
            cy.get('input[id="email"]')
            .type('TestEmailFail1549'+ temp +'@gmail.com')
            .should('have.value', 'TestEmailFail1549'+ temp +'@gmail.com')

            cy.get('input[id="password"]')
            .type('password')
            .should('have.value', 'password')

            cy.get('button:first').click()

        })

        cy.url()
            .should('include', '/signin')
    })
})