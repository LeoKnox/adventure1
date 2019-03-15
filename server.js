var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

app.use (bodyParser.urlencoded({ extended: true }))
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
    res.render('index', {stats: adv_data});
})

app.post('/users', function(req, res) {
    console.log("post data", req.body)
    var monster = new Monster({name: req.body.name, hp: req.body.hp, def: req.body.def, atk: req.body.atk, mgc: req.body.mgc})
    var x = {hp: req.body.hp-3, atk: req.body.atk};
    console.log(x.hp);
    monster.save(function(err) {
        if (err) {
            console.log('something went wrong')
        } else {
            console.log('successfully added a user')
        }
        res.redirect('/')
    })
})

app.get('/attack', function(req, res) {
    console.log('I wIn');
    res.redirect('/');
})

app.listen(8000, function() {
    console.log('listening on port 8000')
})