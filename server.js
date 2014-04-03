var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    path = require('path'),
    mongo = require('mongodb'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    format = require('util').format,
    server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000,
    server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.configure(function() {
    app.use('/app/', express.static(path.join(__dirname, '/app')));
    app.use('/content/', express.static(path.join(__dirname, '/content')));
    app.use('/scripts/', express.static(path.join(__dirname, '/scripts')));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});
// Route to index
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
/////////////////////////////////////////////////////////////////////////////
////                                Database                             ////
/////////////////////////////////////////////////////////////////////////////

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/nameLister';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

MongoClient.connect('mongodb://' + connection_string, function(err, db) {
        var User = db.collection('users');

        app.get('/api/users', function(req, res) {
            User.find().toArray(function(err, users) {
                if(err) throw err;
                res.json(users);
            });
        });

    app.post('/api/users', function(req, res) {
        console.log("hello there: " + req.body.firstName);
        User.insert({firstName: req.body.firstName, lastName: req.body.lastName}, function(err) {
            if(err) throw err;
            User.find().toArray(function(err, users) {
                if(err) throw err;
                res.json(users);
            });
        });
    });

    app.delete('/api/users', function(req, res) {
        User.remove(function(err) {
            if(err) throw err;
            User.find().toArray(function(err, users) {
                if(err) throw err;
                res.json(users);
            });
        })
    })
});

server.listen(server_port, server_ip_address, function() {
    console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});