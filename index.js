// Imports
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const Person = require('./models/person')


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('persondata', function(req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :persondata'))

// Functions and data

// const generateRandomId = (range) => {
//     return Math.floor(Math.random() * range);
// }

// const checkIfUniqueName = (arg) => {
//     let existingItem = persons.find(el => el.name.toLowerCase() === arg.toLowerCase())

//     if (!existingItem) {
//         return true
//     } else {
//         return false
//     }
// }

// Routes

// app.get('/', (request, response) => {
//   response.send('<h1>Phonebook backend</h1>')
// })

app.get('/info', (request, response) => {
    let currentDate = new Date();

  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDate}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'missing person data'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


// Port config

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})