const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ojurltrlsofqiz',
  ssl: true,
  host: 'ec2-54-235-208-103.compute-1.amazonaws.com',
  database: 'd42blum1v868h',
  password: '0db669a26c99ab6b4fc290c1f0cc6e2a263c882bc5964820b656c240569bd5dc',
  port: 5432,
})

function readTransaction() {
    pool.query('SET TRANSACTION READ ONLY;')
}

function writeTransaction() {
    pool.query('SET TRANSACTION READ WRITE;')
}

const getClientes = (req, res) => {
    readTransaction()
    pool.query('SELECT * FROM cliente ORDER BY nit ASC', (error, results) => {
      if (error) {
        console.log(error)
      } else {
        res.status(200).json(results.rows)
      }
      
    })
  }

const setCliente = (req, res) => {
    writeTransaction()
    let {nit, nombre, telefono, direccion} = req.body
    pool.query('INSERT INTO cliente VALUES ($1, $2, $3, $4)', [nit, nombre, telefono, direccion],(error, result) => {
        if(error) {
            res.send(`Unable to save user error: ${error.detail}`)
        } else {
            res.status(201).send(`Client added NIT: ${result}`)
        }
    })
}

const getVendedor = (req, res) => {
    readTransaction()
    pool.query('SELECT * FROM vendedor ORDER BY idVendedor', (error, results) => {
        if(error){
            res.send(`Unable to save user error: ${error.detail}`)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const setVendedor = (req, res) => {
    writeTransaction()
    let{id, nombre, telefono, direccion, fechaEntrada, salario} = req.body
    pool.query(
        'INSERT INTO vendedor VALUES ($1, $2, $3, $4, $5, $6)',
        [id, nombre, telefono, direccion, fechaEntrada, salario],
        (error, result) => {
            if(error){
                res.send(`Unable to save user error: ${error.detail}`)
            } else {
                res.status(201).send(`Employee added: ${result}`)
            }
        })
}

const getCategorias = (req, res) => {
    readTransaction()
    pool.query('SELECT * FROM categoria ORDER BY idCategoria', (error, results) => {
        if(error){
            res.send(`Unable to save user error: ${error.detail}`)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const setCategoria = (req, res) => {
    writeTransaction()
    let {id, tipo} = req.body
    pool.query('INSERT INTO categoria VALUES ($1, $2)', [tipo, id], (error, results) => {
        if(error){
            res.send(`Unable to save user error: ${error.detail}`)
        } else {
            res.status(201).send(`Employee added: ${results}`)
        }
    })
}

const getSubCategorias = (req, res) => {
    readTransaction()
    let getParent = req.body.getParent

    if(getParent){
        cons = 'SELECT idsubcategoria, tiposubcategoria, tipocategoria, subCategoria.idcategoria FROM subCategoria INNER JOIN categoria ON subCategoria.idCategoria = categoria.idCategoria'
    } else {
        cons = 'SELECT * FROM subCategoria'
    }
    pool.query(cons, (error, results) => {
        if (error){
            res.send(`Unable to save user error: ${error.detail}`)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const setSubCategoria = (req, res) => {
    writeTransaction()
    let {idSub, tipo, idCat} = req.body
    pool.query('INSERT INTO subCategoria VALUES ($1, $2, $3)',[idSub, tipo, idCat], (error, results) => {
        if(error){
            res.send(`Unable to save user error: ${error.detail}`)
        } else {
            res.status(201).send(`Employee added: ${results}`)
        }
    })
}

const getProduct = (req, res) => {
    readTransaction()
    pool.query('SELECT * FROM producto', (error, results) => {
        if(error){
            res.send(`Unable to save user error: ${error.detail}`)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const setProduct = (req, res) => {
    writeTransaction()
    let {id, nombre, precio, descripcion, idCat, atributo} = req.body
    pool.query(
        'INSERT INTO producto VALUES ($1, $2, $3, $4, $5, $6)',
        [id, nombre, precio, descripcion, idCat, atributo],
        (error, results) => {
            if (error){
                res.send(`Unable to save user error: ${error.detail}`)
            } else {
                res.status(201).send(`Employee added: ${results}`)
            }
        }
    )
}

module.exports = {
    getClientes,
    setCliente,
    getVendedor,
    setVendedor,
    getCategorias,
    setCategoria,
    getSubCategorias,
    setSubCategoria,
    getProduct,
    setProduct
}
