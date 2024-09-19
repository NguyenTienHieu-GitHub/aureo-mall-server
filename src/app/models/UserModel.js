const getUsers = "SELECT * FROM users";
const getUsersById = "SELECT * FROM users WHERE user_id = $1";
const getRoleId = "SELECT * FROM roles WHERE role_id = $1";
const checkEmailExits = "SELECT * FROM users WHERE email = $1";
const checkPermission = `
  WITH UserRoles AS (
      SELECT role_id
      FROM user_roles
      WHERE user_id = $1
  ),
  RolePermissions AS (
      SELECT p.action, p.resource
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id IN (SELECT role_id FROM UserRoles)
  )
  SELECT COUNT(*)
  FROM RolePermissions
  WHERE action = $2
  AND resource = $3;
`;
const checkRefreshTokenInDB = "SELECT * FROM tokens WHERE refresh_token = $1";
const validPassword = "SELECT password FROM users WHERE email = $1";

const createRole =
  "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING role_id";
const createUser =
  'INSERT INTO users ("firstName", "lastName", email , password, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *';
const saveRefreshTokenToDB =
  "INSERT INTO tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3) RETURNING *";

const deleteUser = "DELETE FROM users WHERE user_id = $1 RETURNING *";
const deleteRefreshToken = "DELETE FROM tokens WHERE refresh_token = $1";

const updateUser =
  'UPDATE users SET "firstName" = $1, "lastName" = $2, email = $3, password = $4, updated_at = NOW() WHERE user_id = $5 RETURNING *';
const updateRole =
  "UPDATE user_roles SET role_id = $1 WHERE user_id = $2 RETURNING *";

module.exports = {
  getUsers,
  getUsersById,
  getRoleId,
  checkEmailExits,
  createUser,
  createRole,
  updateRole,
  deleteUser,
  updateUser,
  validPassword,
  checkPermission,
  saveRefreshTokenToDB,
  checkRefreshTokenInDB,
  deleteRefreshToken,
};
