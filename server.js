const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const {save_user} = require('./models/server_db');
var path = require('path');
var public = path.join(__dirname, './public');
var paypal = require('paypal-rest-sdk');
console.log('check');
app.use(bodyparser.json());
app.use(express.static(public));

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ASKZe2jlwegzo4ysiy4WDjuQnEYLZ_09TNPQAEU9dYay5Uq5QNNQ1sJbWuXIk9YSLOW5FvxNL3avcnJv',
    'client_secret': 'EPo6z9KqyKYAPt3MQKeKo3x0VamK9jSw9NWGZFOZAPV4U_vxvg3nnKPybYjuvV-ua5uquXY95fJajD_c'
});
app.post('/post_info', async(req, res)=> {
    var email = req.body.email;
    var amount = req.body.amount;
    if(amount <= 1) {
       return_info ={};
       return_info.error = true;
       return_info.message = 'Amount should be greater than 1';
       res.send(return_info);
    }

    var fee_amount = amount*0.9;
    var result = await save_user({"amount": fee_amount, "email": email});
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "lottery",
                    "sku": "funding",
                    "price": amount,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": amount
            },
            "payee": 
            {
                "email":'administration@business.example.com' 
            },
            "description": "Lotery purchase sample"
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error)
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            console.log('payment.links.length', payment.links.length);
            console.log('payment.links.length', payment.links.length);
            for (var i=0; i< payment.links.length; i++) {
                if(payment.links[i].rel == 'approval_url'){
                    return res.send(payment.links[i].href);
                }
            }
        }
    });
    
 
});

app.get('/get_total_amount', async(req, res)=> {
    var result = await get_total_amount();
    res.send(result);
});

app.get('/success', async(req, res)=>{
    console.log
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    var execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": 100
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function(err, payment){
        if(err){
            console.log(err.response);
            throw err;
        } else {
            console.log(payment);
        }
    });
    res.redirect('http://localhost:3000')
});

app.listen(3000, () => {
    console.log('server running on port 3000');
});