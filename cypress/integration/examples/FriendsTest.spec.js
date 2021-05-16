describe('Friends system testing', () => {
    beforeEach(() => {
        cy.restoreLocalStorage();
    })
  
    it('Create User 1 and login without UI', function () {
        cy.exec('php artisan migrate:fresh')
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

    it('From User 2 send friend request to User 1', function () {
        //cy.reload()
        cy.intercept('/api/auth/get/user').as('responseuserInfo');
        cy.intercept('/api/auth/users/friend').as('responseAddedFriend');
        cy.get('.user-card:first').within(() => {
            cy.get('button:first').click()
        })
        cy.url().should("include", "/user/1")

        cy.wait('@responseuserInfo').then(() => {
            cy.get('button.btn-success:first').click()
        });

        cy.wait('@responseAddedFriend').then(() => {
            cy.contains('Sent friend request to TestUserName1 TestUserSurname1.').should('be.visible')
        });
    })

    it('Check User 1 friend requests and accept a friend request from User 2', function () {
        cy.loginSpecific("test1@example.com");
        cy.saveLocalStorage();
        cy.intercept('/api/auth/get/sentrequests').as('responseRequests');
        cy.visit('http://127.0.0.1:8000/requests')

        cy.contains('Incoming friend requests').should('be.visible')

        cy.wait('@responseRequests').then(() => {
            cy.get('button.btn-success:first').click()
        });
    })

    it('Check if User 1 has User 2 in their friends list', function () {
        cy.intercept('/api/auth/get/friends').as('responseFriends');
        cy.visit('http://127.0.0.1:8000/friends')

        cy.contains('Friends (').should('be.visible')

        cy.wait('@responseFriends').then(() => {
            cy.contains('TestUserName2 TestUserSurname2').should('be.visible')
        });
    })

    it('Check if User 2 has User 1 in their friends list', function () {
        cy.loginSpecific("test2@example.com");
        cy.saveLocalStorage();
        cy.intercept('/api/auth/get/friends').as('responseFriends');
        cy.visit('http://127.0.0.1:8000/friends')

        cy.contains('Friends (').should('be.visible')

        cy.wait('@responseFriends').then(() => {
            cy.contains('TestUserName1 TestUserSurname1').should('be.visible')
        });
    })

    it('From User 2 send chat message to User 1', function () {
        cy.intercept('/api/auth/messages/send').as('responseSendMessage');

        cy.get('.user-card:first').should('be.visible').within(() => {
            cy.get('button.btn-success:first').should('be.visible').click()
        })

        cy.url().should('include', '/chat/')

        cy.get('.message-input:first').should('be.visible').within(() => {
            cy.get('input')
            .type('Test message from User 2 to User 1')
            .should('have.value', 'Test message from User 2 to User 1')

            cy.get('button.btn-outline-secondary:first').should('be.visible').click()
        })

        cy.wait('@responseSendMessage').then(() => {
            cy.get('.sent-message:first').should('be.visible').within(() => {
                cy.contains('Test message from User 2 to User 1').should('be.visible')
            })
        });
    })

    it('Check if User 1 received a message from User 2 and send a message back', function () {
        cy.loginSpecific("test1@example.com");
        cy.saveLocalStorage();
        cy.visit('http://127.0.0.1:8000/friends')

        cy.contains('Friends (').should('be.visible')

        cy.intercept('/api/auth/messages/send').as('responseSendMessage');
        cy.intercept('/api/auth/messages/get').as('responseRecieveMessage');

        cy.get('.user-card:first').should('be.visible').within(() => {
            cy.get('button.btn-success:first').should('be.visible').click()
        })

        cy.url().should('include', '/chat/')

        cy.wait('@responseRecieveMessage').then(() => {
            cy.get('.received-message:first').should('be.visible').within(() => {
                cy.contains('Test message from User 2 to User 1').should('be.visible')
            })
        });

        cy.get('.message-input:first').should('be.visible').within(() => {
            cy.get('input')
            .type('Test message from User 1 to User 2')
            .should('have.value', 'Test message from User 1 to User 2')

            cy.get('button.btn-outline-secondary:first').should('be.visible').click()
        })

        cy.wait('@responseSendMessage').then(() => {
            cy.get('.sent-message:first').should('be.visible').within(() => {
                cy.contains('Test message from User 1 to User 2').should('be.visible')
            })
        });
    })

    it('Check if User 2 received a message from User 1', function () {
        cy.loginSpecific("test2@example.com");
        cy.saveLocalStorage();
        cy.visit('http://127.0.0.1:8000/friends')

        cy.contains('Friends (').should('be.visible')

        cy.intercept('/api/auth/messages/get').as('responseRecieveMessage');

        cy.get('.user-card:first').should('be.visible').within(() => {
            cy.get('button.btn-success:first').should('be.visible').click()
        })

        cy.url().should('include', '/chat/')

        cy.wait('@responseRecieveMessage').then(() => {
            cy.get('.received-message:first').should('be.visible').within(() => {
                cy.contains('Test message from User 1 to User 2').should('be.visible')
            })
        });
    })
  })