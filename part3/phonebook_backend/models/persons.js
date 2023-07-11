const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personsSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Person name required'],
  },
  number: {
    type: String,
    required: [true, 'Person number required'],
    validate: {
      validator: function (v) {
        return /\d{3}-\d{5,}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})

personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Persons', personsSchema)
