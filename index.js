// Imports
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const Person = require('./models/person')

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('persondata', function(req, _res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :persondata'))

// Functions and data


// Routes

app.get('/info', (request, response) => {
  let currentDate = new Date()
  let personsLen = 0

  Person.find({}).then(persons => {
    personsLen = persons.length
    response.send(`<p>Phonebook has info for ${personsLen} people</p><p>${currentDate}</p>`)
  })
})

app.get('/api/persons', (_request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {

  const body = request.body

  // if (body.name === undefined || body.number === undefined) {
  //   return response.status(400).json({error: 'missing person data'})
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(_result => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  // const body = request.body
  const { name, number } = request.body

  const person = {
    name: name,
    number: number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' }).then(updatedPerson => {
    response.json(updatedPerson)
  }).catch(error => next(error))
})


app.use(errorHandler)


// Port config

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


