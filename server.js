var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

app.use (bodyParser.urlencoded({ extended: true }))
var path = require('path')
mongoose.connect('mongodb://localhost/basic_mongoose')

var UserSchema = new mongoose.Schema({
    name: String,
    age: Number
})
mongoose.model('User', UserSchema)
mongoose.Promise = global.Promise
var User = mongoose.model('User')

app.use(express.static(path.join(__dirname, './static')))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')
app.get('/', function(req, res) {
    var adv_data = [
        {atk: "18", def: "14", hp: "25", mgc: "18"},
        {atk: "14", def: "17", hp: "15", mgc: "38"},
        {atk: "20", def: "12", hp: "28", mgc: "24"},
    ]
    res.render('index', {stats: adv_data});
})
app.post('/users', function(req, res) {
    console.log("poast data", req.body)
    var user = new User({name: req.body.name, age: req.body.age})
    user.save(function(err) {
        if (err) {
            console.log('something went wrong')
        } else {
            console.log('successfully added a user')
        }
        res.redirect('/')
    })
})

app.listen(8000, function() {
    console.log('listening on port 8000')
})