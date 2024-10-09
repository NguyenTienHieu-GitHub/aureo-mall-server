const Permission = require("../models/PermissionModel");
const Role = require("../../auth/models/RoleModel");
const RolePermission = require("../models/RolePermissionModel");
const sequelize = require("../../../config/db/index");

const getAllPermissions = async () => {
  const allPermissions = await Permission.findAll();
  if (allPermissions.length === 0) {
    throw new Error("Permissions not found");
  }
  return allPermissions;
};

const getPermissionById = async (permissionId) => {
  const permission = await Permission.findByPk(permissionId);
  if (permission.length === 0) {
    throw new Error("Permissions not found");
  }

  return permission;
};

const addPermission = async ({ action, resource, description, roleId }) => {
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
    await RolePermission.create(
      {
        roleId: roleId,
        permissionId: newPermission.id,
      },
      { transaction }
    );

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
      ...newPermission.toJSON(),
      roleList: roleDetails.Roles?.map((role) => role.roleName) || [],
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
}) => {
  const permission = await Permission.findByPk(permissionId);
  if (!permission) {
    throw new Error("Permission not found.");
  }
  await permission.update({ action, resource, description });
  return permission;
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
  addPermission,
  updatePermission,
  deletePermission,
};
