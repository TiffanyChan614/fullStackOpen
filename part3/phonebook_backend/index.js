const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Persons = require('./models/persons')
require('dotenv').config()

const unknownEndPoint = (response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

const date = new Date()

app.get('/api/persons', (response, next) => {
  Persons.find({})
    .then((person) => {
      response.json(person)
    })
    .catch((error) => next(error))
})

app.get('/api/info', (response, next) => {
  Persons.estimatedDocumentCount({})
    .then((count) => {
      const info = `
				<div>
					<p>
						Phonebook has info for ${count} ${count > 1 ? 'people' : 'person'}
					</p>
					<p>${date.toUTCString()}</p>
				</div>
			`
      response.send(info)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Persons.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Persons.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Persons({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Persons.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.use(unknownEndPoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
