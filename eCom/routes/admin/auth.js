const express = require("express");

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const { requireEmail, requirePassword, requirePasswordConfirmation, requireValidEmail, requireValidPassword } = require("./validators.js");
const { handleErrors } = require("./middlewares");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post("/signup", [requireEmail, requirePassword, requirePasswordConfirmation], handleErrors(signupTemplate), async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.create({ email, password });
  // Store User id inside cookie
  req.session.userId = user.id;

  res.redirect("/admin/products");
});

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("Log out successfull");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post("/signin", [requireValidEmail, requireValidPassword], handleErrors(signinTemplate), async (req, res) => {
  const { email } = req.body;
  const user = await usersRepo.getOneBy({ email });

  req.session.userId = user.id;
  res.redirect("/admin/products");
});

module.exports = router;
