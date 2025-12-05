const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const VendorPost = require("../../models/vendorProduct");
const User = require("../../models/auth.model");
const Cart = require("../../models/cart.model");
const customError = require("../../errors/customError");

const getCart = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findOne({ userId });

  if (!user) {
    const error = new customError("User not found", 404);
    return next(error);
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.vendorId",
    select: "businessName schoolName username profilePic",
  });
  if (!cart) {
    const error = new customError("Cart is empty", 400);
    return next(error);
  }
  res.status(200).json({ cart });
});

const addToCart = asyncErrorHandler(async (req, res, next) => {
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
      cart.items[itemIndex] = productId;
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

      await cart.save();
      res.status(200).json({ cart });
    }
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

module.exports = {
  getCart,
  addToCart,
};
