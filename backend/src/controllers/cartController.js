import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res, next) => {
  try {
    const filter = req.user ? { user: req.user._id } : { guestId: req.query.guestId };
    if (!filter.user && !filter.guestId) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    const cart = await Cart.findOne(filter).populate('items.product', 'title price salePrice onSale images stock slug');
    res.status(200).json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    next(error);
  }
};

export const syncCart = async (req, res, next) => {
  try {
    const { guestItems = [] } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to sync cart' });
    }

    let userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) {
      userCart = new Cart({ user: req.user._id, items: [] });
    }

    for (const gItem of guestItems) {
      const existingIndex = userCart.items.findIndex(
        i => i.product.toString() === gItem.product && i.size === gItem.size && i.color === gItem.color
      );

      if (existingIndex > -1) {
        userCart.items[existingIndex].quantity += gItem.quantity;
      } else {
        userCart.items.push({
          product: gItem.product,
          size: gItem.size || 'Standard',
          color: gItem.color || 'Default',
          quantity: gItem.quantity,
          price: gItem.price
        });
      }
    }

    await userCart.save();
    const populated = await Cart.findById(userCart._id).populate('items.product', 'title price salePrice onSale images stock slug');
    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, size = 'Standard', color = 'Default', quantity = 1, guestId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const price = product.onSale && product.salePrice ? product.salePrice : product.price;
    const filter = req.user ? { user: req.user._id } : { guestId };

    let cart = await Cart.findOne(filter);
    if (!cart) {
      cart = new Cart({
        user: req.user ? req.user._id : null,
        guestId: req.user ? null : guestId,
        items: []
      });
    }

    const existingIndex = cart.items.findIndex(
      i => i.product.toString() === productId && i.size === size && i.color === color
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, size, color, quantity, price });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product', 'title price salePrice onSale images stock slug');

    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, size, color, guestId } = req.body;
    const filter = req.user ? { user: req.user._id } : { guestId };

    const cart = await Cart.findOne(filter);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      i => !(i.product.toString() === productId && i.size === size && i.color === color)
    );

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product', 'title price salePrice onSale images stock slug');

    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const filter = req.user ? { user: req.user._id } : { guestId: req.query.guestId };
    await Cart.findOneAndDelete(filter);
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
