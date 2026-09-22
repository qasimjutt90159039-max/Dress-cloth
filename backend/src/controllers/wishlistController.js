import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'title slug price salePrice onSale images embroideryType fabric stock'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
      return res.status(200).json({ success: true, added: true, wishlist });
    }

    const index = wishlist.products.findIndex(p => p.toString() === productId);
    let added = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
    } else {
      wishlist.products.push(productId);
      added = true;
    }

    await wishlist.save();
    const populated = await Wishlist.findById(wishlist._id).populate(
      'products',
      'title slug price salePrice onSale images embroideryType fabric stock'
    );

    res.status(200).json({
      success: true,
      added,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist: populated
    });
  } catch (error) {
    next(error);
  }
};
