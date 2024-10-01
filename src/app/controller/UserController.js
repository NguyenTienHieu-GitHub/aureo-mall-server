const User = require("../../app/models/UserModel");
const UserRole = require("../../app/models/UserRoleModel");
const bcrypt = require("bcrypt");
const sequelize = require("../../config/db");
const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const myInfoResult = await User.findByPk(userId);
    if (!myInfoResult) {
      return res.status(404).json({ message: "User not found" });
    }
    const roleId = await UserRole.findByPk(userId);
    const userData = myInfoResult.toJSON();
    delete userData.password;
    delete userData.id;
    const responseData = {
      userId: userId,
      ...userData,
      role_id: roleId.roleId,
    };
    return res.status(200).json(responseData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUserResults = await User.findAll();
    return res.status(200).json(allUserResults);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getUsersById = async (req, res) => {
  const userId = req.params.id;
  try {
    const getUsersByIdResult = await User.findByPk(userId);
    if (!getUsersByIdResult) {
      return res.status(404).json({
        success: false,
        message: "User ID does not exist.",
      });
    }
    const userData = getUsersByIdResult.toJSON();
    delete userData.password;
    return res.status(200).json({
      success: true,
      user: userData,
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
    return res.status(400).json({
      success: false,
      message: "Missing required fields: firstName, lastName, email, password",
    });
  }
  const transaction = await sequelize.transaction();
  try {
    const emailExists = await checkMailExists(email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
        error: "EMAIL_ALREADY_EXISTS",
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
    const addRoleResult = await UserRole.create(
      {
        userId: addUserResult.id,
        roleId,
      },
      { transaction }
    );
    await transaction.commit();

    const userData = addUserResult.toJSON();
    delete userData.password;
    const responseData = { ...userData, roleId: addRoleResult.roleId };

    return res.status(201).json({
      success: true,
      message: "Created user successfully",
      responseData,
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

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email, password, roleId } = req.body;
  if (!firstName || !lastName || !email || !password || !roleId) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: firstName, lastName, email, password, role_id",
    });
  }
  try {
    const userResult = await User.findByPk(userId);
    if (!userResult) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
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
      userResult.password = await bcrypt.hash(password, 10);
    }

    userResult.firstName = firstName;
    userResult.lastName = lastName;
    userResult.email = email;

    await userResult.save();

    await UserRole.update(
      { roleId: roleId },
      { where: { userId: userResult.id } }
    );

    const updatedUserData = userResult.toJSON();
    delete updatedUserData.password;
    const responseData = { ...updatedUserData, roleId: roleId };
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: responseData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getMyInfo,
  getAllUsers,
  getUsersById,
  addUser,
  deleteUser,
  updateUser,
  checkMailExists,
};
