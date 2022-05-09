// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// create associations
// Done
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Done
Category.hasMany(Product, {
  foreignKey: 'category_id',
});

Product.belongsToMany(Tag, {
  through: ProductTag,
  as: 'tag_name',
  foreignKey: 'product_id',
});

Tag.belongsToMany(Product, {
  through: ProductTag,
  as: 'product_name',
  foreignKey: 'tag_id',
});

// Product.belongsToMany(Tag, {
//   through: ProductTag,
//   as: 'product_tag',
//   foreignKey: 'product_id',
// });

// Tag.belongsToMany(Product, {
//   through: ProductTag,
//   as: 'product_tag',
//   foreignKey: 'tag_id',
// });
module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
