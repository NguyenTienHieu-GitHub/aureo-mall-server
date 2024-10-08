const User = require("../../app/models/UserModel");
const Role = require("../../app/models/RoleModel");
const UserRole = require("../../app/models/UserRoleModel");
const bcrypt = require("bcrypt");
const sequelize = require("../../config/db");
const { isUUID } = require("validator");

const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const userWithRole = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        attributes: ["roleName"],
        through: { attributes: [] },
      },
    });
    if (!userWithRole) {
      res.locals.message = "User is not found";
      res.locals.error = "User is  not found in database";
      return res.status(404).json();
    }

    const userData = userWithRole.toJSON();
    res.locals.message = "User information retrieved successfully";
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
    res.locals.message = "Internal server error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUserResults = await User.findAll({
      include: {
        model: Role,
        attribute: ["roleName"],
      },
    });
    if (!allUserResults) {
      res.locals.message = "User not found";
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    }
    const allUserData = allUserResults.map((user) => {
      const userJson = user.toJSON();
      return {
        userId: userJson.id,
        firstName: userJson.firstName,
        lastName: userJson.lastName,
        email: userJson.email,
        roleName: userJson.Roles?.map((role) => role.roleName) || [],
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt,
      };
    });
    res.locals.message = "Show all users successfully";
    res.locals.data = allUserData;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    res.locals.error = error.message;
    res.locals.message = "Internal server error";
    return res.status(500).json();
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
    const getUsersByIdResult = await User.findByPk(userId, {
      include: {
        model: Role,
        attribute: ["roleName"],
      },
    });
    if (!getUsersByIdResult) {
      res.locals.message = "User not found";
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    }
    const userDataById = getUsersByIdResult.toJSON();
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
    res.locals.error = error.message;
    res.locals.message = "Internal Server Error";
    return res.status(500).json();
  }
};

const checkMailExists = async (email) => {
  try {
    const existingUser = await User.findOne({ where: { email: email } });
    return existingUser !== null;
  } catch (error) {
    console.error("Error checking email", error);
    throw new Error("Internal Server Error");
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
  const transaction = await sequelize.transaction();
  try {
    const emailExists = await checkMailExists(email);
    if (emailExists) {
      res.locals.message = "Email already exists.";
      res.locals.error = "Email already exists in the database";
      return res.status(409).json();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const addUserResult = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      { transaction }
    );
    await UserRole.create(
      {
        userId: addUserResult.id,
        roleId,
      },
      { transaction }
    );

    await transaction.commit();
    const userWithRole = await User.findOne({
      where: { id: addUserResult.id },
      include: {
        model: Role,
        attributes: ["roleName"],
        through: { attributes: [] },
      },
    });
    const userData = userWithRole.toJSON();
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
    await transaction.rollback();
    console.error("Error add user:", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
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
    const deleteResult = await User.destroy({ where: { id: userId } });
    if (!deleteResult) {
      res.locals.message = "User not found";
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    } else {
      res.locals.message = "User deleted successfully";
      return res.status(200).json();
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const deleteMyUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.locals.message = "User not found";
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    }
    await User.destroy({
      where: { id: userId },
    });
    res.locals.message = "Your account has been deleted successfully";
    return res.status(200).json();
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
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
    const userResult = await User.findByPk(userId);
    if (!userResult) {
      res.locals.message = "User does not exist.";
      res.locals.error = "User does not exist in the database";
      return res.status(404).json();
    }

    userResult.firstName = firstName;
    userResult.lastName = lastName;
    if (email && email !== userResult.email) {
      const emailExists = await checkMailExists(userResult.email);
      if (emailExists) {
        res.locals.message = "Email already exists";
        res.locals.error = "Email already exists in the database.";
        return res.status(409).json();
      }
    }
    userResult.email = email;
    if (password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
      if (!passwordRegex.test(password)) {
        res.locals.message = "Password does not meet the requirements.";
        res.locals.error =
          "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
        return res.status(400).json();
      }
      userResult.password = await bcrypt.hash(password, 10);
    }

    await userResult.save();

    await UserRole.update(
      { roleId: roleId },
      { where: { userId: userResult.id } }
    );

    const userWithRole = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        attributes: ["roleName"],
      },
    });
    const updatedUserData = userWithRole.toJSON();
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
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    res.status(500).json();
  }
};

const updateMyInfo = async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.locals.message = "User not found";
      res.locals.error = "User not found in the database";
      return res.status(404).json();
    }
    if (password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
      if (!passwordRegex.test(password)) {
        res.locals.message = "Password does not meet the requirements.";
        res.locals.error =
          "Password must be between 12 to 23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
        return res.status(400).json();
      }
      user.password = await bcrypt.hash(password, 10);
    }
    if (email && email !== user.email) {
      const emailExists = await checkMailExists(email);
      if (emailExists) {
        res.locals.message = "Email already exists";
        res.locals.error = "Email already exists in the database";
        return res.status(409).json();
      }
    }
    await user.update({ firstName, lastName, email, password: user.password });

    const userWithRole = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        attributes: ["roleName"],
      },
    });
    const userDate = userWithRole.toJSON();
    res.locals.message = "Your information has been updated successfully";
    res.locals.data = {
      userId: userDate.id,
      firstName: userDate.firstName,
      lastName: userDate.lastName,
      email: userDate.email,
      roleName: userDate.Roles?.map((role) => role.roleName) || [],
      createdAt: userDate.createdAt,
      updatedAt: userDate.updatedAt,
    };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.locals.message = "Internal server error";
    res.locals.error = error.message;
    return res.status(500).json();
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
  checkMailExists,
};
