const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    
    description: {
        type: String,
        required: true
    },
    ListImages: {
        type: [String, String, String],
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: Number,
        default:0
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    rating: {
        type: Number,
        default: 0,
    },
    review: [
        {
          review_rate: Number,
          text: String,
          user_email: String,
          date: {
            type: Date,
            default: Date.now,
          },
          default: []
        }
      ],
    provider_id: {
        type: String,
        default: ''
    },
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);