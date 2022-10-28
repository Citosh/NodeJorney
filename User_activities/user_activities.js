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

  

  

  module.exports = {
    getProductbyName,
    getAllGoods,
    MakePurchase

  }