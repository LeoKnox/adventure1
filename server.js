var express = require('express')
var app = express()
var server = app.listen(1337)
var io = require('socket.io')(server)
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')

app.use (bodyParser.urlencoded({ extended: true }))
app.use (session({secret: "be very quiet"}))
io.on('connection', function(socket) {
    socket.emit('greeting', {msg: 'Greetings, from server Node, brought to you by sockects'})
    socket.on('thank you', function(data) {
        console.log(data.msg)
    })
    socket.on('new-form', function(data) {
        console.log(data)
        socket.emit('form-data', data)
    })
})
var path = require('path')
mongoose.connect('mongodb://localhost/basic_mongoose')

var monsterSchema = new mongoose.Schema({
    name: String,
    hp: Number,
    atk: Number,
    def: Number,
    mgc: Number
})
mongoose.model('Monster', monsterSchema)
mongoose.Promise = global.Promise
var Monster = mongoose.model('Monster')

app.use(express.static(path.join(__dirname, './static')))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    var adv_data = [
        {id: 1, atk: 18, def: 14, hp: 25, mgc: 18},
        {id: 2, atk: 14, def: 17, hp: 15, mgc: 38},
        {id: 3, atk: 20, def: 12, hp: 28, mgc: 24},
    ]
    res.render('index', {stats: adv_data, points: req.session.chart, hp: req.session.hp})
})

app.get('/tables', function(req, res) {

})

app.get('/stat', function(req, res) {
    var adv_data = [
        {id: 1, atk: 18, def: 14, hp: 25, mgc: 18},
        {id: 2, atk: 14, def: 17, hp: 15, mgc: 38},
        {id: 3, atk: 20, def: 12, hp: 28, mgc: 24},
    ]
    res.render('index', {stats: adv_data, points: req.session.chart, hp: req.session.hp})

})

app.post('/users', function(req, res) {
    console.log(req.body);
    var monster = new Monster({name: req.body.name, hp: req.body.hp, def: req.body.def, atk: req.body.atk, mgc: req.body.mgc})
    var chart = [];
    hp = [];
    var x = {hp: req.body.hp-3, atk: req.body.atk};
    while (req.body.hp > 0) {
        var dmf = req.body.atk*Math.floor(Math.random()*req.body.fac1+1)
        var dmg = req.body.atk*Math.floor(Math.random() * req.body.fac1+1)-(req.body.atk-5)*(Math.random()*5+1)
        req.body.hp -= dmg;
        hp.push(dmf)
        chart.push(dmg)
    }
    console.log(chart)
    req.session.chart = chart
    req.session.hp = hp
    res.redirect('/stat')
})

app.get('/attack', function(req, res) {
    console.log('I wIn');
    res.redirect('/stat');
})

//app.get('/data', function(req, res) {

//})

app.listen(8000, function() {
    console.log('listening on port 8000')
})