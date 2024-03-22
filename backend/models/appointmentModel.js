const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
    },
    number: {
        type: String,
    },
    apptDate: {
        type: String,
    },
    apptTime: {
        type: String,
    },
    apptStatus: {
        type: String,
        default: 'Pending',
    },
    address: {
        type: String,
    },
});

module.exports = mongoose.model('appointment', appointmentSchema);
