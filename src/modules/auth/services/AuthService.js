const User = require("../models/UserModel");
const UserRole = require("../models/UserRoleModel");
const Token = require("../models/TokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../../../config/db/index");
const { Op } = require("sequelize");
const cron = require("node-cron");

const registerUser = async ({ firstName, lastName, email, password }) => {
  const transaction = await sequelize.transaction();
  try {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      throw new Error("Email already exists.");
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
    return addResult;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

const generateAccessToken = async (user) => {
  if (!user.id || !user.email) {
    throw new Error("Missing userId or email");
  }
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "600s" });
};

const generateRefreshToken = async (user) => {
  if (!user.id || !user.email) {
    throw new Error("Missing userId or email");
  }
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, process.env.REFRESH_KEY, { expiresIn: "7d" });
};

const saveRefreshTokenToDB = async (userId, refreshKey, expiresAt) => {
  try {
    const existingToken = await Token.findOne({ where: { userId } });
    if (existingToken) {
      await Token.update(
        { refreshToken: refreshKey, expiresAt },
        { where: { userId } }
      );
    } else {
      await Token.create({ userId, refreshToken: refreshKey, expiresAt });
    }
  } catch (error) {
    throw new Error("Unable to save refresh token");
  }
};

const checkRefreshTokenInDB = async (refreshKey) => {
  try {
    const tokenRecord = await Token.findOne({
      where: { refreshToken: refreshKey },
    });
    if (!tokenRecord) return null;

    if (new Date(tokenRecord.expiresAt) < new Date()) {
      await Token.destroy({ where: { id: tokenRecord.id } });
      return null;
    }
    return tokenRecord;
  } catch (error) {
    throw error;
  }
};

const deleteRefreshTokenFromDB = async (refreshKey) => {
  try {
    await Token.destroy({ where: { refreshToken: refreshKey } });
  } catch (error) {
    console.error("Error deleting refresh token:", error);
  }
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }
  const accessKey = await generateAccessToken(user);
  const refreshKey = await generateRefreshToken(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await saveRefreshTokenToDB(user.id, refreshKey, expiresAt);

  return { accessKey, refreshKey };
};

const requestRefreshToken = async (refreshKey) => {
  const tokenRecord = await checkRefreshTokenInDB(refreshKey);
  if (!tokenRecord) {
    throw new Error("Refresh token is not valid");
  }
  return new Promise((resolve, reject) => {
    jwt.verify(refreshKey, process.env.REFRESH_KEY, async (err, user) => {
      if (err) {
        throw new Error("Token is not valid");
      }
      try {
        const newAccessKey = await generateAccessToken(user);
        const newRefreshKey = await generateRefreshToken(user);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await deleteRefreshTokenFromDB(refreshKey);
        await saveRefreshTokenToDB(
          tokenRecord.userId,
          newRefreshKey,
          expiresAt
        );

        resolve({ newAccessKey, newRefreshKey });
      } catch (error) {
        reject(error);
      }
    });
  });
};

const logoutUser = async (refreshKey) => {
  await Token.destroy({ where: { refreshToken: refreshKey } });
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

module.exports = {
  registerUser,
  loginUser,
  requestRefreshToken,
  logoutUser,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshTokenToDB,
  checkRefreshTokenInDB,
  deleteRefreshTokenFromDB,
};
