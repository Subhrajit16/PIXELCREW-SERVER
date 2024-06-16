const ProductModel = require('../Model/ProductModel');

const Insert = async (req, res) => {

    try {
        const { name, details, price, session, } = req.body;

        const newproduct = new ProductModel({
            name,
            details,
            price,
            session,
        });
        await newproduct.save();
        res.status(201).json("New Product Created");
    } catch (error) {
        res.status(500).json({ error: "failed to create product" });
    }
};


const GetAll = async (req, res) => {
    try {
    const Data = await ProductModel.find().sort({ createdAt: -1 });
     res.status(200).json(Data);

    } catch (error) {
       res.status(500).json({error:"getting error fetching data"});
    }
};

const GetByID = async (req, res) => {
    try {
        const {id} =req.params;
        const posts = await ProductModel.find({ _id:id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to show product", details: error.message });
    }
};

const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, details, price, session } = req.body;
               
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.name = name || product.name;
        product.details = details || product.details;
        product.price = price || product.price;
        product.session = session || product.session;

        await product.save();
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update product", details: error.message });
    }
};

const Delete = async (req, res) => {
    try {
        const { id } = req.params;
        const Product = await ProductModel.findOneAndDelete({ _id: id });
        if (!Product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Product", details: error.message });
    }
};

module.exports = {Insert,GetAll,GetByID,Update,Delete};