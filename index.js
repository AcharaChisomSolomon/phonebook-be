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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const printBody = (request, response, next) => {
    console.log(JSON.stringify(request.body))
    next()
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
    response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date().toString()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000000) + 1
}

app.use(printBody)

app.post('/api/persons', (request, response) => {
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
    } else if (persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id) 
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})