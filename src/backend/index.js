//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var utils = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

// Me permite usar los datos que envia el formulario, el formulario 
// envia datos tipo: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//=======[ Main module code ]==================================================


//=======[pruebas sin base de datos]===========================================

/*
app.get('/devices/', function (req, res, next) {
    devices = [
        {
            'id': 1,
            'name': 'Lampara 1',
            'description': 'Luz living',
            'state': 0,
            'type': 1,
        },
        {
            'id': 2,
            'name': 'Ventilador 1',
            'description': 'Ventilador Habitacion',
            'state': 1,
            'type': 2,
        }, {
            'id': 3,
            'name': 'Luz Cocina 1',
            'description': 'Cocina',
            'state': 1,
            'type': 2,
        },
    ]
    res.send(JSON.stringify(devices)).status(200);
});

//CONTROLA ESTADO DE SWITCH
app.put('/devices/', function (req, res) {
    console.log(req.body.id + "  " + req.body.state);
    res.send();
})

app.put('/device/', function (req, res) {
    console.log(req.body);
    res.send();
})

app.delete('/device/', function (req, res) {
    console.log(req.body);
    res.send();
})

app.post('/device/', function (req, res) {
    console.log(req.body);
    res.send();
})
*/

//============[operaciones con base de datos]===================================

app.get('/devices/', function (req, res) {
    utils.query("SELECT * FROM Devices", (error, respuesta, fields) => {
        if (error) {
            res.status(409).send(error.sqlMessage);
        } else {
            res.status(200).send(respuesta);
        }
    })
})

app.get('/device/:id', function (req, res) {
    utils.query("SELECT id,description FROM Devices where id=" + req.params.id, (error, respuesta, fields) => {
        if (error) {
            res.status(409).send(error.sqlMessage);
        } else {
            res.status(200).send(respuesta);
        }
    })
})

app.delete('/device/', function (req, res) {
    utils.query("DELETE FROM Devices WHERE id=" + req.body.id, (error, respuesta, fields) => {
        if (error) {
            res.status(409).send(error.sqlMessage);
        } else {
            res.status(200).send(respuesta);
        }
    })
})

app.post('/device/', function (req, res) {
    // Query de inserción con parámetros
    utils.query(
        "INSERT INTO Devices (name, description, state, type) VALUES (?, ?, ?, ?)",
        [req.body.name, req.body.description, req.body.state, req.body.type],
        (error, respuesta, fields) => {
            if (error) {
                // Manejo de error
                res.status(409).send(error.sqlMessage);
            } else {
                // Respuesta exitosa
                res.status(200).send({ mensaje: 'Dispositivo insertado correctamente', respuesta });
            }
        }
    );

});

app.put('/devices/', function (req, res) {
    utils.query(
        "UPDATE Devices SET state = ?  WHERE id = ?",
        [req.body.state, req.body.id],
        (err, resp) => {
            if (err) {
                console.log(err.sqlMessage)
                res.status(409).send(err.sqlMessage);
            } else {
                res.send("ok " + resp);
            }
        })
})

app.put('/device/', function (req, res) {
    utils.query(
        "UPDATE Devices SET name = ?, description = ?  WHERE id = ?",
        [req.body.name, req.body.description, req.body.id],
        (err, resp, meta) => {
            if (err) {
                console.log(err.sqlMessage)
                res.status(409).send(err.sqlMessage);
            } else {
                res.send("ok " + resp);
            }
        })
});

app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
