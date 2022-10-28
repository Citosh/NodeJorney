require('dotenv').config()
const { urlencoded, request, response } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const e = require('express')


const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: '1111',
  port: 5432,
})




const createUser = async(request, response) => {
   
  try {
   const { login, password } = request.body
   const hashedPassword = await bcrypt.hash(request.body.password, 10)
     pool.query('INSERT INTO users (login, password,role) VALUES ($1, $2, $3) RETURNING * ', [login, hashedPassword,"user"], (error, results) => { 
       if(error)
          response.status(406).send("this user alreade exists")
      else
         response.status(201).send(`User added with login : ${results.rows[0].login}`)
 })
 } 
  catch (error) {
     response.status(403)
  } 
}

const loginUser = async(request,response) =>{

  const { login, password } = request.body
  
pool.query('SELECT * FROM users WHERE login = $1',[login],(error,result)=>{
  // if(error) 
  // response.status(404)
  if(!result.rows[0])
  response.status(404).send("invalid login")
  else{
    if(!bcrypt.compareSync(password,result.rows[0].password))
     response.json('invalid pass')
    else{
     const accessToken = jwt.sign({username : result.rows[0].login, role : result.rows[0].role}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '30m'})
     const refreshToken = jwt.sign({username : result.rows[0].login, role : result.rows[0].role}, process.env.REFRESH_TOKEN_SECRET)
     pool.query('UPDATE users Set accesstoken = $1, refreshtoken = $2 WHERE login = $3',[accessToken,refreshToken,result.rows[0].login],(err,res)=>{
   if(err) 
    response.status(404).send("invalid login")
   else {
    response.send({accessToken : accessToken, refreshToken : refreshToken})
   }
 })
    }
  } 
}) 
}



const RefreshAccessToken = (req,res) =>{

  const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
  

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if (err)  
        response.status(404)
        else{
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
        }
       
    })
}


const userLogout = (req,res) => {
  const name = req.body.login
  pool.query('UPDATE users SET refreshToken = $1 WHERE login = $2',[null,name],(err,result)=>{
    if(err) throw err
    else res.sendStatus(200)
  })
  
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
  createUser,
  loginUser,
  RefreshAccessToken,
  userLogout,
  authenticateToken
}