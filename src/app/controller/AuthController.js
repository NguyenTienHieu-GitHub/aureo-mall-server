const pool = require("../../config/db/index");
const userModel = require("../../app/models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: firstName, lastName, email, and password are required.",
    });
  }
  try {
    const checkEmailResult = await pool.query(userModel.checkEmailExits, [
      email,
    ]);
    if (checkEmailResult.rows.length > 0) {
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
    const addResult = await pool.query(userModel.createUser, [
      firstName,
      lastName,
      email,
      hashedPassword,
    ]);

    if (!addResult.rows[0]) {
      return res.status(500).json({
        message: false,
        message: "Failed to create user",
        error: "USER_CREATED_FAILED",
      });
    }
    const userId = addResult.rows[0].user_id;
    const defaultRoleId = 5;
    const addRoleResult = await pool.query(userModel.createRole, [
      userId,
      defaultRoleId,
    ]);
    if (!addRoleResult.rows[0]) {
      return res.status(500).json({
        message: false,
        message: "Failed to create role",
        error: "ROLE_ASSIGNMENT_FAILED",
      });
    }
    const roleId = addRoleResult.rows[0].role_id;
    let userData = { ...addResult.rows[0], role_id: roleId };
    delete userData.password;
    return res.status(201).json(userData);
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const generateAccessToken = async (user) => {
  if (!user.user_id || !user.email) {
    throw new Error("Missing user_id or email");
  }
  // Generate JWT payload
  const payload = {
    user_id: user.user_id,
    email: user.email,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "600s",
  });
};
const generateRefreshToken = async (user) => {
  if (!user.user_id || !user.email) {
    throw new Error("Missing user_id or email");
  }
  // Generate JWT payload
  const payload = {
    user_id: user.user_id,
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
    const checkMailResults = await pool.query(userModel.checkEmailExits, [
      email,
    ]);
    if (checkMailResults.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }
    const user = checkMailResults.rows[0];
    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (isMatch) {
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await saveRefreshTokenToDB(user.user_id, refreshToken, expiresAt);

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
  const values = [userId, refreshToken, expiresAt];
  await pool.query(userModel.saveRefreshTokenToDB, values);
};

const checkRefreshTokenInDB = async (refreshToken) => {
  try {
    const result = await pool.query(userModel.checkRefreshTokenInDB, [
      refreshToken,
    ]);
    if (result.rows.length > 0) {
      const tokenRecord = result.rows[0];
      if (new Date(tokenRecord.expires_at) < new Date()) {
        await pool.query(userModel.deleteRefreshToken, [refreshToken]);
        return null;
      }
      return tokenRecord;
    }
    return null;
  } catch (error) {
    console.error("Error in checkRefreshTokenInDB:", error);
    throw error;
  }
};

const deleteRefreshTokenFromDB = async (refreshToken) => {
  try {
    await pool.query(userModel.deleteRefreshToken, [refreshToken]);
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
        tokenRecord.user_id,
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
    await pool.query("DELETE FROM tokens WHERE expires_at < $1", [now]);
    console.log("Expired refresh tokens deleted successfully");
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
    await pool.query(userModel.deleteRefreshToken, [refreshToken]);

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
