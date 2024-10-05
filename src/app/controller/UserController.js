const User = require("../../app/models/UserModel");
const Role = require("../../app/models/RoleModel");
const UserRole = require("../../app/models/UserRoleModel");
const bcrypt = require("bcrypt");
const sequelize = require("../../config/db");
const { isUUID } = require("validator");

const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const myInfoResult = await User.findByPk(userId);
    if (!myInfoResult) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userWithRole = await User.findOne({
      where: { id: myInfoResult.id },
      include: {
        model: Role,
        attributes: ["roleName"],
        through: { attributes: [] },
      },
    });
    const userData = userWithRole.toJSON();

    return res.status(200).json({
      userId: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      roleName:
        userData.Roles.length > 0
          ? userData.Roles.map((role) => role.roleName)
          : [],
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const allUserData = allUserResults.map((user) => {
      const userJson = user.toJSON();
      return {
        userId: userJson.id,
        firstName: userJson.firstName,
        lastName: userJson.lastName,
        email: userJson.email,
        roleName:
          userJson.Roles.length > 0
            ? userJson.Roles.map((role) => role.roleName)
            : [],
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt,
      };
    });

    return res.status(200).json(allUserData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getUsersById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: id",
    });
  } else if (!isUUID(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format.",
    });
  }
  try {
    const getUsersByIdResult = await User.findByPk(userId, {
      include: {
        model: Role,
        attribute: ["roleName"],
      },
    });
    if (!getUsersByIdResult) {
      return res.status(404).json({
        success: false,
        message: "User ID does not exist.",
      });
    }
    const userDataById = getUsersByIdResult.toJSON();
    return res.status(200).json({
      userId: userDataById.id,
      firstName: userDataById.firstName,
      lastName: userDataById.lastName,
      email: userDataById.email,
      roleName:
        userDataById.Roles.length > 0
          ? userDataById.Roles.map((role) => role.roleName)
          : [],
      createdAt: userDataById.createdAt,
      updatedAt: userDataById.updatedAt,
    });
  } catch (error) {
    console.error("Error get user by id:", error);
    return res.status(500).send("Internal Server Error");
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
    return res.status(401).json({
      success: false,
      message:
        "Missing required fields: firstName, lastName, email, password, roleId",
    });
  }
  const transaction = await sequelize.transaction();
  try {
    const emailExists = await checkMailExists(email);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
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

    return res.status(201).json({
      success: true,
      message: "Created user successfully",
      userId: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      roleName:
        userData.Roles.length > 0
          ? userData.Roles.map((role) => role.roleName)
          : [],
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Error add user:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: id",
    });
  } else if (!isUUID(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format.",
    });
  }
  try {
    const deleteResult = await User.destroy({ where: { id: userId } });
    if (!deleteResult) {
      res.status(404).send({ success: false, message: "User not found" });
    } else {
      res
        .status(200)
        .send({ success: true, message: "User deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const deleteMyUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    await User.destroy({
      where: { id: userId },
    });
    return res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateUserByAdmin = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: id",
    });
  } else if (!isUUID(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format.",
    });
  }
  const { firstName, lastName, email, password, roleId } = req.body;
  if (!firstName || !lastName || !email || !password || !roleId) {
    return res.status(401).json({
      success: false,
      message:
        "Missing required fields: firstName, lastName, email, password, roleId",
    });
  }
  try {
    const userResult = await User.findByPk(userId);
    if (!userResult) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }

    userResult.firstName = firstName;
    userResult.lastName = lastName;
    if (email && email !== userResult.email) {
      const emailExists = await checkMailExists(userResult.email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }
    userResult.email = email;
    if (password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password does not meet the requirements.",
        });
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
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      userId: updatedUserData.id,
      firstName: updatedUserData.firstName,
      lastName: updatedUserData.lastName,
      email: updatedUserData.email,
      roleName:
        updatedUserData.Roles.length > 0
          ? updatedUserData.Roles.map((role) => role.roleName)
          : [],
      createdAt: updatedUserData.createdAt,
      updatedAt: updatedUserData.updatedAt,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateMyInfo = async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password does not meet the requirements.",
        });
      }
      user.password = await bcrypt.hash(password, 10);
    }
    if (email && email !== user.email) {
      const emailExists = await checkMailExists(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
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
    return res.status(200).json({
      success: true,
      message: "Your information has been updated successfully",
      userId: userDate.id,
      firstName: userDate.firstName,
      lastName: userDate.lastName,
      email: userDate.email,
      roleName:
        userDate.Roles.length > 0
          ? userDate.Roles.map((role) => role.roleName)
          : [],
      createdAt: userDate.createdAt,
      updatedAt: userDate.updatedAt,
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    return res.status(500).json({ message: "Internal server error" });
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
