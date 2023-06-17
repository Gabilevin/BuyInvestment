const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/order-item');
const {Order} = require('../models/order');


router.put('/:id',async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            purchasePrice:req.body.purchasePrice,
            orderItems: req.body.orderItems,
            status: req.body.status,
            shippingAddress: req.body.shippingAddress,
            zip: req.body.zip,
            share: req.body.share,
            city: req.body.city,
            sharesAmount:req.body.sharesAmount,
            country: req.body.country,
            date:req.body.date,
            totalPrice: req.body.totalPrice,
            sharePrice: req.body.sharePrice,
            sharePrice2: req.body.sharePrice2,
            currentPrice: req.body.currentPrice,
            user: req.body.user,
            time:req.body.time
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('update error')

    res.send(order);
})

router.get(`/:id`, async (req, res) =>{
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({ 
                path: 'orderItems', 
                populate: {
                    path : 'product', 
                    populate: 'category'
                } 
            });
        if(!order) {
            res.status(404).json({success: false, message: " the order is not found"})
        } else {
            const share = order.orderItems[0].product.share;
            const sharePrice = order.orderItems[0].product.sharePrice;
            const sharePrice2 = order.orderItems[0].product.sharePrice2;
            res.status(200).json({success: true, share, sharePrice,sharePrice2});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
})


router.post('/', async (req,res)=>{
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    const orderItemsIdsResolved =  await orderItemsIds;
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

    let order = new Order({
        zip: req.body.zip,
        orderItems: orderItemsIdsResolved,
        city: req.body.city,
        shippingAddress: req.body.shippingAddress,
        status: req.body.status,
        country: req.body.country,
        currentPrice: req.body.currentPrice,
        totalPrice: totalPrice,
        share: req.body.share,
        sharePrice: req.body.sharePrice,
        sharePrice2: req.body.sharePrice2,
        purchasePrice:req.body.purchasePrice,
        date:req.body.date,
        sharesAmount:req.body.sharesAmount,
        user: req.body.user,
        time:req.body.time
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('order cannot created')

    res.send(order);
})

router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})


module.exports =router;