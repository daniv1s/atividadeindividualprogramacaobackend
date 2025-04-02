const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

// Mongoose model

const Product = mongoose.model('Product', {
    name: String,
    description: String,
    price: Number,
    quantity: Number
});

// Método listar

app.get("/", async (req, res) => {
    const products = await Product.find();
    return res.send(products);
});

// Método deletar

app.delete("/:id", async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.send(product);
});

// Método alterar

app.put("/:id", async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity
    }, {
        new: true
    });
    return res.send(product);
});

// Método criar

app.post("/", async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity
    });
    await product.save();
    return res.send(product);
});

// Conexão

app.listen(port, () => {
    mongoose.connect('mongodb+srv://user:atividadeunifan@dbatividades.lbokfpl.mongodb.net/?retryWrites=true&w=majority&appName=dbAtividades');
    console.log("App Running...");
});