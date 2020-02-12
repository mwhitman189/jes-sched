const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const jwt_secret =
  process.env.JWT_SECRET || require("../config/config").JWT_SECRET;

router.post("/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

        jwt.sign(
          { id: user.id },
          jwt_secret,
          {
            expiresIn: 86400
          },
          (err, token) => {
            if (err) throw err;
            const newUser = {
              id: user.id,
              username: user.username,
              email: user.email,
              is_admin: user.is_admin
            };
            res.json({
              token,
              user: newUser
            });
          }
        );
      });
    })

    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
