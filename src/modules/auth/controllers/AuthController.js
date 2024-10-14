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
      secure: false,
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
      res.locals.errorMessage = "You are not authenticated";
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_INVALID",
        errorMessage: "You are not authenticated",
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
      secure: false,
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
        errorCode: "TOKEN_INVALID",
        errorMessage: "You are not authenticated",
      });
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

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
