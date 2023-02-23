const express = require('express')
const config = require('../config')
const { error, success } = require('./utils/responses.handler')
const db = require('./utils/database')
const passportJwt = require('./middleware/auth.middleware')
const initModels = require('./models/initModels')

const userRouter = require('./users/users.router')
const authRouter = require('./auth/auth.router')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

db.authenticate()
  .then(() => console.log('Database Authenticated'))
  .catch(err => console.log(err))

db.sync()
  .then(() => console.log('Database Synced'))
  .catch(err => console.log(err))

initModels()

app.get('/', (req, res) => {
  success({
    res,
    status: 200,
    data: {
      users: `${config.api.host}/api/v1/users`,
      auth: `${config.api.host}/api/v1/auth`
    }
  })
})

app.get('/protected',
  passportJwt,
  (req, res) => {
    req.status(200).json({
      message: `${req.user.firstName} leyo este mensaje si se inicio la sesión`
    })
  }
)

app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)

app.use('*', (req, res) => {
  error({
    res,
    status: 404,
    message: 'Page Not Found'
  })
})

app.listen(config.api.port, () => {
  console.log(`Server started succesfully on ${config.api.host}`)
})

module.exports = app