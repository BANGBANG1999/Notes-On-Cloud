const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const getuser = require('../middleware/getuser');
// require('dotenv').config();

// Custom validation to check if the password contains at least one special character
const containsSpecialCharacter = value => /[!@#$%^&*(),.?":{}|<>]/.test(value);

const JWT_SIGN = "Hey@you@got@my@signature" 

//ROUTE 1: Create user using POST : /api/auth/createuser   No Login required
router.post('/createuser', 
//Here is an array of checks, these needs to be fulfilled 
[
    body('name').notEmpty().withMessage('Name is required.').escape().isLength({ min: 5 }).withMessage('Name must be at least 5 characters.'),
    body('username').notEmpty().withMessage('Username is required.').escape().isLength({ min: 5 }).withMessage('Username must be at least 5 characters.'),
    body('password').notEmpty().withMessage('Password is required.').escape().isLength({ min: 5 }).withMessage('Password must be at least 5 characters.').custom(containsSpecialCharacter).withMessage('Password must contain at least one special character.')
], async (req, res) => {
    let success = false;
    const result = validationResult(req);
    if (result.isEmpty()) {
        try {
            //Checking whether username already exists or not
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) {
              return res.status(400).json({ success, error: 'Username already exists.'});
            }

            const salt = await bcrypt.genSaltSync(10);
            const secPass = await bcrypt.hash(req.body.password, salt)

            //Creating new user
            const newUser = await User.create({
              name: req.body.name,
              username: req.body.username,
              password: secPass,
            });

            const data = {
              user:{
                id: newUser.id
              }
            }

            const authToken = jwt.sign(data, JWT_SIGN);
            success=true;
            res.json({success, authToken});

            // console.log(authToken)
            // const savedUser = await newUser.save(); Here we dont use this coz we have3 used an inbuilt methode that is User.create
            
          } catch (error) {
            res.status(500).json({ success, error: 'Internal Server error' });
          }
    } 
    else{
        res.send({ success, errors: result.array(), message: "Validation failed" });

    }
  });

//ROUTE 2: Create user using POST : /api/auth/createuser   No Login required
router.post('/login', 
//Here is an array of checks, these needs to be fulfilled 
[
    body('username').notEmpty().withMessage('Username is required.').escape().isLength({ min: 5 }).withMessage('Username must be at least 5 characters.'),
    body('password').notEmpty().withMessage('Password is required.').escape().isLength({ min: 5 }).withMessage('Password must be at least 5 characters.').custom(containsSpecialCharacter).withMessage('Password must contain at least one special character.')
], async (req, res) => {
  let success = false;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({errors: errors.array()})
  }
  else{
    const {username, password} = req.body;

    try {
      const user = await User.findOne({ username })
      if(!user){
        // success= false;
        return res.status(400).json({ success, error: 'Please try to login with correct credentials'});
      }
      const passwordCompare = await bcrypt.compare(password, user.password)
      if(!passwordCompare){
        // success= false;
        return res.status(400).json({ success, error: 'Please try to login with correct credentials'});
      }

      const data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_SIGN); 
      success = true;
      res.json({success, authToken})

    } catch (error) {
      res.status(500).json({ success, error: 'Internal Server error' });
    }
  }
})

//ROUTE 3: Get loggedIn user details using POST : /api/auth/getuser     Login required
router.post('/getuser', getuser, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send({user})
  } catch (error){
    res.status(500).json({ error: 'Internal Server error' });
  }
})


module.exports = router;
