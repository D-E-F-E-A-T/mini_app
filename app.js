let express = require("express");
let app = express();
let path = require('path');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;


app.get("/", (req, res) => {
    listarCursos(res);
});

app.post('/', (req, res) => {
    let curso = { nome: req.body.nome, categoria: req.body.categoria }

    inserirCurso(curso, () => {
        listarCursos(res);
    });
})


app.use('/static', express.static('public')); //Devemos ter a pasta public conforme a referencia

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true

}));

app.set('views', '/views');
//definindo o template engine
app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.listen(3000, () => {
    console.log('Nodejs é legal mas prefiro Flask');
});


function listarCursos(res) {
    MongoClient.connect('mongodb://localhost:27017/treinaweb', (err, db) => {
        db.collection('cursos').find().sort({ name: 1 }).toArray((err, result) => {
            res.render('index', { data: result });
        });
    });

}

function inserirCurso(obj, callback) {
    MongoClient.connect('mongodb://localhost:27017/treinaweb', (err, db) => {
        db.collection('cursos').insertOne(obj, (err, result) => {
            callback();
        });
    });

}