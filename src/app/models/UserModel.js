const getUsers = "SELECT * FROM users";
const getUsersById = "SELECT * FROM users WHERE id = $1";
const checkEmailExits = "SELECT * FROM users WHERE email = $1";
const checkPhoneExits = "SELECT * FROM users WHERE phone = $1";
const addUser =
  "INSERT INTO users (email, phone, password, role_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *";
const deleteUser = "DELETE FROM users WHERE id = $1 RETURNING *";
const updateUserByAdmin =
  "UPDATE users SET email = $1, phone = $2, password = $3, role_id = $4, updated_at = NOW() WHERE id = $5 RETURNING *";
const updateUser =
  "UPDATE users SET email = $1, phone = $2, password = $3, updated_at = NOW() WHERE id = $4 RETURNING *";
const validPassword = "SELECT password FROM users WHERE email = $1";

module.exports = {
  getUsers,
  getUsersById,
  checkEmailExits,
  addUser,
  deleteUser,
  updateUserByAdmin,
  updateUser,
  checkPhoneExits,
  validPassword,
};
