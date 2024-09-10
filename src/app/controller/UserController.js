const pool = require("../../config/db/index");
const userModel = require("../../app/models/UserModel");
const bcrypt = require("bcrypt");

const getAllUsers = (req, res) => {
  pool.query(userModel.getUsers, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getUsersById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const getUsersByIdResult = await pool.query(userModel.getUsersById, [id]);
    if (getUsersByIdResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User ID does not exist.",
      });
    }
    res.status(200).json({
      success: true,
      user: getUsersByIdResult.rows[0],
    });
  } catch (error) {
    console.error("Error get user by id:", error);
    res.status(500).send("Internal Server Error");
  }
};
const addUser = async (req, res) => {
  const { firstname, lastname, email, password, role_id } = req.body;
  try {
    // Check if email exists
    const checkEmailResult = await pool.query(userModel.checkEmailExits, [
      email,
    ]);
    if (checkEmailResult.rows.length > 0) {
      return res.status(400).send("Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Add User to db
    const addUserResult = await pool.query(userModel.addUser, [
      firstname,
      lastname,
      email,
      hashedPassword,
      role_id,
    ]);
    const newUser = addUserResult.rows[0];
    res.status(201).json({
      success: true,
      message: "Created user successfully",
      newUser,
    }); // Return the newly created user
  } catch (error) {
    console.error("Error add user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // Check if the user exists
    const checkUserResult = await pool.query(userModel.deleteUser, [id]);

    if (checkUserResult.rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "User does not exist in the database",
      });
    } else {
      // Delete the user
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
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, password, role_id } = req.body;

  try {
    // Check if the user exists
    const userResult = await pool.query(userModel.getUsersById, [id]);
    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }
    // Validate password
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet the requirements.",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let updateParams, updateQuery;
    if (req.user.role_id === 1) {
      updateQuery = userModel.updateUserByAdmin;
      updateParams = [firstname, lastname, email, hashedPassword, role_id, id];
    } else {
      updateQuery = userModel.updateUser;
      updateParams = [firstname, lastname, email, hashedPassword, id];
    }
    // Update the user
    const updateResult = await pool.query(updateQuery, updateParams);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updateResult.rows[0], // Ensure proper structure here
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  getAllUsers,
  getUsersById,
  addUser,
  deleteUser,
  updateUser,
};
