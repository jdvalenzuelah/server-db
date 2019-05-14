const express = require('express')
const bodyParser = require('body-parser')
const db = require('./src/queries')
const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
     res.sendStatus(200);
   }
   else {
     next();
   }});

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

app.get('/admin/cust', db.getClientes)
app.post('/admin/cust/add', db.setCliente)

app.get('/admin/emp', db.getVendedor)
app.post('/admin/emp/add', db.setVendedor)

app.get('/category', db.getCategorias)
app.post('/category/add', db.setCategoria)

app.get('/category/sub', db.getSubCategorias)
app.get('/category/sub/id', db.getSubCategoriaByParent)
app.post('/category/sub/add', db.setSubCategoria)

app.get('/product', db.getProduct)
app.post('/product/add', db.setProduct)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
