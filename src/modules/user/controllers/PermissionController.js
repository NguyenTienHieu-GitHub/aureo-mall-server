const PermissionService = require("../services/PermissionService");

const getAllPermissions = async (req, res) => {
  try {
    const allPermissions = await PermissionService.getAllPermissions();
    res.locals.message = "Show all successful permissions";
    res.locals.data = allPermissions;
    return res.status(200).json();
  } catch (error) {
    console.error(error);
    if (error.message.includes("Permissions not found")) {
      res.locals.error = "Permissions not found in the database";
      return res.status(404).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
const getPermissionById = async (req, res) => {
  const permissionId = req.params.id;
  if (!permissionId) {
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  try {
    const permission = await PermissionService.getPermissionById(permissionId);
    res.locals.message = "Show successful permission";
    res.locals.data = permission;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.log(error);
    if (error.message.includes("Permissions not found")) {
      res.locals.error = "Permissions not found in the database";
      return res.status(404).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
const createPermission = async (req, res) => {
  const { action, resource, description, roleId } = req.body;
  try {
    const responseData = await PermissionService.createPermission({
      action,
      resource,
      description,
      roleId,
    });
    res.locals.message = "Created permission";
    res.locals.data = responseData;
    return res.status(200).json();
  } catch (error) {
    console.error(error);
    if (
      error.message.includes(
        "Permission with this action and resource already exists."
      )
    ) {
      res.locals.error =
        "Permission with this action and resource already exists";
      return res.status(400).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
const updatePermission = async (req, res) => {
  const permissionId = req.params.id;
  if (!permissionId) {
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  const { action, resource, description } = req.body;
  try {
    const permission = await PermissionService.updatePermission({
      permissionId,
      action,
      resource,
      description,
    });
    res.locals.message = "Permission updated successfully.";
    res.locals.data = permission;
    return res.status(200).json();
  } catch (error) {
    console.error("Error updating permission:", error);
    if (error.message.includes("Permission not found")) {
      res.locals.error = "Permission not found in the database.";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
const deletePermission = async (req, res) => {
  const permissionId = req.params.id;
  if (!permissionId) {
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  try {
    await PermissionService.deletePermission(permissionId);
    res.locals.message = "Permission deleted successfully";
    return res.status(200).json();
  } catch (error) {
    console.error("Error deleting permission:", error);
    if (error.message.includes("Permission not found")) {
      res.locals.error = "Permission not found in the database.";
      return res.status(404).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
};
