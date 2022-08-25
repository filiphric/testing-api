import spok from 'cy-spok'
import boardSchema from '../support/boardSchema.json'

it('request assertion', () => {

  cy.request({
    method: 'POST',
    url: '/api/boards',
    body: {
      name: 'board created via API'
    }
  }).then( board => {

    expect(board.status).to.eq(201)
    expect(board.body.starred).to.be.false
    expect(board.body.id).to.be.a('number')

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
    }).should('jsonSchema', boardSchema)

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
    .its('response.statusCode')
    .should('eq', 201)

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
        statusCode: 500
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

        expect(res.body[0].name).to.exist
        res.body[0].name = "hello everyone!!"

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
      // req.query = {
      //   starred: 'true'
      // }
    }).as('matchedUrl')

  cy
    .visit('/')

});

it.only('simulate a delay', () => {

  cy.intercept({
    method: 'GET',
    url: '/api/boards',
    times: 1
  }, req => {
    req.reply( res => {

      res.delay = 12000

    })
    
  }).as('getBoards')

  cy.visit('/')

  cy.contains('Reload')
    .click()

});