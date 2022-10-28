Hi, this is my very first restfull api, hope you won't have bleeding eyes <3.

Tehnologies

here i am using next tehnologies : 
Node.js and express to make routing,
db : postgresql and his midlware node-postgres,
nodemon for convenience,
jsonwebtoken for authentification and actvities tracking,
bcrypt for hashing and secure accounting,

How to make this work on your machine 

you have to download all npm packages which requires for things above (package.json is attached).
the next is instalation db tables, you can see the .sql file and you have to create your db and lounch this .sql file with "\i (path to file) " flag. 
next in every .js file you have this :

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres', your user 
  host: 'localhost', your hostname
  database: 'test_api', name of your db
  password: '1111', password for account of db user
  port: 5432, this is defaul port
})

this project have 5 .js files and you have to alter this in every of em.

this is all folks ^-^
