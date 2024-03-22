const express = require('express')
const router = express.Router()
const { setAppointment, getallAppointments, getLifeplan } = require('../controllers/userController')



// const {protect} = require('../middleware/authMiddleware')

router.post('/appointments', setAppointment)
router.get('/appointments', getallAppointments)
router.get('/lifeplan/:planId', getLifeplan)

module.exports = router