const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req,res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res) {

	// Creating const to obtain the user informnation that was inputed in the landing page with body-parser
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;

	var data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	};

	// Converting the data to javascrpit obejects
	const jsonData = JSON.stringify(data);

	// Obtained from the "Get started mailchimp developer page under request body parameters --url"
	const url = "https://us19.api.mailchimp.com/3.0/lists/b232fb9e88";

	// Look over for clear description
	const options = {
		method: "POST",
		auth: "aragon:89cd874d6af41995f2da21102e5fd3e7-us19"
	}

	// Using the https and request npm to display the information in our node screen.
	const request = https.request(url, options, function(response) {

		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function(data) {
			console.log(JSON.parse(data));
		})
	})

	request.write(jsonData);
	request.end();

})

app.post("/success", function(req, res) {
	res.redirect("/");
})



app.post("/failure", function(req, res) {
	res.redirect("/");
})



app.listen(process.env.PORT || 3000, function() {
	console.log("Server is running on port 3000.");
})

