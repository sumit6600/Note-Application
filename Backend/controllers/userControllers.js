const asynchandler = require("express-async-handler");
const User = require("../models/userModals");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
//const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

const { validationResult } = require("express-validator");
const expressJWT = require("express-jwt");
const { errorHandlers } = require("../helpers/dbErrorHandling");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.MAIL_KEY);

const registerController = asynchandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User with this email already Exits");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });

    // await user.hashPassword();
    // await user.save();
  } else {
    res.status(400);
    throw new Error("Error Occured!");
  }
});
// const registerController = (req, res) => {
//   const { name, email, password, pic } = req.body;
//   const errors = validationResult(req);//

//   // validation tp req. body we will create custom validation in secconds
//   if (!errors.isEmpty()) {
//     const firstError = errors.array().map((error) => error.msg)[0];
//     return res.status(422).json({
//       errors: firstError,
//     });
//   } else {
//     User.findOne({
//       email,
//     }).exec((err, user) => {
//       if (user) {
//         return res.status(400).json({
//           errors: "Email is taken",
//         });
//       }
//     });

//     const token = jwt.sign(
//       {
//         name,
//         email,
//         password,
//         pic,
//       },
//       process.env.JWT_ACCOUNT_ACTIVATION,
//       {
//         expiresIn: "5m",
//       }
//     );

//     const emailData = {
//       from: process.env.EMAIL_FROM,
//       to: email,
//       subject: "Account activation link",
//       html: `
//                 <h1>Please use the following to activate your account</h1>
//                 <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
//                 <hr />
//                 <p>This email may containe sensetive information</p>
//                 <p>${process.env.CLIENT_URL}</p>
//             `,
//     };

//     sgMail
//       .send(emailData)
//       .then((sent) => {
//         return res.json({
//           message: `Email has been sent to ${email}`,
//         });
//       })
//       .catch((err) => {
//         return res.status(400).json({
//           success: false,
//           errors: errorHandlers(err),
//         });
//       });
//   }
// };

// const registerUser = asynchandler(async (req, res) => {
//   try {
//     const { name, email, password, pic } = req.body;

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       res.status(400);
//       throw new Error("User with this email already Exits");
//     }

//     if (!name || !email || !password)
//       return res.status(400).json({ msg: "Please fill in all fields." });

//     if (!validateEmail(email))
//       return res.status(400).json({ msg: "Invalid emails." });

//     const user = await User.create({
//       name,
//       email,
//       password,
//       pic,
//     });

//     if (user) {
//       return res.status(401).json({
//         msg: "Register success! please activate your email to start",
//       });
//     }
//     const activation_token = createActivationToken(user);
//     const url = `${CLIENT_URL}/api/activate/${activation_token}`;
//     sendEmail(email, url);
//   } catch {
//     res.status(400);
//     throw new Error("Error Occured!");
//   }
// });

const authUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: req.body.email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else if (!user) {
    return res.status(401).send({
      msg:
        "The email address " +
        req.body.email +
        " is not associated with any account. please check and try again!",
    });
  } else if (!Bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).send({ msg: "Wrong Password!" });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const updateUserProfile = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      pic: updatedUser.pic,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// function validateEmail(email) {
//   const re =
//     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(email);
// }

// const createActivationToken = (payload) => {
//   return jwt.sign(payload, process.env.USER_VERIFICATION_TOKEN_SECRET, {
//     expiresIn: "5m",
//   });
// };

// const createAccessToken = (payload) => {
//   return jwt.sign(payload, process.env.USER_VERIFICATION_ACCESS_SECRET, {
//     expiresIn: "15m",
//   });
// };

// const createRefreshToken = (payload) => {
//   return jwt.sign(payload, process.env.USER_VERIFICATION_REFRESH_SECRET, {
//     expiresIn: "7d",
//   });
// };

module.exports = { registerController, authUser, updateUserProfile };

// const registerUser = asynchandler(async (req, res) => {
//   const { name, email, password, pic } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("User with this email already Exits");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     pic,
//   });

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       pic: user.pic,
//       token: generateToken(user._id),
//     });

//     // await user.hashPassword();
//     // await user.save();
//   } else {
//     res.status(400);
//     throw new Error("Error Occured!");
//   }
// });

// const registerUser = asynchandler(async (req, res) => {
//   const { name, email, password, pic } = req.body;

//   if (!email) {
//     return res.status(422).send({ message: "Missing email." });
//   }

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       res.status(400);
//       throw new Error("User with this email already Exits");
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       pic,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         pic: user.pic,
//         token: generateToken(user._id),
//       });
//     }

//     const verificationToken = user.generateVerificationToken();
//     const url = `http://localhost:3000/api/verifyemail/${verificationToken}`;

//     transporter.sendMail({
//       to: email,
//       subject: "Verify Account",
//       html: `Click <a href = '${url}'>here</a> to confirm your email.`,
//     });
//     return res.status(201).send({
//       message: `Sent a verification email to ${email}`,
//     });
//   } catch {
//     res.status(400);
//     throw new Error("Error Occured!");
//   }
// });
