const Permission = require("../models/PermissionModel");

const createDefaultPermission = async () => {
  const count = await Permission.count();
  if (count === 0) {
    await Permission.sequelize.query(
      'ALTER SEQUENCE "Permissions_id_seq" RESTART WITH 1;'
    );
  }
  const permissions = [
    {
      action: "view_all_users",
      resource: "User",
      description: "View all user details",
    },
    {
      action: "view_user",
      resource: "User",
      description: "View user details",
    },
    {
      action: "view_my_info",
      resource: "User",
      description: "View my user details",
    },
    {
      action: "edit_user",
      resource: "User",
      description: "Edit user details",
    },
    {
      action: "edit_my_info",
      resource: "User",
      description: "Edit my user details",
    },
    {
      action: "delete_user",
      resource: "User",
      description: "Delete a user",
    },
    {
      action: "delete_my_user",
      resource: "User",
      description: "Delete a user",
    },
    {
      action: "create",
      resource: "User",
      description: "Create a new user",
    },

    {
      action: "create",
      resource: "Permission",
      description: "Create new permission",
    },
    {
      action: "edit",
      resource: "Permission",
      description: "Edit existing permission",
    },
    {
      action: "delete",
      resource: "Permission",
      description: "Delete permission",
    },
    {
      action: "view",
      resource: "Permission",
      description: "View permissions list",
    },

    {
      action: "create",
      resource: "Role",
      description: "Create new role",
    },
    {
      action: "edit",
      resource: "Role",
      description: "Edit existing role",
    },
    {
      action: "delete",
      resource: "Role",
      description: "Delete role",
    },
    {
      action: "view",
      resource: "Role",
      description: "View roles list",
    },

    {
      action: "view_all_addresses",
      resource: "Address",
      description: "View all addresses list",
    },
    {
      action: "view_address",
      resource: "Address",
      description: "View address details",
    },
    {
      action: "create",
      resource: "Address",
      description: "Create address",
    },
    {
      action: "edit",
      resource: "Address",
      description: "Edit Address",
    },
    {
      action: "delete_my_address",
      resource: "Address",
      description: "Edit Address",
    },
  ];

  for (const perm of permissions) {
    try {
      await Permission.findOrCreate({
        where: { action: perm.action, resource: perm.resource },
        defaults: { description: perm.description },
      });
    } catch (error) {
      console.error("Error creating permission: ", error);
    }
  }
};

module.exports = createDefaultPermission;
