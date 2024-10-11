const Role = require("../../auth/models/RoleModel");

const getAllRole = async () => {
  const getAllRoleResult = await Role.findAll();
  if (getAllRoleResult.length === 0) {
    throw new Error("Role not found");
  }
  return getAllRoleResult;
};

const getRoleById = async (roleId) => {
  const getRoleByIdResult = await Role.findByPk(roleId);
  if (getRoleByIdResult.length === 0) {
    throw new Error("Role not found");
  }
  return getRoleByIdResult;
};

const createRole = async ({ roleName, description }) => {
  const addRoleResult = await Role.create({ roleName, description });
  if (!addRoleResult) {
    throw new Error("Role created failed");
  }
  return addRoleResult;
};

const updateRole = async ({ roleId, roleName, description }) => {
  const findRole = await Role.findByPk(roleId);
  if (findRole) {
    await Role.update({ roleName, description }, { where: { id: roleId } });
  }
  const updateResult = await Role.findByPk(roleId);
  return updateResult;
};

const deleteRole = async (roleId) => {
  const deletedRoleResult = await Role.destroy({ where: { id: roleId } });
  if (!deletedRoleResult) {
    throw new Error("Role not found");
  }
};
module.exports = {
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
