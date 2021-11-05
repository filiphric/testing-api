it('request', () => {

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

  cy
    .visit('/')


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

it.only('change request headers', () => {

  cy
    .intercept({
      url: '**'
    }, ({ headers }) => {
      headers["Authorization"] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpbGlwQGV4YW1wbGUuY29tIiwiaWF0IjoxNjE5NTQyODU0LCJleHAiOjE2MTk1NDY0NTQsInN1YiI6IjEifQ.eYnekf0zgLly6V61s43NfGUVYBMnnSkDNqfQJ9jExSI`;
    }).as('matchedUrl')

  cy
    .visit('/')


});
