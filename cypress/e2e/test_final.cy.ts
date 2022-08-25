import spok from 'cy-spok'
import boardSchema from '../support/boardSchema.json'

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
      method: 'POST',
      url: '/api/boards',
      body: {
        name: "hello there!"
      }
    })
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

it('change response body dynamically', () => {

  cy
    .intercept({
      method: 'GET',
      url: '/api/boards'
    }, (req) => {
      req.reply(res => {

        res.body[0].name = "hello everyone!"

        return res.body

      })
    }).as('matchedUrl')

  cy
    .visit('/')

});

it('change query dynamically', () => {

  cy
    .intercept({
      method: 'GET',
      url: '/api/boards'
    }, req => {
      req.query = {
        starred: 'true'
      }
    }).as('matchedUrl')

  cy
    .visit('/')

});

it('simulate a delay', () => {

  cy.intercept({
    method: 'GET',
    url: '/api/boards'
  }, req => {
    req.reply( res => {
      res.delay = 12000
    })
  }).as('getBoards')

  cy.visit('/')

});
