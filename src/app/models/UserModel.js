const getUsers = "SELECT * FROM users";
const getUsersById = "SELECT * FROM users WHERE id = $1";
const checkEmailExits = "SELECT * FROM users WHERE email = $1";
const checkPhoneExits = "SELECT * FROM users WHERE phone = $1";
const checkPermission = `
SELECT p.permission_name
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.id = $1 AND p.permission_name = $2;
`;
const addUser =
  "INSERT INTO users (email, phone, password, role_id, created_at, updated_at) VALUES ($1, $2, $3, COALESCE($4, DEFAULT), NOW(), NOW()) RETURNING *";
const registerUser =
  "INSERT INTO users (email, phone, password, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *";
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
  registerUser,
  deleteUser,
  updateUserByAdmin,
  updateUser,
  checkPhoneExits,
  validPassword,
  checkPermission,
};
