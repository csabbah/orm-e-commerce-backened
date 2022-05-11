const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const sequelize = require('../../config/connection');

// The `/api/products` endpoint
// Returns all products
router.get('/', (req, res) => {
  Product.findAll({
    attributes: [
      'id',
      'product_name',
      'price',
      'category_id',
      'stock', // Execute literal to extract Category name based on the Product category_id value
      // sequelize.literal(
      //   '(SELECT Category.category_name FROM Category WHERE Category.id = Product.category_id)'
      // ),
      // 'category_name',
    ],

    include: [
      {
        model: Category,
        attributes: ['id', 'category_name'],
      },
      {
        model: Tag,
        attributes: ['tag_name'],
        through: ProductTag,
      },
    ],
  })
    .then((dbProductData) => res.json(dbProductData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Returns one product
router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id, // params == endpoint url data
    },
    attributes: ['id', 'product_name', 'price', 'category_id', 'stock'],

    include: [
      {
        model: Category,
        attributes: ['id', 'category_name'],
      },
      {
        model: Tag,
        attributes: ['tag_name'],
        through: ProductTag,
      },
    ],
  })
    .then((dbProductData) => res.json(dbProductData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Creates new product
router.post('/', (req, res) => {
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
  })
    .then((dbProductData) => res.json(dbProductData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      console.log(product.body);

      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      console.log('new tags', newProductTags);
      console.log('old tags', productTagIds);

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// Delete one product by its `id` value
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbProductData) => {
      if (!dbProductData) {
        res.status(404).json({ message: 'No Product found with this id' });
        return;
      }
      res.json(`Product with id of ${req.params.id} deleted`);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
