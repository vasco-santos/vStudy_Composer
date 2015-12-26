# vStudy_Composer

vStudy Full Stack Application using a Mean Stack variant.

This web applications is part of a project composed by this project and 3 other Services. These services were developed by [João Rodrigues](https://github.com/F4e) ,[José Sequeira](https://github.com/JRSequeira) and [Miguel Vicente](https://github.com/mvicente93).

## Context

This project aims to be a virtual study environemnt inspired in a real-life library. In order to make this possible, it has been built this Real-time web application with two main features, Tables and Shelves.

The tables have the following functionalities:

* Table Chat;
* Webconference via webcam or screen sharing;
* Table file-sharing;
* Subject repository content.

The shelves have the following functionality:

* Keep the public resources of the courses and subjects.

### vStudy Composer implementation information

Full stack real-time application:
* Asynchronous Server (node.js);
* Single Page MVC Application (angularJS, ui-router, ngDropdowns, pretty-checkable);
* Communications between client and server via REST and Websockets (express.js, socket.io).

Server acts as a REST client to communicate with the File Storage Service and the Videoconference Service (using Request).

Server communicates with the Instant Messaging Service through a RabbitMQ broker (using amqp-lib).

Server:
* Stores information on a MongoDB (using mongoose);
* Authentication and Session management (using passport, bcrypt-nodejs and cookier-parser);
* HTTPs communications;
* Communications APIs: authenticationAPI, coursesAPI, storageAPI, tablesAPI and webSockets.

Client:

* Bootstrap template for page structure;
* User's session data is maintained in the browser's web storage;
* Angular Services responsible for communication handling;
* Parallel views for the application Page, as well as organization and routing of the interface partials though a state machine (using ui-router).

### Architecture

![alt tag](https://raw.githubusercontent.com/vasco-santos/vStudy_Composer/master/img/arch.png)

## Execution

Firtly, it is necessary to have installed NPM, MongoDB and Node.js.

Then, it is only necessary to run a shell script in order to start the application.

`./run.sh`

## Information

Full Stack Web Application developed for Services Engineering course.
