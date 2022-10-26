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


  
module.exports = {
    setGoodsQuantity,
    addGoods
}