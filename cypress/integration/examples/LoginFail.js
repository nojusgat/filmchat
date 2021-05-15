describe('My First test', function () {
    it('Visit site', function () {
        cy.visit('http://127.0.0.1:8000/signin')
        //cy.get('.navbar-nav').contains('Home').click()

        cy.get('form').within(() => {
            cy.get('input[id="email"]')
            .type('adomasgrauzlis@gmail.com')
            .should('have.value', 'adomasgrauzlis@gmail.com')

            cy.get('input[id="password"]')
            .type('qwertyuiop')
            .should('have.value', 'qwertyuiop')

            cy.get('button:first').click()

        })

        cy.url()
            .should('include', '/signin')
    })
})