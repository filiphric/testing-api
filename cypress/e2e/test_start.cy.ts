it('request assertion', () => {

})

it('using plugins', () => {

  const boardName = 'we created this using .request() command'

  cy.request({
    method: 'POST',
    url: '/api/boards',
    body: {
      name: boardName
    }
  })

})

it('json schemas', () => {

  cy
    .request({
      method: 'GET',
      url: '/api/boards/1',
      headers: {
        accept: "application/json"
      }
    })

});

it('match request', () => {

  cy.intercept({
    method: 'POST',
    url: '/api/boards'
  }).as('boardCreate')

  cy
    .visit('/')

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy=new-board-input]')
    .type('new board{enter}');

  cy.wait('@boardCreate')

});

it('change response body', () => {

  cy
    .intercept({
      method: 'GET',
      url: '/api/boards'
    }).as('matchedUrl')

  cy
    .visit('/')

  cy
    .wait('@matchedUrl')

})

it('change response status', () => {

  cy
    .intercept({
      method: 'POST',
      url: '/api/boards'
    }).as('matchedUrl')

  cy
    .visit('/')

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy=new-board-input]')
    .type('new board{enter}');

});

it('simulate a delay', () => {

  cy.intercept({
    method: 'GET',
    url: '/api/boards'
  }).as('getBoards')

  cy.visit('/')

  cy.contains('Reload')
    .click()

});