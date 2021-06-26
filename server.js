const express = require('express');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

app.post('/', (req, res)=> {
    var email = req.body.email;
    var amount = req.body.amount;
    if(amount <= 1) {
       return_info ={};
       return_info.error = true;
       return_info.message = 'Amount should be greater than 1';
       res.send(return_info);
    }
    res.send({"amount": amount, "email": email});
});

app.listen(3000, () => {
console.log('server running on port 3000')
});