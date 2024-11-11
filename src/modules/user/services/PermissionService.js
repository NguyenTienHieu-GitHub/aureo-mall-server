const Permission = require("../models/PermissionModel");
const Role = require("../../auth/models/RoleModel");
const RolePermission = require("../models/RolePermissionModel");
const sequelize = require("../../../config/db/index");

const getAllPermissions = async () => {
  const allPermissions = await Permission.findAll({
    include: [
      {
        model: Role,
        attributes: ["roleName"],
        through: {
          attributes: [],
        },
      },
    ],
  });
  if (allPermissions.length === 0) {
    throw new Error("Permissions not found");
  }
  const formattedPermissions = allPermissions.map((permission) => ({
    id: permission.id,
    action: permission.action,
    resource: permission.resource,
    description: permission.description,
    roleList: permission.Roles.map((role) => role.roleName),
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  }));
  return formattedPermissions;
};

const getPermissionById = async (permissionId) => {
  const permission = await Permission.findByPk(permissionId, {
    include: { model: Role, attributes: ["roleName"] },
  });
  if (permission.length === 0) {
    throw new Error("Permissions not found");
  }
  const permissionsData = {
    id: permission.id,
    action: permission.action,
    resource: permission.resource,
    description: permission.description,
    roleList: permission.Roles.map((role) => role.roleName),
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  };
  return permissionsData;
};

const createPermission = async ({ action, resource, description, roleIds }) => {
  const transaction = await sequelize.transaction();
  try {
    const existingPermission = await Permission.findOne({
      where: { action, resource },
    });

    if (existingPermission) {
      throw new Error(
        "Permission with this action and resource already exists."
      );
    }

    const newPermission = await Permission.create(
      {
        action,
        resource,
        description,
      },
      { transaction }
    );
    for (const roleId of roleIds) {
      await RolePermission.create(
        { roleId, permissionId: newPermission.id },
        { transaction }
      );
    }

    await transaction.commit();

    const roleDetails = await Permission.findOne({
      where: { id: newPermission.id },
      include: [
        {
          model: Role,
          attributes: ["roleName"],
        },
      ],
    });

    const responseData = {
      id: roleDetails.id,
      action: roleDetails.action,
      resource: roleDetails.resource,
      description: roleDetails.description,
      roleList: roleDetails.Roles?.map((role) => role.roleName) || [],
      createdAt: roleDetails.createdAt,
      updatedAt: roleDetails.updatedAt,
    };

    return responseData;
  } catch (err) {
    if (transaction.finished !== "commit") {
      await transaction.rollback();
    }
    throw err;
  }
};

const updatePermission = async ({
  permissionId,
  action,
  resource,
  description,
  roleIds,
}) => {
  const transaction = await sequelize.transaction();
  try {
    for (const roleId of roleIds) {
      const roleCheck = await Role.findByPk(roleId);
      if (!roleCheck) {
        throw new Error("Please create role first");
      }
    }
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      throw new Error("Permission not found.");
    }
    await Permission.update(
      { action, resource, description },
      { where: { id: permission.id } },
      { transaction }
    );
    await permission.setRoles(roleIds, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
  const permissionData = await Permission.findByPk(permissionId, {
    include: { model: Role, attributes: ["roleName"] },
  });
  const responseData = {
    id: permissionData.id,
    action: permissionData.action,
    resource: permissionData.resource,
    description: permissionData.description,
    roleList: permissionData.Roles?.map((role) => role.roleName) || [],
    createdAt: permissionData.createdAt,
    updatedAt: permissionData.updatedAt,
  };
  return responseData;
};

const deletePermission = async (permissionId) => {
  const permission = await Permission.findByPk(permissionId);
  if (!permission) {
    throw new Error("Permission not found");
  }

  await permission.destroy();
};
module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
};
