const User = require("../models/UserModel");
const UserRole = require("../models/UserRoleModel");
const Token = require("../models/TokenModel");
const BlacklistToken = require("../models/BlacklistTokenModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../../../config/db/index");
const { Op } = require("sequelize");
const cron = require("node-cron");

const register = async ({ firstName, lastName, email, password }) => {
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
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

const generateRefreshToken = async (user) => {
  if (!user.id || !user.email) {
    throw new Error("Missing userId or email");
  }
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, process.env.REFRESH_KEY, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
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
    console.error("ERROR DURING SAVE REFRESH TOKEN TO DATABASE: ", error);
    throw new Error("Unable to save refresh token");
  }
};

const checkRefreshTokenInDB = async (refreshKey) => {
  try {
    const tokenRecord = await Token.findOne({
      where: { refreshToken: refreshKey },
    });
    if (!tokenRecord) {
      console.log("No token record found.");
      return null;
    }
    const decoded = jwt.decode(tokenRecord.refreshToken);
    const exp = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = exp - currentTime;
    if (timeLeft < 0) {
      await Token.destroy({ where: { id: tokenRecord.id } });
      return null;
    }
    return tokenRecord;
  } catch (error) {
    console.error("ERROR DURING CHECK REFRESH TOKEN IN DATABASE: ", error);
    throw error;
  }
};

const login = async ({ email, password }) => {
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

const refreshToken = async (refreshKey) => {
  const tokenRecord = await checkRefreshTokenInDB(refreshKey);
  if (!tokenRecord) {
    throw new Error("Refresh token is not found");
  }
  return new Promise((resolve, reject) => {
    jwt.verify(refreshKey, process.env.REFRESH_KEY, async (err, user) => {
      if (err) {
        throw new Error("Refresh token is not valid");
      }
      try {
        const newAccessKey = await generateAccessToken(user);
        const newRefreshKey = await generateRefreshToken(user);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

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

const logout = async ({ refreshKey, userId, accessKey }) => {
  await Token.destroy({ where: { refreshToken: refreshKey } });
  if (accessKey) {
    const decoded = jwt.decode(accessKey);
    const exp = decoded.exp;
    await BlacklistToken.create({
      userId,
      accessToken: accessKey,
      expiresAt: exp,
    });
  } else {
    console.error("ERROR DURING LOGOUT: ", error);
    throw new Error("No token provided");
  }
};

// Xóa các token hết hạn mỗi giờ
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const expiredTokens = await BlacklistToken.findAll({
      where: {
        expiresAt: {
          [Op.lt]: now,
        },
      },
    });
    const expiredTokenIds = expiredTokens.map((token) => token.id);
    if (expiredTokenIds.length > 0) {
      const deletedCount = await BlacklistToken.destroy({
        where: {
          id: {
            [Op.in]: expiredTokenIds,
          },
        },
      });
      console.log(
        `${deletedCount} expired blacklisted tokens deleted successfully`
      );
    }
    const deletedRefreshCount = await Token.destroy({
      where: {
        expiresAt: {
          [Op.lt]: now,
        },
      },
    });
    console.log(
      `${deletedRefreshCount} expired refresh tokens deleted successfully`
    );
  } catch (error) {
    console.error("Error deleting expired refresh tokens:", error);
  }
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshTokenToDB,
  checkRefreshTokenInDB,
};
