const jwt = require('jsonwebtoken');

//
// VERIFICAR TOKEN
//

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    });

    // res.json({
    //     token
    // });



};

//
// VERIFICA ADMIN ROL
//

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role == 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no es administrador'
            }
        })
    }

}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}