const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

/**initialising app */
const app = express();

/***app listening for port */
app.listen(process.env.PORT || 3000, function () {
    console.log("server running on port 3000");
})

/**app.use */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

/***get request */
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/failure', function (req, res) {
    res.redirect("/");
});


/******post */
app.post("/", function (req, resp) {
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;

    
    const data = {
       members:[ 
           {email_address: email,
        status:"subscribed",
        merge_fields: {
            FNAME: first,
            LNAME: last
        }}
    ]
    };


    const JsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/528ef0b274";
    const options = {
        method:"POST",
        
        auth: "nish1:104273fd052909167b1e03adb42eb844-us10"
    }

    const request = https.request(url,options, function (res) {
        res.on("data",function (data) {
            console.log(JSON.parse(data));
            if(res.statusCode===200){
                resp.sendFile(__dirname+"/success.html");
            }
            else{
                resp.sendFile(__dirname+"/failure.html");
            }
        });
    });

    request.write(JsonData);
    request.end();
    
    //console.log(""+first);
    //console.log(""+last);
    //console.log(""+email);
});