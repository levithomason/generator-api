import express from 'express'
import pkg from '../package.json'
import faker from 'faker'
import _ from 'lodash'
import bodyParser from 'body-parser'

// users = [{name: '', age: ''}, ...{}]
const users = _.times(100, () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: _.random(18, 99)
  }
})

const app = express()

app
  .use(bodyParser.json())

  .use((req, res, next) => {
    const reqData = {
      path: req.path,
      query: req.query,
      body: req.body,
    }
    console.log('REQUEST:\n', JSON.stringify(reqData, null, 2))
    next()
  })

  .get('/', (req, res) => {
    res.send('you are at root!')
  })

  .get('/users', (req, res) => {
    let filteredUsers = [...users]

    if (req.query.ageMin)
      filteredUsers = filteredUsers.filter((user) => user.age >= req.query.ageMin)

    if (req.query.ageMax)
      filteredUsers = filteredUsers.filter((user) => user.age <= req.query.ageMax)

    if (req.query.sortBy)
      filteredUsers = _.sortBy(filteredUsers, req.query.sortBy)

    res.json(filteredUsers)
  })

  .post('/users', (req, res) => {
    users.push(req.body)
    res.json(req.body)
  })

  .get('/package', (req, res) => {
    res.json(pkg)
  })

  .get('/quote', (req, res) => {
    res.json({
      author: faker.name.findName(),
      quote: faker.hacker.phrase()
    })
  })


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`)
})
