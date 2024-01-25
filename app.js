const config = require('./utils/config')
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message)
    })


app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(morgan("tiny"));
app.use(middleware.printBody)


app.use('/api/persons', personsRouter)

app.get("/info", (request, response) => {
  Person.find({}).then((people) => {
    response.send(`
            <p>Phonebook has info for ${people.length} people.</p>
            <p>${new Date().toString()}</p>
        `);
  });
});


app.use(middleware.errorHandler);

module.exports = app