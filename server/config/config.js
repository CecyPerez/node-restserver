// PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//BD
let urlDB;

//VENCIMIENTO DEL TOKEN
//60 seg * 60 min * 24 hrs * 30 dias

process.env.CADUCIDAD_TOKEN = '48h';

//SEED
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//GOOGLE CLIENT ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '640246392864-u6o3u8d419na0o8o3lfkln935mirvs7a.apps.googleusercontent.com';