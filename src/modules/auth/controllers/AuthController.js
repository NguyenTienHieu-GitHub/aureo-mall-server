const AuthService = require("../services/AuthService");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    await AuthService.register({ firstName, lastName, email, password });
    res.locals.message = "Registered account successfully";
    return res.status(201).json();
  } catch (error) {
    if (error.message == "Email already exists.") {
      res.locals.message = error.message;
      res.locals.error =
        "This email is already associated with another account.";
      return res.status(409).json();
    } else {
      res.locals.message = "Internal Server Error";
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
    res.cookie("XSRF-TOKEN", refreshKey, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.locals.message = "Login Successfully";
    res.locals.data = { accessKey };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error during login:", error);
    if (error.message === "Invalid email or password.") {
      res.locals.message = error.message;
      res.locals.error = "Invalid email or password";
      return res.status(401).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshKey = req.cookies["XSRF-TOKEN"];
    if (!refreshKey) {
      res.locals.message = "You are not authenticated";
      res.locals.error = "RefreshKey is not in cookie";
      return res.status(401).json();
    }

    const { newAccessKey, newRefreshKey } = await AuthService.refreshToken(
      refreshKey
    );
    res.cookie("XSRF-TOKEN", newRefreshKey, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    res.locals.message = "Refresh token successfully";
    res.locals.data = { newAccessKey };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error in requestRefreshToken:", error);
    if (error.message == "Refresh token is not valid") {
      res.locals.message = error.message;
      res.locals.error = "RefreshKey not in the database";
      return res.status(404).json();
    } else if (error.message == "Token is not valid") {
      res.locals.message = error.message;
      res.locals.error = error.message;
      return res.status(403).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshKey = req.cookies["XSRF-TOKEN"];
    if (!refreshKey) {
      res.locals.message = "You are not authenticated";
      res.locals.error = "RefreshKey is not in cookie";
      return res.status(401).json();
    }

    await AuthService.logout(refreshKey);

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
    res.locals.message = "Internal Server Error";
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
