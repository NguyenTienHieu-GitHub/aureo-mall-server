const { isUUID } = require("validator");
const UserService = require("../services/UserService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_INVALID",
        errorMessage: "You are not authenticated",
      });
    }

    const userData = await UserService.getMyInfo(userId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "User information retrieved successfully",
      data: {
        userId: userData.id,
        fullName: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roleList: userData.Roles?.map((role) => role.roleName) || [],
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("User is not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
        errorMessage: "User is  not found in database",
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

const getAllUsers = async (req, res) => {
  try {
    const allUserData = await UserService.getAllUsers();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all users successfully",
      data: allUserData,
    });
  } catch (error) {
    if (error.message.includes("User not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "USERS_NOT_FOUND",
        errorMessage: "Users not found in the database",
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

const getUsersById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "MISSING_FIELD",
      errorMessage: "Missing required fields: id",
    });
  } else if (!isUUID(userId)) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "INVALID_USER_ID_FORMAT",
      errorMessage: "Invalid user ID format: uuid",
    });
  }
  try {
    const userDataById = await UserService.getUserById(userId);

    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show user successfully",
      data: {
        userId: userDataById.id,
        fullName: `${userDataById.firstName} ${userDataById.lastName}`,
        firstName: userDataById.firstName,
        lastName: userDataById.lastName,
        email: userDataById.email,
        roleList: userDataById.Roles?.map((role) => role.roleName) || [],
        createdAt: userDataById.createdAt,
        updatedAt: userDataById.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error get user by id:", error);
    if (error.message.includes("User not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
        errorMessage: "User not found in the database",
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

const createUser = async (req, res) => {
  const { firstName, lastName, email, password, roleId } = req.body;
  try {
    const userData = await UserService.createUser({
      firstName,
      lastName,
      email,
      password,
      roleId,
    });
    return setResponseLocals({
      res,
      statusCode: 201,
      messageSuccess: "User created successfully",
      data: {
        userId: userData.id,
        fullName: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roleList: userData.Roles?.map((role) => role.roleName) || [],
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Email already exists")) {
      return setResponseLocals({
        res,
        statusCode: 409,
        errorCode: "EMAIL_EXISTS",
        errorMessage: "Email already exists in the database",
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

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "MISSING_FIELD",
      errorMessage: "Missing required fields: id",
    });
  } else if (!isUUID(userId)) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "INVALID_USER_ID_FORMAT",
      errorMessage: "Invalid user ID format: uuid",
    });
  }
  try {
    await UserService.deleteUser(userId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.message.includes("User not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
        errorMessage: "User not found in the database",
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

const deleteMyUser = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return setResponseLocals({
      res,
      statusCode: 401,
      errorCode: "TOKEN_INVALID",
      errorMessage: "You are not authenticated",
    });
  }
  try {
    await UserService.deleteMyUser(userId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Your account has been deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user: ", error);
    if (error.message.includes("User not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
        errorMessage: "User not found in the database",
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

const updateUserByAdmin = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "MISSING_FIELD",
      errorMessage: "Missing required fields: id",
    });
  } else if (!isUUID(userId)) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "INVALID_USER_ID_FORMAT",
      errorMessage: "Invalid user ID format: uuid",
    });
  }
  const { firstName, lastName, email, password, roleId } = req.body;
  try {
    const userData = await UserService.updateUserByAdmin({
      userId: userId,
      firstName,
      lastName,
      email,
      password,
      roleId,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "User updated successfully",
      data: {
        userId: userData.id,
        fullName: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roleList: userData.Roles?.map((role) => role.roleName) || [],
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.message.includes("Email already exists.")) {
      return setResponseLocals({
        res,
        statusCode: 409,
        errorCode: "EMAIL_EXISTS",
        errorMessage: "Email already exists in the database",
      });
    } else if (error.message.includes("User not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
        errorMessage: "User not found in the database",
      });
    } else if (
      error.message.includes("Password does not meet the requirements")
    ) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "INVALID_PASSWORD_FORMAT",
        errorMessage:
          "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
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

const updateMyInfo = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "MISSING_FIELD",
      errorMessage: "Missing required fields: id",
    });
  } else if (!isUUID(userId)) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "INVALID_USER_ID_FORMAT",
      errorMessage: "Invalid user ID format: uuid",
    });
  }
  const { firstName, lastName, email, password } = req.body;
  try {
    const userData = await UserService.updateMyInfo({
      userId: userId,
      firstName,
      lastName,
      email,
      password,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Your information has been updated successfully",
      data: {
        userId: userData.id,
        fullName: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roleList: userData.Roles?.map((role) => role.roleName) || [],
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    if (error.message.includes("Email already exists.")) {
      return setResponseLocals({
        res,
        statusCode: 409,
        errorCode: "EMAIL_EXISTS",
        errorMessage: "Email already exists in the database",
      });
    } else if (error.message.includes("User not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
        errorMessage: "User not found in the database",
      });
    } else if (
      error.message.includes("Password does not meet the requirements")
    ) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "INVALID_PASSWORD_FORMAT",
        errorMessage:
          "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
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
  getMyInfo,
  getAllUsers,
  getUsersById,
  createUser,
  deleteUser,
  deleteMyUser,
  updateUserByAdmin,
  updateMyInfo,
};
