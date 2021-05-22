const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const fs = require("fs");

const JWT_SECRET = "sfdkjandskjnklsnjdafnkdsackjnsadlnfklsdankcnabskjn";
const JWT_EXPIRY = "14d";

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(404).json({
      status: "fail",
      message: "Please provide Username and Password",
    });
  }

  let loginOk = false;

  fs.readFile(`${__dirname}/admin.json`, "utf-8", (err, data) => {
    const users = JSON.parse(data);
    // console.log("Users: ", users);

    users.map((i) => {
      if (i.username === user && i.password === password) {
        loginOk = true;
      }
    });

    if (loginOk) {
      const token = signToken(user._id);
      return res.status(200).json({
        status: "success",
        token,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Incorrect User or Password",
      });
    }
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not Logged in! Please login.",
    });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token Signature",
    });
  }

  next();
});
