const express = require('express')
require('dotenv').config()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())


// let data = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

// morgan('tiny',  {
//   im: function (req, res) { return res.statusCode < 400 }
// });
//  app.use(morgan('combined'))
morgan.token('body', function getId (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':body :method :url :status :res[content-length] - :response-time ms'))


app.get('/info', (req, res) => {
  const currentTime = Date()
  console.log(currentTime)
  Person
    .countDocuments({})
    .then(count => {
      console.log('count:', count)
      res.send(`<h3>Phonebook has info for ${count} people</h3>
    <h3>${currentTime}</h3>`)
    })

})

app.get('/api/persons/', (req, res) => {
  console.log('in the /api/persons/ endpoint')
  // console.log('param:', req.params);
  Person.find({}).then(people => {
    // console.log("people:", people)
    res.json(people)})
  return
})

app.get('/api/persons/:id', (req, res, next) => {
  console.log('param:', req.params)
  const id = req.params.id
  Person
    .findById(id).exec()
    .then(person => {
      if (person) {
        return res.json(person)
      }
      else {
        console.log('person:', person)
        res.status(404).end()
      }
    })
    .catch(err => next(err))

})

app.delete('/api/persons/:id', (req, res, next) => {
  console.log('in the app.delete()')
  const id = req.params.id
  console.log('id, in app.delete', id)
  // data = data.filter((contact) => contact.id !== id);
  Person
    .findByIdAndRemove(id)
    .then(result => {
      if (result) {
        console.log('result from app.delete():', result)
        return res.status(204).send()
      }
      console.log('id not found')
      return res.status(404).send('id doesn\'t exist in database')
    })
    .catch(error => {
      console.log(error)
      next(error)
    })

})

app.post('/api/persons', function (req, res, next) {
  const body = req.body
  Person.findOne({ name: body.name })
    .then(existingContact => {
      if (existingContact) {
        console.log('Contact already exists:', existingContact)
      // NEED TO WORK ON THIS...
      }
      else {
        const person = new Person({ name: body.name, number: body.number })
        person
          .save()
          .then(savedPerson => {
            console.log(savedPerson)
            res.json(savedPerson)
          })
          .catch(err => {
            next(err)
          })
      }
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  console.log('id', id)
  console.log('req.body at app.put()', req.body)
  console.log('req.body', req.body)
  // const indexToUpdate = data.findIndex(contact => contact.id === id);
  Person
    .findByIdAndUpdate(id, req.body, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      console.log('updated contact:', updatedContact)
      if (!updatedContact) {
        console.log('Document not found.')
        res.status(404).send()
        return
      }
      return res.status(200).json(updatedContact)
    })
    .catch(err => {
      next(err)
    })

})

app.use((req, res) => {
  res.status(404).send({ error: 'Route not found' })
})
const errorHandler = (err, req, res) => {
  console.log('err:', err)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send(err)
  }
  res.status(500).send({ error: 'Something went wrong' })
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})