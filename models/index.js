// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// create associations
Product.belongsTo(Category, {
  foreignKey: 'id',
});

Category.hasMany(Product, {
  foreignKey: 'category_id',
});

Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'id',
});

Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
