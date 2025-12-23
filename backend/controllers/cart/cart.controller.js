const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const VendorPost = require("../../models/vendorProduct");
const User = require("../../models/auth.model");
const Cart = require("../../models/cart.model");
const customError = require("../../errors/customError");

const get = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    const error = new customError("User not found", 404);
    return next(error);
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.vendorId",
    select: "businessName schoolName username profilePic whatsAppNumber",
  });
  if (!cart) {
    return res.status(200).json({
      cart: {
        items: [],
      },
    });
  }
  res.status(200).json({ cart });
});

const add = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    const error = new customError("User not found", 404);
    return next(error);
  }

  const { productId, quantity, vendorPostId } = req.body;

  if (!productId || !quantity || !vendorPostId) {
    const error = new customError("All fields are required", 400);
    return next(error);
  }

  const productPost = await VendorPost.findOne({
    _id: vendorPostId,
    "products._id": productId,
  });

  if (!productPost) {
    const error = new customError("Product post not found", 404);
    return next(error);
  }

  if (productPost.vendorId.toString() === userId.toString()) {
    return next(
      new customError("You cannot add your own products to cart", 403)
    );
  }

  const product = productPost.products.id(productId);

  if (!product) {
    const error = new customError("Product detail not found", 404);
    return next(error);
  }

  const cart = await Cart.findOne({ userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (itemIndex > -1) {
      let productItem = cart.items[itemIndex];
      productItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        vendorPostId,
        vendorId: productPost.vendorId,
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        quantity: Number(quantity),
        school: productPost.school,
        location: productPost.location,
      });
    }

    await cart.save();
    res.status(200).json({ cart });
  } else {
    const newCart = await Cart.create({
      userId,
      items: [
        {
          productId,
          vendorPostId,
          vendorId: productPost.vendorId,
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.image,
          quantity: Number(quantity),
          school: productPost.school,
          location: productPost.location,
        },
      ],
    });

    res.status(200).json({
      sucess: true,
      message: "Product added to cart",
      cart: newCart,
    });
  }
});

const updateItemQuantity = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    const error = new customError("Product ID and quantity are required", 400);
    return next(error);
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    const error = new customError("Cart not found", 404);
    return next(error);
  }

  const itemIndex = cart.items.findIndex(
    (p) => p.productId.toString() === productId
  );

  if (itemIndex > -1) {
    if (quantity > 0) {
      cart.items[itemIndex].quantity = Number(quantity);
    } else {
      cart.items.splice(itemIndex, 1);
    }
    await cart.save();
    res.status(200).json({ cart });
  } else {
    const error = new customError("Item not found in cart", 404);
    return next(error);
  }
});

const remove = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const { productId } = req.body;

  if (!productId) {
    const error = new customError("Product ID is required", 400);
    return next(error);
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    const error = new customError("Cart not found", 404);
    return next(error);
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();

  res.status(204).json({ cart });
});

const clear = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({ message: "Cart cleared" });
});

module.exports = {
  get,
  add,
  updateItemQuantity,
  remove,
  clear,
};
