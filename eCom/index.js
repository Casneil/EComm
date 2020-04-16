const express = require("express");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products.js");
const productsRouter = require("./routes/products.js");
const cartsRouter = require("./routes/carts.js");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ["kdjhs6gurop9ihfb7bs09gf"] }));
const port = 3000;

app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
