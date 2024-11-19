const Cart = require("../models/CartModel");
const CartItem = require("../models/CartItemModel");
const CartItemOption = require("../models/CartItemOptionModel");
const Product = require("../../product/models/ProductModel");
const Shop = require("../../product/models/ShopModel");
const ProductPrice = require("../../product/models/ProductPriceModel");
const sequelize = require("../../../config/db/index");

const updateCartTotal = async (cartId, transaction) => {
  const cartItems = await CartItem.findAll({
    where: { cartId },
    attributes: ["quantity", "totalPrice"],
    transaction,
  });

  let totalQuantity = 0;
  let totalPrice = 0;

  if (cartItems.length > 0) {
    totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }
  await Cart.update(
    { totalQuantity, totalPrice },
    { where: { id: cartId }, transaction }
  );
};
const getAllProductInCart = async (userId) => {
  try {
    await createCartIfNotExist({ userId });
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          attributes: ["id", "quantity", "totalPrice"],
          include: [
            {
              model: CartItemOption,
              attributes: ["id", "optionQuantity", "optionName", "optionValue"],
            },
            {
              model: Product,
              as: "Product",
              attributes: ["id", "productName", "sku"],
              include: [
                {
                  model: ProductPrice,
                  as: "ProductPrice",
                  attributes: [
                    "originalPrice",
                    "discountPrice",
                    "discountType",
                    "discountStartDate",
                    "discountEndDate",
                    "finalPrice",
                  ],
                },
                {
                  model: Shop,
                  as: "Shop",
                  attributes: ["id", "shopName"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      throw new Error("Cart not found for the given user");
    }
    const groupedItemsByShop = cart.CartItems.reduce((result, item) => {
      const shopId = item.Product.Shop?.id || "Unknown";
      const shopName = item.Product.Shop?.shopName || "Unknown";

      if (!result[shopId]) {
        result[shopId] = {
          shopId,
          shopName,
          products: [],
        };
      }

      result[shopId].products.push({
        cartItemId: item.id,
        productId: item.Product?.id || null,
        productName: item.Product?.productName || "Unknown",
        options: (item.CartItemOptions || []).map((option) => ({
          cartItemOptionId: option.id,
          optionName: option.optionName || "Unknown",
          optionValue: option.optionValue || "Unknown",
          optionQuantity: option.optionQuantity || 0,
        })),
        originalPrice: item.Product?.ProductPrice?.originalPrice,
        finalPrice:
          item.Product?.ProductPrice?.originalPrice ===
          item.Product?.ProductPrice?.finalPrice
            ? null
            : item.Product?.ProductPrice?.finalPrice,
        totalQuantity: item.quantity,
        totalPrice: item.totalPrice,
      });

      return result;
    }, {});
    const response = {
      cartId: cart.id,
      userId: cart.userId,
      shops:
        Object.values(groupedItemsByShop).length > 0
          ? Object.values(groupedItemsByShop)
          : "Cart is empty",
    };

    return response;
  } catch (error) {
    console.error("Error fetching products in cart:", error.message);
    throw new Error(error.message);
  }
};

const createCartIfNotExist = async ({ userId }) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: userId },
    });

    if (!cart) {
      const newCart = await Cart.create({
        userId: userId,
        totalQuantity: 0,
        totalPrice: 0,
      });
      return newCart;
    }

    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
};
const addProductToCart = async ({
  userId,
  productId,
  quantity,
  optionName,
  optionValue,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const cart = await createCartIfNotExist({ userId });
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
      include: [
        {
          model: CartItemOption,
          where: { optionName, optionValue },
          required: false,
        },
      ],
    });
    const priceProduct = await ProductPrice.findOne({
      where: { productId },
      attributes: [
        "originalPrice",
        "discountPrice",
        "discountType",
        "discountStartDate",
        "discountEndDate",
      ],
    });
    if (!priceProduct) throw new Error("Product price not found");
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * priceProduct.finalPrice;
      await cartItem.save({ transaction });
      if (optionName && optionValue) {
        const existingOption = cartItem.CartItemOptions?.[0];
        if (existingOption) {
          existingOption.optionQuantity += quantity;
          await existingOption.save({ transaction });
        } else {
          await CartItemOption.create(
            {
              cartItemId: cartItem.id,
              optionQuantity: quantity,
              optionName,
              optionValue,
            },
            { transaction }
          );
        }
      }
    } else {
      cartItem = await CartItem.create(
        {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
          totalPrice: quantity * priceProduct.finalPrice,
        },
        { transaction }
      );
      if (optionName && optionValue) {
        await CartItemOption.create(
          {
            cartItemId: cartItem.id,
            optionQuantity: quantity,
            optionName,
            optionValue,
          },
          { transaction }
        );
      }
    }
    await transaction.commit();
    return cart;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const updateItemInCart = async ({
  cartId,
  productId,
  cartItemOptionId,
  quantity,
  optionName,
  optionValue,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const cartItemOption = await CartItemOption.findByPk(cartItemOptionId, {
      transaction,
    });
    if (!cartItemOption) {
      throw new Error("CartItemOption not found");
    }
    cartItemOption.optionQuantity = quantity;
    cartItemOption.optionName = optionName;
    cartItemOption.optionValue = optionValue;
    await cartItemOption.save({ transaction });
    const cartItem = await CartItem.findOne({
      where: { cartId, productId },
      transaction,
    });
    const cartOptions = await CartItemOption.findAll({
      where: { cartItemId: cartItem.id },
      transaction,
    });

    let optionQuantity = cartOptions.reduce(
      (sum, item) => sum + item.optionQuantity,
      0
    );
    cartItem.quantity = optionQuantity;

    const priceProduct = await ProductPrice.findOne({
      where: { productId },
      transaction,
    });
    cartItem.totalPrice = cartItem.quantity * priceProduct.finalPrice;
    await cartItem.save({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const deleteItemInCart = async (cartItemOptionId) => {
  const transaction = await sequelize.transaction();
  try {
    const cartItemOption = await CartItemOption.findByPk(cartItemOptionId, {
      transaction,
    });
    if (!cartItemOption) {
      throw new Error("CartItemOption not found");
    }
    const cartItemId = cartItemOption.cartItemId;
    await cartItemOption.destroy({ transaction });
    const cartItemOptions = await CartItemOption.findAll({
      where: { cartItemId },
      transaction,
    });
    const cartItem = await CartItem.findByPk(cartItemId, { transaction });
    if (!cartItem) {
      throw new Error("CartItem not found");
    }
    const cartId = cartItem.cartId;
    if (cartItemOptions.length === 0) {
      await cartItem.destroy({ transaction });
    } else {
      const productId = cartItem.productId;
      let optionQuantity = cartItemOptions.reduce(
        (sum, item) => sum + item.optionQuantity,
        0
      );
      cartItem.quantity = optionQuantity;

      const priceProduct = await ProductPrice.findOne({
        where: { productId },
        transaction,
      });
      if (!priceProduct) {
        throw new Error("Product price not found");
      }
      cartItem.totalPrice = cartItem.quantity * priceProduct.finalPrice;
      await cartItem.save({ transaction });
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const deleteAllSelected = async (cartItemOptionIds) => {
  const transaction = await sequelize.transaction();
  try {
    const cartItemOptions = await CartItemOption.findAll({
      where: {
        id: cartItemOptionIds,
      },
      transaction,
    });
    if (cartItemOptions.length === 0) {
      throw new Error("No CartItemOptions found");
    }
    const cartItemIdsToDelete = cartItemOptions.map((item) => item.cartItemId);
    await CartItemOption.destroy({
      where: {
        id: cartItemOptionIds,
      },
      transaction,
    });
    const promises = cartItemIdsToDelete.map(async (cartItemId) => {
      console.log(cartItemId);
      const cartItemOptions = await CartItemOption.findAll({
        where: { cartItemId },
        transaction,
      });
      console.log(cartItemOptions);
      const cartItem = await CartItem.findOne({
        where: { id: cartItemId },
        transaction,
      });
      if (!cartItem) {
        throw new Error("CartItem not found");
      }

      const cartId = cartItem.cartId;

      if (cartItemOptions.length === 0) {
        await cartItem.destroy({ transaction });
      } else {
        const productId = cartItem.productId;
        let optionQuantity = cartItemOptions.reduce(
          (sum, item) => sum + item.optionQuantity,
          0
        );
        cartItem.quantity = optionQuantity;

        const priceProduct = await ProductPrice.findOne({
          where: { productId },
          transaction,
        });
        if (!priceProduct) {
          throw new Error("Product price not found");
        }
        cartItem.totalPrice = cartItem.quantity * priceProduct.finalPrice;
        await cartItem.save({ transaction });
      }
    });
    await Promise.all(promises, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
module.exports = {
  getAllProductInCart,
  addProductToCart,
  updateItemInCart,
  deleteItemInCart,
  deleteAllSelected,
};
