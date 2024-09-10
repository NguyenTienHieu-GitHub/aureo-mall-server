const getUsers = "SELECT * FROM users";
const getUsersById = "SELECT * FROM users WHERE id = $1";
const checkEmailExits = "SELECT * FROM users WHERE email = $1";
const checkPermission =
  " SELECT p.permission_name FROM users u JOIN roles r ON u.role_id = r.id JOIN role_permissions rp ON r.id = rp.role_id JOIN permissions p ON rp.permission_id = p.id WHERE u.id = $1 AND p.permission_name = $2;";
const addUser =
  "INSERT INTO users (firstname, lastname, email , password, role_id, created_at, updated_at) VALUES ($1, $2, $3, $4, COALESCE($5, DEFAULT), NOW(), NOW()) RETURNING *";
const registerUser =
  "INSERT INTO users (firstname, lastname, email , password, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *";
const deleteUser = "DELETE FROM users WHERE id = $1 RETURNING *";
const updateUserByAdmin =
  "UPDATE users SET firtname = $1, lastname = $2, email = $3, password = $4, role_id = $5, updated_at = NOW() WHERE id = $6 RETURNING *";
const updateUser =
  "UPDATE users SET firtname = $1, lastname = $2, email = $3, password = $4, updated_at = NOW() WHERE id = $5 RETURNING *";
const validPassword = "SELECT password FROM users WHERE email = $1";

const saveRefreshTokenToDB =
  "INSERT INTO tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3) RETURNING *";
const checkRefreshTokenInDB = "SELECT * FROM tokens WHERE refresh_token = $1";
const deleteRefreshToken = "DELETE FROM tokens WHERE refresh_token = $1";
module.exports = {
  getUsers,
  getUsersById,
  checkEmailExits,
  addUser,
  registerUser,
  deleteUser,
  updateUserByAdmin,
  updateUser,
  validPassword,
  checkPermission,
  saveRefreshTokenToDB,
  checkRefreshTokenInDB,
  deleteRefreshToken,
};
