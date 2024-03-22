const express = require('express')
const router = express.Router()
const {getBranches} = require('../controllers/publicController')
const {getEventPosts, getEventById} = require('../controllers/publicController')

router.get('/branches', getBranches)

router.get('/event/', getEventPosts)
router.get('/event/:id', getEventById)


module.exports = router