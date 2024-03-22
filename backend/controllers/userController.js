const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const appointmentModel = require('../models/appointmentModel')
const lifeplan = require('../models/lifeplanModel')

const getallAppointments = asyncHandler(async (req, res) => {
    const appointments = await appointmentModel.find({})
    res.json(appointments)
})
//get 
const getLifeplan = asyncHandler(async (req, res) => {
    const {planId} = req.params
    const plan = await lifeplan.findById(planId)
    if (plan) {
        res.json(plan)
    } else {
        res.status(404)
        throw new Error('Plan not found')
    }
})

const setAppointment = asyncHandler(async (req, res) => {
    const { fullname, email, number, apptDate, apptTime, address } = req.body

    if (!fullname || !email || !number || !apptDate || !apptTime || !address) {
        res.status(400)
        throw new Error('Please fill all the fields')
        return
    }
//create
    const appointment = await appointmentModel.create({
        fullname, email, number, apptDate, apptTime, address
    })

    if (appointment._id) {
        res.status(201).json({
            _id: appointment._id, message: 'Appointment set successfully'
        })
    }
    else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

module.exports = {
  setAppointment,
  getallAppointments,
  getLifeplan
}