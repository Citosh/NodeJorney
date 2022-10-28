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


app.post('/users', AAA.createUser)  
app.post('/users/login', AAA.loginUser) 
app.post('/token', AAA.RefreshAccessToken)  // fucked up 
app.post('/users/logout',AAA.userLogout) 

app.post('/users/setrole',AAA.authenticateToken,Admin_a.setRole) 
app.get('/users/get_all', AAA.authenticateToken, Admin_a.getUsers) 

app.post('/products/add', AAA.authenticateToken, Manager_a.addGoods) 
app.post('/products/setquantity', AAA.authenticateToken, Manager_a.setGoodsQuantity) 


app.get('/products', AAA.authenticateToken, U_A.getAllGoods) 
app.get('/products/:name', AAA.authenticateToken, U_A.getProductbyName)  
app.post('/products/:name/:user', AAA.authenticateToken, U_A.MakePurchase) 



app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })