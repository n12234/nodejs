const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = new Schema(
  {
    title: { type: String },
    description: { type: String },
    category: { type: String},
    image: { type: String([]) },
    price: { type: Number },
    count: { type: Number },
    student: { type: String }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Product', Product);
