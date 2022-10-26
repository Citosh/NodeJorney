const express = require('express')
const bodyParser = require('body-parser')
const AAA = require('./AAA/AAA')
const U_A = require('./User_activities/user_activities')
const Manager_a = require("./for_managers/manage")
const Admin_a = require("./for_admins/admn")
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


app.post('/users', AAA.createUser) // tests have been completed successfully // replaced
app.post('/users/login', AAA.loginUser) // tests have been completed successfully  // replaced
app.post('/token', AAA.RefreshAccessToken) // tests have been completed successfully // replaced but token must be valid 
app.post('/users/logout',AAA.userLogout) //tests have been completed successfully // replaced

app.post('/users/setrole',AAA.authenticateToken,Admin_a.setRole) //tested // replaced
app.get('/users/get_all', AAA.authenticateToken, Admin_a.getUsers) //tested // 

app.post('/products/add', AAA.authenticateToken, Manager_a.addGoods) //tested // replaced
app.post('/products/setquantity', AAA.authenticateToken, Manager_a.setGoodsQuantity) //tested // replaced


app.get('/products', AAA.authenticateToken, U_A.getAllGoods) //tested // replaced
app.get('/products/:name', AAA.authenticateToken, U_A.getProductbyName) //tested // replaced
app.post('/products/:name/:user', AAA.authenticateToken, U_A.MakePurchase) //tested // replaced



app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })