const mongoose = require('mongoose');

const lifeplanSchema = mongoose.Schema({
    fullname: {
        type: String,
    },
    birthday: {
        type: String,
    },
    number: {   
        type: String,
    },
    email: {
        type: String,
    },
    address: { 
        type: String,
    },
    package: {
        type: String,
    },
    payment_plan: {
        type: String,
    },
    payment_price: {
        type: String,
    },
    plan_price: {
        type: String,
    },
    current_period: {   
        type: String,
    },
    total_period: {
        type: String,
    },
    bank: {
        type: String,
    },
});

module.exports = mongoose.model('lifeplan', lifeplanSchema, 'lifeplan');