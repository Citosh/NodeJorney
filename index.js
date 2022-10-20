const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })


app.post('/users', db.createUser) // tests have been completed successfully
app.post('/users/login', db.loginUser) // tests have been completed successfully
app.post('/token', db.RefreshAccessToken) // tests have been completed successfully
app.post('/users/logout',db.userLogout) //tests have been completed successfully


app.post('/users/1', db.authenticateToken, db.getUsers) //tested
app.post('/users/setrole',db.authenticateToken,db.setRole) //tested

app.post('/products/add', db.authenticateToken, db.addGoods) //tested
app.post('/products/setquantity', db.authenticateToken, db.setGoodsQuantity) //tested


app.get('/products', db.authenticateToken, db.getAllGoods) //tested
app.get('/products/:name', db.authenticateToken, db.getProductbyName) //tested
app.post('/products/purchase/:name/:user', db.authenticateToken, db.MakePurchase) //tested



app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })