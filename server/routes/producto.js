const express = require('express');

const  { verificaToken, verificaAdmin_Role}= require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


//Obtener todos los productos

app.get('/productos', verificaToken, (req, res)=>{
    //Todos los productos
    //Populate
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    // let hasta = req.query.hasta || 0;
    Producto.find({ disponible: true })
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre usuario')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                })
            })


        })

});

//Obtener un producto
app.get('/productos/:id', verificaToken, (req, res)=>{

    let id = req.params.id;

    Producto.find({ disponible: true, _id:id })
        .sort('descripcion')
        .populate('usuario', 'nombre usuario')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (productoDB.length==0) {
            return res.status(400).json({
                ok: false,
                err : {
                    message : 'No existe id'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

//Buscar Productos
app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');

    Producto.find({nombre : regex})
            .populate('categoria','nombre')
            .exec((err, productos)=>{

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    productos
                })
            })

});

//Crear un producto
app.post('/productos', verificaToken, (req, res)=>{
    //Grabar el usuario
    //Grabar una categoria del listado

    let body = req.body;


    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria:body.categoria,
        usuario:req.usuario._id

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

//Actualizar el producto
app.put('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{
    //Grabar el usuario
    //Grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;
    let camposActualizar = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria:body.categoria,
        usuario:req.usuario._id
    }


    Producto.findByIdAndUpdate(id, camposActualizar,{ new: true, runValidators: true }, (err, productoDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });
});

//Borrar un producto
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{
    //Solo pasar disponible a falso
    let id = req.params.id;
    let camposActualizar = {
        disponible: false
    }


    Producto.findByIdAndUpdate(id, camposActualizar,{ new: true, runValidators: true }, (err, productoDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });
})






module.exports = app;