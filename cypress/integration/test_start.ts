it.only('request', () => {

  cy
    .visit('/')


});

it('match request', () => {

  cy
    .visit('/')

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy=new-board-input]')
    .type('new board{enter}');

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

it('change response body dynamically', () => {

  cy
    .intercept({
      method: 'GET',
      url: '/api/boards'
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
      
    }).as('matchedUrl')

  cy
    .visit('/')

});

it('change request headers', () => {

  cy
    .intercept({
      url: '**'
    }).as('matchedUrl')

  cy
    .visit('/')


});
