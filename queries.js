require('dotenv').config()
const { urlencoded, request, response } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const e = require('express')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test_api',
  password: '1111',
  port: 5432,
})



const createUser = async(request, response) => {
   
     try {
      const { login, password } = request.body
      const hashedPassword = await bcrypt.hash(request.body.password, 10)
        pool.query('INSERT INTO users (login, password,role) VALUES ($1, $2, $3) RETURNING * ', [login, hashedPassword,"user"], (error, results) => { 
          
            response.status(201).send(`User added with login : ${results.rows[0].login}`)
    })
    } 
     catch (error) {
        response.json("THIS USER ALREADY EXISTS")
     } 
}

const loginUser = async(request,response) =>{


  const { login, password } = request.body
  
pool.query('SELECT * FROM users WHERE login = $1',[login],(error,result)=>{
  if(error) throw error
  
  if(!bcrypt.compareSync(password,result.rows[0].password))
  response.json('invalid pass')
  else{
    const accessToken = jwt.sign({username : result.rows[0].login, role : result.rows[0].role}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '30m'})
    const refreshToken = jwt.sign({username : result.rows[0].login, role : result.rows[0].role}, process.env.REFRESH_TOKEN_SECRET)
 pool.query('UPDATE users Set accesstoken = $1, refreshtoken = $2 WHERE login = $3',[accessToken,refreshToken,result.rows[0].login],(err,res)=>{
   if(err) throw err
   response.json({accessToken : accessToken, refreshToken : refreshToken})
 })
  }

  
})

    
}


const RefreshAccessToken = (req,res) =>{
  const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if (err)  throw err
        const FromToken = user

        
      pool.query('SELECT * FROM users WHERE login = $1',[user.username],(err,user)=>{
        if(err) throw err
        const userFromq = user.rows[0].login
        if(!(FromToken.username == userFromq))
        res.sendStatus(403)
        else {
         accessToken = jwt.sign({username : FromToken.username,role: FromToken.role},process.env.ACCESS_TOKEN_SECRET)
         res.json({accessToken : accessToken})
        }
        
      })  
    })
}

const userLogout = (req,res) => {
const name = req.body.login
pool.query('UPDATE users SET refreshToken = $1 WHERE login = $2',[null,name],(err,result)=>{
  if(err) throw err
  else res.sendStatus(200)
})

}


const getUsers = (request, response) => {
    
  if(!(request.user.role == "admin" || request.user.role == "manager") ) 
    response.send(403)
  else{

  pool.query('SELECT * FROM users ORDER BY login ASC', (error, results) => {
  if (error) {
    throw error
  }
  response.status(200).send(results.rows)
  
  })
  }
    
}

const setRole = (req,res) =>{

  if(!(req.user.role == "admin") ) 
  response.send(403)
  else{
    const { login, role } = req.body
    console.log(req.body)
    if (!(req.body.role == "user" || req.body.role == "manager"))
    res.sendStatus(404)
    else {
      pool.query('UPDATE users SET role = $1 WHERE login = $2 ',[role,login], (err,results) => {
        if(err) throw err
        else res.sendStatus(200)
      })

    }

  }

}


const addGoods = (request,response) => {
    
  if(!(request.user.role == "admin" || request.user.role == "manager") ){
    response.send(403)
  }
  else {  
  try {
    const {name,cost} = request.body

    pool.query('INSERT INTO goods (name, cost) VALUES ($1, $2) RETURNING * ',[name,cost], (error,results) =>{
      if (error){
        response.send('this product already exists')
      }
      response.status(201).send(`Product ${results.rows[0].name} added with price : ${results.rows[0].cost}`)
    })
    
  } catch (error) {
    response.json('Smth wrong')
  }
    
  }
}

const getAllGoods = (request,response) => {

  if(!(request.user.role == "admin" || request.user.role == "manager" || request.user.role == "user") ) 
    response.send(403)
  else {

  try {  
    pool.query('SELECT * FROM goods',(error,results) =>{
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  } catch (error) {
    throw error
  }
  
  }
}

const getProductbyName = (request,response) =>{
  if(!(request.user.role == "admin" || request.user.role == "manager" || request.user.role == "user") ) 
    response.send(403)
  else {
  try {
    const name = request.params.name

    pool.query('SELECT * FROM goods WHERE name = $1',[name],(error,results)=>{
      if(error){
        throw error
      }
      response.send(results.rows)

    })
  } catch (error) {
    throw error
  }
  }
}

const setGoodsQuantity = (request,response) =>{
  if(!(request.user.role == "admin" || request.user.role == "manager") ) 
    response.send(403)
  else {

  try {
    const {name,quantity} = request.body
    pool.query('UPDATE goods SET quantity = $1 WHERE name = $2',[quantity,name],(error,results)=>{
      if(error){
        throw error
      }
      response.status(201).send(`Quantity altered`)
    })
  } catch (error) {
    throw error
  }
  }
}


const MakePurchase = (request,response) =>{
  if(!(request.user.role == "admin" || request.user.role == "manager" || request.user.role == "user") ) 
    response.send(403)
    else{

    
  try {
    
    const numberInNeed = request.body.quantity
    const name = request.params.name
    const userName = request.params.user
    pool.query('SELECT * FROM goods WHERE name = $1',[name],(error,results) =>{
      if(error){
        throw error
      }
      const AlteredQuantity = +results.rows[0].quantity - numberInNeed
      if( AlteredQuantity >= 0){
        pool.query('UPDATE goods SET quantity = $1 WHERE name = $2',[AlteredQuantity,name],(error)=>{
          if(error){
            throw error
          }
        
        if(response.status(200)){
          pool.query('INSERT INTO purchase (nameofuser,nameofgoods,quantity,date) VALUES ($1,$2,$3,now())',[userName,name,numberInNeed],(error)=>{   
            if(error){
              throw error
            }
            response.status(200).send(`purchase done,history saved`)
          })
        }
          
        })
      }
      else {
        response.send(`bag your pardon, we have not enought product we have only ${results.rows[0].quantity}`)
      }
    })
  } catch (error) {
    throw error
  }
}

}


function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ') [1]
  if(token == null)
    return res.sendStatus(401)
  

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
    
     if(err) 
      res.sendStatus(403)

     
      req.user = user
      next()
  })
  
}





  module.exports = {
    getUsers,
    createUser,
    loginUser,
    addGoods,
    getAllGoods,
    getProductbyName,
    setGoodsQuantity,
    MakePurchase,
    authenticateToken,
    RefreshAccessToken,
    userLogout,
    setRole
  }