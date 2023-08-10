const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const Uri = `mongodb+srv://fairahman:${password}@cluster0.jugte7i.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set('strictQuery',false)
mongoose.connect(Uri)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name,
  number
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})