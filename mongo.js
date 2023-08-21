const mongoose = require('mongoose');
const person = require('./models/person');

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
if (process.argv.length === 3) {
  person.find({}).then(people => console.log(`phonebook: \n${people} `))
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

if (name && number) {
  const person = new Person({
    name,
    number
  })
  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })  
}

