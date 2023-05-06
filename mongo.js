const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackphonebook:${password}@phonebookdb.gub1r3w.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('Enter password as argument')
  process.exit(1)
} else if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const personName = process.argv[3]
  const personNumber = process.argv[4]

  const person = new Person({
    name: personName,
    number: personNumber,
  })

  person.save().then((_result) => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length > 5) {
  console.log(
    'Enter password only for phonebook entries list. Enter password, name and number to add a new person to the phonebook. If name or number contain whitespace, wrap them in quotes'
  )
  process.exit(1)
}