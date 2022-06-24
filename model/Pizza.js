const mongoose = require('mongoose');

const PizzaSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    ingredients: [{type: String}]
})

const Pizza = module.exports = mongoose.model('Pizza', PizzaSchema);