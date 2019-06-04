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
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
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
app.post('/admin/cust/id', db.getClientesID)

app.get('/admin/emp', db.getVendedor)
app.post('/admin/emp/add', db.setVendedor)

app.get('/category', db.getCategorias)
app.post('/category/add', db.setCategoria)

app.get('/category/sub', db.getSubCategorias)
app.post('/category/sub/id', db.getSubCategoriaByParent)
app.post('/category/sub/add', db.setSubCategoria)

app.get('/product', db.getProduct)
app.post('/product/id', db.getProductId)
app.post('/product/atrib/all', db.getAtribId)
app.post('/product/add', db.setProduct)
app.post('/product/add/atrib', db.setAtrib)
app.post('/product/add/atrib/prod', db.setAtribProd)

app.get('/invoice', db.getSales)
app.post('/invoice/add', db.addFactura)
app.post('/invoice/add/details', db.addPurchase)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
