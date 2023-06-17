const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');

router.delete('/:id', async (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(category) 
            return res.status(200).json({success:true, message: 'Category deleted'})
    }).catch(err=>{
        return res.status(400).json({success:false, error: err })
    })
})

router.get(`/:id`, async (req, res) =>{
    const category = await Category.findById(req.params.id);
    res.status(200).send(category);
})

router.post('/', async (req, res)=>{
    let category = new Category({
        name: req.body.name,
    })
    category = await category.save();
    res.send(category);
})

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();
    res.status(200).send(categoryList);
})

module.exports = router;