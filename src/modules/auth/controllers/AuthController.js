const AuthService = require("../services/AuthService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    await AuthService.register({ firstName, lastName, email, password });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Registered account successfully",
    });
  } catch (error) {
    console.error("ERROR DURING REGISTER: ", error);
    if (error.message.includes("Email already exists.")) {
      return setResponseLocals({
        res,
        statusCode: 409,
        errorCode: "EMAIL_EXISTS",
        errorMessage: "This email is already associated with another account",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
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
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Login Successfully",
      data: { accessKey },
    });
  } catch (error) {
    console.error("ERROR DURING LOGIN: ", error);
    if (error.message.includes("Invalid email or password")) {
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "INVALID_EMAIL_OR_PASSWORD",
        errorMessage: "Invalid email or password",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshKey = req.cookies["XSRF-TOKEN"];
    if (!refreshKey) {
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_NOT_FOUND",
        errorMessage: "Token not found in the cookie",
      });
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
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Refresh token successfully",
      data: { newAccessKey },
    });
  } catch (error) {
    console.error("ERROR DURING REFRESH: ", error);
    if (error.message.includes("Refresh token is not found")) {
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_NOT_FOUND",
        errorMessage: "Token not in the database",
      });
    } else if (error.message.includes("Refresh token is not valid")) {
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_INVALID",
        errorMessage: "You are not authenticated",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
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
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_NOT_FOUND",
        errorMessage: "Token not found in the cookie",
      });
    }
    await AuthService.logout({
      refreshKey,
      userId: userId,
      accessKey: token,
    });
    res.clearCookie("XSRF-TOKEN", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Đặt true nếu sử dụng HTTPS
      path: "/",
      sameSite: "strict",
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Logout Successfully",
    });
  } catch (error) {
    console.error("ERROR DURING LOGOUT: ", error);
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    await AuthService.forgetPassword({ email: email });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Password reset request has been sent to your email!",
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Email not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "EMAIL_NOT_FOUND",
        errorMessage: "Email not found in the database",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  try {
    await AuthService.resetPassword({
      token: token,
      password: password,
      confirmPassword: confirmPassword,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    if (error.message.includes("Password is not confirmed")) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "PASSWORD_NOT_CONFIRMED",
        errorMessage: "Password is not confirmed",
      });
    } else if (error.message.includes("Token has expired")) {
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_EXPIRED",
        errorMessage: "Token has expired",
      });
    } else if (error.message.includes("Token in the blacklist")) {
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_IN_BLACKLIST",
        errorMessage: "Token in the backlist",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  forgetPassword,
  resetPassword,
};
