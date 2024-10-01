const Permission = require("../models/PermissionModel");
const RolePermission = require("../models/RolePermissionModel");
const UserRole = require("../models/UserRoleModel");
const addPermission = async (req, res) => {
  const { action, resource, description } = req.body;
  try {
    const addPermissionResult = await Permission.create({
      action,
      resource,
      description,
    });
    if (!addPermissionResult) {
      res.status(404).json({ message: "Error creating permission" });
    }
    const defaultRoleId = 1;
    const addRolePermissionResult = await RolePermission.create({
      roleId: defaultRoleId,
      permissionId: addPermissionResult.id,
    });
    if (!addRolePermissionResult) {
      res.status(404).json({ message: "Error creating role permission" });
    }
    return res.status(200).json({
      success: true,
      message: "Created permission",
      Permission: addPermissionResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

module.exports = {
  addPermission,
};
