const pool = require("../../config/db/index");
const userModel = require("../../app/models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const registerUser = async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    // Check if email already exists
    const checkMailResults = await pool.query(userModel.checkEmailExits, [
      email,
    ]);
    if (checkMailResults.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }
    // Check if phone already exists
    const checkPhoneResults = await pool.query(userModel.checkPhoneExits, [
      phone,
    ]);
    if (checkPhoneResults.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Phone already exists." });
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
    const addResults = await pool.query(userModel.addUser, [
      email,
      phone,
      hashedPassword,
    ]);
    // Return the newly created user
    const newUser = addResults.rows[0];
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const generateAccessToken = async (user) => {
  // Generate JWT payload
  const payload = {
    id: user.id,
    email: user.email,
    role_id: user.role_id,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "120s",
  });
};
const generateRefreshToken = async (user) => {
  // Generate JWT payload
  const payload = {
    id: user.id,
    email: user.email,
    role_id: user.role_id,
  };
  return jwt.sign(payload, process.env.REFRESH_KEY, {
    expiresIn: "30d",
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
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      const { password, ...others } = user._doc || user; // Nếu không có _doc, lấy trực tiếp từ user
      return res.status(200).json({
        ...others,
        success: true,
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
const requestRefreshToken = async (req, res) => {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authenticated" });
    }
    // Kiểm tra xem refresh token có hợp lệ không
    if (!refreshTokens.includes(refreshToken)) {
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
      // Cập nhật danh sách refresh token
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      // Tạo access token và refresh token mới
      const newAccessToken = await generateAccessToken(user);
      const newRefreshToken = await generateRefreshToken(user);
      // Cập nhật danh sách refresh token
      refreshTokens.push(newRefreshToken);
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

const logoutUser = async (req, res) => {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token found" });
    }
    // Xóa cookie chứa refresh token
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // Đặt true nếu sử dụng HTTPS
      path: "/",
      sameSite: "strict",
    });
    // Xóa refresh token khỏi danh sách các token hợp lệ
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
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
