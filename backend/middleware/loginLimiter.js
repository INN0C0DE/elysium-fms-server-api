const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
    windowMs: 60 *1000 ,
    max: 5,
    message: {message: 'Too many login attempts, please try again in after 1 minute'},
    handler: (req, res, next, options) => {
        logEvents(`Too many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).json(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = loginLimiter
