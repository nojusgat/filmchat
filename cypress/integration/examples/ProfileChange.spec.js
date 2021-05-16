var faker = require('faker');

describe('Favorite movie test', () => {
    beforeEach(() => {
        cy.restoreLocalStorage();
    })
  
    it('logs in programmatically without using the UI', function () {
        cy.login();
        cy.saveLocalStorage();
        cy.visit('http://127.0.0.1:8000/profile')

        cy.contains("Upload your avatar").should('be.visible')
    })

    it('Change name - fail', function () {
        cy.intercept('/api/auth/change/details').as('responseEdit');

        cy.get('input[name="name"]')
            .clear()
            .type("test")
            .should('have.value', "test")
        cy.get('.profile:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseEdit').its('response.statusCode').should('not.eq', 200)
        cy.saveLocalStorage();
    })

    it('Change name - success', function () {
        cy.intercept('/api/auth/change/details').as('responseEdit');

        const randomFirstName = faker.name.firstName()+faker.name.firstName()

        cy.get('input[name="name"]')
            .clear()
            .type(randomFirstName)
            .should('have.value', randomFirstName)
        cy.get('.profile:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseEdit').its('response.statusCode').should('eq', 200)
        cy.saveLocalStorage();
    })

    it('Change surname - fail', function () {
        cy.intercept('/api/auth/change/details').as('responseEdit');

        cy.get('input[name="surname"]')
            .clear()
            .type("test")
            .should('have.value', "test")
        cy.get('.profile:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseEdit').its('response.statusCode').should('not.eq', 200)
        cy.saveLocalStorage();
    })

    it('Change surname - success', function () {
        cy.intercept('/api/auth/change/details').as('responseEdit');

        const randomLastName = faker.name.lastName()+faker.name.lastName()

        cy.get('input[name="surname"]')
            .clear()
            .type(randomLastName)
            .should('have.value', randomLastName)
        cy.get('.profile:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseEdit').its('response.statusCode').should('eq', 200)
        cy.saveLocalStorage();
    })

    it('Change gender', function () {
        cy.intercept('/api/auth/change/details').as('responseEdit');

        const genders = ['Male', 'Female', 'Other']

        const randomGender = faker.random.arrayElement(genders);

        cy.get('.custom-control-label[for="'+randomGender+'"]').click()

        cy.get('.profile:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseEdit').its('response.statusCode').should('eq', 200)
        cy.saveLocalStorage();
    })

    it('Change all at the same time - fail', function () {
        cy.intercept('/api/auth/change/details').as('responseEdit');

        cy.get('input[name="name"]')
            .clear()
            .type("test")
            .should('have.value', "test")

        cy.get('input[name="surname"]')
            .clear()
            .type("test")
            .should('have.value', "test")

        cy.get('.profile:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseEdit').its('response.statusCode').should('not.eq', 200)
        cy.saveLocalStorage();
    })

    it('Change all at the same time - success', function () {
        cy.intercept('/api/auth/change/details').as('responseEdit');

        const randomFirstName = faker.name.firstName()+faker.name.firstName()

        cy.get('input[name="name"]')
            .clear()
            .type(randomFirstName)
            .should('have.value', randomFirstName)

        const randomLastName = faker.name.lastName()+faker.name.lastName()

        cy.get('input[name="surname"]')
            .clear()
            .type(randomLastName)
            .should('have.value', randomLastName)

        const genders = ['Male', 'Female', 'Other']

        const randomGender = faker.random.arrayElement(genders);
    
        cy.get('.custom-control-label[for="'+randomGender+'"]').click()

        cy.get('.profile:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseEdit').its('response.statusCode').should('eq', 200)
        cy.saveLocalStorage();
    })
  })