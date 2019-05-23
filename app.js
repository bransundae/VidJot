const exphbs = require('express-handlebars');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Middleware

    //Mongoose
    mongoose.connect('mongodb://localhost/vidjot-dev', {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

    //Handlebars
    app.engine('handlebars', exphbs({
        defaultLayout: 'main'
    }));
    app.set('view engine', 'handlebars');

    //Body Parser
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    //Load Idea Model
    require('./models/Idea');
    const Idea = mongoose.model('ideas');

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {title: title});
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
});

//Idea Index Route
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//Add Idea Route
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Process Form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title)
        errors.push({text:'Please add a title'});
    if(!req.body.details)
        errors.push({text:'Please add a description'});
    if (errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            });
    }
});

const port = process.env.port || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});