import spok from 'cy-spok'
import boardSchema from '../fixtures/boardSchema.json'

it('request assertion', () => {

  cy
    .request({
      method: 'POST',
      url: '/api/boards',
      body: {
        name: "hello there!"
      }
    })
    .then(board => {

      expect(board.status).to.eq(201)
      expect(board.body.starred).to.be.false
      assert.isNumber(board.body.id)

    })

})

it('using plugins', () => {

  const boardName = 'we created this using .request() command'
  const expectedBody = {
    name: boardName,
    user: 0,
    starred: false,
    created: "2022-08-25",
    id: 1
  }

  cy.api({
    method: 'POST',
    url: '/api/boards',
    body: {
      name: boardName
    }
  }).then(spok({
    body: {
      id: spok.type('number'),
      name: boardName,
      starred: false,
      user: 0
    },
    status: 201
  }))

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
    .its('body')
    .should('jsonSchema', boardSchema)

});

it('match request', () => {

  cy
    .intercept({
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

  cy
    .wait('@boardCreate')
    .then(board => {
      expect(board.request.body.name).to.eq('new board')
      assert.isString(board.request.body.name)
    })

});

it('change response body', () => {

  cy
    .intercept({
      method: 'GET',
      url: '/api/boards'
    }, {
      body: []
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
    }, {
      forceNetworkError: true
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
  }, req => {
    req.reply(res => {
      res.delay = 12000
    })
  }).as('getBoards')

  cy.visit('/')

});
