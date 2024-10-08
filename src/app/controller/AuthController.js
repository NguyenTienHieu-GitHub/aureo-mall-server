const User = require("../../app/models/UserModel");
const UserRole = require("../../app/models/UserRoleModel");
const Token = require("../../app/models/TokenModel");
const userController = require("../../app/controller/UserController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const { Op } = require("sequelize");
const sequelize = require("../../config/db");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.locals.message = "Missing required fields";
    res.locals.error =
      "Missing required fields: firstName, lastName, email, and password are required.";
    return res.status(400).json();
  }
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
  if (!passwordRegex.test(password)) {
    res.locals.message = "Password does not meet the requirements.";
    res.locals.error =
      "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    return res.status(400).json();
  }
  const transaction = await sequelize.transaction();
  try {
    const emailExists = await userController.checkMailExists(email);
    if (emailExists) {
      res.locals.message = "Email already exists.";
      res.locals.error =
        "This email is already associated with another account.";
      return res.status(409).json();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const addResult = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      { transaction }
    );
    const userId = addResult.id;
    const defaultRoleId = 5;
    await UserRole.create(
      {
        userId: userId,
        roleId: defaultRoleId,
      },
      { transaction }
    );

    await transaction.commit();
    res.locals.message = "Registered account successfully";
    return res.status(201).json();
  } catch (error) {
    await transaction.rollback();
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const generateAccessToken = async (user) => {
  if (!user.id || !user.email) {
    throw new Error("Missing userId or email");
  }
  // Generate JWT payload
  const payload = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "600s",
  });
};
const generateRefreshToken = async (user) => {
  if (!user.id || !user.email) {
    throw new Error("Missing userId or email");
  }
  // Generate JWT payload
  const payload = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payload, process.env.REFRESH_KEY, {
    expiresIn: "7d",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: email, password";
    return res.status(401).json();
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.locals.message = "Invalid email or password.";
      res.locals.error = "Authentication failed: Invalid email or password.";
      return res.status(400).json();
    }
    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (isMatch) {
      const accessKey = await generateAccessToken(user);
      const refreshKey = await generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await saveRefreshTokenToDB(user.id, refreshKey, expiresAt);

      res.cookie("refreshKey", refreshKey, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.locals.message = "Login Successfully";
      res.locals.data = { accessKey };
      return res.status(200).json({ data: res.locals.data });
    } else {
      res.locals.message = "Invalid email or password.";
      res.locals.error = "Authentication failed: Invalid email or password.";
      return res.status(400).json();
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const saveRefreshTokenToDB = async (userId, refreshKey, expiresAt) => {
  try {
    const existingToken = await Token.findOne({ where: { userId: userId } });
    if (existingToken) {
      await Token.update(
        { refreshToken: refreshKey, expiresAt: expiresAt },
        { where: { userId: userId } }
      );
    } else {
      await Token.create({
        userId: userId,
        refreshToken: refreshKey,
        expiresAt: expiresAt,
      });
    }
  } catch (error) {
    console.error("Error saving refresh token to DB", error);
    throw new Error("Unable to save refresh token");
  }
};

const checkRefreshTokenInDB = async (refreshKey) => {
  try {
    const tokenRecord = await Token.findOne({
      where: { refreshToken: refreshKey },
    });
    if (!tokenRecord) {
      console.log("No matching token found in the database.");
      return null;
    }
    if (new Date(tokenRecord.expiresAt) < new Date()) {
      await Token.destroy({ where: { id: tokenRecord.id } });
      return null;
    }
    return tokenRecord;
  } catch (error) {
    console.error("Error in checkRefreshTokenInDB:", error);
    throw error;
  }
};

const deleteRefreshTokenFromDB = async (refreshKey) => {
  try {
    await Token.destroy({ where: { refreshToken: refreshKey } });
    console.log("Old refresh token deleted successfully");
  } catch (error) {
    console.error("Error deleting refresh token:", error);
  }
};

const requestRefreshToken = async (req, res) => {
  try {
    const refreshKey = req.cookies.refreshKey;
    if (!refreshKey) {
      res.locals.message = "You are not authenticated";
      res.locals.error = "RefreshKey is not in cookie";
      return res.status(401).json();
    }
    const tokenRecord = await checkRefreshTokenInDB(refreshKey);
    if (!tokenRecord) {
      res.locals.message = "Refresh token is not valid";
      res.locals.error = "RefreshKey not in the database";
      return res.status(401).json();
    }
    jwt.verify(refreshKey, process.env.REFRESH_KEY, async (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        res.locals.message = "Token is not valid";
        res.locals.error = err.message;
        return res.status(403).json();
      }
      const newAccessKey = await generateAccessToken(user);
      const newRefreshKey = await generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await deleteRefreshTokenFromDB(refreshKey);
      await saveRefreshTokenToDB(tokenRecord.userId, newRefreshKey, expiresAt);

      res.cookie("refreshKey", newRefreshKey, {
        httpOnly: true,
        secure: false, // Đặt true nếu sử dụng HTTPS
        path: "/",
        sameSite: "strict",
      });
      res.locals.message = "Refresh token successfully";
      res.locals.data = { newAccessKey };
      return res.status(200).json({ data: res.locals.data });
    });
  } catch (error) {
    console.error("Error in requestRefreshToken:", error);
    return res.status(500).json("Internal Server Error");
  }
};

// Xóa các token hết hạn mỗi giờ
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const deletedCount = await Token.destroy({
      where: {
        expiresAt: {
          [Op.lt]: now, // Sử dụng Op.lt để so sánh
        },
      },
    });

    console.log(`${deletedCount} expired refresh tokens deleted successfully`);
  } catch (error) {
    console.error("Error deleting expired refresh tokens:", error);
  }
});

const logoutUser = async (req, res) => {
  try {
    const refreshKey = req.cookies.refreshKey;
    if (!refreshKey) {
      res.locals.message = "You are not authenticated";
      res.locals.error = "RefreshKey is not in cookie";
      return res.status(401).json();
    }
    await Token.destroy({ where: { refreshToken: refreshKey } });

    res.clearCookie("refreshKey", {
      httpOnly: true,
      secure: false, // Đặt true nếu sử dụng HTTPS
      path: "/",
      sameSite: "strict",
    });
    res.locals.message = "Logout Successfully";
    return res.status(200).json();
  } catch (error) {
    console.error("Error during logout:", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

module.exports = {
  registerUser,
  loginUser,
  generateAccessToken,
  generateRefreshToken,
  requestRefreshToken,
  logoutUser,
};
