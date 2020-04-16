const Repository = require("./repository.js");

class CartRepository extends Repository {}

module.exports = new CartRepository("carts.json");
