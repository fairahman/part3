const mongoose = require('mongoose');
const Uri = process.env.MONGO_URI;
mongoose.set('strictQuery', false)

mongoose.connect(Uri)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength:8,
    validate: {
      validator: function (value) {
        // Custom validator logic
        const parts = value.split('-');
        if (parts.length !== 2) {
          return false;
        }

        const [firstPart, secondPart] = parts;
        const isValidFirstPart = /^\d{2,3}$/.test(firstPart);
        const isValidSecondPart = /^\d+$/.test(secondPart);
        
        return isValidFirstPart && isValidSecondPart;
      },
      message: props => `${props.value} is not a valid phone number format`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports =  mongoose.model('Person', personSchema);
