describe('Movie search test', () => {
    beforeEach(() => {
        cy.restoreLocalStorage();
    })
  
    it('Create User 1 and login without UI', function () {
        cy.exec('php artisan migrate:fresh && php artisan db:seed')
        cy.createUserAndloginSpecific("TestUserName1", "TestUserSurname1", "test1@example.com");
        cy.saveLocalStorage();
        cy.visit('http://127.0.0.1:8000/users')

        cy.get('[name="search"]').should('be.visible')
    })

    it('Create User 2 and login without UI', function () {
        cy.createUserAndloginSpecific("TestUserName2", "TestUserSurname2", "test2@example.com");
        cy.saveLocalStorage();
        cy.visit('http://127.0.0.1:8000/users')

        cy.get('[name="search"]').should('be.visible')
    })

    it('From User 2 add User 1 to friends', function () {
        //cy.reload()
        cy.intercept('/api/auth/get/user').as('responseuserInfo');
        cy.get('.user-card:first').within(() => {
            cy.get('button:first').click()
        })
        cy.url().should("include", "/user/1")

        cy.wait('@responseuserInfo').then(() => {
            cy.get('button.btn-success:first').click()
        });
    })

    /*it('Search "Inception" - find successfull', function () {
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
    })*/
  })