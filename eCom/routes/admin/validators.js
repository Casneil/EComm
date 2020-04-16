const { check } = require("express-validator");
const usersRepo = require("../../repositories/users.js");

module.exports = {
  requireTitle: check("title").trim().isLength({ min: 5, max: 30 }).withMessage("Must be between 5 and 30 characters"),

  requirePrice: check("price").trim().toFloat().isFloat({ min: 1 }).withMessage("Must me a number greater than one"),

  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email alrady taken");
      }
    }),

  requirePassword: check("password").trim().isLength({ min: 5, max: 20 }).withMessage("Must be between 5 and 20 characters"),

  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Must be between 5 and 20 characters")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords did not match");
      }
    }),

  requireValidEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Valid email required")
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error("Email not found!");
      }
    }),

  requireValidPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid password");
      }
      const validPassword = await usersRepo.comparePasswords(user.password, password);
      if (!validPassword) {
        throw new Error("Please check password");
      }
    }),
};
