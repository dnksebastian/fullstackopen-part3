// Imports
const express = require('express')
const app = express()

app.use(express.json())

// Functions and data

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateRandomId = (range) => {
    return Math.floor(Math.random() * range);
}

const checkIfUniqueName = (arg) => {
    let existingItem = persons.find(el => el.name.toLowerCase() === arg.toLowerCase())

    if (!existingItem) {
        return true
    } else {
        return false
    }
}

// Routes

app.get('/', (request, response) => {
  response.send('<h1>Phonebook backend</h1>')
})

app.get('/info', (request, response) => {
    let currentDate = new Date();

  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDate}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Person's name or number missing"
        })
    }

    let isUnique = checkIfUniqueName(body.name)

    if (!isUnique) {
        return response.status(400).json({
            error: "Name must be unique"
        })
    }
    
    const person = {
        id: generateRandomId(1000000000),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person);


    console.log(person);
    response.json(person)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})