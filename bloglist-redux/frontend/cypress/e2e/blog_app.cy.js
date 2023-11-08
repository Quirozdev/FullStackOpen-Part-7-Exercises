describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    cy.visit('');
  });

  it('Login form is shown', function () {
    cy.visit('');
    cy.contains('Log in to application');
  });

  describe('Login', function () {
    beforeEach(function () {
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
        username: 'testUser',
        name: 'test',
        password: 'test1234',
      });

      cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
        username: 'userThatCannotDeleteTestUserBlogs',
        name: 'waos',
        password: '1234test',
      });

      cy.visit('');
    });

    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testUser');
      cy.get('#password').type('test1234');

      cy.get('#login-btn').click();

      cy.contains('test logged in');

      cy.get('.success')
        .should('contain', 'Logged in successfully')
        .and('have.css', 'color', 'rgb(0, 128, 0)');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('testUser');
      cy.get('#password').type('wrong');

      cy.get('#login-btn').click();

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });

    describe('when logged in', function () {
      beforeEach(function () {
        cy.login({
          username: 'testUser',
          password: 'test1234',
        });
      });

      it('a blog can be created', function () {
        cy.contains('new blog').click();

        cy.get('#title').type('waos new blog!!!!');
        cy.get('#author').type('jo');
        cy.get('#url').type('httpunknown');

        cy.get('#create-blog-btn').click();

        cy.contains('waos new blog!!!!');
      });

      describe('when there are some blogs', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'first blog!',
            author: 'Unknown',
            url: 'http://cats.com',
            likes: 9,
          });

          cy.createBlog({
            title: 'second blog!',
            author: 'Unknown',
            url: 'http://cats.com',
            likes: 6,
          });

          cy.createBlog({
            title: 'third blog!',
            author: 'Unknown',
            url: 'http://cats.com',
            likes: 8,
          });
        });

        it('user can like a blog', function () {
          cy.contains('first blog!').parent().contains('view').click();

          cy.contains('first blog!').get('.like-btn').click();

          cy.contains('first blog!').get('.likes').contains('likes 1');
        });

        it('creator of the blog can delete it', function () {
          cy.contains('first blog!').parent().contains('view').click();

          cy.contains('first blog').get('.remove-btn').click();

          cy.contains('first blog! by Unknown deleted');
        });

        it('only the creator can see the delete button of a blog, not anyone else', function () {
          cy.login({
            username: 'userThatCannotDeleteTestUserBlogs',
            password: '1234test',
          });

          cy.contains('first blog!').parent().contains('view').click();

          cy.contains('first blog').get('.remove-btn').should('not.exist');
        });

        it('blogs are ordered by likes', function () {
          cy.get('.blog').eq(0).should('contain', 'first blog!');
          cy.get('.blog').eq(1).should('contain', 'third blog!');
          cy.get('.blog').eq(2).should('contain', 'second blog!');
        });
      });
    });
  });
});
