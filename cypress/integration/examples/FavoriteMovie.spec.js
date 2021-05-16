describe('Favorite movie test', () => {
    beforeEach(() => {
        cy.restoreLocalStorage();
    })
  
    it('logs in programmatically without using the UI', function () {
        cy.login();
        cy.saveLocalStorage();
        cy.visit('http://127.0.0.1:8000/home')

        cy.get('[name="search"]').should('be.visible')
    })

    it('Add to favorite', function () {
        cy.intercept('/api/auth/movie/favorite').as('responseFavorite');

        cy.get('.card:first').trigger('mouseover').within(($card) => {
            cy.get('button:first').click()
        })

        cy.url().should('include', '/movie/')

        cy.get('.movie-info:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseFavorite').then(() => {
            cy.get('.favoriteButton')
            .should('be.visible')
            .should('have.class', 'btn-danger')
        });
    })

    it('Remove from favorites', function () {
        cy.go('back')

        cy.intercept('/api/auth/movie/favorite').as('responseFavorite');

        cy.get('.card:first').trigger('mouseover').within(($card) => {
            cy.get('button:first').click()
        })

        cy.url().should('include', '/movie/')

        cy.get('.movie-info:first').within(() => {
            cy.get('button:first').click()
        })

        cy.wait('@responseFavorite').then(() => {
            cy.get('.favoriteButton')
            .should('be.visible')
            .should('have.class', 'btn-success')
        });
    })
  })