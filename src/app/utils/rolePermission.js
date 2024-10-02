const RolePermission = require("../models/RolePermissionModel");

const createRolePermissionDefault = async () => {
  const rolePermission = [
    {
      roleId: 1,
      permissionId: 1,
    },
    {
      roleId: 1,
      permissionId: 2,
    },
    {
      roleId: 1,
      permissionId: 3,
    },
    {
      roleId: 1,
      permissionId: 4,
    },

    {
      roleId: 1,
      permissionId: 5,
    },
    {
      roleId: 1,
      permissionId: 6,
    },
    {
      roleId: 1,
      permissionId: 7,
    },
    {
      roleId: 1,
      permissionId: 8,
    },
    {
      roleId: 1,
      permissionId: 9,
    },
    {
      roleId: 1,
      permissionId: 10,
    },
    {
      roleId: 1,
      permissionId: 11,
    },
    {
      roleId: 1,
      permissionId: 12,
    },
    {
      roleId: 1,
      permissionId: 13,
    },
    {
      roleId: 1,
      permissionId: 14,
    },
    {
      roleId: 1,
      permissionId: 15,
    },
    {
      roleId: 1,
      permissionId: 16,
    },
    {
      roleId: 1,
      permissionId: 17,
    },
    {
      roleId: 1,
      permissionId: 18,
    },
    {
      roleId: 1,
      permissionId: 19,
    },
    {
      roleId: 1,
      permissionId: 20,
    },
    {
      roleId: 1,
      permissionId: 21,
    },

    {
      roleId: 5,
      permissionId: 3,
    },
    {
      roleId: 5,
      permissionId: 5,
    },
    {
      roleId: 5,
      permissionId: 7,
    },
    {
      roleId: 5,
      permissionId: 17,
    },
    {
      roleId: 5,
      permissionId: 18,
    },
    {
      roleId: 5,
      permissionId: 19,
    },
    {
      roleId: 5,
      permissionId: 20,
    },
    {
      roleId: 5,
      permissionId: 21,
    },
  ];
  try {
    for (const rp of rolePermission) {
      await RolePermission.findOrCreate({
        where: {
          roleId: rp.roleId,
          permissionId: rp.permissionId,
        },
      });
    }
    console.log("Default RolePermission created successfully.");
  } catch (error) {
    console.log("Error creating RolePermission: " + error);
  }
};

module.exports = createRolePermissionDefault;
