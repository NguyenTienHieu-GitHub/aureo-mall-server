const ShopService = require("../services/ShopService");

const createShop = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.locals.message = "You are not authenticated";
    res.locals.error = "You need to login";
    return res.status(400).json();
  }
  const { shopName, description, address, phone, email, logo, website } =
    req.body;
  if (!shopName) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: shopName";
    return res.status(400).json();
  }
  const shopData = {
    userId: userId,
    shopName: shopName.trim() === "" ? null : shopName,
    description: description.trim() === "" ? null : description,
    address: address.trim() === "" ? null : address,
    phone: phone.trim() === "" ? null : phone,
    email: email.trim() === "" ? null : email,
    logo: logo.trim() === "" ? null : logo,
    website: website.trim() === "" ? null : website,
  };
  try {
    const newShop = await ShopService.createShop(shopData);
    res.locals.message = "Created shop successfully";
    res.locals.data = newShop;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    if (error.message === "Create shop failed") {
      res.locals.message = error.message;
      res.locals.error = "Create shop failed";
      return res.status(400).json();
    } else if (error.message === "Shop name already exists") {
      res.locals.message = "You need create a new shop";
      res.locals.error = error.message;
      return res.status(400).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error;
      return res.status(500).json();
    }
  }
};

module.exports = {
  createShop,
};
