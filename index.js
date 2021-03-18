// Declare variables
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var nunjucks = require('nunjucks');

// Databae connection
var connection = mysql.createConnection({
	host: '107.180.1.16',
	port: 3306,
	user: 'group12021',
	password: '2021group1',
	database: '2021group1'
});

var app = express()

nunjucks.configure('views', {
    autoescape: true,
    express   : app
});
app.use(session({
	secret: 'groupOne',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'/')));

// GET Login Screen
app.get('/', function(request, response) {
    response.render('login.html')
})

app.post('/', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;

	if (username && password) {
		connection.query('SELECT * FROM Employees WHERE Username = ? AND Password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/main');
			} else {
				response.render('login.html', { msg: 'Incorrect Username and/or Password!' });
			}
		});
	} else {
		response.render('login.html', { msg: 'Please enter Username and Password!' });
	}
});

app.get('/main', function(request, response) {
	if (request.session.loggedin) {
		connection.query('SELECT * FROM Employees WHERE Username = ?', [request.session.username], function(error, results, fields) {
	
			response.render('main.html', { account: results[0] });
		});
	} else {
		response.redirect('/');
	}
});

app.get('/logout', function(request, response) {
    request.session.destroy();
    response.redirect('/');
})

app.listen(3000);