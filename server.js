var express = require('express');
var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');

var server = express();
var store = fortune({
    adapter: {
        type: nedbAdapter,
        options: {
            dbPath: __dirname + '/.db'
        }
    },
    serializers: [{
        type: jsonapi
    }]
});

server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
/*
store.defineType('player', {
   name: { type: String },
   race: { type: String },
   league: { type: String }
});

store.defineType('match', {
   map: { type: String },
   type: { type: String },
   team1win: { type: Boolean },
   team1: {
       link: 'player',
       isArray: true
   },
   team2: {
       link: 'player',
       isArray: true
   }
});*/


store.defineType('todo', {
   text: { type: String },
   comments: { 
        link: 'comment',
        isArray: true
    }
});

store.defineType('comment', {
    szoveg: { type: String },
    todo: {
        link: 'todo'
    }
})

// store.defineType('comment', {
//     text: { type: String },
// });

server.use(fortune.net.http(store));

var port = process.env.port || 8080;

store.connect().then(function(){
    server.listen(port, function(){
        console.log('server started on: ' + port);
    });
});