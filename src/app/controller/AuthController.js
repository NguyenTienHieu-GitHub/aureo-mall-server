const pool = require("../../config/db/index");
const userModel = require("../../app/models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");

const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    // Check if email already exists
    const checkEmailResult = await pool.query(userModel.checkEmailExits, [
      email,
    ]);
    if (checkEmailResult.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }
    // Validate password
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet the requirements.",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Add user to the database
    const addResult = await pool.query(userModel.createUser, [
      firstname,
      lastname,
      email,
      hashedPassword,
    ]);
    // Return the newly created user
    const userId = addResult.rows[0].user_id;
    const defaultRoleId = 5;
    const addRoleResult = await pool.query(userModel.createRole, [
      userId,
      defaultRoleId,
    ]);
    const roleId = addRoleResult.rows[0].role_id;
    return res.status(201).json({ user: addResult.rows[0], role_id: roleId });
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
  try {
    // Check if email exists in the database
    const checkMailResults = await pool.query(userModel.checkEmailExits, [
      email,
    ]);
    if (checkMailResults.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }
    // Lấy thông tin người dùng từ kết quả truy vấn
    const user = checkMailResults.rows[0];

    const hashedPassword = user.password;
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (isMatch) {
      // Passwords match, login successful
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Token hết hạn sau 7 ngày

      await saveRefreshTokenToDB(user.user_id, refreshToken, expiresAt);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({
        // users: {
        //   user: user,
        //   role_id: user.role_id,
        // },
        message: "Login successfully",
        accessToken,
      });
    } else {
      // Passwords do not match
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
    // Truy vấn cơ sở dữ liệu để kiểm tra refresh token
    const result = await pool.query(userModel.checkRefreshTokenInDB, [
      refreshToken,
    ]);

    // Kiểm tra nếu có kết quả
    if (result.rows.length > 0) {
      const tokenRecord = result.rows[0];

      // Kiểm tra nếu token đã hết hạn
      if (new Date(tokenRecord.expires_at) < new Date()) {
        // Xóa token hết hạn khỏi cơ sở dữ liệu
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
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authenticated" });
    }

    // Kiểm tra refresh token trong cơ sở dữ liệu
    const tokenRecord = await checkRefreshTokenInDB(refreshToken);
    if (!tokenRecord) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token is not valid" });
    }

    // Xác thực refresh token
    jwt.verify(refreshToken, process.env.REFRESH_KEY, async (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res
          .status(403)
          .json({ success: false, message: "Token is not valid" });
      }
      // Tạo access token và refresh token mới
      const newAccessToken = await generateAccessToken(user);
      const newRefreshToken = await generateRefreshToken(user);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Token hết hạn sau 7 ngày

      // Xóa refresh token cũ khỏi cơ sở dữ liệu
      await deleteRefreshTokenFromDB(refreshToken);

      await saveRefreshTokenToDB(
        tokenRecord.user_id,
        newRefreshToken,
        expiresAt
      );

      // Lưu refresh token mới vào cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false, // Đặt true nếu sử dụng HTTPS
        path: "/",
        sameSite: "strict",
      });
      // Trả về access token mới
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
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token found" });
    }

    // Xóa refresh token khỏi cơ sở dữ liệu
    await pool.query(userModel.deleteRefreshToken, [refreshToken]);

    // Xóa cookie chứa refresh token
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
