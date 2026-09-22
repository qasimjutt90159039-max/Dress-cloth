import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * @desc    Get all products with filtering, search, sorting & pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      embroideryType,
      fabric,
      size,
      color,
      minPrice,
      maxPrice,
      inStock,
      onSale,
      featured,
      bestSeller,
      newArrival,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'active' };

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { embroideryType: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter by ID or slug
    if (category) {
      const foundCategory = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }]
      });
      if (foundCategory) {
        query.category = foundCategory._id;
      }
    }

    // Embroidery type filter
    if (embroideryType) {
      const types = Array.isArray(embroideryType) ? embroideryType : embroideryType.split(',');
      query.embroideryType = { $in: types.map(t => new RegExp(t.trim(), 'i')) };
    }

    // Fabric filter
    if (fabric) {
      const fabrics = Array.isArray(fabric) ? fabric : fabric.split(',');
      query.fabric = { $in: fabrics.map(f => new RegExp(f.trim(), 'i')) };
    }

    // Size filter
    if (size) {
      const sizes = Array.isArray(size) ? size : size.split(',');
      query.sizes = { $in: sizes };
    }

    // Color filter
    if (color) {
      query['colors.name'] = { $regex: color, $options: 'i' };
    }

    // Price Range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // In Stock filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // On Sale filter
    if (onSale === 'true' || onSale === true) {
      query.onSale = true;
    }

    // Highlights
    if (featured === 'true' || featured === true) query.isFeatured = true;
    if (bestSeller === 'true' || bestSeller === true) query.isBestSeller = true;
    if (newArrival === 'true' || newArrival === true) query.isNewArrival = true;

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-low') sortOption = { price: 1 };
    else if (sort === 'price-high') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popularity') sortOption = { numReviews: -1, isBestSeller: -1 };

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get related products by category and embroidery
 * @route   GET /api/products/:id/related
 * @access  Public
 */
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      status: 'active',
      $or: [
        { category: product.category },
        { embroideryType: product.embroideryType }
      ]
    }).limit(4).populate('category', 'name slug');

    res.status(200).json({ success: true, products: related });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get filter metadata (embroidery types, fabrics, sizes, price min/max)
 * @route   GET /api/products/meta/filters
 * @access  Public
 */
export const getProductFilterMeta = async (req, res, next) => {
  try {
    const embroideryTypes = await Product.distinct('embroideryType', { status: 'active' });
    const fabrics = await Product.distinct('fabric', { status: 'active' });
    const categories = await Category.find().select('name slug');

    const priceBounds = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }
    ]);

    res.status(200).json({
      success: true,
      filters: {
        embroideryTypes,
        fabrics,
        categories,
        sizes: ["XS", "S", "M", "L", "XL", "XXL", "Unstitched"],
        minPrice: priceBounds[0]?.minPrice || 2500,
        maxPrice: priceBounds[0]?.maxPrice || 75000
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Create product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);

    const product = await Product.create({
      ...req.body,
      slug: req.body.slug || slug
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product successfully deleted' });
  } catch (error) {
    next(error);
  }
};
