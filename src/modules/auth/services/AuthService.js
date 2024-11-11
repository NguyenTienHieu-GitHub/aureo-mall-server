const User = require("../models/UserModel");
const UserRole = require("../models/UserRoleModel");
const Token = require("../models/TokenModel");
const BlacklistToken = require("../models/BlacklistTokenModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../../../config/db/index");
const { Op } = require("sequelize");
const cron = require("node-cron");
const transporter = require("../../../config/nodemailer/nodemailer");

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

const forgetPassword = async ({ email }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Email not found");
    }
    const accessToken = await generateAccessToken(user);
    const mailOptions = {
      from: `AureoMall <${process.env.USER_MAIL}>`,
      to: user.email,
      subject: `Password Reset Request - AureoMall`,
      text: `Hello ${user.firstName} ${user.lastName},
    
    We received a request to reset your password. Please click the link below to reset it within the next 5 minutes:
    http://localhost:3080/api/auth/reset-password/${accessToken}
    
    If you did not request a password reset, please ignore this email or contact our support team at ${process.env.USER_MAIL}.
    
    Best regards,
    The AureoMall Support Team`,

      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <table width="100%" style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
            <tr>
              <td style="background-color: #4CAF50; padding: 20px; text-align: center; color: #fff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                <h2 style="margin: 0;">AureoMall</h2>
                <p style="margin: 0; font-size: 1.1em;">Password Reset Request</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <p>Hello ${user.firstName} ${user.lastName},</p>
                <p>We received a request to reset your password. Please click the link below to proceed with the reset. The link will expire in 5 minutes:</p>
                <div style="text-align: center; margin: 20px;">
                  <a href="http://localhost:3080/api/auth/reset-password/${accessToken}" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                </div>
                <p>If you did not request this password reset, please ignore this email or contact our support team at <a href="mailto:${process.env.USER_MAIL}" style="color: #4CAF50; text-decoration: none;">${process.env.USER_MAIL}</a>.</p>
                <p>Best regards,</p>
                <p>The AureoMall Support Team</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f7f7f7; padding: 10px; text-align: center; font-size: 0.9em; color: #555; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                <p>Need further assistance? Contact us at <a href="mailto:${process.env.USER_MAIL}" style="color: #4CAF50; text-decoration: none;">${process.env.USER_MAIL}</a></p>
                <p>&copy; 2024 AureoMall. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send password reset email:", error);
      } else {
        console.log("Password reset email sent successfully:", info.response);
      }
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error.message);
    throw error;
  }
};
const resetPassword = async ({ token, password, confirmPassword }) => {
  try {
    const blacklistedToken = await BlacklistToken.findOne({
      where: { accessToken: token },
    });
    if (blacklistedToken) {
      const decoded = jwt.decode(blacklistedToken.accessToken);
      const exp = decoded.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = exp - currentTime;
      if (timeLeft < 0) {
        await BlacklistToken.destroy({ where: { accessToken: token } });
        console.log(`Removed expired token: ${token}`);
      }
      throw new Error("Token in the blacklist");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
      {
        if (err) {
          throw new Error("Token has expired");
        }
        return result;
      }
    });
    if (password !== confirmPassword) {
      throw new Error("Password is not confirmed");
    }
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    const resetPasswordResult = await user.save();

    const mailOptions = {
      from: `AureoMall <${process.env.USER_MAIL}>`,
      to: user.email,
      subject: "Your Password Has Been Successfully Reset - AureoMall",
      text: `Hello ${user.firstName} ${user.lastName},
    
    We wanted to let you know that your password was successfully updated. If you did not request this change, please contact our support team immediately.
    
    To log back into your account, click the link below:
    https://localhost:3080/api/auth/login
    
    Thank you for using AureoMall!
    
    Best regards,
    The AureoMall Support Team`,

      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <table width="100%" style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
            <tr>
              <td style="background-color: #4CAF50; padding: 20px; text-align: center; color: #fff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                <h2 style="margin: 0;">AureoMall</h2>
                <p style="margin: 0; font-size: 1.1em;">Password Reset Confirmation</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <p>Hi ${user.firstName} ${user.lastName},</p>
                <p>We wanted to let you know that your password was successfully updated. If you did not request this change, please <a href="mailto:${process.env.USER_MAIL}" style="color: #4CAF50; text-decoration: none;">contact our support team</a> immediately.</p>
                <p>To log back into your account, please click the button below:</p>
                <div style="text-align: center; margin: 20px;">
                  <a href="https://localhost:3080/api/auth/login" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log in to AureoMall</a>
                </div>
                <p>Thank you for using AureoMall!</p>
                <p>Best regards,</p>
                <p>The AureoMall Support Team</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f7f7f7; padding: 10px; text-align: center; font-size: 0.9em; color: #555; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                <p>If you have any questions, please contact us at <a href="mailto:${process.env.USER_MAIL}" style="color: #4CAF50; text-decoration: none;">${process.env.USER_MAIL}</a></p>
                <p>&copy; 2024 AureoMall. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send confirmation email:", error);
      } else {
        console.log("Confirmation email sent successfully: " + info.response);
      }
    });

    if (resetPasswordResult) {
      await BlacklistToken.create({
        userId: decoded.id,
        accessToken: token,
        expiresAt: decoded.exp,
      });
    } else {
      throw new Error("Create token blacklist failed");
    }
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    throw error;
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
  forgetPassword,
  resetPassword,
};
