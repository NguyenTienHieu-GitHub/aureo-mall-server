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
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: firstName, lastName, email, and password are required.",
    });
  }
  const transaction = await sequelize.transaction();
  try {
    const emailExists = await userController.checkMailExists(email);
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet the requirements.",
      });
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
    const addRoleResult = await UserRole.create(
      {
        userId: userId,
        roleId: defaultRoleId,
      },
      { transaction }
    );

    await transaction.commit();

    const userData = addResult.toJSON();
    delete userData.password;
    const responseData = { ...userData, roleId: addRoleResult.roleId };

    return res.status(201).json({
      success: true,
      message: "Created user successfully",
      responseData,
    });
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
    return res.status(401).json({
      success: false,
      message: "Missing required fields: email, password are require",
    });
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }
    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (isMatch) {
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await saveRefreshTokenToDB(user.id, refreshToken, expiresAt);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({
        message: "Login successfully",
        accessToken,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const saveRefreshTokenToDB = async (userId, refreshToken, expiresAt) => {
  try {
    const existingToken = await Token.findOne({ where: { userId: userId } });
    if (existingToken) {
      await Token.update(
        { refreshToken: refreshToken, expiresAt: expiresAt },
        { where: { userId: userId } }
      );
    } else {
      await Token.create({
        userId: userId,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
      });
    }
  } catch (error) {
    console.error("Error saving refresh token to DB", error);
    throw new Error("Unable to save refresh token");
  }
};

const checkRefreshTokenInDB = async (refreshToken) => {
  try {
    const tokenRecord = await Token.findOne({
      where: { refreshToken: refreshToken },
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

const deleteRefreshTokenFromDB = async (refreshToken) => {
  try {
    await Token.destroy({ where: { refreshToken: refreshToken } });
    console.log("Old refresh token deleted successfully");
  } catch (error) {
    console.error("Error deleting refresh token:", error);
  }
};

const requestRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authenticated" });
    }
    const tokenRecord = await checkRefreshTokenInDB(refreshToken);
    if (!tokenRecord) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token is not valid" });
    }
    jwt.verify(refreshToken, process.env.REFRESH_KEY, async (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res
          .status(403)
          .json({ success: false, message: "Token is not valid" });
      }
      const newAccessToken = await generateAccessToken(user);
      const newRefreshToken = await generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await deleteRefreshTokenFromDB(refreshToken);
      await saveRefreshTokenToDB(
        tokenRecord.userId,
        newRefreshToken,
        expiresAt
      );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false, // Đặt true nếu sử dụng HTTPS
        path: "/",
        sameSite: "strict",
      });

      return res.status(200).json({ accessToken: newAccessToken });
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token found" });
    }
    await Token.destroy({ where: { refreshToken: refreshToken } });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // Đặt true nếu sử dụng HTTPS
      path: "/",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json("Internal Server Error");
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
