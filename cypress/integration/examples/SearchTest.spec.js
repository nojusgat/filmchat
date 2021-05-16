describe('Movie search test', () => {
    beforeEach(() => {
        cy.restoreLocalStorage();
    })
  
    it('logs in programmatically without using the UI', function () {
        cy.login();
        cy.saveLocalStorage();
        cy.visit('http://127.0.0.1:8000/home')

        cy.get('[name="search"]').should('be.visible')
    })

    it('Search "Inception" - find successfull', function () {
        cy.get('input[name="search"]')
            .clear()
            .should('have.value', "")
        cy.get('input[name="search"]')
            .type("Inception")
            .should('have.value', "Inception")

        cy.get('button[name="search"]').click()

        cy.get('h5:first').should(($p) => {
            expect($p.first()).to.contain('Inception')
          })
    })

    it('Search "Inception" - fail to find', function () {
        cy.get('input[name="search"]')
            .clear()
            .should('have.value', "")
        cy.get('input[name="search"]')
            .type("Avengers")
            .should('have.value', "Avengers")

        cy.get('button[name="search"]').click()

        cy.get('h5:first').should(($p) => {
            expect($p.first()).not.to.contain('Inception')
          })
    })
  })