const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const ActivityLog = require('../models/activityLogModel')

const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    }catch(err){
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)

    const activityLog = new ActivityLog({
        user: req.user ? req.user._id : null,
        message: `${req.method} ${req.path}`,
        requestMethod: req.method,
        requestUrl: req.url,
        requestOrigin: req.headers.origin,
    })
    
    activityLog.save()
    .catch(console.error);

    next()
    
}

module.exports = { logger, logEvents }