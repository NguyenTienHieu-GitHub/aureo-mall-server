const User = require("../../app/models/UserModel");
const UserRole = require("../../app/models/UserRoleModel");
const bcrypt = require("bcrypt");

const getMyInfo = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const myInfoResult = await User.findByPk(user_id);
    if (!myInfoResult) {
      res.status(404).json({ message: "User not found" });
    }
    const roleId = await UserRole.findByPk(user_id);
    const userData = myInfoResult.toJSON();
    delete userData.password;
    const responseData = { ...userData, role_id: roleId.role_id };
    res.status(200).json(responseData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUserResults = await User.findAll();
    res.status(200).json(allUserResults);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getUsersById = async (req, res) => {
  const id = req.params.id;
  try {
    const getUsersByIdResult = await User.findByPk(id);
    if (!getUsersByIdResult) {
      return res.status(404).json({
        success: false,
        message: "User ID does not exist.",
      });
    }
    const userData = getUsersByIdResult.toJSON();
    delete userData.password;
    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error get user by id:", error);
    res.status(500).send("Internal Server Error");
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
  const { firstName, lastName, email, password, role_id } = req.body;
  if (!firstName || !lastName || !email || !password || !role_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: firstName, lastName, email, password",
    });
  }
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
    const addUserResult = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const addRoleResult = await UserRole.create({
      user_id: addUserResult.user_id,
      role_id,
    });
    const userData = addUserResult.toJSON();
    delete userData.password;
    const responseData = { ...userData, role_id: addRoleResult.role_id };
    res.status(201).json({
      success: true,
      message: "Created user successfully",
      responseData,
    });
  } catch (error) {
    console.error("Error add user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteUser = async (req, res) => {
  const user_id = req.params.id;
  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: id",
    });
  }
  try {
    const deleteResult = await User.destroy({ where: { user_id: user_id } });
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
  const user_id = req.params.id;
  const { firstName, lastName, email, password, role_id } = req.body;
  if (!firstName || !lastName || !email || !password || !role_id) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: firstName, lastName, email, password, role_id",
    });
  }
  try {
    const userResult = await User.findByPk(user_id);
    if (!userResult) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }
    // let hashedPassword = null;
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
      { role_id: role_id },
      { where: { user_id: userResult.user_id } }
    );

    const updatedUserData = userResult.toJSON();
    delete updatedUserData.password;
    const responseData = { ...updatedUserData, role_id: role_id };
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
