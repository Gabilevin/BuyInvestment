const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");


router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res
      .status(500)
      .json({ message: "The user was not found." });
  }
  res.status(200).send(user);
});

router.post("/", async (req, res) => {

  let user = new User({
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
    isAdmin: req.body.isAdmin,
    email: req.body.email,
    phone: req.body.phone,
  });
  user = await user.save();

  if (!user) return res.status(400).send("can't create user");

  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        isAdmin: user.isAdmin,
        userId: user.id,  
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("the password is not correct");
  }
});

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.post("/register", async (req, res) => {
  let user = new User({
    passwordHash: bcrypt.hashSync(req.body.password, 10), 
    email: req.body.email,
    phone: req.body.phone,
    name: req.body.name, 
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();

  if (!user) return res.status(400).send("can't create user");

  res.send(user);
});


router.put("/:id",  async (req, res) => {
  const userExist = await User.findById(req.params.id);

  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }
  const currentBalanceProduct = userExist.balance_product;
  let balanceProduct;
  if (req.body.balance_product) {
    balanceProduct = parseInt(req.body.balance_product);
  } else {
    balanceProduct = 0;
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      balance_product: currentBalanceProduct + balanceProduct,
      name: req.body.name,
      isAdmin: req.body.isAdmin,
      passwordHash: newPassword,
      phone: req.body.phone,
      totalSharesPrice: req.body.totalSharesPrice,
      email: req.body.email,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("can't create user")
  res.send(user);
});



module.exports = router;
