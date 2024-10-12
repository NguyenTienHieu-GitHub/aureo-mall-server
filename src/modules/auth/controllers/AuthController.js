const AuthService = require("../services/AuthService");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    await AuthService.register({ firstName, lastName, email, password });
    res.locals.message = "Registered account successfully";
    return res.status(201).json();
  } catch (error) {
    if (error.message.includes("Email already exists.")) {
      res.locals.error =
        "This email is already associated with another account.";
      return res.status(409).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { accessKey, refreshKey } = await AuthService.login({
      email,
      password,
    });
    const decoded = jwt.decode(refreshKey);
    const exp = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    const timeLeft = exp - currentTime;

    res.cookie("XSRF-TOKEN", refreshKey, {
      maxAge: timeLeft * 1000,
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.locals.message = "Login Successfully";
    res.locals.data = { accessKey };
    return res.status(200).json();
  } catch (error) {
    console.error("Error during login:", error);
    if (error.message.includes("Invalid email or password.")) {
      res.locals.error = "Invalid email or password";
      return res.status(401).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshKey = req.cookies["XSRF-TOKEN"];
    if (!refreshKey) {
      res.locals.error = "You are not authenticated";
      return res.status(401).json();
    }

    const { newAccessKey, newRefreshKey } = await AuthService.refreshToken(
      refreshKey
    );
    const decoded = jwt.decode(newRefreshKey);
    const exp = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    const timeLeft = exp - currentTime;

    res.cookie("XSRF-TOKEN", newRefreshKey, {
      maxAge: timeLeft * 1000,
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    res.locals.message = "Refresh token successfully";
    res.locals.data = { newAccessKey };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error during RefreshToken:", error);
    if (error.message.includes("Refresh token is not valid")) {
      res.locals.error = "Refresh token not in the database";
      return res.status(404).json();
    } else if (error.message.includes("Token is not valid")) {
      res.locals.error = "You are not authenticated";
      return res.status(403).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const logoutUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const userId = req.user.id;
  try {
    const refreshKey = req.cookies["XSRF-TOKEN"];
    if (!refreshKey) {
      res.locals.error = "You are not authenticated";
      return res.status(401).json();
    }
    await AuthService.logout({
      refreshKey,
      userId: userId,
      accessKey: token,
    });
    res.clearCookie("XSRF-TOKEN", {
      httpOnly: true,
      secure: false, // Đặt true nếu sử dụng HTTPS
      path: "/",
      sameSite: "strict",
    });
    res.locals.message = "Logout Successfully";
    return res.status(200).json();
  } catch (error) {
    console.error("Error during logout:", error);
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
