const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://tiffanychan1999614:${password}@cluster0.thdh6b0.mongodb.net/personsApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Persons = mongoose.model('Persons', personsSchema)

if (process.argv.length === 5) {
  const person = new Persons({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  console.log('phonebook:')
  Persons.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log(
    'Please enter the correct number of arguments\n',
    'Format: node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}
