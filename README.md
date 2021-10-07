# Crowdfunding App

Full-stack crowdfunding app using Node.js, Express.js, Sequelize, Handlebars.js, and MVC architecture.

## User Stories

* As a user, I want to see a list of current projects seeking funding.

* As a user, I want to be able to create an account.

* As a registered user, I want to post my own projects to ask for funding.

## Specifications 

*   `/` homepage route renders a list of all projects from the database.

*   `/project/:id` route renders an individual project's details based on the route parameter id.

*   `/login` route renders a form to log in and a form to create a new account.

*   an existing user can enter their credentials on the login page to create a session on the server.

*   a new user can create an account on the login page and then be immediately logged in with a session.

*   `/profile` route renders the logged-in user's projects and a form to create a new project.

*   only a logged in user can visit the `/profile` route.

*   a logged in user is redirected to `/profile` when they try to visit `/login` again.

*   a user on the profile page can use the form to create a new project in the database.

*   a user on the profile page can select a "Delete" button to remove their project from the database.

*   a logged-in user can select a "Logout" button to remove their session.

*   API routes to create and delete posts are protected from non logged-in users.

*   code is organized using MVC architecture.

*   views are rendered with Handlebars.js templates.

* The database models have the following fields and associations:

  * `User`

    * `id`: primary key

    * `name`

    * `email`

    * `password`

  * `Project`

    * `id`: primary key

    * `name`

    * `description`

    * `date_created`

    * `needed_funding`

    * `user_id`: foreign key that references `User.id`

  * Users have many projects, and projects belong to a user.

    * If a user is deleted, all associated projects are also deleted.

