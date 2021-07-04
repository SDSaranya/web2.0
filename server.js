const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const {save_user, get_list_of_participants, delete_all_users} = require('./models/server_db');
var path = require('path');
var public = path.join(__dirname, './public');
var paypal = require('paypal-rest-sdk');
var session = require('express-session');
app.use(session(
    {
        secret: 'my_web_app',
        cookie: {maxAge: 60000}
    })
)
app.use(bodyparser.json());
app.use(express.static(public));

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
    'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
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
    req.session.paypal_amount = amount;
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
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    var execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": req.session.paypal_amount
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

    if(req.session.winner_picked) {
        var deleted = await delete_all_users();
    }
    req.session.winner_picked = false;
    res.redirect('http://localhost:3000')
});

app.get('/pick_winner', async(req, res)=>{
    var result = await get_total_amount();
    var total_amount = result[0].total_amount;
    req.session.paypal_amount = total_amount;
    var list_of_participants = await get_list_of_participants();
    list_of_participants = JSON.parse(JSON.stringify(list_of_participants));
    var email_array = [];
    list_of_participants.forEach(function(element){
        email_array.push(element.email);
    });

    var winner_email = email_array[Math.floor(Math.random()*email_array.length)];
    req.session.winner_picked = true;

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
                    "price": req.session.paypal_amount,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": req.session.paypal_amount
            },
            "payee": 
            {
                "email": winner_email
            },
            "description": "Paying the winner of the lottery application"
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
           
            for (var i=0; i< payment.links.length; i++) {
                if(payment.links[i].rel == 'approval_url'){
                    return res.redirect(payment.links[i].href);
                }
            }
        }
    });
    
});

app.listen(3000, () => {
    console.log('server running on port 3000');
});