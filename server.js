var express        = require('express'),
    app            = express(),
    mongoose       = require('mongoose'),
    morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override');
    
mongoose.connect('mongodb://localhost/angular_toDoList');

// ====================================================
// Defining the Mongoose Schema
var Todo = mongoose.model('Todo', {
    text: String
});
// ====================================================

app.use(express.static(__dirname + '/public'));                  // for the images
app.use(morgan('dev'));                                          // log every request to console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                      // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));   // parse application/vnd.api+json as json
app.use(methodOverride());                                       // allows me to use other CRUD operations.

// ====================================================
// Routes
app.get('/api/todos', function(req, res){
    
    Todo.find(function(err, todos){
        if (err) {
            res.send(err);
        }
        
        res.json(todos); // return all todos in JSON format
    });
    
});

app.post('/api/todos', function(req, res){
    
    Todo.create({
        text : req.body.text,
        done: false
    }, function(err, todo){
        if (err) {
            res.send(err);
        }
        
        Todo.find(function(err, todos){
            if(err) {
                res.send(err);
            } 
            res.json(todos);
        });
    });
    
});

app.delete('/api/todos/:todo_id', function(req, res){
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo){
        if (err) {
            res.send(err);
        }
        
        Todo.find(function(err, todos){
            if (err) {
                res.send(err)
            }
            
            res.json(todos);
        });
    });
});


// ====================================================
// Application itself

app.get('*', function(req, res){
    res.sendfile('./public/index.html'); // load the single view file (we'll handle the changes on the front end)
});

// ====================================================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log(`To-Do List App Listening On Port ${process.env.PORT}`);
});