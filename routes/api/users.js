const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const Teacher = require("../../models/teacher.model");
const Staff = require("../../models/staff.model");
const auth = require("../../middleware/auth");

const jwt_secret =
  process.env.JWT_SECRET || require("../../config/config").JWT_SECRET;

const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validateEmail(email) {
  return re.test(String(email).toLowerCase());
}

function verifyRegistrant(
  givenName,
  familyName,
  email,
  password,
  role,
  is_admin
) {
  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists" });
  });

  const newUser = new User({
    givenName,
    familyName,
    email,
    password,
    role,
    is_admin,
  });

  // Create salt & hash
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then((user) => {
          jwt.sign(
            { id: user.id },
            jwt_secret,
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  givenName: user.givenName,
                  familyName: user.familyName,
                  email: user.email,
                  role: user.role,
                  is_admin: user.is_admin,
                },
              });
            }
          );
        })
        .then(() => res.json("User registered!"))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    });
  });
}

router.post("/signup", (req, res) => {
  const { givenName, familyName, email, password } = req.body;
  let { role, is_admin } = req.body;

  // Validation
  if (!givenName || !familyName || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ msg: "Please enter a valid email" });
  }

  // Check for email in teachers and staff tables. If not found, prevent signup
  Teacher.findOne({ email }).then((teacher) => {
    if (teacher) {
      verifyRegistrant(givenName, familyName, email, password);
    } else {
      Staff.findOne({ email }).then((staff) => {
        if (!staff) {
          return res
            .status(400)
            .json({ msg: "User not authorized to make account" });
        } else {
          role = "staff";
          is_admin = false;
          verifyRegistrant(
            givenName,
            familyName,
            email,
            password,
            role,
            is_admin
          );
        }
      });
    }
  });
});

router.delete("/delete/:id", auth, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
