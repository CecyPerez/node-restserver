const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function (req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
            }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    let archivo = req.files.archivo;

    //Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length-1];

    if(extensionesValidas.indexOf(extension)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                extension
            }
        })
    }

    //Cambiar nombre al archivo
    let nombreAchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    archivo.mv(`uploads/${tipo}/${nombreAchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(tipo == 'usuarios'){
            imagenUsuario(id, res, nombreAchivo);
        }else{
            imagenProducto(id, res, nombreAchivo);
        }

        

    });

});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB)=>{

        if(err){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(5400).json({
                ok:false,
                err:{
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB)=>{

            res.json({
                ok: true,
                usuarioDB,
                img: nombreArchivo
            });

        });


    });

}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB)=>{

        if(err){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(5400).json({
                ok:false,
                err:{
                    message: 'Producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB)=>{

            res.json({
                ok: true,
                productoDB,
                img: nombreArchivo
            });

        });


    });

}

function borraArchivo(nombreImagen, tipo){
    let pathImagen =  path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;