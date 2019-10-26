<p align="center"><img src="https://github.com/Rocketseat/bootcamp-gostack-desafio-02/blob/master/.github/logo.png"></p>

# GYMPOINT

Gympoint is an application developed for gym management.

# What I used to develop this application:

- NodeJS (ExpressJS)
- Javascript ES6
- Docker
- Postgre SQL
- Sequelize
- Migration
- Seeds
- MongoDB
- Mongoose
- Redis
- Bee-Queue
- Nodemailer
- JWT (JSON Web Token) Authentication

# Tools

- Visual Studio Code (IDE)
- Postbird (PostgreSQL GUI)
- MongoDB Compass (MongoDB GUI)
- Nodemon and Sucrase
- ESLint (Patterns)
- Sequelize (ORM)
- Insomnia

# Features

- User management (Administrators and Students)
- JWT Authentication (Tokens)
- Session management via token
- Plan management (e.g: Basic Plan - U$D45,00/month - Duration: 3 months)
- Registration management: having a student on the database doesn't mean he/she has a registry. Each user can have a registry in the gym containing his ID, plan information, start date, end date and price calculated automatically
- When a user is registered he/she receives a e-mail (Nodemailer) containing useful information (plan, start date, end date and price)
- Help orders management: students can send question to the gym staff. Whenever it is answered the student receives an e-mail with his question and answer.
- The e-mail system is managed using Queues in order avoid latency to the final user.
- Checkin management: user can checkin when they arrive at the gym, but they can only apply five checkins in a period of seven days.

