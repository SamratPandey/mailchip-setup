const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("resources"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
}); 

app.post("/failure",function(req, res){
  res.redirect("/");
});

app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.emailId;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        marge_fildes: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us18.api.mailchimp.com/3.0/lists/1acf15f62e";
  const options = {
    method: "POST",
  auth: "username:mailchip apikey",//add any username in the place of username: and your mailchip apikey in the place of apikey
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/sucess.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT, function () {
  console.log("Server running on port 3000");
});
