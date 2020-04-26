const router = require('express').Router();
const request = require('request')

router.route('/').get((req, res) => {
    res.json("No misc query")
});

router.route('/importContacts').get((req, res) => {
    console.log("here")
    request("https://outlook.office.com/api/v2.0/me/contacts", function(error, response, body){
        if (!error && response.statusCode === 200) {
            var namesList = []
            for (var person of body.value){
                namesList.push(person.GivenName)
            }
            console.log(body)
            res.json(namesList)
        }else{
            console.log(error)
            res.status(400).json("Error: " + error)
        }
    })
});

module.exports = router;