let express = require('express');
let app = express();
let path = require('path');
let spawn = require ('child_process').spawn;
//To access data from post request
let bodyParser = require('body-parser');
let urlEncodedParser = bodyParser.urlencoded({ extended: false });
//To write to file
let fs = require('fs');
//Default port set to 3000
let port = 3000;
let numRequests = 0;

//Routes
app.get ('/', function(req, resp) {
    resp.sendFile(path.join(__dirname, 'submission', 'index.html'));
})

app.get('/select', function(req, resp) {
    //number of questions use?
    resp.sendFile(path.join(__dirname, 'coordinates', 'index.html'));
})

app.post('/select', urlEncodedParser, function(req, resp) {

    //Writing data to the text file
    let result = '';
    //Appending dimensions to new file (scale.csv)
    if (numRequests == 0) {
        dim = req.body.dimensions;
        dim = dim.split(' ');
        dim = dim.join();
        fs.appendFileSync(path.join(__dirname,'scale.csv'), dim, function() {
            console.log("The scale file was saved!");
        }); 
    }
    result += req.body.topLeftX.toString();
    result += ',';
    result += req.body.topLeftY.toString();
    result += ',';
    result += req.body.botRightX.toString();
    result += ',';
    result += req.body.botRightY.toString();
    result += ',';
    result += req.body.truthValue;
    result += '\n';
    //alt : JSON.stringify(req.body)
    fs.appendFileSync(path.join(__dirname,'test.csv'), result, function() {
        console.log("The coordinates file was saved!");
    }); 
    numRequests++;
    //Sending coordinate selection page as response (again)
    resp.sendFile (path.join(__dirname, 'coordinates', 'index.html'));
})

app.get('/resultgen', function (req, resp) {
    //Trigger python script
    spawn('python', ['./classify.py']);
    resp.sendFile(path.join(__dirname, 'genresult', 'gen.html'));
})
app.get('/result', function(req, resp) {
    resp.sendFile(path.join(__dirname, 'genresult', 'index.html'))
})

app.listen(port,function() {
    console.log(`listening on port ${port}`);
})

//Use all resources in the root directory
app.use(express.static(path.join(__dirname,'coordinates')));
app.use(express.static(path.join(__dirname,'submission')));
app.use(express.static(path.join(__dirname,'genresult')));