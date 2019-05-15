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

  const getClientesID = (req, res) => {
    let nit = req.body.nit
    readTransaction()
    pool.query('SELECT * FROM cliente WHERE nit = $1', [nit] , (error, results) => {
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

const getSubCategoriaByParent = (req, res) => {
    readTransaction()
    let parentId = req.body.id
    pool.query('SELECT * FROM subcategoria WHERE idcategoria = $1', [parentId], (error, results) => {
        if(error) {
            res.send(`Unable to save user error: ${error.detail}`)
        } else {
            res.status(200).json(results.rows)
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

const getProductId = (req, res) => {
    let id = req.body.idproducto
    readTransaction()
    pool.query(
        `SELECT
            producto.idProducto AS id_producto,
            producto.nombre AS nombre_producto,
            producto.precio AS precio_producto,
            producto.descripcion AS descripcion_producto,
            subCategoria.tipoSubCategoria AS subcategoria,
            categoria.tipoCategoria AS categoria
        FROM producto
        INNER JOIN subcategoria
        ON producto.idSubCategoria = subcategoria.idSubCategoria
        INNER JOIN categoria
        ON subcategoria.idCategoria = categoria.idCategoria
        WHERE producto.idProducto = $1`,
        [id]
    ).then(results => {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error.detail}`)
    })
}

const setProduct = (req, res) => {

    writeTransaction()

    let {nombre, precio, descripcion, idCat} = req.body
    //let atribs = JSON.parse(atributos)

    pool.query(
        'INSERT INTO producto(nombre, precio, descripcion, idSubCategoria) VALUES ($1, $2, $3, $4) RETURNING idproducto',
        [nombre, precio, descripcion, idCat]
    ).then(results => {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error.detail}`)
    })
}

const setAtrib = (req, res) => {
    let nombre = req.body.nombre
    pool.query(
        'INSERT INTO atributo(nombre) VALUES($1) RETURNING idAtributoProducto',
        [nombre]
    ).then(results => {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error.detail}`)
    })
}

const setAtribProd = (req, res) => {
    let {idProd, idAtrProd, opt} = req.body
    pool.query(
        'INSERT INTO atributoproducto(idatributoproducto, idproducto, opciones) VALUES ($1, $2, $3)',
        [idAtrProd,idProd, opt]
    ).then(() => {
        res.status(201).send('ADDED')
    }).catch(error => {
        res.send(`Unable to save user error: ${error.detail}`)
    })
}

const getAtribId = (req, res) => {
    let id = req.body.id

    pool.query(
        `SELECT nombre, opciones, unico FROM atributoproducto 
         INNER JOIN atributo 
         ON atributo.idatributoproducto = atributoproducto.idatributoproducto
         WHERE atributoproducto.idproducto = $1`,
        [id]
    ).then(results => {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error.detail}`)
    })
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
    setProduct,
    getSubCategoriaByParent,
    setAtrib,
    setAtribProd,
    getClientesID,
    getProductId,
    getAtribId
}
