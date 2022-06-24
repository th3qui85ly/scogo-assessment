const express = require('express');
const router  = express.Router(); 
const auth = require("../middlewares/auth");
const error = require("../middlewares/error");
const bcrypt = require('bcrypt');
const User = require("../model/User");
const Pizza = require("../model/Pizza");
const jwt = require('jsonwebtoken');


// signup route
router.post('/signup', async (req, res,) => {
    const body = req.body;

    if(!(body.firstName || body.lastName || body.email || body.password)) {
        return res.status(400).send({ error: "Invalid input" });
    }

    if(!(body.password == body.confirmPassword)) {
        return res.status(400).send({ error: "Password not matched!" });
    }

    const check = await User.findOne({ email: body.email });
    if  (check) {
        return res.status(400).send({ error: "User email already exists!"});
    }

    const user = new User(body);

    // generating salt for hashing
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);
    user.save()
    .then((data) => res.status(200).send([
        data.firstName,
        data.lastName,
        data.email,
        data.mobile]
    ))
    .catch(err => { res.status(400).send("Unable to save the data")});
}); 

// login route
router.post('/login', async (req, res) => {
    const body = req.body;

    const user = await User.findOne({ email: body.email });
    if (user) {
        const checkPwd = await bcrypt.compare(body.password, user.password);

        if (checkPwd) {
            res.status(200).json({ accessToken: jwt.sign({ _id: user._id, email: user.email }, 'SeCrEt')});
        } else {
            res.status(400).json({ message: "Invalid password!"});
        }
    } else {
        res.status(404).json({ error: 'User doesn\'t exist' });
    }
}); 

// add pizza route POST
router.post('/pizzas', [auth, error], async (req, res) => {
    const body = req.body;

    const duplicate = arr => arr.filter((item, index) => arr.indexOf(item) !== index);

    // console.log(duplicate(body.ingredients))
    if (duplicate(body.ingredients).length == 0) {
        const pizza = new Pizza(body);
        pizza.save()
        .then((data) => res.status(200).send(data))
        .catch(error => res.status(400).json({ message: "Couldn\'t add the item!"}));
    } else {
        return res.status(400).send("Ingredients repeated!");
    }  
});

// get all pizza list GET
router.get('/pizzas', [auth, error], async (req, res) => {
    const pizza = await Pizza.find({},{name:1, price:1, ingredients:1, _id: 0});
    if(pizza) {
        res.status(200).send(pizza)
    } else {
        res.status(400).json({ message: "Data couldn\'t be found!"})
    }
}); 

// update the ingredients for a specific pizza
router.patch('/pizzas/:id', [auth, error], async (req, res) => {
    const id = req.params.id;
    await Pizza.findOneAndUpdate({_id: id}, {$push: req.body});
    const data = await Pizza.find({_id: id},{name:1, price:1, ingredients:1, _id: 0});
    res.status(200).json(data);
})

//


// export to use in server.js
module.exports = router; 
