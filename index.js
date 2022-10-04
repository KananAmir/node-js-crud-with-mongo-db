const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const app = express();
const bodyParser = require("body-parser");
const { validationResult } = require("express-validator");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://amirovkanan:amirov1532@cluster0.mzcry9b.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

//DB TABLE
const productSchema = new Schema({
  name: String,
  price: Number,
  status: Boolean,
});

const Product = mongoose.model("Product", productSchema);

//Get All Products
app.get("/products", (req, res) => {
  Product.find({}, (err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      res.status(500).json(err);
    }
  });
});

// Get by Id
app.get('/products/:id', (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, doc) => {
        if (!err) {
            if (doc)
                res.json(doc);
            else
                res.status(404).json({ "message": "Not found!" })
        }
        else {
            res.status(500).json(err)
        }
    })

})

// Post New Product
app.post("/products", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var product = new Product({
    name: req.body.name,
    price: req.body.price,
    status: true,
  });
  product.save();
  res.send("Success!!");
});

//Delete by Id
app.delete('/products/:id', (req, res) => {

    let id = req.params.id;

    Product.findByIdAndDelete(id, (err) => {
        if (!err)
            res.json({ 'messagae': 'Success!' })
        else
            res.status(500).json(err)
    })

})
app.listen(8080, () => {
  console.log("Server is running!!");
});