const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log(`connecting to ${url}`);
mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function (number) {
        return /^((\d{3}-\d{4,15})|(\d{2}-\d{5,15}))$/.test(number);
      },
      message: ({ value }) =>
        `${value} is not a valid phone number! 
        Number should start with either DD- or DDD-`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
