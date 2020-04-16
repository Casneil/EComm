const express = require("express");
const productsRepo = require("../repositories/products.js");
const indexedProductTemplate = require("../views/products/index.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(indexedProductTemplate({ products }));
});

module.exports = router;
