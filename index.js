require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))


const printBody = (request, response, next) => {
    console.log(JSON.stringify(request.body))
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
    }

    next(error)
}

app.get('/', (request, response) => {
    response.send('<h1>Hiya</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(people => {
        response.send(`
            <p>Phonebook has info for ${people.length} people.</p>
            <p>${new Date().toString()}</p>
        `);
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.use(printBody)

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name && !body.number) {
        return response.status(400).json({
            error: "name and number must not be blank"
        })
    } else if (!body.name) {
        return response.status(400).json({
            error: "name must not be blank"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "number must not be blank"
        })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    newPerson.save().then(newPer => {
        response.json(newPer)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(deletedPerson => {
        response.json(deletedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})