// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "cypress-localstorage-commands";

Cypress.Commands.add('login', () => {
    cy.request('GET', 'http://127.0.0.1:8000/api/test/generate/user')
    .its('body')
    .then(body => {
        cy.request('POST', 'http://127.0.0.1:8000/api/auth/login', {email: body.email, password: 'password', remember: false})
        .its('body')
        .then(body => {
            cy.setLocalStorage("user", JSON.stringify(body));
        })
    })

});

Cypress.Commands.add('createUserAndloginSpecific', (name, surname, email) => {
    cy.request('POST', 'http://127.0.0.1:8000/api/test/generate/user', {name: name, surname: surname, email: email})
    .its('body')
    .then(body => {
        cy.request('POST', 'http://127.0.0.1:8000/api/auth/login', {email: body.email, password: 'password', remember: false})
        .its('body')
        .then(body => {
            cy.setLocalStorage("user", JSON.stringify(body));
        })
    })

});

Cypress.Commands.add('loginSpecific', (email) => {
    cy.request('POST', 'http://127.0.0.1:8000/api/auth/login', {email: email, password: 'password', remember: false})
    .its('body')
    .then(body => {
        cy.setLocalStorage("user", JSON.stringify(body));
    })
});
