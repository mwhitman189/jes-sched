const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const jwt_secret =
  process.env.JWT_SECRET || require("../config/config").JWT_SECRET;

router.get("/", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validateEmail(email) {
  return re.test(String(email).toLowerCase());
}

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ msg: "Please enter a valid email" });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists" });
  });

  const newUser = new User({
    username,
    email,
    password
  });
  // Create salt & hash
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then(user => {
        jwt.sign(
          { id: user.id },
          jwt_secret,
          {
            expiresIn: 86400
          },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                is_admin: user.is_admin
              }
            });
          }
        );
      });
    });
  });

  newUser
    .save()
    .then(() => res.json("User registered!"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ msg: "Please enter a valid email" });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        { id: user.id },
        jwt_secret,
        {
          expiresIn: 86400
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              is_admin: user.is_admin
            }
          });
        }
      );
    });
  });
});

router.delete("/delete/:id", auth, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
