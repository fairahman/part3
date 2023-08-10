const express = require('express')
require('dotenv').config();
const Person = require('./models/person')
const morgan = require('morgan');
const cors = require('cors');


const app = express();
app.use(express.static('build'))
app.use(cors());
app.use(express.json());


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
  return JSON.stringify(req.body);
});

app.use(morgan(':body :method :url :status :res[content-length] - :response-time ms'))

app.get('/api/persons/:id', (req, res) => {
  console.log('param:', req.params);
    const id = Number(req.params.id);
    const dataToSend = data.find((person) => person.id === id )
    if (dataToSend) {
      return res.json(dataToSend);
    }
    else return res.status(404).end();
});

app.get('/api/persons/', (req, res) => {
   console.log("in the /api/persons/ endpoint");
  // console.log('param:', req.params);
  Person.find({}).then(people => {
    console.log("people:", people)
    res.json(people)});
  return;  
});

app.get('/api/info', (req, res) => {
  const currentTime = Date();
  console.log(currentTime);
  res.send(`<h3>Phonebook has info for ${data.length} people</h3>
            <h3>${currentTime}</h3>`);
});

app.delete('/api/persons/:id', (req, res) => {
  console.log('in the /api/persons/:id')
  const id = Number(req.params.id);
  console.log("id", id);
  data = data.filter((contact) => contact.id !== id);
  console.log("data", data)
  res.status(204).end();
});

app.post('/api/persons', function (req, res) {
	const newContact = req.body;
  // if (!newContact.name || !newContact.number) {
  //   console.log('name or number missing...')
  //    return res.status(404).end();
  // }
  if(data.find(contact => {
      console.log(contact.name, newContact.name)
      return contact.name === newContact.name
    })) {
    console.log('contact already exists...')
    res.statusMessage = 'contact already exists...'
    return res.status(404).end();
  }
 
  const id =  Math.floor(Math.random() * 1550);
  newContact.id = id;
  data.push(newContact)
  console.log(data)
  res.send(newContact);
});

app.put('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  console.log("id", id);
  const number = req.body.number;
  console.log("number", number);

  console.log("req.body", req.body);
  const indexToUpdate = data.findIndex(contact => contact.id === id);
  console.log("indexToUpdate", indexToUpdate, typeof indexToUpdate)
  if (indexToUpdate !== -1) {
    data[indexToUpdate] = {...data[indexToUpdate], number}
   console.log("dataindexToUpdate: how is this possible?")

   res.status(200).json(data[indexToUpdate]);
  }
  else res.status(404).json({error: "contact not found"})
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});