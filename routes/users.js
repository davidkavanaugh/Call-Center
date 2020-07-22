const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config");

// Load input validation
const validateLoginInput = require("../validation/login.validation");

// Load User model
const User = require("../models/user.model");

mongoose.set('useFindAndModify', false);

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
})

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  // Find user by username
  User.findOne({ username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ userNotFound: "user not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          id: user._id
        };

        // Sign token
        jwt.sign(
          payload,
          keys.JWT,
          {
            expiresIn: 86400 // 1 day in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "password incorrect" });
      }
    });
  });
});

// @route GET api/users/:id
// @desc GET user
// @access Public
router.route('/:id').get((req, res) => {
  User.find({ _id: req.params.id })
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// @route GET api/users/:username
// @desk GET user
// @access Public
router.route('/by-username/:username').get((req, res) => {
  User.find({ username: req.params.username })
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// @route GET api/users/:email
// @desc GET user by email address
// @access Public

router.route('/by-email/:email').get((req, res) => {
  User.find({ email: req.params.email })
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

//@route POST api/users/update-first-name/:id
//@desc PUT User First Name
//@access Private
router.route('/update-first-name/:id').post((req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, { firstName: req.body.firstName })
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
});

//@route Post api/users/update-last-name/:id
//@desc PUT User Last Name
//@access Private
router.route('/update-last-name/:id').post((req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, { lastName: req.body.lastName })
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
});

//@route POST api/users/update-username/:id
//@desc PUT Username
//@access Private
router.post('/update-username/:id', (req, res) => {
       User.findOneAndUpdate(
         { _id: req.params.id },{ username: req.body.username })
         .then(user => res.json(user))
         .catch(err => res.status(400).json('Error: ' + err));
     });

 //@route POST api/users/update-email/:id
 //@desc PUT User Email
 //@access Private
 router.post('/update-email/:id', (req, res) => {
      User.findOneAndUpdate({ _id: req.params.id }, { email: req.body.email })
      .then(user => {res.json(user)})
      .catch(err => res.status(400).json('Error: ' + err));
      })

router.post('/update-password/:id', (req, res) => {
  // Hash password before saving in database

  bcrypt.genSalt(10, (err, salt) => {
    let newPassword = req.body.password;
    bcrypt.hash(newPassword, salt, (err, hash) => {
      if (err) throw err;
      let newPassword = hash;
      User.findOneAndUpdate({ _id: req.params.id }, { password: newPassword })
      .then(user => {
        res.json(user)
      })
      .catch(err => res.status(400).json('Error: ' + err));      
    });
  });
});

 //@route POST api/users/notfications/:email
 //@desc Invite Users to Call Center
 //@access Private

router.route('/notifications/:email').post((req, res) => {
  let newNotification = {
    title: req.body.title,
    message: req.body.message,
    from: req.body.from,
    re: req.body.callCenter
  }

  User.findOne({ email: req.params.email })
  .then(user => {
    let notified = false;
    user.notifications.map(notification => {
      if (notification.title === req.body.title && notification.message === req.body.message) {
        notified = true;
      }
    })

    if (user._id == req.body.from) {
      console.log('cannot invite yourself')
    } else if (notified === true) {
      console.log('user already notified')
    } else if (!user.notifications) {
          User.findOneAndUpdate({ email: req.params.email }, { notifications: newNotification })
            .then(user => res.json(user))
            .catch((err) => res.status(400).json('Error: ' + err));
    } else {
        let notifications = user.notifications;
        notifications[notifications.length] = newNotification
        User.findOneAndUpdate({ email: req.params.email }, { notifications: notifications })
          .then(user => res.json(user))
          .catch((err) => res.json(400).json('Error: ' + err));
    }
  })
  .catch((err) => console.log(err))
});


 //@route POST api/users/notfications/:id
 //@desc Check Notification
 //@access Private

 router.route('/notifications/check/:id').post((req, res) => {
   let update;
   User.findOne({ _id: req.params.id })
    .then(user => {
      update = user.notifications
      for (let [key, value] of Object.entries(user.notifications)) {
        if (user.notifications[key]._id == req.body.id) {
          update[key].checked = true
        }
      }
      User.findOneAndUpdate({ _id: req.params.id }, { notifications: update })
        .then(user => res.json(user))
        .catch((err) => res.json(400).json('Error: ' + err))
    })
    .catch((err) => res.json(400).json('Error: ' + err))
 })

module.exports = router;