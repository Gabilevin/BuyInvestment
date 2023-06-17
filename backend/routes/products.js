
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const {Product} = require('../models/product');
const { Category } = require('../models/category');


const FILE_TYPE_MAP = {
    'image/jpg': 'jpg',  
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });


router.get(`/`, async (req, res) =>{
    let filter = {};
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})

router.get(`/:id`, async (req, res) =>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send(product);
})

router.post(`/`, uploadOptions.single('image'), async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product({
        provider_id: req.body.provider_id,
        ListImages: req.body.ListImages,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        rating: req.body.rating,
    })

    product = await product.save();

    if(!product) 
    return res.status(500).send('The product cannot be created')

    res.send(product);
})

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    if (req.body.category !== null) {       
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');
    }
 
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');
 
    const file = req.file;
    let imagepath;
 
    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }
    if (req.body.review) {
        newReview = JSON.parse(req.body.review);
      } else {
        newReview = {}; 
      }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            description: req.body.description,
            name: req.body.name,
            price: req.body.price,
            image: imagepath,
            brand: req.body.brand,
            rating: req.body.rating,
            category: req.body.category,
            provider_id: req.body.provider_id,
            review: [...product.review, newReview]
        },
        { new: true }
    );
 
    if (!updatedProduct) return res.status(500).send('product cannot updated');
    res.send(updatedProduct);
});

router.put('/:id/review', uploadOptions.single('image'), async (req, res) => {

    const userEmail = req.body.user_email;
    Product.findById(req.params.id)
    .then((product) => {
        if (product) {
            const review = product.review.find(review => review.user_email === userEmail);
            if (review) {
                review.review_rate = req.body.review_rate;
                review.text = req.body.text;
                review.date = Date.now();

                product.markModified('review');
                product.save()
                    .then((updatedProduct) => {
                        return res.status(200).json({ success: true, message: 'Review updated successfully!', updatedProduct });
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, error: err });
                    });
            } else {
                return res.status(404).json({ success: false, message: 'Review not found!' });
            }
        } else {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    });
});

router.delete('/:productId/reviews', (req, res) => {
    const productId = req.params.productId;
    const userEmail = req.body.user_email;
    Product.findById(productId)
    .then((product) => {
        if (product) {
            const review = product.review.find(review => review.user_email === userEmail);
            if (review) {
                product.review = product.review.filter(review => review.user_email !== userEmail);
                product.save()
                    .then(() => {
                        return res.status(200).json({ success: true, message: 'Review deleted successfully!' });
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, error: err });
                    });
            } else {
                return res.status(404).json({ success: false, message: 'Review not found!' });
            }
        } else {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    });
  });


router.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'product deleted'})
        } else {
            return res.status(404).json({success: false , message: "the product is not found"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


module.exports =router;