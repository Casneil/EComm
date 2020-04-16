const express = require("express");
const multer = require("multer");

const productsRepo = require("../../repositories/products.js");
const newProductsTemplate = require("../../views/admin/products/new.js");
const { requirePrice, requireTitle } = require("./validators.js");
const { handleErrors, requireAuth } = require("./middlewares.js");
const productTmplateIndex = require("../../views/admin/products/index.js");
const editProductTemplate = require("../../views/admin/products/edit.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productTmplateIndex({ products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(newProductsTemplate({}));
});

router.post("/admin/products/new", requireAuth, upload.single("image"), [requireTitle, requirePrice], handleErrors(newProductsTemplate), async (req, res) => {
  const image = req.file.buffer.toString("base64");
  const { title, price } = req.body;

  await productsRepo.create({ title, price, image });

  res.redirect("/admin/products");
});

router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);
  if (!product) {
    res.send("Product not found!");
  }

  res.send(editProductTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(editProductTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }
    try {
      await productsRepo.update(req.params.id, changes);
    } catch (error) {
      return res.send("Item not found!");
    }
    res.redirect("/admin/products");
  }
);

router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
  await productsRepo.delete(req.params.id);
  res.redirect("/admin/products");
});

module.exports = router;
