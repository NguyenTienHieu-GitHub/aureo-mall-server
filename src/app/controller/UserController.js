const pool = require("../../config/db/index");
const userModel = require("../../app/models/UserModel");
const bcrypt = require("bcrypt");
const { password } = require("pg/lib/defaults");

const getMyInfo = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const results = await pool.query(userModel.getUsersById, [user_id]);
    const roleName = await pool.query(userModel.getRoleName, [user_id]);
    if (results.rows.length > 0) {
      const user = { ...results.rows[0], role_name: roleName.rows[0] };
      delete user.password;
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllUsers = (req, res) => {
  pool.query(userModel.getUsers, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getUsersById = async (req, res) => {
  const id = req.params.id;
  try {
    const getUsersByIdResult = await pool.query(userModel.getUsersById, [id]);
    if (getUsersByIdResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User ID does not exist.",
      });
    }
    const user = { ...getUsersByIdResult.rows[0] };
    delete user.password;
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error get user by id:", error);
    res.status(500).send("Internal Server Error");
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
    const checkEmailResult = await pool.query(userModel.checkEmailExits, [
      email,
    ]);
    if (checkEmailResult.rows.length > 0) {
      return res.status(400).send("Email already exists.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const addUserResult = await pool.query(userModel.createUser, [
      firstName,
      lastName,
      email,
      hashedPassword,
    ]);
    if (!addUserResult.rows[0]) {
      return res.status(400).json({
        success: false,
        message: "Failed to add user",
        error: "ADD_USER_FAILED",
      });
    }
    const userId = addUserResult.rows[0].user_id;
    const addRoleIdResult = await pool.query(userModel.createRole, [
      userId,
      role_id,
    ]);

    const roleId = addRoleIdResult.rows[0].role_id;
    const userData = { ...addUserResult.rows[0], role_id: roleId };
    delete userData.password;
    res.status(201).json({
      success: true,
      message: "Created user successfully",
      userData,
    });
  } catch (error) {
    console.error("Error add user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: id",
    });
  }
  try {
    const checkUserResult = await pool.query(userModel.deleteUser, [id]);
    if (checkUserResult.rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "User does not exist in the database",
      });
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
  const id = req.params.id;
  const { firstName, lastName, email, password, role_id } = req.body;
  if (!firstName || !lastName || !email || !password || !role_id) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: firstName, lastName, email, password, role_id",
    });
  }
  try {
    const userResult = await pool.query(userModel.getUsersById, [id]);
    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }
    let hashedPassword = null;
    if (password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password does not meet the requirements.",
        });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await pool.query(userModel.updateUser, [
      firstName,
      lastName,
      email,
      hashedPassword || userResult.rows[0].password,
      id,
    ]);

    const updatedUserResult = await pool.query(userModel.getUsersById, [id]);
    const updatedUser = { ...updatedUserResult.rows[0] };
    delete updatedUser.password;
    if (role_id) {
      const updateRoleResult = await pool.query(userModel.updateRole, [
        role_id,
        id,
      ]);
      const updatedRole = updateRoleResult.rows[0].role_id;
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
        role: updatedRole,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: userResult.rows[0],
      });
    }
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
};
