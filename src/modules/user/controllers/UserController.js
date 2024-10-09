const { isUUID } = require("validator");
const UserService = require("../services/UserService");

const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      res.locals.message = "User not authenticated";
      res.locals.error = "User ID is required.";
      return res.status(400).json();
    }

    const userData = await UserService.getMyInfo(userId);
    res.locals.message = "User information retrieved successfully";
    res.locals.data = {
      userId: userData.id,
      fullName: `${userData.lastName} ${userData.firstName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      roleList: userData.Roles?.map((role) => role.roleName) || [],
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error(error);
    if (error.message === "User is not found") {
      res.locals.message = error.message;
      res.locals.error = "User is  not found in database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal server error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUserData = await UserService.getAllUsers();
    res.locals.message = "Show all users successfully";
    res.locals.data = allUserData;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    if (error.message === "User not found") {
      res.locals.message = error.message;
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    } else {
      res.locals.error = error.message;
      res.locals.message = "Internal server error";
      return res.status(500).json();
    }
  }
};

const getUsersById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  } else if (!isUUID(userId)) {
    res.locals.message = "Invalid user ID format";
    res.locals.error = "Invalid user ID format: uuid";
    return res.status(400).json();
  }
  try {
    const userDataById = await UserService.getUserById(userId);
    res.locals.data = {
      userId: userDataById.id,
      firstName: userDataById.firstName,
      lastName: userDataById.lastName,
      email: userDataById.email,
      roleName: userDataById.Roles?.map((role) => role.roleName) || [],
      createdAt: userDataById.createdAt,
      updatedAt: userDataById.updatedAt,
    };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error get user by id:", error);
    if (error.message === "User not found") {
      res.locals.message = error.message;
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    } else {
      res.locals.error = error.message;
      res.locals.message = "Internal Server Error";
      return res.status(500).json();
    }
  }
};

const addUser = async (req, res) => {
  const { firstName, lastName, email, password, roleId } = req.body;
  if (!firstName || !lastName || !email || !password || !roleId) {
    res.locals.message = "Missing required fields";
    res.locals.error =
      "Missing required fields: firstName, lastName, email, password, roleId";
    return res.status(401).json();
  }
  try {
    const userData = await UserService.addUser({
      firstName,
      lastName,
      email,
      password,
      roleId,
    });
    res.locals.message = "Created user successfully";
    res.locals.data = {
      userId: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      roleName: userData.Roles?.map((role) => role.roleName) || [],
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
    return res.status(201).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error add user:", error);
    if (error.message === "Email already exists") {
      res.locals.message = error.message;
      res.locals.error = "Email already exists in the database";
      return res.status(409).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  } else if (!isUUID(userId)) {
    res.locals.message = "Invalid user ID format";
    res.locals.error = "Invalid user ID format: uuid";
    return res.status(400).json();
  }
  try {
    await UserService.deleteUser(userId);
    res.locals.message = "User deleted successfully";
    return res.status(200).json();
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.message == "User not found") {
      res.locals.message = error.message;
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const deleteMyUser = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  try {
    await UserService.deleteMyUser(userId);
    res.locals.message = "Your account has been deleted successfully";
    return res.status(200).json();
  } catch (error) {
    console.error("Error deleting user: ", error);
    if (error.message === "User not found") {
      res.locals.message = error.message;
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const updateUserByAdmin = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  } else if (!isUUID(userId)) {
    res.locals.message = "Invalid user ID format";
    res.locals.error = "Invalid user ID format: uuid";
    return res.status(400).json();
  }
  const { firstName, lastName, email, password, roleId } = req.body;
  if (!firstName || !lastName || !email || !password || !roleId) {
    res.locals.message = "Missing required fields";
    res.locals.error =
      "Missing required fields: firstName, lastName, email, password, roleId";
    return res.status(401).json();
  }
  try {
    const updatedUserData = await UserService.updateUserByAdmin({
      userId: userId,
      firstName,
      lastName,
      email,
      password,
      roleId,
    });
    res.locals.message = "User updated successfully";
    res.locals.data = {
      userId: updatedUserData.id,
      firstName: updatedUserData.firstName,
      lastName: updatedUserData.lastName,
      email: updatedUserData.email,
      roleName: updatedUserData.Roles?.map((role) => role.roleName) || [],
      createdAt: updatedUserData.createdAt,
      updatedAt: updatedUserData.updatedAt,
    };
    return res.status(200).json({
      data: res.locals.data,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.message === "Email already exists.") {
      res.locals.message = error.message;
      res.locals.error = "Email already exists in the database";
      return res.status(409).json();
    } else if (error.message === "User not found") {
      res.locals.message = error.message;
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    } else if (error.message === "Password does not meet the requirements") {
      res.locals.message = error.message;
      res.locals.error =
        "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
      return res.status(400).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const updateMyInfo = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  } else if (!isUUID(userId)) {
    res.locals.message = "Invalid user ID format";
    res.locals.error = "Invalid user ID format: uuid";
    return res.status(400).json();
  }
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.locals.message = "Missing required fields";
    res.locals.error =
      "Missing required fields: firstName, lastName, email, password";
    return res.status(401).json();
  }
  try {
    const userData = await UserService.updateMyInfo({
      userId: userId,
      firstName,
      lastName,
      email,
      password,
    });
    res.locals.message = "Your information has been updated successfully";
    res.locals.data = {
      userId: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      roleName: userData.Roles?.map((role) => role.roleName) || [],
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error updating user info:", error);
    if (error.message === "Email already exists.") {
      res.locals.message = error.message;
      res.locals.error = "Email already exists in the database";
      return res.status(409).json();
    } else if (error.message === "User not found") {
      res.locals.message = error.message;
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    } else if (error.message === "Password does not meet the requirements") {
      res.locals.message = error.message;
      res.locals.error =
        "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
      return res.status(400).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

module.exports = {
  getMyInfo,
  getAllUsers,
  getUsersById,
  addUser,
  deleteUser,
  deleteMyUser,
  updateUserByAdmin,
  updateMyInfo,
};
