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

module.exports = {
setRole,
getUsers
}