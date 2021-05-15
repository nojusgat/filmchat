describe('The Dashboard Page', () => {
  
    it('logs in programmatically without using the UI', function () {
      // destructuring assignment of the this.currentUser object
      cy.visit('http://127.0.0.1:8000/signin')
      const { email, password, remember } = this.currentUser
      // programmatically log us in without needing the UI
      cy.request('POST', 'http://127.0.0.1:8000/api/auth/login', {
        email:'adomasgrauzelis@gmail.com',
        password:'qwertyuiop',
        remember:true,
      })

      cy.get('.navbar-nav').contains('Home').click()
      cy.url()
            .should('include', '/home')
    })
  })