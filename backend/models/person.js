const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
        validator: function(v) {
            const parts = v.split('-')
            if (parts.length !==2) return false

            const firstPart = parts[0]
            if (firstPart.length !==2 && firstPart.length !== 3) return false
            if (!/^\d+$/.test(firstPart)) return false
            
            const secondPart = parts[1]
            if (secondPart.length < 5) return false
            if (!/^\d+$/.test(secondPart)) return false

            return true
        },
        message: props => `${props.value} is not a valid phone number`
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


module.exports = mongoose.model('Person', personSchema)